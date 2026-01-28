/**
 * @typedef {Object} BreathingPattern
 * @property {number} inhale - Duration in seconds
 * @property {number} hold - Duration in seconds
 * @property {number} exhale - Duration in seconds
 * @property {number} holdAfterExhale - Duration in seconds
 */

/**
 * @typedef {Object} EMDRConfig
 * @property {number} speed - Lateral movement speed (1-10)
 * @property {number} range - Lateral movement range percentage (50-100)
 * @property {boolean} bilateralTone - Enable bilateral audio tone
 * @property {number} toneFrequency - Tone frequency in Hz (optional)
 */

/**
 * @typedef {Object} Preset
 * @property {string} id - Unique identifier
 * @property {string} name - Preset name
 * @property {string} type - Type: 'breathing' | 'emdr' | 'affirmation'
 * @property {number} duration - Duration in seconds
 * @property {BreathingPattern} [breathingPattern] - Breathing configuration (if type is 'breathing')
 * @property {EMDRConfig} [emdrConfig] - EMDR configuration (if type is 'emdr')
 * @property {string} [affirmationText] - Affirmation text (if type is 'affirmation')
 * @property {string} [description] - Optional description
 * @property {boolean} isDefault - Whether this is a default preset
 * @property {number} createdAt - Timestamp
 * @property {number} updatedAt - Timestamp
 */

/**
 * Creates a new preset with default values
 * @param {Partial<Preset>} preset - Preset configuration
 * @returns {Preset}
 */
export function createPreset(preset) {
    const now = Date.now();
    return {
        id: preset.id || crypto.randomUUID(),
        name: preset.name || 'Untitled Preset',
        type: preset.type || 'breathing',
        duration: preset.duration || 300,
        breathingPattern: preset.breathingPattern || null,
        emdrConfig: preset.emdrConfig || null,
        affirmationText: preset.affirmationText || null,
        description: preset.description || '',
        isDefault: preset.isDefault || false,
        createdAt: preset.createdAt || now,
        updatedAt: preset.updatedAt || now,
    };
}

/**
 * Default breathing presets
 */
export const defaultBreathingPresets = [
    createPreset({
        id: 'breathing-box',
        name: 'Box Breathing',
        type: 'breathing',
        duration: 240,
        breathingPattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
        description: 'Equal breath for calm and focus',
        isDefault: true,
    }),
    createPreset({
        id: 'breathing-478',
        name: '4-7-8 Breathing',
        type: 'breathing',
        duration: 180,
        breathingPattern: { inhale: 4, hold: 7, exhale: 8, holdAfterExhale: 0 },
        description: 'Relaxation and sleep preparation',
        isDefault: true,
    }),
];

/**
 * Default EMDR presets
 */
export const defaultEMDRPresets = [
    createPreset({
        id: 'emdr-standard',
        name: 'Standard EMDR',
        type: 'emdr',
        duration: 300,
        emdrConfig: { speed: 5, range: 80, bilateralTone: false, toneFrequency: 440 },
        description: 'Standard bilateral stimulation',
        isDefault: true,
    }),
];
