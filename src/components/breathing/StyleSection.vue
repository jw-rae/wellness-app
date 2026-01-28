<template>
  <CollapsibleSection 
    title="Style" 
    :icon="Settings" 
    :initially-expanded="true"
  >
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
        <span>Show Inhale/Exhale</span>
        <div class="toggle-switch">
          <input type="checkbox" v-model="showInhaleExhale" />
          <span class="slider"></span>
        </div>
      </label>
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

    <div class="control-section">
      <GameSelect
        label="Choose Focal Point"
        v-model="focalPointType"
        :options="focalPointOptions"
      />
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Settings, Sun, Moon } from 'lucide-vue-next';
import CollapsibleSection from '../CollapsibleSection.vue';
import GameSelect from '../GameSelect.vue';

const selectedTheme = ref('pink');
const darkMode = ref(true);
const showInhaleExhale = ref(true);
const showTime = ref(true);
const focalPointType = ref('circle');

const themeOptions = [
  { value: 'default', label: 'Default' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'pink', label: 'Pink' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
];

const focalPointOptions = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'star', label: 'Star' },
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
  showInhaleExhale,
  showTime,
  focalPointType,
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
  padding: var(--space-sm);
  background: var(--color-surface-tertiary);
  border: none;
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-200);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mode-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-secondary);
}

.mode-btn.active {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
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
  width: 38px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface-tertiary);
  transition: .3s;
  border-radius: 20px;
  border: 1px solid var(--color-border-primary);
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-text-secondary);
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-brand-primary-500);
  border-color: var(--color-brand-primary-500);
}

input:checked + .slider:before {
  background-color: var(--color-text-inverse);
  transform: translateX(18px);
}
</style>
