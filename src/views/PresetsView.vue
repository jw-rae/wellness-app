<template>
  <div class="view-container">
    <div class="view-header">
      <h1>Preset Library & Sequences</h1>
      <p>Manage your presets and create custom sequences</p>
    </div>

    <div class="view-content">
      <div class="presets-section">
        <h2>Breathing Presets</h2>
        <div class="preset-grid">
          <div 
            v-for="preset in presetStore.breathingPresets" 
            :key="preset.id"
            class="preset-card"
          >
            <h3>{{ preset.name }}</h3>
            <p>{{ preset.description }}</p>
            <span class="duration">{{ formatDuration(preset.duration) }}</span>
          </div>
        </div>

        <h2>EMDR Presets</h2>
        <div class="preset-grid">
          <div 
            v-for="preset in presetStore.emdrPresets" 
            :key="preset.id"
            class="preset-card"
          >
            <h3>{{ preset.name }}</h3>
            <p>{{ preset.description }}</p>
            <span class="duration">{{ formatDuration(preset.duration) }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn-secondary">Create New Preset</button>
        <button class="btn-secondary">Create Sequence</button>
        <button class="btn-secondary">Import/Export</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePresetStore } from '../stores/presetStore.js';

const presetStore = usePresetStore();

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-xl);
  overflow-y: auto;
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
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.presets-section {
  margin-bottom: var(--space-2xl);
}

.presets-section h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-md);
  margin-top: var(--space-xl);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.preset-card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  transition: all var(--duration-200);
  cursor: pointer;
}

.preset-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-interactive);
}

.preset-card h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-xs);
}

.preset-card p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-sm);
}

.duration {
  display: inline-block;
  background: var(--color-surface-tertiary);
  color: var(--color-text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--space-xl);
}

.btn-secondary {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
}

.btn-secondary:hover {
  background: var(--color-surface-tertiary);
  border-color: var(--color-border-interactive);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
</style>
