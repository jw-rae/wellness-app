<template>
  <tr class="table-row">
    <td class="cell-name">
      <input
        v-if="isEditing"
        ref="nameInput"
        v-model="editedName"
        class="table-name-input"
        @blur="handleSave"
        @keyup.enter="handleSave"
        @keyup.escape="handleCancel"
      />
      <span v-else>{{ String(preset.name || 'Untitled') }}</span>
    </td>
    <td class="cell-type">{{ typeLabel }}</td>
    <td class="cell-date responsive-date">{{ formattedDate }}</td>
    <td class="cell-actions">
      <button class="btn-icon-small" @click="$emit('play', preset)" title="Play">
        <Play :size="16" />
      </button>
      <button v-if="isEditing" class="btn-icon-small btn-save" @click="handleSave" title="Save preset name">
        <Check :size="16" />
      </button>
      <button v-else class="btn-icon-small btn-edit" @click="startEditing" title="Rename preset">
        <Pencil :size="14" />
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
import { ref, computed, nextTick } from 'vue';
import { Play, Download, Trash2, Pencil, Check } from 'lucide-vue-next';

const props = defineProps({
  preset: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['play', 'export', 'delete', 'rename', 'update']);

const isEditing = ref(false);
const editedName = ref('');
const nameInput = ref(null);

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

const startEditing = async () => {
  isEditing.value = true;
  editedName.value = String(props.preset.name || '');
  await nextTick();
  nameInput.value?.focus();
  nameInput.value?.select();
};

const handleSave = () => {
  if (isEditing.value && editedName.value.trim()) {
    emit('update', { ...props.preset, name: editedName.value.trim() });
  }
  isEditing.value = false;
};

const handleCancel = () => {
  isEditing.value = false;
  editedName.value = String(props.preset.name || '');
};
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

.table-name-input {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  background: var(--color-surface-secondary);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-md);
  outline: none;
}

.table-name-input:focus {
  border-color: var(--color-accent);
}

.btn-save {
  background: var(--color-surface-tertiary) !important;
  border: 2px solid var(--color-border-focus) !important;
  color: var(--color-text-link) !important;
  box-shadow: 0 0 0 1.5px var(--color-border-focus), 0 0 6px var(--color-border-focus);
}

.btn-save:hover {
  background: var(--color-surface-secondary) !important;
  border: 2px solid var(--color-border-focus) !important;
  color: var(--color-text-link-hover) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 2px var(--color-border-focus), 0 0 10px var(--color-border-focus);
}

.btn-edit {
  /* No special style, matches .btn-icon-small */
}

.btn-edit:hover {
  /* Remove any special hover styling, matches .btn-icon-small */
  border-color: var(--color-border-hover);
  background: var(--color-surface-tertiary);
  color: var(--color-text-primary);
  transform: none;
  box-shadow: none;
}

@media (max-width: 700px) {
  .responsive-date {
    display: none !important;
  }
}
</style>
