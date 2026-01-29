<template>
  <div :class="['breathing-controls', { collapsed: isCollapsed }]">
    <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
      <ChevronRight v-if="isCollapsed" :size="20" />
      <ChevronLeft v-else :size="20" />
    </button>
    
    <div v-show="!isCollapsed" class="controls-content">
      <BasicControlsSection 
        ref="basicControlsRef"
        @start="handleStart"
        @togglePause="handleTogglePause"
        @stop="handleStop"
      />

      <StyleSection ref="styleRef" />

      <AffirmationsSection ref="affirmationsRef" />

      <SaveImportSection 
        ref="saveImportRef"
        @save="handleSave"
        @export="handleExport"
        @import="handleImport"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { usePresetStore } from '../stores/presetStore.js';
import { useSessionStore } from '../stores/sessionStore.js';
import { exportPreset } from '../utils/exportUtils.js';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import BasicControlsSection from './breathing/BasicControlsSection.vue';
import StyleSection from './breathing/StyleSection.vue';
import AffirmationsSection from './breathing/AffirmationsSection.vue';
import SaveImportSection from './breathing/SaveImportSection.vue';

const presetStore = usePresetStore();
const sessionStore = useSessionStore();

const isCollapsed = ref(false);
const basicControlsRef = ref(null);
const styleRef = ref(null);
const affirmationsRef = ref(null);
const saveImportRef = ref(null);

const emit = defineEmits(['collapse-changed']);

defineExpose({
  basicControlsRef,
  styleRef,
  affirmationsRef,
  saveImportRef,
  toggleSidebar,
});

// Auto-collapse when sequence starts
watch(() => sessionStore.isPlayingSequence, (isPlaying) => {
  if (isPlaying) {
    isCollapsed.value = true;
    emit('collapse-changed', true);
  }
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-changed', isCollapsed.value);
}

function handleStart() {
  const breathingPattern = basicControlsRef.value.getBreathingPattern();
  const totalSeconds = basicControlsRef.value.getTotalSeconds();
  
  const preset = {
    name: 'Current Session',
    type: 'breathing',
    duration: totalSeconds,
    breathingPattern,
    affirmationText: affirmationsRef.value.affirmations || '',
  };
  
  sessionStore.startSession('breathing', preset);
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
  const presetName = saveImportRef.value.presetName;
  
  if (!presetName.trim()) {
    saveImportRef.value.showAlert('error', 'Please enter a preset name');
    return;
  }
  
  // Save with ALL settings (matching export format)
  presetStore.addPreset({
    id: `preset-${Date.now()}`,
    name: presetName.trim(),
    type: 'breathing',
    selectedPattern: basicControlsRef.value.selectedPattern,
    durationMinutes: basicControlsRef.value.durationMinutes,
    durationSeconds: basicControlsRef.value.durationSeconds,
    selectedTheme: styleRef.value.selectedTheme,
    darkMode: styleRef.value.darkMode,
    showInhaleExhale: styleRef.value.showInhaleExhale,
    showTime: styleRef.value.showTime,
    focalPointType: styleRef.value.focalPointType,
    affirmations: affirmationsRef.value.affirmations || '',
    created: new Date().toISOString()
  });
  
  saveImportRef.value.presetName = '';
  saveImportRef.value.showAlert('success', 'Preset saved!');
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
        if (!preset || preset.type !== 'breathing') {
          saveImportRef.value.showAlert('error', 'Invalid breathing preset file');
          return;
        }
        
        // Apply preset to UI
        applyPresetToUI(preset);
        
        // Add to preset store if it has a name and isn't already there
        if (preset.name) {
          const existingPreset = presetStore.presets.find(p => p.id === preset.id);
          if (!existingPreset) {
            // Ensure preset has all required fields
            const completePreset = {
              ...preset,
              id: preset.id || `preset-${Date.now()}`,
              created: preset.created || new Date().toISOString()
            };
            presetStore.addPreset(completePreset);
          }
        }
        
        saveImportRef.value.showAlert('success', 'Preset imported successfully!');
      } catch (error) {
        saveImportRef.value.showAlert('error', 'Failed to import preset. Invalid JSON format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

function applyPresetToUI(preset) {
  // Apply breathing pattern
  if (preset.selectedPattern) {
    basicControlsRef.value.selectedPattern = preset.selectedPattern;
  }
  
  // Apply duration
  if (preset.durationMinutes !== undefined) {
    basicControlsRef.value.durationMinutes = preset.durationMinutes;
  }
  if (preset.durationSeconds !== undefined) {
    basicControlsRef.value.durationSeconds = preset.durationSeconds;
  }
  
  // Apply style settings
  if (preset.selectedTheme) {
    styleRef.value.selectedTheme = preset.selectedTheme;
    document.documentElement.setAttribute('data-theme', preset.selectedTheme);
  }
  if (preset.darkMode !== undefined) {
    styleRef.value.darkMode = preset.darkMode;
    if (preset.darkMode) {
      styleRef.value.setDarkMode();
    } else {
      styleRef.value.setLightMode();
    }
  }
  if (preset.showInhaleExhale !== undefined) {
    styleRef.value.showInhaleExhale = preset.showInhaleExhale;
  }
  if (preset.showTime !== undefined) {
    styleRef.value.showTime = preset.showTime;
  }
  if (preset.focalPointType) {
    styleRef.value.focalPointType = preset.focalPointType;
  }
  
  // Apply affirmations
  if (preset.affirmations) {
    affirmationsRef.value.affirmations = preset.affirmations;
  }
}

function handleExport() {
  const preset = {
    id: `preset-${Date.now()}`,
    name: saveImportRef.value.presetName || 'Breathing Session',
    type: 'breathing',
    selectedPattern: basicControlsRef.value.selectedPattern,
    durationMinutes: basicControlsRef.value.durationMinutes,
    durationSeconds: basicControlsRef.value.durationSeconds,
    selectedTheme: styleRef.value.selectedTheme,
    darkMode: styleRef.value.darkMode,
    showInhaleExhale: styleRef.value.showInhaleExhale,
    showTime: styleRef.value.showTime,
    focalPointType: styleRef.value.focalPointType,
    affirmations: affirmationsRef.value.affirmations || '',
    created: new Date().toISOString()
  };
  
  // Use the unified export utility
  exportPreset(preset);
}
</script>

<style scoped>
.breathing-controls {
  position: relative;
  width: 320px;
  min-width: 280px;
  max-width: 400px;
  height: 100%;
  background: var(--color-surface-elevated);
  border-right: 1px solid var(--color-border-primary);
  padding: 0;
  overflow-y: auto;
  transition: width var(--duration-300) var(--ease-out);
}

.breathing-controls.collapsed {
  width: 0;
  min-width: 0;
  padding: 0;
  background: transparent;
  border-right: none;
  overflow: visible;
}

.breathing-controls.collapsed .toggle-btn {
  left: var(--space-md);
  right: auto;
}

.breathing-controls.collapsed .controls-content {
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

.toggle-btn:hover {
  background: var(--color-surface-tertiary);
  transform: scale(1.1);
}

.controls-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 56px;
  width: 100%;
}

/* Custom Scrollbar */
.breathing-controls::-webkit-scrollbar {
  width: 8px;
}

.breathing-controls::-webkit-scrollbar-track {
  background: var(--color-surface-secondary);
}

.breathing-controls::-webkit-scrollbar-thumb {
  background: var(--color-brand-primary-500);
  border-radius: 4px;
}

.breathing-controls::-webkit-scrollbar-thumb:hover {
  background: var(--color-brand-primary-600);
}
</style>
