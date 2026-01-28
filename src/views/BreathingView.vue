<template>
  <div class="breathing-view" :class="{ 'panel-collapsed': isPanelCollapsed }">
    <BreathingControls 
      ref="controlsRef" 
      @collapse-changed="(collapsed) => { isPanelCollapsed = collapsed; emit('panel-collapsed', collapsed); }"
    />
    
    <div class="main-canvas">
      <CircularFocalPoint 
        :showInhaleExhale="styleSettings.showInhaleExhale"
        :showTime="styleSettings.showTime"
        :affirmations="affirmationSettings.text"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BreathingControls from '../components/BreathingControls.vue';
import CircularFocalPoint from '../components/CircularFocalPoint.vue';

const controlsRef = ref(null);
const isPanelCollapsed = ref(false);

const emit = defineEmits(['panel-collapsed']);

const styleSettings = computed(() => {
  return {
    showInhaleExhale: controlsRef.value?.styleRef?.showInhaleExhale ?? true,
    showTime: controlsRef.value?.styleRef?.showTime ?? true,
  };
});

const affirmationSettings = computed(() => {
  return {
    text: controlsRef.value?.affirmationsRef?.affirmations ?? '',
  };
});
</script>

<style scoped>
.breathing-view {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.breathing-view.panel-collapsed .main-canvas {
  margin-left: 0;
  width: 100%;
}

.main-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-primary);
  padding: var(--space-2xl);
  padding-bottom: 140px;
}

.instruction-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.btn-primary {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
  min-width: 150px;
}

.btn-primary:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.session-info {
  text-align: center;
  width: 100%;
}

.session-info p {
  margin-bottom: var(--space-sm);
  font-weight: var(--font-weight-medium);
}

progress {
  width: 100%;
  height: 8px;
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

progress::-webkit-progress-bar {
  background-color: var(--color-surface-tertiary);
  border-radius: var(--border-radius-full);
}

progress::-webkit-progress-value {
  background-color: var(--color-brand-primary-500);
  border-radius: var(--border-radius-full);
}
</style>
