<template>
  <div class="builder-content">
    <div class="builder-layout">
      <!-- Available Presets Panel -->
      <div class="available-presets">
        <h3 class="panel-title">Available Presets</h3>
        <div class="preset-list">
          <div 
            v-for="preset in availablePresets" 
            :key="preset.id"
            class="preset-item"
          >
            <div class="preset-info">
              <span class="preset-item-name">{{ preset.name }}</span>
              <span class="preset-item-type">{{ getPresetTypeLabel(preset.type) }}</span>
            </div>
            <button class="btn-add" @click="$emit('add', preset)" title="Add to sequence">
              <Plus :size="18" />
            </button>
          </div>
        </div>
      </div>

      <!-- Build Sequence Panel -->
      <div class="build-sequence">
        <div class="sequence-header">
          <input 
            :value="sequenceName"
            @input="$emit('update:sequenceName', $event.target.value)"
            type="text" 
            class="sequence-name-input" 
            placeholder="Enter sequence name"
          />
          <button 
            class="btn-create-sequence" 
            @click="$emit('create')"
            :disabled="sequenceItems.length === 0"
          >
            {{ isEditing ? 'Save Sequence' : 'Create Sequence' }}
          </button>
        </div>
        
        <div 
          v-if="sequenceItems.length === 0"
          class="sequence-empty"
        >
          <p>No items in sequence</p>
          <p class="empty-hint">Add presets from the left panel</p>
        </div>

        <div 
          v-else
          class="sequence-list"
          @dragover.prevent
          @drop="$emit('drop', $event)"
        >
          <div 
            v-for="(item, index) in sequenceItems" 
            :key="item.tempId"
            class="sequence-item"
            draggable="true"
            @dragstart="$emit('dragStart', index)"
            @dragend="$emit('dragEnd')"
            @dragover.prevent="$emit('dragOver', index)"
          >
            <div class="drag-handle">
              <GripVertical :size="16" />
            </div>
            <div class="sequence-item-content">
              <span class="sequence-item-name">{{ item.preset.name }}</span>
              <span class="sequence-item-type">{{ getPresetTypeLabel(item.preset.type) }}</span>
            </div>
            <div class="sequence-item-actions">
              <button class="btn-icon-small" @click="$emit('toggleVisibility', index)" :title="item.visible ? 'Hide' : 'Show'">
                <Eye v-if="item.visible" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
              <button class="btn-icon-small" @click="$emit('remove', index)" title="Remove">
                <X :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Plus, GripVertical, Eye, EyeOff, X } from 'lucide-vue-next';

defineProps({
  availablePresets: {
    type: Array,
    required: true
  },
  sequenceName: {
    type: String,
    required: true
  },
  sequenceItems: {
    type: Array,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

defineEmits(['add', 'remove', 'toggleVisibility', 'dragStart', 'dragEnd', 'dragOver', 'drop', 'create', 'update:sequenceName']);

function getPresetTypeLabel(type) {
  const labels = {
    'breathing': 'Breathing Session',
    'bilateral': 'EMDR Session',
    'emdr': 'EMDR Session',
    'affirmation': 'Affirmation Session',
  };
  return labels[type] || 'Session';
}
</script>

<style scoped>
.builder-content {
  padding: var(--space-xl);
  height: 100%;
}

.builder-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  height: 100%;
}

.available-presets,
.build-sequence {
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-md) 0;
}

.preset-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-default);
}

.preset-item:hover {
  border-color: var(--color-border-hover);
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
  flex: 1;
  min-width: 0;
}

.preset-item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preset-item-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.btn-add {
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-default);
  flex-shrink: 0;
}

.btn-add:hover {
  background: var(--color-accent-hover);
  transform: scale(1.05);
}

.sequence-header {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  align-items: center;
}

.sequence-name-input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-default);
  height: 40px;
}

.btn-create-sequence {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-default);
  white-space: nowrap;
  height: 40px;
}

.btn-create-sequence:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.3);
  background: var(--color-surface-secondary);
  transform: translateY(-1px);
}

.btn-create-sequence:active:not(:disabled) {
  transform: translateY(0);
}

.btn-create-sequence:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sequence-name-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.sequence-name-input::placeholder {
  color: var(--color-text-tertiary);
}

.sequence-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-xl);
}

.sequence-empty p {
  margin: 0;
  font-size: var(--font-size-base);
}

.empty-hint {
  margin-top: var(--space-sm) !important;
  font-size: var(--font-size-sm) !important;
  opacity: 0.7;
}

.sequence-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sequence-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-surface-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: move;
  transition: all var(--transition-default);
}

.sequence-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.drag-handle {
  color: var(--color-text-tertiary);
  cursor: grab;
  display: flex;
  align-items: center;
}

.drag-handle:active {
  cursor: grabbing;
}

.sequence-item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.sequence-item-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sequence-item-type {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.sequence-item-actions {
  display: flex;
  gap: var(--space-xs);
}

.btn-icon-small {
  background: transparent;
  border: none;
  padding: var(--space-2xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-default);
  border-radius: var(--radius-sm);
}

.btn-icon-small:hover {
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
}

.sequence-footer {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .builder-layout {
    grid-template-columns: 1fr;
  }
}
</style>
