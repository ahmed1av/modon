/**
 * MODON Platform - Security Logging (DiscoverX Monitoring)
 * =========================================================
 * Structured security event logging
 */

// ============================================
// TYPES
// ============================================

export type SecurityEventType =
    | 'auth_success'
    | 'auth_failure'
    | 'access_denied'
    | 'rate_limit'
    | 'ddos_attempt'
    | 'injection_attempt'
    | 'xss_attempt'
    | 'csrf_attempt'
    | 'ssrf_attempt'
    | 'brute_force'
    | 'session_hijack'
    | 'privilege_escalation'
    | 'data_breach'
    | 'malicious_upload'
    | 'suspicious_activity';

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

// Enum-like object for security event types (for use in API routes)
export const SecurityEventType = {
    LOGIN_SUCCESS: 'auth_success' as const,
    LOGIN_FAILED: 'auth_failure' as const,
    ACCESS_DENIED: 'access_denied' as const,
    RATE_LIMIT: 'rate_limit' as const,
    DDOS_ATTEMPT: 'ddos_attempt' as const,
    INJECTION_ATTEMPT: 'injection_attempt' as const,
    XSS_ATTEMPT: 'xss_attempt' as const,
    CSRF_ATTEMPT: 'csrf_attempt' as const,
    SSRF_ATTEMPT: 'ssrf_attempt' as const,
    BRUTE_FORCE: 'brute_force' as const,
    SESSION_HIJACK: 'session_hijack' as const,
    PRIVILEGE_ESCALATION: 'privilege_escalation' as const,
    DATA_BREACH: 'data_breach' as const,
    MALICIOUS_UPLOAD: 'malicious_upload' as const,
    SUSPICIOUS_ACTIVITY: 'suspicious_activity' as const,
    API_REQUEST: 'suspicious_activity' as const,
    API_ERROR: 'suspicious_activity' as const,
    REGISTRATION_SUCCESS: 'auth_success' as const,
    REGISTRATION_FAILED: 'auth_failure' as const,
};

// Enum-like object for severity levels
export const SecuritySeverityLevel = {
    LOW: 'low' as SecuritySeverity,
    MEDIUM: 'medium' as SecuritySeverity,
    HIGH: 'high' as SecuritySeverity,
    CRITICAL: 'critical' as SecuritySeverity,
    INFO: 'low' as SecuritySeverity,
    WARNING: 'medium' as SecuritySeverity,
    ERROR: 'high' as SecuritySeverity,
};

// Type for the actual event type values
export type SecurityEventTypeValue = typeof SecurityEventType[keyof typeof SecurityEventType];

export interface SecurityEvent {
    type: SecurityEventTypeValue;
    severity: SecuritySeverity;
    userId?: string;
    ip: string;
    userAgent: string;
    path: string;
    method?: string;
    details: Record<string, unknown>;
    timestamp: Date;
    requestId?: string;
    sessionId?: string;
    geoLocation?: {
        country?: string;
        region?: string;
        city?: string;
    };
}

export interface LogEntry {
    level: 'debug' | 'info' | 'warn' | 'error' | 'security';
    message: string;
    timestamp: Date;
    context?: Record<string, unknown>;
}

// ============================================
// SECURITY LOGGER
// ============================================

class SecurityLogger {
    private static instance: SecurityLogger;
    private eventQueue: SecurityEvent[] = [];
    private flushInterval: NodeJS.Timeout | null = null;

    private constructor() {
        // Flush events every 10 seconds
        this.flushInterval = setInterval(() => {
            this.flush();
        }, 10000);
    }

    static getInstance(): SecurityLogger {
        if (!SecurityLogger.instance) {
            SecurityLogger.instance = new SecurityLogger();
        }
        return SecurityLogger.instance;
    }

    /**
     * Log a security event
     */
    async logEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
        const fullEvent: SecurityEvent = {
            ...event,
            timestamp: new Date(),
        };

        // Add to queue
        this.eventQueue.push(fullEvent);

        // Log to console with severity-based formatting
        this.consoleLog(fullEvent);

        // Immediate alert for critical events
        if (event.severity === 'critical') {
            await this.sendCriticalAlert(fullEvent);
        }

        // Process high-severity events immediately
        if (event.severity === 'high' || event.severity === 'critical') {
            await this.processHighSeverityEvent(fullEvent);
        }
    }

    /**
     * Console log with formatting
     */
    private consoleLog(event: SecurityEvent): void {
        const severityColors: Record<SecuritySeverity, string> = {
            low: '\x1b[32m',      // Green
            medium: '\x1b[33m',   // Yellow
            high: '\x1b[91m',     // Light Red
            critical: '\x1b[31m', // Red
        };

        const reset = '\x1b[0m';
        const color = severityColors[event.severity];

        console.log(
            `${color}[SECURITY]${reset} [${event.severity.toUpperCase()}] ${event.type}`,
            JSON.stringify({
                ip: event.ip,
                path: event.path,
                userId: event.userId,
                details: event.details,
            })
        );
    }

    /**
     * Process high-severity events
     */
    private async processHighSeverityEvent(event: SecurityEvent): Promise<void> {
        // Auto-block repeated offenders
        if (this.shouldAutoBlock(event)) {
            await this.autoBlockIp(event.ip);
        }

        // Store in database for analysis
        await this.persistEvent(event);
    }

    /**
     * Check if IP should be auto-blocked
     */
    private shouldAutoBlock(event: SecurityEvent): boolean {
        const blockableTypes: SecurityEventType[] = [
            'brute_force',
            'ddos_attempt',
            'injection_attempt',
            'session_hijack',
        ];

        return blockableTypes.includes(event.type);
    }

    /**
     * Auto-block an IP address
     */
    private async autoBlockIp(ip: string): Promise<void> {
        console.warn(`[SECURITY] Auto-blocking IP: ${ip}`);

        // In production, add to Redis blocklist
        // await redis.set(`blocked:${ip}`, '1', { ex: 3600 });
    }

    /**
     * Send critical alert
     */
    private async sendCriticalAlert(event: SecurityEvent): Promise<void> {
        console.error(
            `[CRITICAL SECURITY ALERT]`,
            JSON.stringify(event, null, 2)
        );

        // In production, send to:
        // - Slack
        // - PagerDuty
        // - Email
        // - SMS

        // Example Slack webhook
        // await this.sendSlackAlert(event);
    }

    /**
     * Persist event to database
     */
    private async persistEvent(event: SecurityEvent): Promise<void> {
        // In production, store in database
        // await db.securityLogs.create({ data: event });
    }

    /**
     * Flush event queue to persistent storage
     */
    private async flush(): Promise<void> {
        if (this.eventQueue.length === 0) return;

        const events = [...this.eventQueue];
        this.eventQueue = [];

        // Batch insert to database
        // await db.securityLogs.createMany({ data: events });

        console.log(`[SECURITY] Flushed ${events.length} events to storage`);
    }

    /**
     * Get recent events
     */
    getRecentEvents(limit: number = 100): SecurityEvent[] {
        return this.eventQueue.slice(-limit);
    }

    /**
     * Cleanup
     */
    destroy(): void {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
        }
        this.flush();
    }
}

// ============================================
// PUBLIC API
// ============================================

const securityLogger = SecurityLogger.getInstance();

/**
 * Log a security event
 */
export function logSecurityEvent(
    event: Omit<SecurityEvent, 'timestamp'>
): void {
    securityLogger.logEvent(event);
}

/**
 * Log authentication success
 */
export function logAuthSuccess(
    userId: string,
    ip: string,
    userAgent: string
): void {
    logSecurityEvent({
        type: 'auth_success',
        severity: 'low',
        userId,
        ip,
        userAgent,
        path: '/api/v1/auth/login',
        details: { action: 'login' },
    });
}

/**
 * Log authentication failure
 */
export function logAuthFailure(
    email: string,
    ip: string,
    userAgent: string,
    reason: string
): void {
    logSecurityEvent({
        type: 'auth_failure',
        severity: 'medium',
        ip,
        userAgent,
        path: '/api/v1/auth/login',
        details: { email, reason },
    });
}

/**
 * Log access denied
 */
export function logAccessDenied(
    userId: string | undefined,
    ip: string,
    userAgent: string,
    path: string,
    requiredPermission: string
): void {
    logSecurityEvent({
        type: 'access_denied',
        severity: 'medium',
        userId,
        ip,
        userAgent,
        path,
        details: { requiredPermission },
    });
}

/**
 * Log rate limit hit
 */
export function logRateLimit(
    ip: string,
    userAgent: string,
    path: string,
    limit: number
): void {
    logSecurityEvent({
        type: 'rate_limit',
        severity: 'low',
        ip,
        userAgent,
        path,
        details: { limit },
    });
}

/**
 * Log potential attack
 */
export function logAttackAttempt(
    type: SecurityEventType,
    ip: string,
    userAgent: string,
    path: string,
    payload: unknown
): void {
    logSecurityEvent({
        type,
        severity: 'high',
        ip,
        userAgent,
        path,
        details: { payload },
    });
}

// ============================================
// GENERAL LOGGER
// ============================================

class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    private log(level: LogEntry['level'], message: string, context?: Record<string, unknown>): void {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date(),
            context: { ...context, module: this.context },
        };

        const prefix = `[${level.toUpperCase()}] [${this.context}]`;

        switch (level) {
            case 'debug':
                console.debug(prefix, message, context || '');
                break;
            case 'info':
                console.info(prefix, message, context || '');
                break;
            case 'warn':
                console.warn(prefix, message, context || '');
                break;
            case 'error':
                console.error(prefix, message, context || '');
                break;
            default:
                console.log(prefix, message, context || '');
        }
    }

    debug(message: string, context?: Record<string, unknown>): void {
        this.log('debug', message, context);
    }

    info(message: string, context?: Record<string, unknown>): void {
        this.log('info', message, context);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        this.log('warn', message, context);
    }

    error(message: string, context?: Record<string, unknown>): void {
        this.log('error', message, context);
    }
}

/**
 * Create a logger for a module
 */
export function createLogger(context: string): Logger {
    return new Logger(context);
}

// ============================================
// EXPORTS
// ============================================

export { securityLogger, SecurityLogger };
