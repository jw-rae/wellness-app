<template>
  <div class="sequences-content">
    <div v-if="sequences.length === 0" class="empty-state">
      <p>No sequences yet</p>
      <p class="empty-hint">Create your first sequence in the Sequence Builder</p>
    </div>

    <div v-else class="presets-grid">
      <SequenceCard
        v-for="sequence in sequences"
        :key="sequence.id"
        :sequence="sequence"
        @play="$emit('play', $event)"
        @export="$emit('export', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import SequenceCard from './SequenceCard.vue';

defineProps({
  sequences: {
    type: Array,
    required: true
  }
});

defineEmits(['play', 'export', 'delete']);
</script>

<style scoped>
.sequences-content {
  padding: 0 var(--space-xl) var(--space-xl);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl) var(--space-xl);
  color: var(--color-text-secondary);
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-base);
}

.empty-hint {
  margin-top: var(--space-sm) !important;
  font-size: var(--font-size-sm) !important;
  opacity: 0.7;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
}
</style>
