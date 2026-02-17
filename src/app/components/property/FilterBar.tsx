/**
 * Filter Bar Component
 * =====================
 * Advanced property filtering
 */

'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import styles from './filterBar.module.css';

const propertyTypes = ['All Types', 'Villa', 'Apartment', 'Penthouse', 'House', 'Estate', 'Land'];
const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Up to €1M', value: '0-1000000' },
    { label: '€1M - €3M', value: '1000000-3000000' },
    { label: '€3M - €5M', value: '3000000-5000000' },
    { label: '€5M - €10M', value: '5000000-10000000' },
    { label: '€10M+', value: '10000000-' },
];
const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+', '6+'];
const locations = [
    'All Locations',
    'Marbella',
    'Dubai',
    'Amsterdam',
    'Monaco',
    'Ibiza',
    'London',
    'Paris',
    'Nice',
];

export default function FilterBar() {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        type: 'All Types',
        price: '',
        bedrooms: 'Any',
        location: 'All Locations',
        minArea: '',
        maxArea: '',
    });

    const handleChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            type: 'All Types',
            price: '',
            bedrooms: 'Any',
            location: 'All Locations',
            minArea: '',
            maxArea: '',
        });
    };

    const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
        if (key === 'search') return value !== '';
        if (key === 'type') return value !== 'All Types';
        if (key === 'price') return value !== '';
        if (key === 'bedrooms') return value !== 'Any';
        if (key === 'location') return value !== 'All Locations';
        return value !== '';
    }).length;

    return (
        <div className={styles.filterBar}>
            <div className={styles.container}>
                {/* Main Filters */}
                <div className={styles.mainFilters}>
                    <div className={styles.searchInput}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by location, keyword, or reference..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Property Type</label>
                        <div className={styles.selectWrapper}>
                            <select
                                value={filters.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                            >
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Price Range</label>
                        <div className={styles.selectWrapper}>
                            <select
                                value={filters.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                            >
                                {priceRanges.map(range => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Bedrooms</label>
                        <div className={styles.selectWrapper}>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) => handleChange('bedrooms', e.target.value)}
                            >
                                {bedroomOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    <button
                        className={`${styles.advancedBtn} ${showAdvanced ? styles.active : ''}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <SlidersHorizontal size={16} />
                        More Filters
                        {activeFiltersCount > 0 && (
                            <span className={styles.filterBadge}>{activeFiltersCount}</span>
                        )}
                    </button>

                    <button className={styles.searchBtn}>
                        Search
                    </button>
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className={styles.advancedFilters}>
                        <div className={styles.advancedRow}>
                            <div className={styles.filterGroup}>
                                <label>Location</label>
                                <div className={styles.selectWrapper}>
                                    <select
                                        value={filters.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                    >
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>Living Area (m²)</label>
                                <div className={styles.rangeInputs}>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minArea}
                                        onChange={(e) => handleChange('minArea', e.target.value)}
                                    />
                                    <span>—</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxArea}
                                        onChange={(e) => handleChange('maxArea', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label>Features</label>
                                <div className={styles.checkboxGroup}>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>Sea View</span>
                                    </label>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>Pool</span>
                                    </label>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>Garden</span>
                                    </label>
                                    <label className={styles.checkbox}>
                                        <input type="checkbox" />
                                        <span>Garage</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.advancedActions}>
                            <button className={styles.clearBtn} onClick={clearFilters}>
                                <X size={14} />
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
