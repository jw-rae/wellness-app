/**
 * LocalStorage service for persisting presets and sequences
 */

const STORAGE_KEYS = {
    PRESETS: 'wellness-app-presets',
    SEQUENCES: 'wellness-app-sequences',
    SETTINGS: 'wellness-app-settings',
};

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Failed to save to localStorage: ${key}`, error);
    }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any}
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Failed to load from localStorage: ${key}`, error);
        return defaultValue;
    }
}

/**
 * Save presets to localStorage
 * @param {import('../models/Preset.js').Preset[]} presets
 */
export function savePresets(presets) {
    saveToStorage(STORAGE_KEYS.PRESETS, presets);
}

/**
 * Load presets from localStorage
 * @returns {import('../models/Preset.js').Preset[]}
 */
export function loadPresets() {
    return loadFromStorage(STORAGE_KEYS.PRESETS, []);
}

/**
 * Save sequences to localStorage
 * @param {import('../models/Sequence.js').Sequence[]} sequences
 */
export function saveSequences(sequences) {
    saveToStorage(STORAGE_KEYS.SEQUENCES, sequences);
}

/**
 * Load sequences from localStorage
 * @returns {import('../models/Sequence.js').Sequence[]}
 */
export function loadSequences() {
    return loadFromStorage(STORAGE_KEYS.SEQUENCES, []);
}

/**
 * Save app settings to localStorage
 * @param {Object} settings - App settings
 */
export function saveSettings(settings) {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Load app settings from localStorage
 * @returns {Object}
 */
export function loadSettings() {
    return loadFromStorage(STORAGE_KEYS.SETTINGS, {
        theme: 'default',
        colorScheme: 'light',
    });
}

/**
 * Export all data as JSON
 * @returns {string} JSON string of all data
 */
export function exportData() {
    return JSON.stringify({
        presets: loadPresets(),
        sequences: loadSequences(),
        settings: loadSettings(),
        exportedAt: new Date().toISOString(),
    }, null, 2);
}

/**
 * Import data from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} Success status
 */
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (data.presets) savePresets(data.presets);
        if (data.sequences) saveSequences(data.sequences);
        if (data.settings) saveSettings(data.settings);
        return true;
    } catch (error) {
        console.error('Failed to import data', error);
        return false;
    }
}

/**
 * Clear all stored data
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}
