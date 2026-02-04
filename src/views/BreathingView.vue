<template>
  <div 
    class="breathing-view" 
    :class="{ 'panel-collapsed': isPanelCollapsed, 'drag-over': isDragOver }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <BreathingControls 
      ref="controlsRef" 
      @collapse-changed="(collapsed) => { isPanelCollapsed = collapsed; emit('panel-collapsed', collapsed); }"
    />
    
    <div class="main-canvas">
      <CircularFocalPoint 
        :showInhaleExhale="styleSettings.showInhaleExhale"
        :showTime="styleSettings.showTime"
        :affirmations="affirmationSettings.text"
        :durationMinutes="durationSettings.minutes"
        :durationSeconds="durationSettings.seconds"
        :focalPointType="styleSettings.focalPointType"
      />
      
      <div v-if="isDragOver" class="drop-overlay">
        <div class="drop-message">
          <Upload :size="48" />
          <p>Drop JSON preset to load</p>
        </div>
      </div>
    </div>
    
    <Modal 
      v-model="showModal" 
      :title="modalTitle" 
      :message="modalMessage"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, unref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePresetStore } from '../stores/presetStore.js';
import { useSessionStore } from '../stores/sessionStore.js';
import { Upload } from 'lucide-vue-next';
import BreathingControls from '../components/BreathingControls.vue';
import CircularFocalPoint from '../components/CircularFocalPoint.vue';
import Modal from '../components/ui/Modal.vue';

const router = useRouter();
const presetStore = usePresetStore();
const sessionStore = useSessionStore();
const controlsRef = ref(null);
const isPanelCollapsed = ref(false);
const isDragOver = ref(false);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const emit = defineEmits(['panel-collapsed']);

const styleSettings = computed(() => {
  return {
    showInhaleExhale: controlsRef.value?.styleRef?.showInhaleExhale ?? true,
    showTime: controlsRef.value?.styleRef?.showTime ?? true,
    focalPointType: controlsRef.value?.styleRef?.focalPointType ?? 'solid',
  };
});

const affirmationSettings = computed(() => {
  return {
    text: controlsRef.value?.affirmationsRef?.affirmations ?? '',
  };
});

const durationSettings = computed(() => {
  if (!controlsRef.value?.basicControlsRef) {
    return { minutes: 5, seconds: 0 };
  }
  
  const basicControls = controlsRef.value.basicControlsRef;
  
  // Force reactivity by accessing the ref values
  const minutes = unref(basicControls.durationMinutes);
  const seconds = unref(basicControls.durationSeconds);
  
  return {
    minutes,
    seconds,
  };
});

onMounted(() => {
  // Check for pending preset from library or bilateral view
  const pendingPreset = sessionStorage.getItem('pendingBreathingPreset');
  if (pendingPreset) {
    sessionStorage.removeItem('pendingBreathingPreset');
    try {
      const preset = JSON.parse(pendingPreset);
      loadBreathingPreset(preset);
    } catch (error) {
      console.error('Failed to load pending preset:', error);
    }
  }
  
  // Check if panel should be collapsed (from play preset)
  const shouldCollapse = sessionStorage.getItem('collapsePanel');
  if (shouldCollapse === 'true') {
    sessionStorage.removeItem('collapsePanel');
    // Collapse the panel if controls are available
    if (controlsRef.value) {
      isPanelCollapsed.value = true;
      // Trigger collapse on the controls component
      nextTick(() => {
        if (controlsRef.value?.toggleSidebar) {
          controlsRef.value.toggleSidebar();
        }
      });
    }
  }
});

function handleDragEnter(e) {
  isDragOver.value = true;
}

function handleDragOver(e) {
  isDragOver.value = true;
}

function handleDragLeave(e) {
  if (e.target === e.currentTarget) {
    isDragOver.value = false;
  }
}

function handleDrop(e) {
  isDragOver.value = false;
  
  const files = e.dataTransfer.files;
  if (files.length === 0) return;
  
  const file = files[0];
  if (!file.name.endsWith('.json')) {
    showError('Invalid File', 'Please drop a JSON file');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const preset = JSON.parse(event.target.result);
      
      if (!preset || !preset.type) {
        showError('Invalid Preset', 'The file does not contain a valid preset');
        return;
      }
      
      if (preset.type === 'bilateral') {
        // Switch to bilateral view
        router.push('/bilateral');
        // Wait for route change then load preset
        setTimeout(() => {
          loadBilateralPreset(preset);
        }, 100);
        return;
      }
      
      if (preset.type === 'breathing') {
        try {
          loadBreathingPreset(preset);
          
          // Add to preset store if it has a name and isn't already there
          if (preset.name) {
            const existingPreset = presetStore.presets.find(p => p.id === preset.id);
            if (!existingPreset) {
              const completePreset = {
                ...preset,
                id: preset.id || `preset-${Date.now()}`,
                created: preset.created || new Date().toISOString()
              };
              presetStore.addPreset(completePreset);
            }
          }
        } catch (error) {
          console.error('Error loading preset:', error);
          showError('Load Error', 'Failed to apply preset settings');
        }
      } else {
        showError('Invalid Preset', 'Unknown preset type');
      }
    } catch (error) {
      showError('Invalid File', 'Failed to parse JSON file');
      console.error('Drop error:', error);
    }
  };
  reader.readAsText(file);
}

function loadBreathingPreset(preset) {
  if (!controlsRef.value) return;
  
  if (preset.selectedPattern && controlsRef.value.basicControlsRef) {
    controlsRef.value.basicControlsRef.selectedPattern = preset.selectedPattern;
  } else if (preset.breathingPattern && controlsRef.value.basicControlsRef) {
    // If only breathingPattern is provided (old format), try to match it to a known pattern
    const pattern = preset.breathingPattern;
    const patterns = {
      'box': { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
      '478': { inhale: 4, hold: 7, exhale: 8, holdAfterExhale: 0 },
      'equal': { inhale: 5, hold: 0, exhale: 5, holdAfterExhale: 0 },
      'calm': { inhale: 4, hold: 0, exhale: 6, holdAfterExhale: 0 },
      'energize': { inhale: 6, hold: 0, exhale: 2, holdAfterExhale: 0 },
      'triangle': { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 0 },
      'square-plus': { inhale: 6, hold: 6, exhale: 6, holdAfterExhale: 6 },
    };
    
    // Try to find matching pattern
    for (const [key, knownPattern] of Object.entries(patterns)) {
      if (pattern.inhale === knownPattern.inhale && 
          pattern.hold === knownPattern.hold && 
          pattern.exhale === knownPattern.exhale && 
          pattern.holdAfterExhale === knownPattern.holdAfterExhale) {
        controlsRef.value.basicControlsRef.selectedPattern = key;
        break;
      }
    }
  }
  if (preset.durationMinutes !== undefined && controlsRef.value.basicControlsRef) {
    controlsRef.value.basicControlsRef.durationMinutes = preset.durationMinutes;
  }
  if (preset.durationSeconds !== undefined && controlsRef.value.basicControlsRef) {
    controlsRef.value.basicControlsRef.durationSeconds = preset.durationSeconds;
  }
  if (preset.selectedTheme && controlsRef.value.styleRef) {
    controlsRef.value.styleRef.selectedTheme = preset.selectedTheme;
    document.documentElement.setAttribute('data-theme', preset.selectedTheme);
  }
  if (preset.darkMode !== undefined && controlsRef.value.styleRef) {
    controlsRef.value.styleRef.darkMode = preset.darkMode;
    if (preset.darkMode) {
      controlsRef.value.styleRef.setDarkMode();
    } else {
      controlsRef.value.styleRef.setLightMode();
    }
  }
  if (preset.showInhaleExhale !== undefined && controlsRef.value.styleRef) {
    controlsRef.value.styleRef.showInhaleExhale = preset.showInhaleExhale;
  }
  if (preset.showTime !== undefined && controlsRef.value.styleRef) {
    controlsRef.value.styleRef.showTime = preset.showTime;
  }
  if (preset.focalPointType && controlsRef.value.styleRef) {
    controlsRef.value.styleRef.focalPointType = preset.focalPointType;
  }
  if (preset.affirmations && controlsRef.value.affirmationsRef) {
    controlsRef.value.affirmationsRef.affirmations = preset.affirmations;
  }
}

function loadBilateralPreset(preset) {
  // This will be called after routing to bilateral view
  // Store in sessionStorage for bilateral view to pick up
  sessionStorage.setItem('pendingBilateralPreset', JSON.stringify(preset));
}

function showError(title, message) {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
}
</script>

<style scoped>
.breathing-view {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.breathing-view.panel-collapsed .main-canvas {
  margin-left: 0;
  width: 100%;
}

.main-canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-primary);
  padding: var(--space-2xl);
  padding-bottom: 140px;
  position: relative;
}

.breathing-view.drag-over .main-canvas::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 3px dashed var(--color-brand-primary-500);
  border-radius: var(--border-radius-lg);
  pointer-events: none;
}

.drop-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.drop-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  color: var(--color-brand-primary-500);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.drop-message p {
  margin: 0;
}

.instruction-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.btn-primary {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
  min-width: 150px;
}

.btn-primary:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.session-info {
  text-align: center;
  width: 100%;
}

.session-info p {
  margin-bottom: var(--space-sm);
  font-weight: var(--font-weight-medium);
}

progress {
  width: 100%;
  height: 8px;
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

progress::-webkit-progress-bar {
  background-color: var(--color-surface-tertiary);
  border-radius: var(--border-radius-full);
}

progress::-webkit-progress-value {
  background-color: var(--color-brand-primary-500);
  border-radius: var(--border-radius-full);
}
</style>
