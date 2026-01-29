import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * Session state management store
 * Handles active sessions, timers, and current state
 */
export const useSessionStore = defineStore('session', () => {
    // State
    const isActive = ref(false);
    const isPaused = ref(false);
    const currentMode = ref(null); // 'breathing' | 'emdr' | 'sequence' | null
    const currentPreset = ref(null);
    const currentSequence = ref(null);
    const sequencePresets = ref([]);
    const currentStepIndex = ref(0);
    const elapsedTime = ref(0); // in seconds
    const totalDuration = ref(0); // in seconds
    const isPlayingSequence = ref(false);

    // Timer interval ID
    let timerInterval = null;

    // Computed
    const remainingTime = computed(() => {
        return Math.max(0, totalDuration.value - elapsedTime.value);
    });

    const progress = computed(() => {
        if (totalDuration.value === 0) return 0;
        return (elapsedTime.value / totalDuration.value) * 100;
    });

    const isComplete = computed(() => {
        return elapsedTime.value >= totalDuration.value && isActive.value;
    });

    // Actions
    function startSession(mode, preset, sequence = null) {
        currentMode.value = mode;
        currentPreset.value = preset;
        currentSequence.value = sequence;
        currentStepIndex.value = 0;
        elapsedTime.value = 0;
        totalDuration.value = preset?.duration || 0;
        isActive.value = true;
        isPaused.value = false;

        startTimer();
    }

    function pauseSession() {
        isPaused.value = true;
        stopTimer();
    }

    function resumeSession() {
        isPaused.value = false;
        startTimer();
    }

    function stopSession() {
        isActive.value = false;
        isPaused.value = false;
        currentMode.value = null;
        currentPreset.value = null;
        currentSequence.value = null;
        currentStepIndex.value = 0;
        elapsedTime.value = 0;
        totalDuration.value = 0;
        stopTimer();
    }

    function startTimer() {
        stopTimer(); // Clear any existing timer
        timerInterval = setInterval(() => {
            if (!isPaused.value && isActive.value) {
                elapsedTime.value += 1;

                // Auto-complete when time is up
                if (elapsedTime.value >= totalDuration.value) {
                    completeSession();
                }
            }
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function completeSession() {
        stopTimer();

        // If playing a sequence, move to next preset
        if (isPlayingSequence.value && currentStepIndex.value < sequencePresets.value.length - 1) {
            nextStep();
        } else {
            // Keep session active but paused to show completion state
            isActive.value = true;
            isPaused.value = true;
        }
    }

    function startSequence(sequence, presets) {
        currentSequence.value = sequence;
        sequencePresets.value = presets;
        currentStepIndex.value = 0;
        isPlayingSequence.value = true;

        // Start with first preset
        const firstPreset = presets[0];
        startSession(firstPreset);
    }

    function nextStep() {
        if (isPlayingSequence.value && currentStepIndex.value < sequencePresets.value.length - 1) {
            currentStepIndex.value += 1;
            const nextPreset = sequencePresets.value[currentStepIndex.value];

            // Start next preset
            elapsedTime.value = 0;
            currentPreset.value = nextPreset;
            totalDuration.value = nextPreset.durationMinutes ? nextPreset.durationMinutes * 60 : 0;
            isActive.value = true;
            isPaused.value = false;
            startTimer();
        } else {
            // Sequence complete
            isPlayingSequence.value = false;
            isActive.value = true;
            isPaused.value = true;
        }
    }

    return {
        // State
        isActive,
        isPaused,
        currentMode,
        currentPreset,
        currentSequence,
        sequencePresets,
        currentStepIndex,
        elapsedTime,
        totalDuration,
        isPlayingSequence,

        // Computed
        remainingTime,
        progress,
        isComplete,

        // Actions
        startSession,
        startSequence,
        pauseSession,
        resumeSession,
        stopSession,
        nextStep,
    };
});
