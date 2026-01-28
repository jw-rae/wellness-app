<template>
  <div class="view-container">
    <div class="view-header">
      <h1>Bilateral (EMDR) Mode</h1>
      <p>Bilateral stimulation for processing and integration</p>
    </div>

    <div class="view-content">
      <div class="focal-area">
        <svg class="focal-svg" viewBox="0 0 400 200">
          <circle 
            cx="100" 
            cy="100" 
            r="30" 
            fill="var(--color-brand-primary-500)"
          />
        </svg>
        <p class="instruction-text">Lateral motion will be implemented here</p>
      </div>

      <div class="controls">
        <button class="btn-primary" @click="startSession">
          {{ sessionStore.isActive ? 'Reset' : 'Start' }} Session
        </button>
        
        <div v-if="sessionStore.isActive" class="session-info">
          <p>Time: {{ formatTime(sessionStore.elapsedTime) }} / {{ formatTime(sessionStore.totalDuration) }}</p>
          <progress :value="sessionStore.progress" max="100"></progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from '../stores/sessionStore.js';
import { usePresetStore } from '../stores/presetStore.js';

const sessionStore = useSessionStore();
const presetStore = usePresetStore();

function startSession() {
  if (sessionStore.isActive) {
    sessionStore.stopSession();
  } else {
    const defaultPreset = presetStore.emdrPresets[0];
    sessionStore.startSession('emdr', defaultPreset);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-xl);
}

.view-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.view-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-sm);
}

.view-header p {
  color: var(--color-text-secondary);
}

.view-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
}

.focal-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  width: 100%;
}

.focal-svg {
  width: 100%;
  max-width: 600px;
  height: 200px;
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
