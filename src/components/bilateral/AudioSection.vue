<template>
  <CollapsibleSection 
    title="Audio" 
    :icon="Volume2" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <label class="toggle-label">
        <span>Bilateral Audio</span>
        <div class="toggle-switch">
          <input type="checkbox" v-model="bilateralAudio" />
          <span class="slider"></span>
        </div>
      </label>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref } from 'vue';
import { Volume2 } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';

const bilateralAudio = ref(false);

defineExpose({
  bilateralAudio,
});
</script>

<style scoped>
.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--color-surface-tertiary);
  border-radius: 12px;
  border: 2px solid var(--color-border-primary);
  transition: all var(--duration-200);
}

.toggle-switch input {
  display: none;
}

.toggle-switch .slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: var(--color-text-secondary);
  border-radius: 50%;
  transition: all var(--duration-200);
}

.toggle-switch input:checked ~ .slider {
  transform: translateX(20px);
  background: var(--color-brand-primary-500);
}

.toggle-switch input:checked + .slider {
  background: var(--color-brand-primary-500);
}

input:checked ~ .toggle-switch,
.toggle-switch:has(input:checked) {
  background: color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
  border-color: var(--color-brand-primary-500);
}
</style>
