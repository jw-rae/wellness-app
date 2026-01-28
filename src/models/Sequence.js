/**
 * @typedef {Object} SequenceStep
 * @property {string} presetId - Reference to preset ID
 * @property {number} order - Step order in sequence
 */

/**
 * @typedef {Object} Sequence
 * @property {string} id - Unique identifier
 * @property {string} name - Sequence name
 * @property {SequenceStep[]} steps - Array of preset steps
 * @property {string} [description] - Optional description
 * @property {number} totalDuration - Total duration in seconds (calculated)
 * @property {number} createdAt - Timestamp
 * @property {number} updatedAt - Timestamp
 */

/**
 * Creates a new sequence
 * @param {Partial<Sequence>} sequence - Sequence configuration
 * @returns {Sequence}
 */
export function createSequence(sequence) {
    const now = Date.now();
    return {
        id: sequence.id || crypto.randomUUID(),
        name: sequence.name || 'Untitled Sequence',
        steps: sequence.steps || [],
        description: sequence.description || '',
        totalDuration: sequence.totalDuration || 0,
        createdAt: sequence.createdAt || now,
        updatedAt: sequence.updatedAt || now,
    };
}

/**
 * Calculate total duration of a sequence
 * @param {Sequence} sequence - The sequence
 * @param {import('./Preset.js').Preset[]} presets - Available presets
 * @returns {number} Total duration in seconds
 */
export function calculateSequenceDuration(sequence, presets) {
    return sequence.steps.reduce((total, step) => {
        const preset = presets.find(p => p.id === step.presetId);
        return total + (preset ? preset.duration : 0);
    }, 0);
}
