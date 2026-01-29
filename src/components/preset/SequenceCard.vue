<template>
  <div class="preset-card">
    <div class="card-content">
      <h3 class="preset-name">{{ sequence.name }}</h3>
      <p class="preset-type">{{ sequence.items.length }} step{{ sequence.items.length !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="card-actions">
      <button class="btn-play" @click="$emit('play', sequence)">
        <Play :size="20" />
        <span>Play</span>
      </button>
      
      <div class="secondary-actions">
        <button class="btn-icon" @click="$emit('export', sequence)" title="Export sequence">
          <Download :size="18" />
        </button>
        <button class="btn-icon btn-delete" @click="$emit('delete', sequence)" title="Delete sequence">
          <Trash2 :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Play, Download, Trash2 } from 'lucide-vue-next';

defineProps({
  sequence: {
    type: Object,
    required: true
  }
});

defineEmits(['play', 'export', 'delete']);
</script>

<style scoped>
.preset-card {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  transition: all var(--transition-default);
  height: 100%;
}

.preset-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-content {
  flex: 1;
}

.preset-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs) 0;
  word-break: break-word;
}

.preset-type {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.btn-play {
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  transition: all var(--transition-default);
  width: 100%;
}

.btn-play:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.btn-play:active {
  transform: translateY(0);
}

.secondary-actions {
  display: flex;
  gap: var(--space-xs);
}

.btn-icon {
  flex: 1;
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  transition: all var(--transition-default);
}

.btn-icon:hover {
  border-color: var(--color-border-hover);
  background: var(--color-surface-secondary);
}

.btn-delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}
</style>
