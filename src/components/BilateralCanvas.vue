<template>
  <div class="bilateral-canvas" @click="handleClick">
    <div class="timer-display" :class="{ invisible: !showTime }">{{ formattedTime }}</div>
    
    <div class="visual-area">
      <!-- Slide Mode -->
      <div v-if="visualMode === 'slide'" class="slide-container">
        <div 
          class="dot" 
          :style="{ left: dotPosition + '%' }"
        ></div>
      </div>

      <!-- Flash Mode -->
      <div v-if="visualMode === 'flash'" class="flash-container">
        <div 
          class="dot flash-left" 
          :class="{ active: showLeftDot }"
        ></div>
        <div 
          class="dot flash-right" 
          :class="{ active: showRightDot }"
        ></div>
      </div>

      <!-- Affirmations -->
      <div v-if="currentAffirmation" class="affirmation-display">
        {{ currentAffirmation }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useSessionStore } from '../stores/sessionStore.js';

const sessionStore = useSessionStore();

const props = defineProps({
  bpm: {
    type: Number,
    default: 50
  },
  visualMode: {
    type: String,
    default: 'slide'
  },
  bilateralAudio: {
    type: Boolean,
    default: true
  },
  showTime: {
    type: Boolean,
    default: true
  },
  affirmations: {
    type: String,
    default: ''
  },
  affirmationInterval: {
    type: Number,
    default: 15
  }
});

const dotPosition = ref(50);
const showLeftDot = ref(true);
const showRightDot = ref(false);
const currentAffirmation = ref('');

let animationId = null;
let audioContext = null;
let affirmationTimer = null;

const formattedTime = computed(() => {
  if (!sessionStore.isActive) {
    const mins = Math.floor(sessionStore.totalDuration / 60);
    const secs = sessionStore.totalDuration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  const remaining = sessionStore.remainingTime;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

// Affirmation cycling logic
let affirmationList = [];
let currentAffirmationIndex = 0;

watch(() => props.affirmations, (text) => {
  if (text && text.trim()) {
    affirmationList = text.split('\n').filter(a => a.trim());
  } else {
    affirmationList = [];
    currentAffirmation.value = '';
  }
}, { immediate: true });

function startAffirmations() {
  if (affirmationList.length > 0) {
    currentAffirmationIndex = 0;
    currentAffirmation.value = affirmationList[currentAffirmationIndex];
    
    affirmationTimer = setInterval(() => {
      currentAffirmationIndex = (currentAffirmationIndex + 1) % affirmationList.length;
      currentAffirmation.value = affirmationList[currentAffirmationIndex];
    }, props.affirmationInterval * 1000);
  }
}

function stopAffirmations() {
  if (affirmationTimer) {
    clearInterval(affirmationTimer);
    affirmationTimer = null;
  }
  currentAffirmation.value = '';
}

// Bilateral audio
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playBeep(pan) {
  if (!props.bilateralAudio || !audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panNode = audioContext.createStereoPanner();
  
  oscillator.connect(panNode);
  panNode.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 440;
  panNode.pan.value = pan; // -1 = left, 1 = right
  gainNode.gain.value = 0.1;
  
  oscillator.start(audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Animation logic
function startAnimation() {
  if (props.visualMode === 'slide') {
    startSlideAnimation();
  } else {
    startFlashAnimation();
  }
}

function startSlideAnimation() {
  const cycleTime = (60 / props.bpm) * 1000; // Time for one full cycle in ms
  const startTime = Date.now();
  let direction = 1;
  let lastBeepSide = 0;
  
  function animate() {
    if (!sessionStore.isActive || sessionStore.isPaused) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    
    const elapsed = Date.now() - startTime;
    const progress = (elapsed % cycleTime) / cycleTime;
    
    // Smooth oscillation
    const position = 50 + (Math.sin(progress * Math.PI * 2) * 40);
    dotPosition.value = position;
    
    // Play audio at edges
    if (position > 85 && lastBeepSide !== 1) {
      playBeep(1);
      lastBeepSide = 1;
    } else if (position < 15 && lastBeepSide !== -1) {
      playBeep(-1);
      lastBeepSide = -1;
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
}

function startFlashAnimation() {
  const flashInterval = (60 / props.bpm) * 1000 / 2; // Half beat per flash
  let isLeft = true;
  
  showLeftDot.value = true;
  showRightDot.value = false;
  playBeep(-1);
  
  animationId = setInterval(() => {
    if (!sessionStore.isActive || sessionStore.isPaused) {
      return;
    }
    
    isLeft = !isLeft;
    showLeftDot.value = isLeft;
    showRightDot.value = !isLeft;
    
    playBeep(isLeft ? -1 : 1);
  }, flashInterval);
}

function stopAnimation() {
  if (animationId) {
    if (props.visualMode === 'slide') {
      cancelAnimationFrame(animationId);
    } else {
      clearInterval(animationId);
    }
    animationId = null;
  }
  
  // Reset positions
  dotPosition.value = 50;
  showLeftDot.value = false;
  showRightDot.value = false;
}

function handleClick() {
  if (!sessionStore.isActive) {
    // Session will be started from controls
    return;
  } else {
    togglePause();
  }
}

function togglePause() {
  if (sessionStore.isPaused) {
    sessionStore.resumeSession();
  } else {
    sessionStore.pauseSession();
  }
}

function handleKeydown(event) {
  if (event.code === 'Space') {
    // Don't handle spacebar if user is typing in an input or textarea
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    
    event.preventDefault();
    if (sessionStore.isActive) {
      togglePause();
    }
  }
}

// Watch for session state changes
watch(() => sessionStore.isActive, (active, wasActive) => {
  if (active && !wasActive) {
    initAudio();
    startAnimation();
    startAffirmations();
  } else if (!active && wasActive) {
    stopAnimation();
    stopAffirmations();
  }
});

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  stopAnimation();
  stopAffirmations();
  if (audioContext) {
    audioContext.close();
  }
});
</script>

<style scoped>
.bilateral-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-primary);
  padding: var(--space-2xl);
  cursor: pointer;
  position: relative;
  min-height: 100vh;
}

.timer-display {
  position: absolute;
  top: var(--space-2xl);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  min-height: 3rem;
}

.timer-display.invisible {
  opacity: 0;
  pointer-events: none;
}

.visual-area {
  width: 100%;
  max-width: 1200px;
  height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.flash-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2xl);
}

.dot {
  width: 40px;
  height: 40px;
  background: var(--color-brand-primary-500);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--color-brand-primary-500);
}

.slide-container .dot {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left var(--duration-100) linear;
}

.flash-container .dot {
  opacity: 0;
  transition: opacity var(--duration-100);
}

.flash-container .dot.active {
  opacity: 1;
}

.affirmation-display {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  text-align: center;
  font-style: italic;
  max-width: 600px;
  animation: fadeIn var(--duration-500) ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
