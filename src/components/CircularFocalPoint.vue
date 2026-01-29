<template>
  <div class="focal-point-container" @click="handleClick">
    <div class="timer-display" :class="{ invisible: !showTime }">{{ formattedTime }}</div>
    
    <div class="circular-focal-point">
      <svg viewBox="0 0 200 200" class="circle-svg">
        <circle
          cx="100"
          cy="100"
          :r="circleRadius"
          :class="['breathing-circle', animationPhase]"
          fill="var(--color-brand-primary-500)"
          :opacity="circleOpacity"
        />
      </svg>
      
      <div v-if="showInhaleExhale" class="center-text">
        {{ centerText }}
      </div>
    </div>
    
    <div v-if="currentAffirmation" class="affirmation-display">
      {{ currentAffirmation }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useSessionStore } from '../stores/sessionStore.js';
import { usePresetStore } from '../stores/presetStore.js';

const sessionStore = useSessionStore();
const presetStore = usePresetStore();

const circleRadius = ref(60);
const circleOpacity = ref(0.3);
const animationPhase = ref('ready');
const currentAffirmation = ref('');
let currentCyclePhase = 0; // Track current position in breathing cycle
let animationTimeout = null; // Track animation timeout for cancellation

const props = defineProps({
  showInhaleExhale: {
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
  durationMinutes: {
    type: Number,
    default: 5
  },
  durationSeconds: {
    type: Number,
    default: 0
  }
});

// Affirmation cycling logic
let affirmationList = [];
let currentAffirmationIndex = 0;
let hasStartedSession = false;

watch(() => props.affirmations, (text) => {
  if (text && text.trim()) {
    affirmationList = text.split('\n').filter(a => a.trim());
    currentAffirmationIndex = 0;
    // Don't show affirmation until first inhale
    if (hasStartedSession) {
      currentAffirmation.value = affirmationList[currentAffirmationIndex];
    }
  } else {
    currentAffirmation.value = '';
    affirmationList = [];
  }
}, { immediate: true });

function nextAffirmation() {
  if (affirmationList.length > 0) {
    hasStartedSession = true;
    currentAffirmationIndex = (currentAffirmationIndex + 1) % affirmationList.length;
    currentAffirmation.value = affirmationList[currentAffirmationIndex];
  }
}

const centerText = computed(() => {
  if (!sessionStore.isActive) return 'Ready';
  if (sessionStore.isPaused) return 'Paused';
  return animationPhase.value.charAt(0).toUpperCase() + animationPhase.value.slice(1);
});

const formattedTime = computed(() => {
  if (!sessionStore.isActive) {
    // Show duration from controls when not active
    const totalSeconds = (props.durationMinutes * 60) + props.durationSeconds;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  const remaining = sessionStore.remainingTime;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

function startSession() {
  const defaultPreset = presetStore.breathingPresets[0];
  sessionStore.startSession('breathing', defaultPreset);
}

function handleClick() {
  if (!sessionStore.isActive) {
    startSession();
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
    if (!sessionStore.isActive) {
      startSession();
    } else {
      togglePause();
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function startBreathingAnimation() {
  // Clear any existing animation
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }
  
  // Simple breathing animation cycle
  const pattern = sessionStore.currentPreset?.breathingPattern || {
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4
  };
  
  currentCyclePhase = 0; // Always start from inhale
  const allPhases = [
    { name: 'inhale', duration: pattern.inhale, radius: 80, opacity: 0.6 },
    { name: 'hold', duration: pattern.hold, radius: 80, opacity: 0.6 },
    { name: 'exhale', duration: pattern.exhale, radius: 40, opacity: 0.3 },
    { name: 'hold', duration: pattern.holdAfterExhale, radius: 40, opacity: 0.3 },
  ];
  
  // Filter out phases with 0 duration
  const phases = allPhases.filter(phase => phase.duration > 0);
  
  function animateCycle() {
    if (!sessionStore.isActive) {
      return;
    }
    
    if (sessionStore.isPaused) {
      animationTimeout = setTimeout(animateCycle, 100);
      return;
    }
    
    const phase = phases[currentCyclePhase];
    animationPhase.value = phase.name;
    circleRadius.value = phase.radius;
    circleOpacity.value = phase.opacity;
    
    // Change affirmation on every inhale
    if (phase.name === 'inhale') {
      nextAffirmation();
    }
    
    animationTimeout = setTimeout(() => {
      currentCyclePhase = (currentCyclePhase + 1) % phases.length;
      if (sessionStore.isActive) {
        animateCycle();
      }
    }, phase.duration * 1000);
  }
  
  animateCycle();
}

watch(() => sessionStore.isActive, (active, wasActive) => {
  if (!active) {
    animationPhase.value = 'ready';
    circleRadius.value = 60;
    circleOpacity.value = 0.3;
    hasStartedSession = false;
    currentAffirmation.value = '';
  } else if (active && !wasActive) {
    // Session just became active, start animation
    startBreathingAnimation();
  }
});

// Watch for pause state to reset circle to neutral
watch(() => sessionStore.isPaused, (paused) => {
  if (paused) {
    // Cancel current animation cycle
    if (animationTimeout) {
      clearTimeout(animationTimeout);
      animationTimeout = null;
    }
    // Reset to neutral state when paused
    animationPhase.value = 'ready';
    circleRadius.value = 60;
    circleOpacity.value = 0.3;
    currentCyclePhase = 0;
  } else if (sessionStore.isActive) {
    // Restart animation from inhale when unpaused
    startBreathingAnimation();
  }
});
</script>

<style scoped>
.focal-point-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xl);
  height: 100%;
  cursor: pointer;
}

.timer-display {
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

.circular-focal-point {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.breathing-circle {
  transition: r var(--duration-300) var(--ease-in-out), 
              opacity var(--duration-300) var(--ease-in-out);
}

.breathing-circle.inhale {
  animation: pulse-in 4s ease-in-out;
}

.breathing-circle.exhale {
  animation: pulse-out 4s ease-in-out;
}

.center-text {
  position: relative;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: capitalize;
}

.start-button {
  padding: var(--space-md) var(--space-2xl);
  background: var(--color-brand-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--duration-200);
  box-shadow: var(--shadow-md);
}

.start-button:hover {
  background: var(--color-brand-primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.affirmation-display {
  margin-top: var(--space-xl);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  text-align: center;
  font-style: italic;
  max-width: 400px;
  animation: fadeIn var(--duration-500) ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-in {
  0% { r: 40; }
  100% { r: 80; }
}

@keyframes pulse-out {
  0% { r: 80; }
  100% { r: 40; }
}
</style>
