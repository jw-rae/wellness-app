<template>
  <div class="bottom-control-bar" :class="{ 'session-active': sessionStore.isActive && !sessionStore.isPaused }">
    <RouterLink to="/breathing" class="nav-btn">
      Breathing
    </RouterLink>
    
    <RouterLink to="/bilateral" class="nav-btn">
      Bilateral
    </RouterLink>
    
    <RouterLink to="/presets" class="nav-btn">
      Presets
    </RouterLink>
    
    <RouterLink to="/about" class="nav-btn">
      About
    </RouterLink>
  </div>
</template>

<script setup>
import { useSessionStore } from '../stores/sessionStore.js';

const sessionStore = useSessionStore();
</script>

<style scoped>
.bottom-control-bar {
  position: fixed;
  bottom: var(--space-xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-full);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-index-40);
  transition: transform var(--duration-300) var(--ease-out), opacity var(--duration-300) var(--ease-out);
  opacity: 1;
  max-width: calc(100vw - var(--space-xl) * 2);
}

@media (max-width: 768px) {
  .bottom-control-bar {
    bottom: var(--space-md);
    padding: var(--space-xs) var(--space-md);
    gap: var(--space-xs);
  }
  
  /* On narrow screens, always center regardless of panel state */
  .bottom-control-bar,
  .bottom-control-bar.adjust-position {
    transform: translateX(-50%) !important;
  }
}

@media (max-width: 480px) {
  .bottom-control-bar {
    flex-wrap: wrap;
    justify-content: center;
  }
}

.bottom-control-bar.session-active {
  opacity: 0.3;
}

.bottom-control-bar.session-active:hover {
  opacity: 1;
}

.bottom-control-bar.adjust-position {
  transform: translateX(calc(-50% + 140px));
}

.nav-btn {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-full);
  transition: all var(--duration-200);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav-btn {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
  }
}

.nav-btn:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-tertiary);
}

.nav-btn.router-link-active {
  color: var(--color-brand-primary-500);
  background: color-mix(in srgb, var(--color-brand-primary-500) 15%, transparent);
}
</style>
