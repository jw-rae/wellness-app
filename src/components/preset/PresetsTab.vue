<template>
  <div class="presets-tab">
    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="right-controls">
        <div class="filters">
          <select v-model="filterType" class="filter-select">
            <option value="all">All Types</option>
            <option value="breathing">Breathing</option>
            <option value="bilateral">EMDR</option>
          </select>
          
          <select v-model="sortBy" class="filter-select">
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>

        <div class="view-toggle">
          <button 
            :class="['view-btn', { active: viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
            title="Grid view"
          >
            <Grid :size="18" />
          </button>
          <button 
            :class="['view-btn', { active: viewMode === 'table' }]"
            @click="viewMode = 'table'"
            title="Table view"
          >
            <List :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="presets-grid">
      <PresetCard
        v-for="preset in filteredAndSortedPresets"
        :key="preset.id"
        :preset="preset"
        @play="$emit('play', $event)"
        @export="$emit('export', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>

    <!-- Table View -->
    <div v-else class="presets-table-container">
      <table class="presets-table">
        <thead>
          <tr>
            <th @click="sortBy = 'name'" class="sortable">
              Name
              <span v-if="sortBy === 'name'">↓</span>
            </th>
            <th @click="sortBy = 'type'" class="sortable">
              Type
              <span v-if="sortBy === 'type'">↓</span>
            </th>
            <th @click="sortBy = 'date'" class="sortable">
              Date Created
              <span v-if="sortBy === 'date'">↓</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <PresetTableRow
            v-for="preset in filteredAndSortedPresets"
            :key="preset.id"
            :preset="preset"
            @play="$emit('play', $event)"
            @export="$emit('export', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Grid, List } from 'lucide-vue-next';
import PresetCard from './PresetCard.vue';
import PresetTableRow from './PresetTableRow.vue';

const props = defineProps({
  presets: {
    type: Array,
    required: true
  }
});

defineEmits(['play', 'export', 'delete']);

const viewMode = ref('grid');
const filterType = ref('all');
const sortBy = ref('name');

const filteredAndSortedPresets = computed(() => {
  let filtered = props.presets;
  
  // Filter by type
  if (filterType.value !== 'all') {
    if (filterType.value === 'bilateral') {
      // Include both bilateral and emdr types
      filtered = filtered.filter(p => p.type === 'bilateral' || p.type === 'emdr');
    } else {
      filtered = filtered.filter(p => p.type === filterType.value);
    }
  }
  
  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy.value === 'date') {
      const dateA = new Date(a.created || 0);
      const dateB = new Date(b.created || 0);
      return dateB - dateA; // Newest first
    } else if (sortBy.value === 'type') {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });
  
  return sorted;
});
</script>

<style scoped>
.presets-tab {
  padding: 0 var(--space-xl) var(--space-xl);
}

.controls-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: var(--space-md) 0;
  margin-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.right-controls {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.filters {
  display: flex;
  gap: var(--space-sm);
}

.filter-select {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-default);
}

.filter-select:hover {
  border-color: var(--color-border-hover);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.view-toggle {
  display: flex;
  gap: var(--space-2xs);
  background: var(--color-surface-secondary);
  border-radius: var(--radius-md);
  padding: 2px;
}

.view-btn {
  background: transparent;
  border: none;
  padding: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-default);
}

.view-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-tertiary);
}

.view-btn.active {
  background: var(--color-accent);
  color: white;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-sm);
}

.presets-table-container {
  overflow-x: auto;
}

.presets-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.presets-table thead {
  background: var(--color-surface-tertiary);
}

.presets-table th {
  text-align: left;
  padding: var(--space-sm) var(--space-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  border-bottom: 2px solid var(--color-border);
}

.presets-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color var(--transition-default);
}

.presets-table th.sortable:hover {
  background: var(--color-surface-hover);
}

.presets-table th span {
  margin-left: var(--space-xs);
  opacity: 0.6;
}
</style>
