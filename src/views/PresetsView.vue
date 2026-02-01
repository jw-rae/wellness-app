<template>
  <div class="library-view">
    <!-- Header -->
    <div class="library-header">
      <h1>Library</h1>
      <p class="subtitle">Manage your presets and sequences</p>
    </div>

    <!-- Subview Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="['tab', { active: activeTab === 'presets' }]"
          @click="activeTab = 'presets'"
        >
          Presets
        </button>
        <button 
          :class="['tab', { active: activeTab === 'sequences' }]"
          @click="activeTab = 'sequences'"
        >
          Sequences
        </button>
        <button 
          :class="['tab', { active: activeTab === 'builder' }]"
          @click="activeTab = 'builder'"
        >
          Sequence Builder
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Presets Tab -->
      <PresetsTab
        v-if="activeTab === 'presets'"
        :presets="allPresets"
        @play="handlePlayPreset"
        @export="handleExportPreset"
        @delete="handleDeletePreset"
      />

      <!-- Sequences Tab -->
      <SequencesTab
        v-else-if="activeTab === 'sequences'"
        :sequences="sequences"
        :all-presets="allPresets"
        @play="handlePlaySequence"
        @edit="handleEditSequence"
        @export="handleExportSequence"
        @delete="handleDeleteSequence"
      />

      <!-- Sequence Builder Tab -->
      <SequenceBuilderTab
        v-else-if="activeTab === 'builder'"
        :available-presets="allPresets"
        v-model:sequence-name="sequenceName"
        :sequence-items="sequenceItems"
        :is-editing="isEditingSequence"
        @add="addToSequence"
        @remove="removeFromSequence"
        @toggle-visibility="toggleItemVisibility"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
        @drag-over="handleDragOver"
        @drop="handleDrop"
        @create="createSequence"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal 
      v-model="showDeleteModal" 
      :title="presetToDelete ? 'Delete Preset' : 'Delete Sequence'" 
      :message="deleteMessage"
      :show-cancel="true"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDeleteAction"
    />

    <!-- Cannot Delete Modal -->
    <Modal 
      v-model="showCannotDeleteModal" 
      title="Cannot Delete Preset" 
      :message="cannotDeleteMessage"
      :list-items="affectedSequencesList"
      confirm-text="OK"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePresetStore } from '../stores/presetStore.js';
import { useSessionStore } from '../stores/sessionStore.js';
import { useSequences } from '../composables/useSequences.js';
import { exportPreset, exportSequence } from '../utils/exportUtils.js';
import Modal from '../components/ui/Modal.vue';
import PresetsTab from '../components/preset/PresetsTab.vue';
import SequencesTab from '../components/preset/SequencesTab.vue';
import SequenceBuilderTab from '../components/preset/SequenceBuilderTab.vue';

const router = useRouter();
const presetStore = usePresetStore();
const sessionStore = useSessionStore();
const { sequences, loadSequences, addSequence, deleteSequence: removeSequence } = useSequences();

const activeTab = ref('presets');
const showDeleteModal = ref(false);
const showCannotDeleteModal = ref(false);
const cannotDeleteMessage = ref('');
const affectedSequencesList = ref([]);
const presetToDelete = ref(null);
const sequenceToDelete = ref(null);

// Sequence builder state
const sequenceName = ref('');
const sequenceItems = ref([]);
let draggedIndex = null;
let tempIdCounter = 0;

const allPresets = computed(() => presetStore.presets);

const deleteMessage = computed(() => {
  if (presetToDelete.value) {
    return `Are you sure you want to delete '${presetToDelete.value.name}'? This action cannot be undone.`;
  }
  if (sequenceToDelete.value) {
    return `Are you sure you want to delete '${sequenceToDelete.value.name}'? This action cannot be undone.`;
  }
  return '';
});

const isEditingSequence = computed(() => {
  return !!sequenceItems.value.editingSequenceId;
});

onMounted(() => {
  presetStore.initializePresets();
  loadSequences();
});

// Preset handlers
function handlePlayPreset(preset) {
  // Store preset to be loaded by the view (same as import/drag-drop)
  if (preset.type === 'breathing') {
    sessionStorage.setItem('pendingBreathingPreset', JSON.stringify(preset));
    sessionStorage.setItem('collapsePanel', 'true'); // Collapse panel on play
    router.push('/breathing');
  } else if (preset.type === 'bilateral' || preset.type === 'emdr') {
    sessionStorage.setItem('pendingBilateralPreset', JSON.stringify(preset));
    sessionStorage.setItem('collapsePanel', 'true'); // Collapse panel on play
    router.push('/bilateral');
  }
}

function handleExportPreset(preset) {
  exportPreset(preset);
}

function handleDeletePreset(preset) {
  // Check if preset is used in any sequence
  const usedInSequences = sequences.value.filter(seq => 
    seq.items.some(item => item.presetId === preset.id)
  );
  
  if (usedInSequences.length > 0) {
    cannotDeleteMessage.value = `Cannot delete preset '${preset.name}' because it is used in ${usedInSequences.length} sequence${usedInSequences.length > 1 ? 's' : ''}:`;
    affectedSequencesList.value = usedInSequences.map(s => s.name);
    showCannotDeleteModal.value = true;
    return;
  }
  
  presetToDelete.value = preset;
  sequenceToDelete.value = null;
  showDeleteModal.value = true;
}

function deletePreset() {
  if (presetToDelete.value) {
    const presetId = presetToDelete.value.id;
    presetStore.deletePreset(presetId);
    
    // Check if any sequences use this preset
    const affectedSequences = sequences.value.filter(seq => 
      seq.items.some(item => item.presetId === presetId)
    );
    
    if (affectedSequences.length > 0) {
      console.warn(`Preset deleted. ${affectedSequences.length} sequence(s) contain this preset:`, 
        affectedSequences.map(s => s.name));
    }
    
    presetToDelete.value = null;
  }
}

// Sequence handlers
function handlePlaySequence(sequence) {
  // Get all presets that are part of this sequence
  const sequencePresets = sequence.items
    .map(item => {
      const preset = presetStore.presets.find(p => p.id === item.presetId);
      if (!preset) {
        console.warn(`Preset ${item.presetId} not found in sequence ${sequence.name}`);
        return null;
      }
      console.log('Loading preset from sequence:', preset);
      return { ...preset, visible: item.visible };
    })
    .filter(p => p !== null && p.visible);
  
  if (sequencePresets.length === 0) {
    alert('This sequence contains no valid presets. Some presets may have been deleted.');
    return;
  }
  
  console.log('Sequence presets to play:', sequencePresets);
  
  // Set flag to collapse panel
  sessionStorage.setItem('collapsePanel', 'true');
  
  // Start sequence playback
  sessionStore.startSequence(sequence, sequencePresets);
  
  // Navigate to appropriate view based on first preset type
  const firstPreset = sequencePresets[0];
  if (firstPreset.type === 'breathing') {
    router.push('/breathing');
  } else if (firstPreset.type === 'bilateral' || firstPreset.type === 'emdr') {
    router.push('/bilateral');
  }
}

function handleExportSequence(sequence) {
  exportSequence(sequence);
}

function handleDeleteSequence(sequence) {
  sequenceToDelete.value = sequence;
  presetToDelete.value = null;
  showDeleteModal.value = true;
}

function handleEditSequence(sequence) {
  // Load sequence into builder
  sequenceName.value = sequence.name;
  sequenceItems.value = sequence.items
    .map(item => {
      const preset = allPresets.value.find(p => p.id === item.presetId);
      if (preset) {
        return {
          preset,
          visible: item.visible,
          tempId: `item-${tempIdCounter++}`
        };
      }
      return null;
    })
    .filter(item => item !== null);
  
  // Store the sequence ID for updating instead of creating new
  sequenceItems.value.editingSequenceId = sequence.id;
  
  // Switch to builder tab
  activeTab.value = 'builder';
}

function deleteSequenceAction() {
  if (sequenceToDelete.value) {
    removeSequence(sequenceToDelete.value.id);
    sequenceToDelete.value = null;
  }
}

function confirmDeleteAction() {
  if (presetToDelete.value) {
    deletePreset();
  } else if (sequenceToDelete.value) {
    deleteSequenceAction();
  }
  showDeleteModal.value = false;
}

// Sequence builder functions
function addToSequence(preset) {
  sequenceItems.value.push({
    preset,
    visible: true,
    tempId: `item-${tempIdCounter++}`
  });
}

function removeFromSequence(index) {
  sequenceItems.value.splice(index, 1);
}

function toggleItemVisibility(index) {
  sequenceItems.value[index].visible = !sequenceItems.value[index].visible;
}

function handleDragStart(index) {
  draggedIndex = index;
}

function handleDragEnd() {
  draggedIndex = null;
}

function handleDragOver(index) {
  if (draggedIndex === null || draggedIndex === index) return;
  
  const items = [...sequenceItems.value];
  const draggedItem = items[draggedIndex];
  items.splice(draggedIndex, 1);
  items.splice(index, 0, draggedItem);
  
  sequenceItems.value = items;
  draggedIndex = index;
}

function handleDrop(event) {
  event.preventDefault();
}

function createSequence() {
  if (!sequenceName.value.trim()) {
    alert('Please enter a sequence name');
    return;
  }
  
  if (sequenceItems.value.length === 0) {
    alert('Please add at least one preset to the sequence');
    return;
  }
  
  const editingId = sequenceItems.value.editingSequenceId;
  
  // Check for duplicate names (excluding current sequence if editing)
  const duplicateName = sequences.value.find(s => 
    s.name.toLowerCase() === sequenceName.value.trim().toLowerCase() && 
    s.id !== editingId
  );
  
  if (duplicateName) {
    alert(`A sequence with the name "${sequenceName.value}" already exists. Please choose a different name.`);
    return;
  }
  
  if (editingId) {
    // Update existing sequence
    const existingSequence = sequences.value.find(s => s.id === editingId);
    if (existingSequence) {
      existingSequence.name = sequenceName.value;
      existingSequence.items = sequenceItems.value.map(item => ({
        presetId: item.preset.id,
        visible: item.visible
      }));
      saveSequences();
    }
  } else {
    // Create new sequence
    const newSequence = {
      id: `seq-${Date.now()}`,
      name: sequenceName.value,
      items: sequenceItems.value.map(item => ({
        presetId: item.preset.id,
        visible: item.visible
      })),
      created: new Date().toISOString()
    };
    
    addSequence(newSequence);
  }
  
  // Reset builder
  sequenceName.value = '';
  sequenceItems.value = [];
  activeTab.value = 'sequences';
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

.tabs-container {
  padding: 0 var(--space-xl);
  margin-bottom: var(--space-lg);
}

.tabs {
  display: inline-flex;
  background: var(--color-surface-secondary);
  border-radius: 100px;
  padding: 4px;
  gap: 4px;
}

.tab {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: 100px;
  cursor: pointer;
  transition: all var(--duration-200);
  white-space: nowrap;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab.active {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
}

.content-area {
  flex: 1;
  overflow-y: auto;
}
</style>
