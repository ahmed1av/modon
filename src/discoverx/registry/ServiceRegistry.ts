/**
 * MODON Platform - DiscoverX Service Registry
 * ============================================
 * Microservices discovery and registration
 */

export interface ServiceInstance {
    id: string;
    name: string;
    version: string;
    host: string;
    port: number;
    protocol: 'http' | 'https' | 'grpc';
    healthEndpoint: string;
    metadata: Record<string, string>;
    status: 'healthy' | 'unhealthy' | 'unknown';
    lastHeartbeat: Date;
    registeredAt: Date;
}

export interface ServiceConfig {
    name: string;
    version: string;
    host?: string;
    port: number;
    protocol?: 'http' | 'https' | 'grpc';
    healthEndpoint?: string;
    metadata?: Record<string, string>;
    ttl?: number; // Time-to-live in seconds
}

/**
 * In-Memory Service Registry (Development)
 * Production should use Consul, etcd, or Redis
 */
class ServiceRegistry {
    private services: Map<string, ServiceInstance[]> = new Map();
    private healthCheckInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Start health check loop
        this.startHealthChecks();
    }

    /**
     * Register a service instance
     */
    register(config: ServiceConfig): ServiceInstance {
        const instance: ServiceInstance = {
            id: `${config.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: config.name,
            version: config.version,
            host: config.host || 'localhost',
            port: config.port,
            protocol: config.protocol || 'http',
            healthEndpoint: config.healthEndpoint || '/health',
            metadata: config.metadata || {},
            status: 'unknown',
            lastHeartbeat: new Date(),
            registeredAt: new Date(),
        };

        const instances = this.services.get(config.name) || [];
        instances.push(instance);
        this.services.set(config.name, instances);

        console.log(`[DiscoverX] Registered service: ${instance.name}@${instance.host}:${instance.port}`);

        return instance;
    }

    /**
     * Deregister a service instance
     */
    deregister(serviceId: string): boolean {
        let found = false;
        this.services.forEach((instances) => {
            const index = instances.findIndex(i => i.id === serviceId);
            if (index !== -1 && !found) {
                instances.splice(index, 1);
                console.log(`[DiscoverX] Deregistered service: ${serviceId}`);
                found = true;
            }
        });
        return found;
    }

    /**
     * Discover service instances by name
     */
    discover(serviceName: string): ServiceInstance[] {
        const instances = this.services.get(serviceName) || [];
        return instances.filter(i => i.status === 'healthy');
    }

    /**
     * Get a single healthy instance (round-robin)
     */
    private roundRobinIndex: Map<string, number> = new Map();

    getInstance(serviceName: string): ServiceInstance | null {
        const healthyInstances = this.discover(serviceName);
        if (healthyInstances.length === 0) return null;

        const currentIndex = this.roundRobinIndex.get(serviceName) || 0;
        const instance = healthyInstances[currentIndex % healthyInstances.length];
        this.roundRobinIndex.set(serviceName, currentIndex + 1);

        return instance;
    }

    /**
     * Get service URL
     */
    getServiceUrl(serviceName: string, path: string = ''): string | null {
        const instance = this.getInstance(serviceName);
        if (!instance) return null;

        return `${instance.protocol}://${instance.host}:${instance.port}${path}`;
    }

    /**
     * Update heartbeat for a service
     */
    heartbeat(serviceId: string): void {
        this.services.forEach((instances) => {
            const instance = instances.find((i: ServiceInstance) => i.id === serviceId);
            if (instance) {
                instance.lastHeartbeat = new Date();
                instance.status = 'healthy';
            }
        });
    }

    /**
     * Get all registered services
     */
    getAllServices(): Record<string, ServiceInstance[]> {
        const result: Record<string, ServiceInstance[]> = {};
        this.services.forEach((instances, name) => {
            result[name] = instances;
        });
        return result;
    }

    /**
     * Health check loop
     */
    private startHealthChecks(): void {
        this.healthCheckInterval = setInterval(async () => {
            const serviceArrays = Array.from(this.services.values());
            for (const instances of serviceArrays) {
                for (const instance of instances) {
                    await this.checkHealth(instance);
                }
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Check health of a single instance
     */
    private async checkHealth(instance: ServiceInstance): Promise<void> {
        try {
            const url = `${instance.protocol}://${instance.host}:${instance.port}${instance.healthEndpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                signal: AbortSignal.timeout(5000),
            });

            instance.status = response.ok ? 'healthy' : 'unhealthy';
            instance.lastHeartbeat = new Date();
        } catch {
            // Check if instance is stale (no heartbeat in 60 seconds)
            const staleThreshold = 60000;
            const timeSinceHeartbeat = Date.now() - instance.lastHeartbeat.getTime();

            if (timeSinceHeartbeat > staleThreshold) {
                instance.status = 'unhealthy';
            }
        }
    }

    /**
     * Cleanup
     */
    destroy(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }
    }
}

// Singleton instance
export const serviceRegistry = new ServiceRegistry();

// ============================================
// SERVICE CLIENT
// ============================================

export interface ServiceClientConfig {
    serviceName: string;
    timeout?: number;
    retries?: number;
    circuitBreaker?: {
        failureThreshold: number;
        resetTimeout: number;
    };
}

/**
 * Service Client with auto-discovery
 */
export class ServiceClient {
    private config: Required<ServiceClientConfig>;
    private failures: number = 0;
    private circuitOpen: boolean = false;
    private circuitOpenedAt: Date | null = null;

    constructor(config: ServiceClientConfig) {
        this.config = {
            serviceName: config.serviceName,
            timeout: config.timeout || 5000,
            retries: config.retries || 3,
            circuitBreaker: config.circuitBreaker || {
                failureThreshold: 5,
                resetTimeout: 30000,
            },
        };
    }

    /**
     * Make a request to the service
     */
    async request<T>(
        path: string,
        options: RequestInit = {}
    ): Promise<T> {
        // Check circuit breaker
        if (this.isCircuitOpen()) {
            throw new Error(`Circuit breaker open for ${this.config.serviceName}`);
        }

        const url = serviceRegistry.getServiceUrl(this.config.serviceName, path);
        if (!url) {
            throw new Error(`No healthy instances for ${this.config.serviceName}`);
        }

        let lastError: Error | null = null;

        for (let attempt = 0; attempt < this.config.retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: AbortSignal.timeout(this.config.timeout),
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                this.onSuccess();
                return await response.json();

            } catch (error) {
                lastError = error as Error;
                this.onFailure();

                // Exponential backoff
                if (attempt < this.config.retries - 1) {
                    await this.delay(Math.pow(2, attempt) * 100);
                }
            }
        }

        throw lastError || new Error('Request failed');
    }

    /**
     * GET request
     */
    async get<T>(path: string, params?: Record<string, string>): Promise<T> {
        const queryString = params
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.request<T>(path + queryString, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * PUT request
     */
    async put<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: 'DELETE' });
    }

    private isCircuitOpen(): boolean {
        if (!this.circuitOpen) return false;

        // Check if reset timeout has passed
        if (this.circuitOpenedAt) {
            const elapsed = Date.now() - this.circuitOpenedAt.getTime();
            if (elapsed > this.config.circuitBreaker.resetTimeout) {
                this.circuitOpen = false;
                this.failures = 0;
                return false;
            }
        }

        return true;
    }

    private onSuccess(): void {
        this.failures = 0;
        this.circuitOpen = false;
    }

    private onFailure(): void {
        this.failures++;

        if (this.failures >= this.config.circuitBreaker.failureThreshold) {
            this.circuitOpen = true;
            this.circuitOpenedAt = new Date();
            console.warn(`[DiscoverX] Circuit breaker opened for ${this.config.serviceName}`);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// PRE-CONFIGURED SERVICE CLIENTS
// ============================================

export const propertyService = new ServiceClient({ serviceName: 'property-service' });
export const userService = new ServiceClient({ serviceName: 'user-service' });
export const searchService = new ServiceClient({ serviceName: 'search-service' });
export const notificationService = new ServiceClient({ serviceName: 'notification-service' });
export const valuationService = new ServiceClient({ serviceName: 'valuation-service' });
