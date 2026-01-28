<template>
  <div class="session-controls">
    <button 
      class="icon-btn"
      :class="{ active: sessionStore.isActive && !sessionStore.isPaused }"
      @click="sessionStore.isActive && !sessionStore.isPaused ? $emit('togglePause') : $emit('start')"
      :aria-label="sessionStore.isActive && !sessionStore.isPaused ? 'Pause' : 'Start'"
    >
      <Play v-if="!sessionStore.isActive || sessionStore.isPaused" :size="20" />
      <Pause v-else :size="20" />
    </button>
    
    <button 
      class="icon-btn"
      :disabled="!sessionStore.isActive"
      @click="$emit('stop')"
      aria-label="Stop"
    >
      <Square :size="20" />
    </button>
  </div>
</template>

<script setup>
import { Play, Pause, Square } from 'lucide-vue-next';
import { useSessionStore } from '../../stores/sessionStore.js';

const sessionStore = useSessionStore();

defineEmits(['start', 'togglePause', 'stop']);
</script>

<style scoped>
.session-controls {
  padding: var(--space-md);
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
}

.icon-btn {
  width: 36px;
  height: 36px;
  background: var(--color-surface-tertiary);
  border: none;
  border-radius: 4px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover:not(:disabled) {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  transform: scale(1.1);
}

.icon-btn.active {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
}

.icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
