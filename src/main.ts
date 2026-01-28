import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/foundations.css'
import './assets/themes.css'
import './assets/utilities.css'
import './style.css'
import App from './App.vue'
// @ts-ignore
import router from './router'
// @ts-ignore
import { usePresetStore } from './stores/presetStore.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize presets after Pinia is installed
const presetStore = usePresetStore()
presetStore.initializePresets()

// Set theme to pink
document.documentElement.setAttribute('data-theme', 'green')

app.mount('#app')
