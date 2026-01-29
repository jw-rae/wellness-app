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
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-2xl);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border-primary);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--border-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-200);
}

.close-btn:hover {
  background: var(--color-surface-tertiary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--space-xl);
}

.modal-body p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.modal-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}

.btn-primary {
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-base);
  padding: var(--space-sm) var(--space-xl);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
  min-width: 80px;
}

.btn-primary:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-surface-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-base);
  padding: var(--space-sm) var(--space-xl);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-200);
  min-width: 80px;
}

.btn-secondary:hover {
  background: var(--color-surface-elevated);
  border-color: var(--color-brand-primary-500);
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
