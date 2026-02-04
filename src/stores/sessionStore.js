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
    const currentMode = ref(null); // 'breathing' | 'emdr' | null
    const currentPreset = ref(null);
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
    function startSession(mode, preset) {
        console.log('startSession called with preset:', preset);

        currentMode.value = mode;
        currentPreset.value = preset;
        elapsedTime.value = 0;

        // Calculate duration from preset
        // For breathing presets, prefer durationMinutes/Seconds over duration field
        if ((preset?.durationMinutes !== undefined || preset?.durationSeconds !== undefined) && preset?.type === 'breathing') {
            const mins = preset.durationMinutes || 0;
            const secs = preset.durationSeconds || 0;
            totalDuration.value = (mins * 60) + secs;
            console.log('Set duration from durationMinutes/Seconds (breathing):', mins, secs, '=', totalDuration.value);
        } else if (preset?.duration !== undefined) {
            totalDuration.value = preset.duration;
            console.log('Set duration from preset.duration:', preset.duration);
        } else if (preset?.durationMinutes !== undefined || preset?.durationSeconds !== undefined) {
            const mins = preset.durationMinutes || 0;
            const secs = preset.durationSeconds || 0;
            totalDuration.value = (mins * 60) + secs;
            console.log('Set duration from durationMinutes/Seconds:', mins, secs, '=', totalDuration.value);
        } else {
            totalDuration.value = 0;
            console.log('No duration found, set to 0');
        }

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
        // End the session completely
        isActive.value = false;
        isPaused.value = false;
        currentMode.value = null;
        currentPreset.value = null;
        elapsedTime.value = 0;
        totalDuration.value = 0;
    }

    return {
        // State
        isActive,
        isPaused,
        currentMode,
        currentPreset,
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
    };
});
