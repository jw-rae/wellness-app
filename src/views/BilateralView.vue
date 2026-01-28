<template>
  <div class="bilateral-view" :class="{ 'panel-collapsed': isPanelCollapsed }">
    <BilateralControls 
      ref="controlsRef" 
      @collapse-changed="(collapsed) => { isPanelCollapsed = collapsed; emit('panel-collapsed', collapsed); }"
    />
    
    <BilateralCanvas 
      :bpm="bilateralSettings.bpm"
      :visualMode="bilateralSettings.visualMode"
      :bilateralAudio="bilateralSettings.bilateralAudio"
      :showTime="bilateralSettings.showTime"
      :affirmations="bilateralSettings.affirmations"
      :affirmationInterval="bilateralSettings.affirmationInterval"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BilateralControls from '../components/BilateralControls.vue';
import BilateralCanvas from '../components/BilateralCanvas.vue';

const controlsRef = ref(null);
const isPanelCollapsed = ref(false);

const emit = defineEmits(['panel-collapsed']);

const bilateralSettings = computed(() => {
  return {
    bpm: controlsRef.value?.bpm ?? 50,
    visualMode: controlsRef.value?.visualMode ?? 'slide',
    bilateralAudio: controlsRef.value?.bilateralAudio ?? true,
    showTime: controlsRef.value?.showTime ?? true,
    affirmations: controlsRef.value?.affirmations ?? '',
    affirmationInterval: controlsRef.value?.affirmationInterval ?? 15,
  };
});
</script>

<style scoped>
.bilateral-view {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
