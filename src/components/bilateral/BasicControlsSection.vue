<template>
  <div class="basic-controls">
    <!-- Speed (BPM) -->
    <div class="control-section">
      <label for="bpm">
        Speed
        <span class="value-display">{{ bpm }} BPM</span>
      </label>
      <input 
        id="bpm" 
        type="range" 
        v-model.number="bpm"
        min="10"
        max="80"
        step="5"
      />
    </div>

    <!-- Duration -->
    <div class="control-section">
      <label>Session Duration</label>
      <div class="duration-inputs">
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model.number="durationMinutes" 
            min="0" 
            max="60"
            :disabled="sessionStore.isActive"
          />
          <span class="unit">min</span>
        </div>
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model.number="durationSeconds" 
            min="0" 
            max="59"
            :disabled="sessionStore.isActive"
          />
          <span class="unit">sec</span>
        </div>
      </div>
    </div>

    <SessionControlButtons 
      @start="$emit('start')"
      @togglePause="$emit('togglePause')"
      @stop="$emit('stop')"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSessionStore } from '../../stores/sessionStore.js';
import SessionControlButtons from '../ui/SessionControlButtons.vue';

const sessionStore = useSessionStore();

defineEmits(['start', 'togglePause', 'stop']);

const bpm = ref(30);
const durationMinutes = ref(5);
const durationSeconds = ref(0);

// Store initial/preset duration values to restore after session
const initialMinutes = ref(5);
const initialSeconds = ref(0);

// Track if we're currently in a session to prevent updating initial values during countdown
let isCountingDown = false;

// Update duration inputs to show countdown during session
watch(() => sessionStore.remainingTime, (remaining) => {
  if (sessionStore.isActive && !sessionStore.isPaused) {
    isCountingDown = true;
    durationMinutes.value = Math.floor(remaining / 60);
    durationSeconds.value = remaining % 60;
  }
});

// Capture initial values when session starts and reset when it ends
watch(() => sessionStore.isActive, (active, wasActive) => {
  if (active && !wasActive) {
    initialMinutes.value = durationMinutes.value;
    initialSeconds.value = durationSeconds.value;
    isCountingDown = true;
  } else if (!active && wasActive) {
    durationMinutes.value = initialMinutes.value;
    durationSeconds.value = initialSeconds.value;
    isCountingDown = false;
  }
});

// Watch for manual changes to update initial values (only when not counting down)
watch([durationMinutes, durationSeconds], ([newMin, newSec]) => {
  if (!isCountingDown) {
    initialMinutes.value = newMin;
    initialSeconds.value = newSec;
  }
});

function getTotalSeconds() {
  return (durationMinutes.value * 60) + durationSeconds.value;
}

defineExpose({
  bpm,
  durationMinutes,
  durationSeconds,
  getTotalSeconds,
});
</script>

<style scoped>
.basic-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border: none;
  background: transparent;
}

.control-section label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-display {
  color: var(--color-brand-primary-500);
  font-weight: var(--font-weight-bold);
}

.duration-inputs {
  display: flex;
  gap: 0;
  width: 100%;
}

input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-surface-tertiary);
  outline: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-brand-primary-500);
  cursor: pointer;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
  transition: all var(--duration-200);
}

input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-brand-primary-500) 30%, transparent);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-brand-primary-500);
  cursor: pointer;
  border: none;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
  transition: all var(--duration-200);
}

input[type="range"]::-moz-range-thumb:hover {
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-brand-primary-500) 30%, transparent);
}

.duration-inputs {
  display: flex;
  gap: var(--space-sm);
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
}

.input-with-unit input {
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: inherit;
}

.input-with-unit input:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

.input-with-unit input:disabled {
  opacity: 0.7;
}

.unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
</style>
