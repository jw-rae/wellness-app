<template>
  <div class="basic-controls">
    <div class="control-section">
      <GameSelect
        label="Breathing Pattern"
        v-model="selectedPattern"
        :options="breathingPatternOptions"
      />
    </div>

    <div class="control-section">
      <label>Session Duration</label>
      <div class="duration-inputs">
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model.number="durationMinutes" 
            min="0" 
            max="60"
          />
          <span class="unit">min</span>
        </div>
        <div class="input-with-unit">
          <input 
            type="number" 
            v-model.number="durationSeconds" 
            min="0" 
            max="59"
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
import GameSelect from '../ui/GameSelect.vue';
import SessionControlButtons from '../ui/SessionControlButtons.vue';

const sessionStore = useSessionStore();

defineEmits(['start', 'togglePause', 'stop']);

const selectedPattern = ref('box');
const durationMinutes = ref(5);
const durationSeconds = ref(0);

// Store original duration to reset after session
let originalMinutes = 5;
let originalSeconds = 0;

// Update duration inputs to show countdown during session
watch(() => sessionStore.remainingTime, (remaining) => {
  if (sessionStore.isActive && !sessionStore.isPaused) {
    // Update inputs to show remaining time
    durationMinutes.value = Math.floor(remaining / 60);
    durationSeconds.value = remaining % 60;
  }
});

// Reset to original values when session ends
watch(() => sessionStore.isActive, (active, wasActive) => {
  if (!active && wasActive) {
    // Session ended, reset to original values
    durationMinutes.value = originalMinutes;
    durationSeconds.value = originalSeconds;
  } else if (active && !wasActive) {
    // Session starting, store original values
    originalMinutes = durationMinutes.value;
    originalSeconds = durationSeconds.value;
  }
});

// Stop session when breathing pattern changes
watch(selectedPattern, () => {
  if (sessionStore.isActive) {
    sessionStore.stopSession();
  }
});

const breathingPatternOptions = [
  { value: 'box', label: 'Box Breathing (4-4-4-4)' },
  { value: '478', label: '4-7-8 Relaxation' },
  { value: 'equal', label: 'Equal Breathing (5-5)' },
  { value: 'calm', label: 'Calming (4-6)' },
  { value: 'energize', label: 'Energizing (6-2)' },
  { value: 'triangle', label: 'Triangle (4-4-4)' },
  { value: 'square-plus', label: 'Extended Box (6-6-6-6)' },
  { value: 'coherent', label: 'Coherent (5-5)' },
  { value: 'custom', label: 'Custom Pattern' },
];

function getBreathingPattern() {
  const patterns = {
    box: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
    '478': { inhale: 4, hold: 7, exhale: 8, holdAfterExhale: 0 },
    equal: { inhale: 5, hold: 0, exhale: 5, holdAfterExhale: 0 },
    calm: { inhale: 4, hold: 0, exhale: 6, holdAfterExhale: 0 },
    energize: { inhale: 6, hold: 0, exhale: 2, holdAfterExhale: 0 },
    triangle: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 0 },
    'square-plus': { inhale: 6, hold: 6, exhale: 6, holdAfterExhale: 6 },
    coherent: { inhale: 5, hold: 0, exhale: 5, holdAfterExhale: 0 },
    custom: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 0 },
  };
  return patterns[selectedPattern.value] || patterns.box;
}

function getTotalSeconds() {
  return (durationMinutes.value * 60) + durationSeconds.value;
}

defineExpose({
  selectedPattern,
  durationMinutes,
  durationSeconds,
  getBreathingPattern,
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

.unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
</style>
