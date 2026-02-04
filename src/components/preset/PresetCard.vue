<template>
  <div class="preset-card">
    <div class="card-content">
      <input
        v-if="isEditing"
        ref="nameInput"
        v-model="editedName"
        class="preset-name-input"
        @blur="handleSave"
        @keyup.enter="handleSave"
        @keyup.escape="handleCancel"
      />
      <h3 v-else class="preset-name">{{ String(preset.name || 'Untitled') }}</h3>
      <p class="preset-type">{{ typeLabel }}</p>
    </div>
    
    <div class="card-actions">
      <button class="btn-play" style="min-width:28px;min-height:28px;padding:2px 8px;" @click="$emit('play', preset)">
        <Play :size="16" />
        <span>Play</span>
      </button>
      <button v-if="isEditing" class="btn-icon btn-save" @click="handleSave" title="Save preset name">
        <Check :size="16" />
      </button>
      <button v-else class="btn-icon btn-edit" @click="startEditing" title="Rename preset">
        <Pencil :size="14" />
      </button>
      <button class="btn-icon" @click="$emit('export', preset)" title="Export preset">
        <Download :size="18" />
      </button>
      <button class="btn-icon btn-delete" @click="$emit('delete', preset)" title="Delete preset">
        <Trash2 :size="18" />
      </button>
    </div>
  </div>
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
    'breathing': 'Breathing Session',
    'bilateral': 'EMDR Session',
    'emdr': 'EMDR Session',
    'affirmation': 'Affirmation Session',
  };
  return labels[props.preset.type] || 'Session';
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
.preset-card {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border-secondary);
  border-radius: 12px;
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  transition: all var(--transition-default);
  height: 100%;
}

.preset-card:hover {
  border-color: var(--color-border-focus);
  box-shadow: 0 2px 8px var(--color-shadow, rgba(0,0,0,0.07));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.preset-type {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.card-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-play {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-secondary);
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
  border-color: var(--color-border-focus);
  background: var(--color-surface-secondary);
  transform: translateY(-1px);
}

.btn-play:active {
  transform: translateY(0);
}

.btn-icon {
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border-secondary);
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
  border-color: var(--color-border-focus);
  background: var(--color-surface-secondary);
}

.btn-delete:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: var(--color-error-bg, #fef2f2);
}

.preset-name-input {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  background: var(--color-surface-secondary);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-md);
  outline: none;
  margin: 0 0 var(--space-xs) 0;
}

.preset-name-input:focus {
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
  /* No special style, matches .btn-icon */
  border-color: var(--color-border-focus);
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
  transform: none;
  box-shadow: none;
}
</style>
