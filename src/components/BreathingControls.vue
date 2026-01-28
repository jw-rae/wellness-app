<template>
  <div :class="['breathing-controls', { collapsed: isCollapsed }]">
    <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
      <ChevronRight v-if="isCollapsed" :size="20" />
      <ChevronLeft v-else :size="20" />
    </button>
    
    <div v-if="!isCollapsed" class="controls-content">
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
        @import="handleImport"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePresetStore } from '../stores/presetStore.js';
import { useSessionStore } from '../stores/sessionStore.js';
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
  styleRef,
  affirmationsRef,
  saveImportRef,
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
    alert('Please enter a preset name');
    return;
  }
  
  const breathingPattern = basicControlsRef.value.getBreathingPattern();
  const totalSeconds = basicControlsRef.value.getTotalSeconds();
  
  presetStore.addPreset({
    name: presetName,
    type: 'breathing',
    duration: totalSeconds,
    breathingPattern,
    affirmationText: affirmationsRef.value.affirmations || '',
    description: `${basicControlsRef.value.selectedPattern} pattern, ${basicControlsRef.value.durationMinutes}m ${basicControlsRef.value.durationSeconds}s`,
  });
  
  saveImportRef.value.presetName = '';
  alert('Preset saved!');
}

function handleImport() {
  alert('Import functionality coming soon!');
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
  z-index: 10;
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
