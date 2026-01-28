<template>
  <div class="game-select">
    <label v-if="label">{{ label }}</label>
    <div class="select-container">
      <button class="arrow-btn" @click="previous" aria-label="Previous option">
        <ArrowLeft :size="16" />
      </button>
      <div class="value-display">
        {{ currentOption.label }}
      </div>
      <button class="arrow-btn" @click="next" aria-label="Next option">
        <ArrowRight :size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ArrowLeft, ArrowRight } from 'lucide-vue-next';

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true,
    // Array of { value, label } objects
  }
});

const emit = defineEmits(['update:modelValue']);

const currentIndex = ref(0);

// Initialize current index based on modelValue
watch(() => props.modelValue, (newVal) => {
  const index = props.options.findIndex(opt => opt.value === newVal);
  if (index !== -1) {
    currentIndex.value = index;
  }
}, { immediate: true });

const currentOption = computed(() => {
  return props.options[currentIndex.value] || props.options[0];
});

function next() {
  currentIndex.value = (currentIndex.value + 1) % props.options.length;
  emit('update:modelValue', props.options[currentIndex.value].value);
}

function previous() {
  currentIndex.value = (currentIndex.value - 1 + props.options.length) % props.options.length;
  emit('update:modelValue', props.options[currentIndex.value].value);
}
</script>

<style scoped>
.game-select {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.game-select label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.select-container {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.arrow-btn {
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-150);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.arrow-btn:hover {
  color: var(--color-brand-primary-500);
  transform: scale(1.1);
}

.arrow-btn:active {
  transform: scale(0.95);
}

.value-display {
  flex: 1;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
}
</style>
