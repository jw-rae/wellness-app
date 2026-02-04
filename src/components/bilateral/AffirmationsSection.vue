<template>
  <CollapsibleSection 
    title="Affirmations" 
    :icon="MessageCircle" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <label>
        <span class="label-text">Affirmations (one per line)</span>
        <textarea 
          v-model="affirmations"
          placeholder="Enter affirmations (one per line)"
          ref="affirmationsTextarea"
          @input="autoResize"
          class="roomy-textarea"
        ></textarea>
      </label>
      <div class="textarea-breathing-space"></div>
    </div>
    <div class="control-section">
      <label>
        <span class="label-text">Affirmation Interval: {{ affirmationInterval }}s</span>
        <input
          type="range"
          v-model.number="affirmationInterval"
          min="5"
          max="60"
          step="5"
          class="slider-input"
        />
      </label>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { MessageCircle } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';
const affirmations = ref('I am safe\nI am healing\nI release the past\nI trust the process');
const affirmationInterval = ref(15);
const affirmationsTextarea = ref(null);

function autoResize() {
  nextTick(() => {
    const ta = affirmationsTextarea.value;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 32 + 'px'; // 32px for 2 lines breathing room
    }
  });
}

onMounted(() => {
  autoResize();
});

defineExpose({
  affirmations,
  affirmationInterval,
});
</script>

<style scoped>
.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

label {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.label-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}


.roomy-textarea {
  width: 100%;
  padding: var(--space-sm);
  background: var(--color-surface-tertiary);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-sm);
  resize: none;
  min-height: 120px;
  transition: all var(--duration-200);
  box-sizing: border-box;
  margin-bottom: 0;
}

.textarea-breathing-space {
  min-height: 2.5em;
}

textarea:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  background: var(--color-surface-elevated);
}

textarea::placeholder {
  color: var(--color-text-tertiary);
}

.slider-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-surface-tertiary);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-brand-primary-500);
  cursor: pointer;
  transition: all var(--duration-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: var(--color-brand-primary-500);
  cursor: pointer;
  transition: all var(--duration-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
</style>
