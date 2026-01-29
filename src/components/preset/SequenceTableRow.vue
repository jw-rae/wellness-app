<template>
  <tr class="table-row">
    <td class="cell-name">
      {{ sequence.name }}
      <span v-if="missingPresets > 0" class="warning-badge" title="Some presets are missing">⚠️</span>
    </td>
    <td class="cell-steps">{{ sequence.items.length }} step{{ sequence.items.length !== 1 ? 's' : '' }}</td>
    <td class="cell-date">{{ formattedDate }}</td>
    <td class="cell-actions">
      <button class="btn-icon-small" @click="$emit('play', sequence)" title="Play">
        <Play :size="16" />
      </button>
      <button class="btn-icon-small" @click="$emit('edit', sequence)" title="Edit">
        <Edit :size="16" />
      </button>
      <button class="btn-icon-small" @click="$emit('export', sequence)" title="Export">
        <Download :size="16" />
      </button>
      <button class="btn-icon-small btn-delete" @click="$emit('delete', sequence)" title="Delete">
        <Trash2 :size="16" />
      </button>
    </td>
  </tr>
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

const formattedDate = computed(() => {
  if (!props.sequence.created) return 'N/A';
  const date = new Date(props.sequence.created);
  return date.toLocaleDateString();
});

const missingPresets = computed(() => {
  return props.sequence.items.filter(item => 
    !props.allPresets.find(p => p.id === item.presetId)
  ).length;
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

.warning-badge {
  margin-left: var(--space-xs);
  font-size: var(--font-size-sm);
}

.cell-steps {
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
