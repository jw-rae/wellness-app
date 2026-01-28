<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import BottomControlBar from './components/BottomControlBar.vue'

const isPanelCollapsed = ref(false)

function handlePanelCollapse(collapsed) {
  isPanelCollapsed.value = collapsed
}
</script>

<template>
  <div id="app" :class="{ 'panel-collapsed': isPanelCollapsed }">
    <main class="main-content">
      <RouterView @panel-collapsed="handlePanelCollapse" />
    </main>
    
    <BottomControlBar :class="{ 'adjust-position': !isPanelCollapsed }" />
  </div>
</template>

<style>
/* Global app styles */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-primary);
  color: var(--color-text-primary);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
