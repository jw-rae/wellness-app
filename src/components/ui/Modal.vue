<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="close" aria-label="Close">
              <X :size="20" />
            </button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
            <ul v-if="listItems && listItems.length > 0" class="modal-list">
              <li v-for="(item, index) in listItems" :key="index">{{ item }}</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button v-if="showCancel" class="btn-secondary" @click="close">{{ cancelText }}</button>
            <button class="btn-primary" @click="confirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Notification'
  },
  message: {
    type: String,
    default: ''
  },
  listItems: {
    type: Array,
    default: null
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'OK'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'confirm']);

const isOpen = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue;
});

function close() {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('close');
}

function confirm() {
  emit('confirm');
  close();
}

function handleOverlayClick() {
  close();
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-50);
}

.modal-content {
  background: var(--color-surface-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 360px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-default);
}

.close-btn:hover {
  background: var(--color-surface-secondary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-md) var(--space-lg);
}

.modal-body p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
  font-size: var(--font-size-sm);
}

.modal-list {
  margin-top: var(--space-sm);
  padding-left: var(--space-md);
  color: var(--color-text-primary);
  list-style: none;
}

.modal-list li {
  margin: var(--space-xs) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  padding-left: var(--space-sm);
  position: relative;
}

.modal-list li::before {
  content: "•";
  position: absolute;
  left: -8px;
  color: var(--color-text-tertiary);
}

.modal-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

.btn-primary {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-default);
  min-width: 70px;
}

.btn-primary:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: var(--color-surface-secondary);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-default);
  min-width: 70px;
}

.btn-secondary:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: var(--color-surface-secondary);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-300) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform var(--duration-300) var(--ease-out);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-20px);
}
</style>
