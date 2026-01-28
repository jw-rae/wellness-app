<template>
  <div 
    class="bilateral-view" 
    :class="{ 'panel-collapsed': isPanelCollapsed, 'drag-over': isDragOver }"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <BilateralControls 
      ref="controlsRef" 
      @collapse-changed="(collapsed) => { isPanelCollapsed = collapsed; emit('panel-collapsed', collapsed); }"
    />
    
    <div class="canvas-wrapper">
      <BilateralCanvas 
        :bpm="bilateralSettings.bpm"
        :visualMode="bilateralSettings.visualMode"
        :bilateralAudio="bilateralSettings.bilateralAudio"
        :showTime="bilateralSettings.showTime"
        :affirmations="bilateralSettings.affirmations"
        :affirmationInterval="bilateralSettings.affirmationInterval"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Upload } from 'lucide-vue-next';
import BilateralControls from '../components/bilateral/BilateralControls.vue';
import BilateralCanvas from '../components/bilateral/BilateralCanvas.vue';
import Modal from '../components/ui/Modal.vue';

const router = useRouter();
const controlsRef = ref(null);
const isPanelCollapsed = ref(false);
const isDragOver = ref(false);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const emit = defineEmits(['panel-collapsed']);

const bilateralSettings = computed(() => {
  return {
    bpm: controlsRef.value?.bpm ?? 50,
    visualMode: controlsRef.value?.visualMode ?? 'slide',
    bilateralAudio: controlsRef.value?.bilateralAudio ?? true,
    showTime: controlsRef.value?.showTime ?? true,
    affirmations: controlsRef.value?.affirmations ?? '',
    affirmationInterval: controlsRef.value?.affirmationInterval ?? 15,
  };
});

onMounted(() => {
  // Check for pending preset from breathing view drag-drop
  const pendingPreset = sessionStorage.getItem('pendingBilateralPreset');
  if (pendingPreset) {
    sessionStorage.removeItem('pendingBilateralPreset');
    try {
      const preset = JSON.parse(pendingPreset);
      loadBilateralPreset(preset);
    } catch (error) {
      console.error('Failed to load pending preset:', error);
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
      
      if (preset.type === 'breathing') {
        // Switch to breathing view
        router.push('/breathing');
        // Wait for route change then load preset
        setTimeout(() => {
          loadBreathingPreset(preset);
        }, 100);
        return;
      }
      
      if (preset.type === 'bilateral') {
        try {
          loadBilateralPreset(preset);
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

function loadBilateralPreset(preset) {
  if (!controlsRef.value) return;
  
  if (preset.bpm !== undefined) {
    controlsRef.value.bpm = preset.bpm;
  }
  if (preset.durationMinutes !== undefined) {
    controlsRef.value.durationMinutes = preset.durationMinutes;
  }
  if (preset.visualMode) {
    controlsRef.value.visualMode = preset.visualMode;
  }
  if (preset.bilateralAudio !== undefined) {
    controlsRef.value.bilateralAudio = preset.bilateralAudio;
  }
  if (preset.selectedTheme) {
    controlsRef.value.selectedTheme = preset.selectedTheme;
    document.documentElement.setAttribute('data-theme', preset.selectedTheme);
  }
  if (preset.darkMode !== undefined) {
    controlsRef.value.darkMode = preset.darkMode;
    if (preset.darkMode) {
      controlsRef.value.setDarkMode();
    } else {
      controlsRef.value.setLightMode();
    }
  }
  if (preset.showTime !== undefined) {
    controlsRef.value.showTime = preset.showTime;
  }
  if (preset.affirmations) {
    controlsRef.value.affirmations = preset.affirmations;
  }
  if (preset.affirmationInterval !== undefined) {
    controlsRef.value.affirmationInterval = preset.affirmationInterval;
  }
}

function loadBreathingPreset(preset) {
  // This will be called after routing to breathing view
  // Store in sessionStorage for breathing view to pick up
  sessionStorage.setItem('pendingBreathingPreset', JSON.stringify(preset));
}

function showError(title, message) {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
}
</script>

<style scoped>
.bilateral-view {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.canvas-wrapper {
  flex: 1;
  position: relative;
}

.bilateral-view.drag-over .canvas-wrapper::after {
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
</style>
