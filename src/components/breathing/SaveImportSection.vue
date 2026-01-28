<template>
  <CollapsibleSection 
    title="Save / Import" 
    :icon="Save" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <label for="preset-name">Preset Name</label>
      <input 
        id="preset-name" 
        type="text" 
        v-model="presetName"
        placeholder="Enter preset name"
      />
    </div>
    
    <div class="control-section">
      <div class="button-group">
        <button class="btn-secondary" @click="$emit('save')">
          <Save :size="16" />
          Save
        </button>
        <button class="btn-secondary" @click="$emit('import')">
          <Download :size="16" />
          Import
        </button>
      </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref } from 'vue';
import { Save, Download } from 'lucide-vue-next';
import CollapsibleSection from '../CollapsibleSection.vue';

defineEmits(['save', 'import']);

const presetName = ref('');

defineExpose({
  presetName,
});
</script>

<style scoped>
.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.control-section label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

input[type="text"] {
  width: 100%;
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: inherit;
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

.button-group {
  display: flex;
  gap: var(--space-sm);
}

.btn-secondary {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-tertiary);
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.btn-secondary:hover {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border-color: var(--color-brand-primary-500);
}
</style>
