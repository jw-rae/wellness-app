<template>
  <CollapsibleSection 
    title="Save & Import" 
    :icon="Save" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <div class="input-with-button">
        <input
          type="text"
          v-model="presetName"
          placeholder="Preset name"
          class="preset-name-input"
        />
        <button class="btn-icon" @click="handleSave" title="Save preset">
          <Save :size="18" />
        </button>
      </div>
    </div>

    <div class="control-section">
      <div class="button-group">
        <button class="btn-secondary" @click="handleExport">
          <Download :size="16" />
          Export
        </button>
        <button class="btn-secondary" @click="handleImport">
          <Upload :size="16" />
          Import
        </button>
      </div>
    </div>

    <Transition name="alert">
      <div v-if="localAlertType" class="alert" :class="`alert-${localAlertType}`">
        {{ localAlertMessage }}
      </div>
    </Transition>
  </CollapsibleSection>
</template>

<script setup>
import { ref } from 'vue';
import { Save, Download, Upload } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';

const presetName = ref('');
const localAlertType = ref('');
const localAlertMessage = ref('');

const emit = defineEmits(['save', 'export', 'import', 'show-alert']);

function showAlert(type, message) {
  localAlertType.value = type;
  localAlertMessage.value = message;
  setTimeout(() => {
    localAlertType.value = '';
    localAlertMessage.value = '';
  }, 3000);
}

function handleSave() {
  emit('save', presetName.value, showAlert);
}

function handleExport() {
  emit('export', showAlert);
}

function handleImport() {
  emit('import', showAlert);
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

.input-with-button {
  display: flex;
  gap: var(--space-xs);
}

.preset-name-input {
  flex: 1;
  padding: var(--space-sm);
  background: var(--color-surface-tertiary);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--duration-200);
}

.preset-name-input:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  background: var(--color-surface-elevated);
}

.preset-name-input::placeholder {
  color: var(--color-text-tertiary);
}

.btn-icon {
  padding: var(--space-sm);
  background: var(--color-brand-primary-500);
  border: none;
  border-radius: 4px;
  color: var(--color-text-inverse);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-200);
}

.btn-icon:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-1px);
}

.btn-icon:active {
  transform: translateY(0);
}

.button-group {
  display: flex;
  gap: var(--space-sm);
}

.btn-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-tertiary);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-200);
}

.btn-secondary:hover {
  background: var(--color-surface-elevated);
  border-color: var(--color-brand-primary-500);
  color: var(--color-brand-primary-500);
}

.btn-secondary:active {
  transform: translateY(1px);
}

.alert {
  padding: var(--space-sm);
  border-radius: 4px;
  font-size: var(--font-size-sm);
  margin-top: var(--space-sm);
}

.alert-success {
  background: color-mix(in srgb, #10b981 20%, transparent);
  border: 2px solid #10b981;
  color: #10b981;
}

.alert-error {
  background: color-mix(in srgb, #ef4444 20%, transparent);
  border: 2px solid #ef4444;
  color: #ef4444;
}

.alert-enter-active,
.alert-leave-active {
  transition: all var(--duration-300);
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
