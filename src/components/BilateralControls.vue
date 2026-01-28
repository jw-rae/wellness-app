<template>
  <div :class="['bilateral-controls', { collapsed: isCollapsed }]">
    <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
      <ChevronRight v-if="isCollapsed" :size="20" />
      <ChevronLeft v-else :size="20" />
    </button>
    
    <div v-if="!isCollapsed" class="controls-content">
      <!-- Speed (BPM) -->
      <div class="control-section">
        <label for="bpm">
          Speed
          <span class="value-display">{{ bpm }} BPM</span>
        </label>
        <input 
          id="bpm" 
          type="range" 
          v-model.number="bpm"
          min="10"
          max="80"
          step="5"
        />
      </div>

      <!-- Duration -->
      <div class="control-section">
        <label for="duration">Duration</label>
        <div class="input-with-unit">
          <input 
            id="duration"
            type="number" 
            v-model.number="durationMinutes" 
            min="1" 
            max="60"
          />
          <span class="unit">min</span>
        </div>
      </div>

      <SessionControlButtons 
        @start="handleStart"
        @togglePause="handleTogglePause"
        @stop="handleStop"
      />

      <!-- Style Section -->
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

      <!-- Audio -->
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

      <!-- Affirmations -->
      <CollapsibleSection 
        title="Affirmations" 
        :icon="MessageCircle" 
        :initially-expanded="false"
      >
        <div class="control-section">
          <label for="affirmations">Affirmations (one per line)</label>
          <textarea 
            id="affirmations" 
            v-model="affirmations"
            rows="5"
            placeholder="I am safe&#10;I am healing&#10;I release the past&#10;I trust the process"
          ></textarea>
          <p class="help-text">Affirmations change on every cycle</p>
        </div>

        <div class="control-section">
          <label for="affirmation-interval">
            Affirmation Interval
            <span class="value-display">{{ affirmationInterval }}s</span>
          </label>
          <input 
            id="affirmation-interval" 
            type="range" 
            v-model.number="affirmationInterval"
            min="5"
            max="60"
            step="5"
          />
        </div>
      </CollapsibleSection>

      <!-- Save/Import -->
      <CollapsibleSection 
        title="Save Preset" 
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
              placeholder="My EMDR Session"
            />
            <button class="btn-icon" @click="handleSave" title="Save preset">
              <Save :size="18" />
            </button>
          </div>
        </div>

        <div class="control-section button-group">
          <button class="btn-secondary" @click="handleExport">
            <Download :size="16" />
            Export
          </button>
          <button class="btn-secondary" @click="handleImport">
            <Upload :size="16" />
            Import
          </button>
        </div>
      </CollapsibleSection>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useSessionStore } from '../stores/sessionStore.js';
import { ChevronLeft, ChevronRight, MessageCircle, Save, Download, Upload, Settings, Sun, Moon, Volume2 } from 'lucide-vue-next';
import CollapsibleSection from './CollapsibleSection.vue';
import GameSelect from './GameSelect.vue';
import SessionControlButtons from './SessionControlButtons.vue';

const sessionStore = useSessionStore();

const isCollapsed = ref(false);
const bilateralAudio = ref(true);
const bpm = ref(30);
const durationMinutes = ref(5);
const visualMode = ref('slide');
const selectedTheme = ref('pink');
const darkMode = ref(true);
const showTime = ref(true);
const affirmations = ref('I am safe\nI am healing\nI release the past\nI trust the process');
const affirmationInterval = ref(15);
const presetName = ref('');
const alertType = ref('');
const alertMessage = ref('');

const emit = defineEmits(['collapse-changed']);

function showAlert(type, message) {
  alertType.value = type;
  alertMessage.value = message;
  setTimeout(() => {
    alertType.value = '';
    alertMessage.value = '';
  }, 3000);
}

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

// Stop session when visual mode or BPM changes
watch([visualMode, bpm], () => {
  if (sessionStore.isActive) {
    sessionStore.stopSession();
  }
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

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-changed', isCollapsed.value);
}

function handleStart() {
  const preset = {
    name: 'Current Session',
    type: 'bilateral',
    duration: durationMinutes.value * 60,
    bpm: bpm.value,
    visualMode: visualMode.value,
    bilateralAudio: bilateralAudio.value,
    affirmationText: affirmations.value || '',
    affirmationInterval: affirmationInterval.value,
  };
  
  sessionStore.startSession('bilateral', preset);
}

function handleTogglePause() {
  if (sessionStore.isPaused) {
    sessionStore.resumeSession();
  } else {
    sessionStore.pauseSession();
  }
}

function handleStop() {
  sessionStore.stopSession();
}

function handleSave() {
  if (!presetName.value.trim()) {
    showAlert('error', 'Please enter a preset name');
    return;
  }
  
  // Add save logic here if needed
  presetName.value = '';
  showAlert('success', 'Preset saved!');
}

function handleExport() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  
  const preset = {
    type: 'bilateral',
    bpm: bpm.value,
    durationMinutes: durationMinutes.value,
    visualMode: visualMode.value,
    bilateralAudio: bilateralAudio.value,
    selectedTheme: selectedTheme.value,
    darkMode: darkMode.value,
    showTime: showTime.value,
    affirmations: affirmations.value || '',
    affirmationInterval: affirmationInterval.value,
    exportedAt: date.toISOString(),
  };
  
  const json = JSON.stringify(preset, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `bilateral_${dateStr}_preset.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const preset = JSON.parse(e.target.result);
        
        // Validate preset structure
        if (!preset || preset.type !== 'bilateral') {
          showAlert('error', 'Invalid bilateral preset file');
          return;
        }
        
        // Apply bilateral settings
        if (preset.bpm !== undefined) {
          bpm.value = preset.bpm;
        }
        if (preset.durationMinutes !== undefined) {
          durationMinutes.value = preset.durationMinutes;
        }
        if (preset.visualMode) {
          visualMode.value = preset.visualMode;
        }
        if (preset.bilateralAudio !== undefined) {
          bilateralAudio.value = preset.bilateralAudio;
        }
        if (preset.selectedTheme) {
          selectedTheme.value = preset.selectedTheme;
          document.documentElement.setAttribute('data-theme', preset.selectedTheme);
        }
        if (preset.darkMode !== undefined) {
          darkMode.value = preset.darkMode;
          if (preset.darkMode) {
            setDarkMode();
          } else {
            setLightMode();
          }
        }
        if (preset.showTime !== undefined) {
          showTime.value = preset.showTime;
        }
        if (preset.affirmations) {
          affirmations.value = preset.affirmations;
        }
        if (preset.affirmationInterval !== undefined) {
          affirmationInterval.value = preset.affirmationInterval;
        }
        
        showAlert('success', 'Preset imported successfully!');
      } catch (error) {
        showAlert('error', 'Failed to import preset. Invalid JSON format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

defineExpose({
  bilateralAudio,
  bpm,
  durationMinutes,
  visualMode,
  selectedTheme,
  darkMode,
  showTime,
  affirmations,
  affirmationInterval,
  setDarkMode,
  setLightMode,
});
</script>

<style scoped>
.bilateral-controls {
  position: relative;
  width: 320px;
  min-width: 280px;
  max-width: 400px;
  height: 100%;
  background: var(--color-surface-elevated);
  border-right: 1px solid var(--color-border-primary);
  overflow-y: auto;
  overflow-x: hidden;
  transition: width var(--duration-300) var(--ease-out),
              min-width var(--duration-300) var(--ease-out);
  display: flex;
  flex-direction: column;
}

.bilateral-controls.collapsed {
  width: 0;
  min-width: 0;
  padding: 0;
  background: transparent;
  border-right: none;
  overflow: visible;
}

.bilateral-controls.collapsed .toggle-btn {
  left: var(--space-md);
  right: auto;
}

.bilateral-controls.collapsed .controls-content {
  display: none;
}

.toggle-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border-primary);
  background: var(--color-surface-primary);
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: all var(--duration-300) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-50);
  color: var(--color-text-primary);
}

.bilateral-controls.collapsed .toggle-btn {
  left: var(--space-md);
  right: auto;
}

.toggle-btn:hover {
  background: var(--color-surface-tertiary);
  transform: scale(1.1);
}

.controls-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 56px;
  width: 100%;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  margin-bottom: var(--space-md);
}

.control-section label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-display {
  font-weight: var(--font-weight-medium);
  color: var(--color-brand-primary-500);
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--color-surface-tertiary);
  border-radius: 12px;
  transition: background var(--duration-200);
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch .slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform var(--duration-200);
}

.toggle-switch input:checked + .slider {
  transform: translateX(20px);
}

.toggle-switch input:checked ~ .slider {
  background: var(--color-brand-primary-500);
}

.toggle-switch:has(input:checked) {
  background: color-mix(in srgb, var(--color-brand-primary-500) 30%, transparent);
}

input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--color-surface-tertiary);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-track {
  width: 100%;
  height: 6px;
  background: var(--color-surface-tertiary);
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-brand-primary-500);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--duration-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 6px;
  background: var(--color-surface-tertiary);
  border-radius: 3px;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--color-brand-primary-500);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all var(--duration-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.input-with-unit input {
  flex: 1;
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: inherit;
}

.input-with-unit input:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

.unit {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

input[type="text"] {
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

textarea {
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
}

textarea:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

.help-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-style: italic;
  margin-top: var(--space-xs);
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
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
}

.btn-secondary:hover {
  background: var(--color-surface-elevated);
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
  border-color: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
}

/* Custom Scrollbar */
.bilateral-controls::-webkit-scrollbar {
  width: 8px;
}

.bilateral-controls::-webkit-scrollbar-track {
  background: var(--color-surface-secondary);
}

.bilateral-controls::-webkit-scrollbar-thumb {
  background: var(--color-brand-primary-500);
  border-radius: 4px;
}

.bilateral-controls::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-primary-600);
}
</style>
