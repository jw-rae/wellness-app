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
        console.log('startSession called with preset:', preset);

        currentMode.value = mode;
        currentPreset.value = preset;

        // Only update sequence-related state if not already in a sequence
        if (!isPlayingSequence.value) {
            currentSequence.value = sequence;
            currentStepIndex.value = 0;
        }

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
            // End the session completely
            isActive.value = false;
            isPaused.value = false;
            currentMode.value = null;
            currentPreset.value = null;
            currentSequence.value = null;
            currentStepIndex.value = 0;
            elapsedTime.value = 0;
            totalDuration.value = 0;
        }
    }

    function startSequence(sequence, presets) {
        console.log('startSequence called with presets:', presets);

        currentSequence.value = sequence;
        sequencePresets.value = presets;
        currentStepIndex.value = 0;
        isPlayingSequence.value = true;

        // Set the first preset but don't start the session yet
        const firstPreset = presets[0];
        console.log('First preset in sequence:', firstPreset);
        console.log('First preset duration field:', firstPreset.duration);
        console.log('First preset durationMinutes/Seconds:', firstPreset.durationMinutes, firstPreset.durationSeconds);

        currentMode.value = firstPreset.type === 'breathing' ? 'breathing' : 'bilateral';
        currentPreset.value = firstPreset;

        // Calculate duration but don't start timer
        // For breathing presets, prefer durationMinutes/Seconds over duration field
        if ((firstPreset.durationMinutes !== undefined || firstPreset.durationSeconds !== undefined) && firstPreset.type === 'breathing') {
            const mins = firstPreset.durationMinutes || 0;
            const secs = firstPreset.durationSeconds || 0;
            totalDuration.value = (mins * 60) + secs;
            console.log('Calculated duration from min/sec (breathing):', mins, secs, '=', totalDuration.value);
        } else if (firstPreset.duration !== undefined) {
            totalDuration.value = firstPreset.duration;
            console.log('Using preset.duration:', firstPreset.duration);
        } else if (firstPreset.durationMinutes !== undefined || firstPreset.durationSeconds !== undefined) {
            const mins = firstPreset.durationMinutes || 0;
            const secs = firstPreset.durationSeconds || 0;
            totalDuration.value = (mins * 60) + secs;
            console.log('Calculated duration from min/sec:', mins, secs, '=', totalDuration.value);
        } else {
            totalDuration.value = 0;
            console.log('No duration found');
        }

        // Session is NOT active yet - user must press start
        isActive.value = false;
        isPaused.value = false;
        elapsedTime.value = 0;
    }

    function nextStep() {
        if (isPlayingSequence.value && currentStepIndex.value < sequencePresets.value.length - 1) {
            currentStepIndex.value += 1;
            const nextPreset = sequencePresets.value[currentStepIndex.value];

            // Start next preset
            elapsedTime.value = 0;
            currentPreset.value = nextPreset;
            currentMode.value = nextPreset.type === 'breathing' ? 'breathing' : 'bilateral';

            // Calculate duration from preset
            if (nextPreset.duration !== undefined) {
                totalDuration.value = nextPreset.duration;
            } else if (nextPreset.durationMinutes !== undefined || nextPreset.durationSeconds !== undefined) {
                const mins = nextPreset.durationMinutes || 0;
                const secs = nextPreset.durationSeconds || 0;
                totalDuration.value = (mins * 60) + secs;
            } else {
                totalDuration.value = 0;
            }

            isActive.value = true;
            isPaused.value = false;
            startTimer();
        } else {
            // Sequence complete
            isPlayingSequence.value = false;
            isActive.value = false;
            isPaused.value = false;
            currentMode.value = null;
            currentPreset.value = null;
            currentSequence.value = null;
            currentStepIndex.value = 0;
            elapsedTime.value = 0;
            totalDuration.value = 0;
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
