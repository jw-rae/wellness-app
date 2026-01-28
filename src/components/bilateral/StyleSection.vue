<template>
  <CollapsibleSection 
    title="Style" 
    :icon="Settings" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <GameSelect
        label="Visual Mode"
        v-model="visualMode"
        :options="visualModeOptions"
      />
    </div>

    <div class="control-section">
      <GameSelect
        label="Choose Theme"
        v-model="selectedTheme"
        :options="themeOptions"
      />
      
      <div class="color-mode-toggle">
        <button 
          class="mode-btn"
          :class="{ active: !darkMode }"
          @click="setLightMode"
          aria-label="Light mode"
        >
          <Sun :size="18" />
        </button>
        <button 
          class="mode-btn"
          :class="{ active: darkMode }"
          @click="setDarkMode"
          aria-label="Dark mode"
        >
          <Moon :size="18" />
        </button>
      </div>
    </div>

    <div class="control-section">
      <label class="toggle-label">
        <span>Show Time</span>
        <div class="toggle-switch">
          <input type="checkbox" v-model="showTime" />
          <span class="slider"></span>
        </div>
      </label>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Settings, Sun, Moon } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';
import GameSelect from '../ui/GameSelect.vue';

const visualMode = ref('slide');
const selectedTheme = ref('pink');
const darkMode = ref(true);
const showTime = ref(true);

const visualModeOptions = [
  { value: 'slide', label: 'Slide Mode' },
  { value: 'flash', label: 'Flash Mode' },
];

const themeOptions = [
  { value: 'default', label: 'Default' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'pink', label: 'Pink' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

watch(selectedTheme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme);
});

function setLightMode() {
  darkMode.value = false;
  document.documentElement.setAttribute('data-color-scheme', 'light');
}

function setDarkMode() {
  darkMode.value = true;
  document.documentElement.setAttribute('data-color-scheme', 'dark');
}

onMounted(() => {
  setDarkMode();
});

defineExpose({
  visualMode,
  selectedTheme,
  darkMode,
  showTime,
  setLightMode,
  setDarkMode,
});
</script>

<style scoped>
.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.color-mode-toggle {
  display: flex;
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  background: var(--color-surface-tertiary);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-200);
}

.mode-btn:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
}

.mode-btn.active {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border-color: var(--color-brand-primary-500);
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
