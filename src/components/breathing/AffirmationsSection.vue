<template>
  <CollapsibleSection 
    title="Affirmations" 
    :icon="MessageCircle" 
    :initially-expanded="false"
  >
    <div class="control-section">
      <label for="affirmations">Affirmations (one per line)</label>
      <textarea 
        id="affirmations" 
        v-model="affirmations"
        placeholder="I am calm&#10;I am centered&#10;I am at peace&#10;I breathe with ease"
        ref="affirmationsTextarea"
        @input="autoResize"
        class="roomy-textarea"
      ></textarea>
      <div class="textarea-breathing-space"></div>
      <p class="help-text">Affirmations change on every inhale. Leave empty to disable.</p>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { MessageCircle } from 'lucide-vue-next';
import CollapsibleSection from '../ui/CollapsibleSection.vue';
const affirmations = ref('I am calm\nI am centered\nI am at peace\nI breathe with ease');
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
});
</script>

<style scoped>
.control-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.control-section label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-display {
  font-weight: var(--font-weight-medium);
  color: var(--color-brand-primary-500);
}

.help-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-style: italic;
  margin-top: var(--space-xs);
}

.checkbox-label {
  font-weight: var(--font-weight-normal) !important;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-brand-primary-500);
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  width: 38px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-surface-tertiary);
  transition: .3s;
  border-radius: 20px;
  border: 1px solid var(--color-border-primary);
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-text-secondary);
  transition: .3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--color-brand-primary-500);
  border-color: var(--color-brand-primary-500);
}

input:checked + .slider:before {
  background-color: var(--color-text-inverse);
  transform: translateX(18px);
}


.roomy-textarea {
  width: 100%;
  padding: var(--space-sm);
  background: var(--color-surface-elevated);
  border: 2px solid var(--color-border-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: inherit;
  resize: none;
  min-height: 120px;
  box-sizing: border-box;
  margin-bottom: 0;
}

.textarea-breathing-space {
  min-height: 2.5em;
}

textarea:focus {
  outline: none;
  border-color: var(--color-brand-primary-500);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand-primary-500) 20%, transparent);
}

input[type="range"] {
  width: 100%;
  height: 6px;
  background: var(--color-surface-tertiary);
  border-radius: var(--border-radius-full);
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-brand-primary-500);
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--color-brand-primary-500);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
