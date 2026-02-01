<template>
  <div :class="['bilateral-controls', { collapsed: isCollapsed }]">
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

      <AudioSection ref="audioRef" />

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
import { ref, watch, computed } from 'vue';
import { useSessionStore } from '../../stores/sessionStore.js';
import { usePresetStore } from '../../stores/presetStore.js';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import BasicControlsSection from './BasicControlsSection.vue';
import StyleSection from './StyleSection.vue';
import AudioSection from './AudioSection.vue';
import AffirmationsSection from './AffirmationsSection.vue';
import SaveImportSection from './SaveImportSection.vue';

const sessionStore = useSessionStore();
const presetStore = usePresetStore();

const isCollapsed = ref(false);

// Refs to child components
const basicControlsRef = ref(null);
const styleRef = ref(null);
const audioRef = ref(null);
const affirmationsRef = ref(null);
const saveImportRef = ref(null);

const emit = defineEmits(['collapse-changed']);

// Auto-collapse when sequence starts
watch(() => sessionStore.isPlayingSequence, (isPlaying) => {
  if (isPlaying) {
    isCollapsed.value = true;
    emit('collapse-changed', true);
  }
});

// Computed properties to access child component values
const bpm = computed(() => basicControlsRef.value?.bpm || 30);
const durationMinutes = computed(() => basicControlsRef.value?.durationMinutes || 5);
const durationSeconds = computed(() => basicControlsRef.value?.durationSeconds || 0);
const visualMode = computed(() => styleRef.value?.visualMode || 'slide');
const selectedTheme = computed(() => styleRef.value?.selectedTheme || 'pink');
const darkMode = computed(() => styleRef.value?.darkMode || true);
const showTime = computed(() => styleRef.value?.showTime || true);
const bilateralAudio = computed(() => audioRef.value?.bilateralAudio || false);
const affirmations = computed(() => affirmationsRef.value?.affirmations || '');
const affirmationInterval = computed(() => affirmationsRef.value?.affirmationInterval || 15);

// Watch for changes in visualMode and bpm to stop session
watch([visualMode, bpm], () => {
  if (sessionStore.isActive) {
    sessionStore.stopSession();
  }
});

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
  emit('collapse-changed', isCollapsed.value);
}

function handleStart() {
  // If sequence is loaded but not started yet, start it with the current preset
  if (sessionStore.isPlayingSequence && !sessionStore.isActive && sessionStore.currentPreset) {
    const preset = sessionStore.currentPreset;
    const mode = preset.type === 'breathing' ? 'breathing' : 'bilateral';
    sessionStore.startSession(mode, preset);
    return;
  }
  
  // If already active (sequence is running), just resume if paused
  if (sessionStore.isActive && sessionStore.isPlayingSequence) {
    if (sessionStore.isPaused) {
      sessionStore.resumeSession();
    }
    return;
  }
  
  // Start a new standalone session
  const totalSeconds = basicControlsRef.value?.getTotalSeconds() || 300;
  const preset = {
    name: 'Current Session',
    type: 'bilateral',
    duration: totalSeconds,
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
  const presetName = saveImportRef.value.presetName;
  
  if (!presetName.trim()) {
    saveImportRef.value.showAlert('error', 'Please enter a preset name');
    return;
  }
  
  const preset = {
    id: `preset-${Date.now()}`,
    name: presetName.trim(),
    type: 'bilateral',
    bpm: bpm.value,
    durationMinutes: durationMinutes.value,
    durationSeconds: durationSeconds.value,
    visualMode: visualMode.value,
    bilateralAudio: bilateralAudio.value,
    selectedTheme: selectedTheme.value,
    darkMode: darkMode.value,
    showTime: showTime.value,
    affirmations: affirmations.value || '',
    affirmationInterval: affirmationInterval.value,
    created: new Date().toISOString()
  };
  
  presetStore.addPreset(preset);
  
  saveImportRef.value.presetName = '';
  saveImportRef.value.showAlert('success', 'Preset saved!');
}

function handleExport() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  
  const preset = {
    type: 'bilateral',
    bpm: bpm.value,
    durationMinutes: durationMinutes.value,
    durationSeconds: durationSeconds.value,
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
          saveImportRef.value.showAlert('error', 'Invalid bilateral preset file');
          return;
        }
        
        applyBilateralPreset(preset);
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

function applyBilateralPreset(preset) {
  // Apply bilateral settings to child components
  if (basicControlsRef.value) {
    if (preset.bpm !== undefined) {
      basicControlsRef.value.bpm = preset.bpm;
    }
    if (preset.durationMinutes !== undefined) {
      basicControlsRef.value.durationMinutes = preset.durationMinutes;
    }
    if (preset.durationSeconds !== undefined) {
      basicControlsRef.value.durationSeconds = preset.durationSeconds;
    }
  }
  
  if (styleRef.value) {
    if (preset.visualMode) {
      styleRef.value.visualMode = preset.visualMode;
    }
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
    if (preset.showTime !== undefined) {
      styleRef.value.showTime = preset.showTime;
    }
  }
  
  if (audioRef.value && preset.bilateralAudio !== undefined) {
    audioRef.value.bilateralAudio = preset.bilateralAudio;
  }
  
  if (affirmationsRef.value) {
    if (preset.affirmations) {
      affirmationsRef.value.affirmations = preset.affirmations;
    }
    if (preset.affirmationInterval !== undefined) {
      affirmationsRef.value.affirmationInterval = preset.affirmationInterval;
    }
  }
}

defineExpose({
  basicControlsRef,
  styleRef,
  audioRef,
  affirmationsRef,
  saveImportRef,
  bpm,
  durationMinutes,
  durationSeconds,
  visualMode,
  bilateralAudio,
  selectedTheme,
  darkMode,
  showTime,
  affirmations,
  affirmationInterval,
  applyBilateralPreset,
  toggleSidebar,
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
