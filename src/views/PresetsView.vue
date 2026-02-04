<template>
  <div class="library-view">
    <!-- Header -->
    <div class="library-header">
      <h1>Library</h1>
      <p class="subtitle">Manage your presets</p>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Presets Tab -->
      <PresetsTab
        :presets="allPresets"
        @play="handlePlayPreset"
        @export="handleExportPreset"
        @delete="handleDeletePreset"
        @update="handleUpdatePreset"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal 
      v-model="showDeleteModal" 
      title="Delete Preset" 
      :message="deleteMessage"
      :show-cancel="true"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePresetStore } from '../stores/presetStore.js';
import { exportPreset } from '../utils/exportUtils.js';
import Modal from '../components/ui/Modal.vue';
import PresetsTab from '../components/preset/PresetsTab.vue';

const router = useRouter();
const presetStore = usePresetStore();

const showDeleteModal = ref(false);
const presetToDelete = ref(null);

const allPresets = computed(() => presetStore.presets);

const deleteMessage = computed(() => {
  if (presetToDelete.value) {
    return `Are you sure you want to delete '${presetToDelete.value.name}'? This action cannot be undone.`;
  }
  return '';
});

onMounted(() => {
  presetStore.initializePresets();
});

// Preset handlers
function handlePlayPreset(preset) {
  // Store preset to be loaded by the view (same as import/drag-drop)
  if (preset.type === 'breathing') {
    sessionStorage.setItem('pendingBreathingPreset', JSON.stringify(preset));
    sessionStorage.removeItem('pendingBilateralPreset');
    sessionStorage.setItem('collapsePanel', 'true'); // Collapse panel on play
    router.push('/breathing');
  } else if (preset.type === 'bilateral' || preset.type === 'emdr') {
    sessionStorage.setItem('pendingBilateralPreset', JSON.stringify(preset));
    sessionStorage.removeItem('pendingBreathingPreset');
    sessionStorage.setItem('collapsePanel', 'true'); // Collapse panel on play
    router.push('/bilateral');
  }
}

function handleExportPreset(preset) {
  exportPreset(preset);
}

function handleDeletePreset(preset) {
  presetToDelete.value = preset;
  showDeleteModal.value = true;
}

function deletePreset() {
  if (presetToDelete.value) {
    presetStore.deletePreset(presetToDelete.value.id);
    presetToDelete.value = null;
  }
}

function confirmDeleteAction() {
  if (presetToDelete.value) {
    deletePreset();
  }
  showDeleteModal.value = false;
}

function handleUpdatePreset(updatedPreset) {
  presetStore.updatePreset(updatedPreset.id, updatedPreset);
}
</script>

<style scoped>
.library-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: var(--color-surface-primary);
  overflow: hidden;
}

.library-header {
  padding: var(--space-lg) var(--space-xl) var(--space-sm);
  text-align: left;
}

.library-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-xs) 0;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
</style>
