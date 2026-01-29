<template>
  <div class="presets-grid">
    <PresetCard
      v-for="preset in presets"
      :key="preset.id"
      :preset="preset"
      @play="$emit('play', $event)"
      @export="$emit('export', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup>
import PresetCard from './PresetCard.vue';

defineProps({
  presets: {
    type: Array,
    required: true
  }
});

defineEmits(['play', 'export', 'delete']);
</script>

<style scoped>
.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
  padding: 0 var(--space-xl) var(--space-xl);
}
</style>
