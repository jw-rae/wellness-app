import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defaultBreathingPresets, defaultEMDRPresets, createPreset } from '../models/Preset.js';
import { savePresets, loadPresets } from '../services/storageService.js';

/**
 * Preset management store
 */
export const usePresetStore = defineStore('presets', () => {
    // State
    const presets = ref([]);

    // Computed
    const breathingPresets = computed(() =>
        presets.value.filter(p => p.type === 'breathing')
    );

    const emdrPresets = computed(() =>
        presets.value.filter(p => p.type === 'emdr')
    );

    const affirmationPresets = computed(() =>
        presets.value.filter(p => p.type === 'affirmation')
    );

    const userPresets = computed(() =>
        presets.value.filter(p => !p.isDefault)
    );

    // Actions
    function initializePresets() {
        const stored = loadPresets();

        if (stored.length === 0) {
            // First time - load defaults
            presets.value = [
                ...defaultBreathingPresets,
                ...defaultEMDRPresets,
            ];
            savePresets(presets.value);
        } else {
            presets.value = stored;
        }
    }

    function addPreset(preset) {
        const newPreset = createPreset(preset);
        presets.value.push(newPreset);
        savePresets(presets.value);
        return newPreset;
    }

    function updatePreset(id, updates) {
        const index = presets.value.findIndex(p => p.id === id);
        if (index !== -1) {
            presets.value[index] = {
                ...presets.value[index],
                ...updates,
                updatedAt: Date.now(),
            };
            savePresets(presets.value);
        }
    }

    function deletePreset(id) {
        presets.value = presets.value.filter(p => p.id !== id);
        savePresets(presets.value);
    }

    function getPresetById(id) {
        return presets.value.find(p => p.id === id);
    }

    return {
        // State
        presets,

        // Computed
        breathingPresets,
        emdrPresets,
        affirmationPresets,
        userPresets,

        // Actions
        initializePresets,
        addPreset,
        updatePreset,
        deletePreset,
        getPresetById,
    };
});
