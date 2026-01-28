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
      <label for="duration">Duration</label>
      <div class="input-with-unit">
        <input 
          id="duration"
          type="number" 
          v-model.number="durationMinutes" 
          min="1" 
          max="60"
        />
        <span class="unit">min</span>
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
import { ref } from 'vue';
import SessionControlButtons from '../ui/SessionControlButtons.vue';

defineEmits(['start', 'togglePause', 'stop']);

const bpm = ref(30);
const durationMinutes = ref(5);

defineExpose({
  bpm,
  durationMinutes,
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

.input-with-unit {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
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
