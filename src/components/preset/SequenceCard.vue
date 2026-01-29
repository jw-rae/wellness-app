<template>
  <div class="preset-card">
    <div class="card-content">
      <h3 class="preset-name">{{ sequence.name }}</h3>
      <p class="preset-type">{{ sequence.items.length }} step{{ sequence.items.length !== 1 ? 's' : '' }}</p>
      <p v-if="missingPresets > 0" class="preset-warning">⚠️ {{ missingPresets }} missing preset{{ missingPresets !== 1 ? 's' : '' }}</p>
    </div>
    
    <div class="card-actions">
      <button class="btn-play" @click="$emit('play', sequence)">
        <Play :size="20" />
        <span>Play</span>
      </button>
      <button class="btn-icon" @click="$emit('edit', sequence)" title="Edit sequence">
        <Edit :size="18" />
      </button>
      <button class="btn-icon" @click="$emit('export', sequence)" title="Export sequence">
        <Download :size="18" />
      </button>
      <button class="btn-icon btn-delete" @click="$emit('delete', sequence)" title="Delete sequence">
        <Trash2 :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Play, Edit, Download, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  sequence: {
    type: Object,
    required: true
  },
  allPresets: {
    type: Array,
    required: true
  }
});

defineEmits(['play', 'edit', 'export', 'delete']);

const missingPresets = computed(() => {
  return props.sequence.items.filter(item => 
    !props.allPresets.find(p => p.id === item.presetId)
  ).length;
});
</script>

<style scoped>
.preset-card {
  background: var(--color-surface-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  transition: all var(--transition-default);
  height: 100%;
}

.preset-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
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

.preset-warning {
  font-size: var(--font-size-sm);
  color: var(--color-warning);
  margin: var(--space-xs) 0 0 0;
}

.card-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-play {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  transition: all var(--transition-default);
  flex: 1;
}

.btn-play:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: var(--color-surface-secondary);
  transform: translateY(-1px);
}

.btn-play:active {
  transform: translateY(0);
}

.btn-icon {
  background: var(--color-surface-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  transition: all var(--transition-default);
  min-width: 36px;
  min-height: 36px;
}

.btn-icon:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: var(--color-surface-secondary);
}

.btn-delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}
</style>
