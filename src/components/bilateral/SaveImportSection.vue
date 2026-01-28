<template>
  <CollapsibleSection 
    title="Save / Import" 
    :icon="Save" 
    :initially-expanded="false"
  >
    <Transition name="alert">
      <div v-if="alertMessage" :class="['alert', alertType]">
        {{ alertMessage }}
      </div>
    </Transition>
    
    <div class="control-section">
      <label for="preset-name">Preset Name</label>
      <div class="input-with-button">
        <input 
          id="preset-name" 
          type="text" 
          v-model="presetName"
          placeholder="Enter preset name"
        />
        <button class="btn-icon" @click="$emit('save')" title="Save preset">
          <Save :size="18" />
        </button>
      </div>
    </div>
    
    <div class="control-section">
      <div class="button-group">
        <button class="btn-secondary" @click="$emit('export')">
          <Download :size="16" />
          Export
        </button>
        <button class="btn-secondary" @click="$emit('import')">
          <Upload :size="16" />
          Import
        </button>
      </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref } from 'vue';
import { Save, Download, Upload } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';

defineEmits(['save', 'export', 'import']);

const presetName = ref('');
const alertType = ref('');
const alertMessage = ref('');

function showAlert(type, message) {
  alertType.value = type;
  alertMessage.value = message;
  setTimeout(() => {
    alertType.value = '';
    alertMessage.value = '';
  }, 3000);
}

defineExpose({
  presetName,
  showAlert,
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

.input-with-button {
  display: flex;
  gap: var(--space-xs);
  align-items: center;
}

.input-with-button input {
  flex: 1;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  background: var(--color-brand-primary-500);
  border: none;
  border-radius: 4px;
  color: var(--color-text-inverse);
  cursor: pointer;
  transition: all var(--duration-200);
  min-width: 36px;
  height: 36px;
}

.btn-icon:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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

.alert {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.alert.success {
  background: color-mix(in srgb, #10b981 15%, transparent);
  color: #10b981;
  border: 1px solid color-mix(in srgb, #10b981 30%, transparent);
}

.alert.error {
  background: color-mix(in srgb, #ef4444 15%, transparent);
  color: #ef4444;
  border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
}

.alert-enter-active,
.alert-leave-active {
  transition: all var(--duration-300) var(--ease-out);
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
