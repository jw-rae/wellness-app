<template>
  <div class="collapsible-section">
    <button class="section-header" @click="toggleExpanded">
      <component :is="icon" :size="18" />
      <span>{{ title }}</span>
      <ChevronDown 
        :size="18" 
        :class="['chevron', { rotated: !isExpanded }]"
      />
    </button>
    
    <div v-if="isExpanded" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  initiallyExpanded: {
    type: Boolean,
    default: false
  }
});

const isExpanded = ref(props.initiallyExpanded);

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style scoped>
.collapsible-section {
  border: 1px solid var(--color-border-primary);
  border-bottom: none;
  overflow: hidden;
}

.collapsible-section:last-child {
  border-bottom: 1px solid var(--color-border-primary);
}

.section-header {
  width: 100%;
  padding: var(--space-md);
  background: var(--color-surface-secondary);
  border: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  transition: all var(--duration-200);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.section-header:hover {
  background: var(--color-surface-tertiary);
}

.section-header span {
  flex: 1;
  text-align: left;
}

.chevron {
  transition: transform var(--duration-200);
}

.chevron.rotated {
  transform: rotate(-90deg);
}

.section-content {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
</style>
