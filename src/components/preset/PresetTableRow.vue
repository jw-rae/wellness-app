<template>
  <tr class="table-row">
    <td class="cell-name">{{ preset.name }}</td>
    <td class="cell-type">{{ typeLabel }}</td>
    <td class="cell-date">{{ formattedDate }}</td>
    <td class="cell-actions">
      <button class="btn-icon-small" @click="$emit('play', preset)" title="Play">
        <Play :size="16" />
      </button>
      <button class="btn-icon-small" @click="$emit('export', preset)" title="Export">
        <Download :size="16" />
      </button>
      <button class="btn-icon-small btn-delete" @click="$emit('delete', preset)" title="Delete">
        <Trash2 :size="16" />
      </button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import { Play, Download, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  preset: {
    type: Object,
    required: true
  }
});

defineEmits(['play', 'export', 'delete']);

const typeLabel = computed(() => {
  const labels = {
    'breathing': 'Breathing',
    'bilateral': 'EMDR',
    'emdr': 'EMDR',
    'affirmation': 'Affirmation',
  };
  return labels[props.preset.type] || 'Session';
});

const formattedDate = computed(() => {
  if (!props.preset.created) return 'N/A';
  const date = new Date(props.preset.created);
  return date.toLocaleDateString();
});
</script>

<style scoped>
.table-row {
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition-default);
}

.table-row:hover {
  background: var(--color-surface-tertiary);
  box-shadow: inset 0 0 0 1px var(--color-border-hover);
}

.table-row td {
  padding: var(--space-sm) var(--space-md);
}

.cell-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.cell-type {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.cell-date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.cell-actions {
  display: flex;
  gap: var(--space-xs);
  justify-content: flex-end;
  opacity: 0;
  transition: opacity var(--transition-default);
}

.table-row:hover .cell-actions {
  opacity: 1;
}

.btn-icon-small {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  transition: all var(--transition-default);
}

.btn-icon-small:hover {
  border-color: var(--color-border-hover);
  background: var(--color-surface-tertiary);
}

.btn-delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}
</style>
