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
    const currentStepIndex = ref(0);
    const elapsedTime = ref(0); // in seconds
    const totalDuration = ref(0); // in seconds

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
        // Keep session active but paused to show completion state
        isActive.value = true;
        isPaused.value = true;
    }

    function nextStep() {
        if (currentSequence.value && currentStepIndex.value < currentSequence.value.steps.length - 1) {
            currentStepIndex.value += 1;
            elapsedTime.value = 0;
            // Load next preset
            // This will be implemented when sequence execution is built
        }
    }

    return {
        // State
        isActive,
        isPaused,
        currentMode,
        currentPreset,
        currentSequence,
        currentStepIndex,
        elapsedTime,
        totalDuration,

        // Computed
        remainingTime,
        progress,
        isComplete,

        // Actions
        startSession,
        pauseSession,
        resumeSession,
        stopSession,
        nextStep,
    };
});
