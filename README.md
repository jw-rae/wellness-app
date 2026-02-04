# Wellness App v0

A simple, self-directed nervous-system regulation tool. Zero ads, no accounts, no subscriptions—just you and the tools you need.

## Purpose

Provide high-quality wellness tools for acute stress relief, daily grounding routines, and personalized rituals. Built with a privacy-first, offline-ready approach.

## Features

### Core Modes
- **Breathing Mode**: Visual focal point with customizable breathing patterns
  - Animated circular focal point with smooth radius transitions
  - Multiple focal point styles (solid, glow, gradient)
  - Real-time breathing guidance (Inhale/Exhale/Hold text)
  - Customizable patterns: Box Breathing, 4-7-8, Coherent, Calm, Triangle, and more
  - Inline affirmations that cycle with each inhale
  - Theme system with warm, cool, pink, green, and blue palettes
  - Light/dark mode support
  
- **EMDR (Bilateral) Mode**: Lateral visual stimulation with optional bilateral audio
  - Multiple visual modes: slide, pulse, blink
  - Adjustable BPM (beats per minute) for movement speed
  - Optional bilateral audio tones
  - Affirmations with customizable interval
  - Same theme and dark/light mode support

### Preset Management
- **Preset Library**: Save, organize, and manage custom presets
  - Table and grid view options
  - Filter by type (Breathing or EMDR)
  - Sort by name, date, or type
  - Inline editing of preset names
  - One-click play to start sessions with collapsed sidebar
  - Export individual presets as JSON files
  - Import presets via file picker or drag-and-drop
  - Delete with confirmation modal
  
### Session Controls
- **Collapsible Sidebar**: Clean, theme-consistent left panel with all controls
  - Toggle button to expand/collapse for distraction-free sessions
  - Auto-collapse when playing presets from library
  - Smooth transitions and animations
  
- **Customization Options**:
  - Duration settings (minutes and seconds)
  - Theme selection (5 color palettes)
  - Light/dark mode toggle
  - Focal point style selection (breathing mode)
  - Visual mode selection (bilateral mode)
  - Audio toggle (bilateral mode)
  - Affirmations input with auto-resizing textarea
  - Save current settings as new preset
  - Export/import configurations

### Design & UX
- **Theme System**: 5 color palettes (warm, cool, pink, green, blue) with light/dark variants
- **Responsive**: Works on desktop, tablet, and mobile
- **Auto-Growing Textareas**: Affirmations input expands naturally without scrollbars
- **Breathing Room**: Visual spacing and padding for comfortable interaction
- **Keyboard/Mouse/Touch**: Full support for all input methods
- **Privacy-First**: All data stored locally in your browser—no server, no tracking

## Architecture

### System Overview

**Frontend-Only SPA**
- Single-page application built with Vue 3
- Client-side routing (no page reloads)
- Static assets only—no backend or server-side logic
- Local persistence via localStorage

**Tech Stack**
- **Language**: JavaScript (with JSDoc for type hints)
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: CSS with design tokens from `@jwrae/design-tokens`
- **Storage**: localStorage (IndexedDB for future scalability)

### Project Structure

```
wellness-app/
├── instructions/          # Project documentation and design references
│   ├── instructions.md
│   ├── demo.html
│   ├── tokens-catalog.html
│   └── README.md
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable Vue components
│   │   ├── bilateral/           # EMDR mode components
│   │   │   ├── AffirmationsSection.vue
│   │   │   ├── AudioSection.vue
│   │   │   ├── BasicControlsSection.vue
│   │   │   ├── BilateralCanvas.vue
│   │   │   ├── BilateralControls.vue
│   │   │   ├── SaveImportSection.vue
│   │   │   └── StyleSection.vue
│   │   ├── breathing/           # Breathing mode components
│   │   │   ├── AffirmationsSection.vue
│   │   │   ├── BasicControlsSection.vue
│   │   │   ├── BreathingControls.vue
│   │   │   ├── SaveImportSection.vue
│   │   │   └── StyleSection.vue
│   │   ├── preset/              # Preset library components
│   │   │   ├── PresetCard.vue
│   │   │   ├── PresetsTab.vue
│   │   │   ├── PresetTableRow.vue
│   │   │   └── (sequence components removed in v0)
│   │   ├── ui/                  # Shared UI components
│   │   │   ├── CollapsibleSection.vue
│   │   │   ├── GameSelect.vue
│   │   │   ├── Modal.vue
│   │   │   └── SessionControlButtons.vue
│   │   ├── BottomControlBar.vue
│   │   └── CircularFocalPoint.vue
│   ├── views/            # Page-level components (routes)
│   │   ├── BreathingView.vue
│   │   ├── BilateralView.vue
│   │   ├── PresetsView.vue
│   │   └── AboutView.vue
│   ├── stores/           # Pinia state management
│   │   ├── sessionStore.js    # Active session state & timer
│   │   └── presetStore.js     # Preset management
│   ├── services/         # Business logic & utilities
│   │   └── storageService.js  # localStorage persistence
│   ├── models/           # Data models with JSDoc types
│   │   └── Preset.js
│   ├── utils/            # Utility functions
│   │   └── exportUtils.js
│   ├── router/           # Vue Router configuration
│   │   └── index.js
│   ├── assets/           # CSS and design tokens
│   │   ├── foundations.css
│   │   ├── themes.css
│   │   └── utilities.css
│   ├── App.vue           # Root component
│   ├── main.ts           # App entry point
│   └── style.css         # Global styles
├── package.json
└── vite.config.ts
```

### Core Data Models

**Preset**
- Represents a single breathing pattern or EMDR configuration
- Contains: id, name, type, duration, breathing pattern settings (inhale/hold/exhale times), theme, dark mode, affirmations, etc.
- Default presets provided: Box Breathing, 4-7-8, Coherent Breathing, Calm, Triangle, Standard EMDR

**Session**
- Active runtime state managed by `sessionStore`
- Tracks: current mode (breathing/bilateral), active preset, elapsed time, timer, pause state
- Controls: start, pause/resume, stop session

### Data Flow

1. **App Initialization**
   - Pinia stores initialized
   - Presets loaded from localStorage (or defaults if first run)
   - Theme set to 'cool' with dark mode enabled by default
   - Router mounts initial view (/breathing)

2. **User Starts Session**
   - User selects preset from library or configures custom settings
   - Clicks play (from library) or start (from controls)
   - `sessionStore.startSession()` activates with selected config
   - Sidebar auto-collapses for distraction-free experience
   - Timer starts, progress tracked

3. **Session Execution**
   - Views respond to session state changes
   - Breathing mode: circular focal point animates with phase transitions
   - Bilateral mode: visual stimulus moves/pulses based on BPM
   - Affirmations cycle at configured intervals
   - Timer updates every second

4. **Data Persistence**
   - User saves new preset → `presetStore.addPreset()` → `storageService` → localStorage
   - User updates preset → `presetStore.updatePreset()` → localStorage
   - User deletes preset → `presetStore.deletePreset()` → localStorage
   - Import/Export: JSON serialization via file picker or drag-and-drop

### Routes

- `/` → Redirects to `/breathing`
- `/breathing` → Breathing Mode
- `/bilateral` → EMDR (Bilateral) Mode
- `/presets` → Preset Library & Sequence Builder
- `/about` → About & Documentation

## Development

### Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Design Tokens

The app uses custom CSS design tokens for consistent styling across all themes. Design tokens include:

- **Colors**: 5 theme palettes (warm, cool, pink, green, blue)
  - Each theme has brand colors (50-950 scale)
  - Surface colors (primary, secondary, tertiary, elevated)
  - Text colors (primary, secondary, tertiary, disabled, inverse)
  - Border colors (primary, secondary, interactive, focus)
  - Semantic colors (success, warning, error, info)
  
- **Color Schemes**: Light and dark mode support
  - `data-color-scheme="dark"` inverts surface/text colors
  - Smooth transitions between modes
  
- **Spacing**: Consistent spacing scale (2xs, xs, sm, md, lg, xl, 2xl, 3xl)
- **Typography**: Font sizes, weights, line heights
- **Border Radius**: Consistent radius values (sm, base, md, lg, full)
- **Shadows**: Elevation shadows
- **Transitions**: Duration and easing functions (200ms, 300ms, ease-in-out)

Themes can be switched dynamically:
```javascript
document.documentElement.setAttribute('data-theme', 'cool');
document.documentElement.setAttribute('data-color-scheme', 'dark');
```

Default: Cool theme with dark mode enabled.

## Non-Functional Requirements

- **Performance**: App loads in <1 second, smooth 60fps animations
- **Scalability**: Static hosting scales infinitely via CDN
- **Reliability**: No backend = no downtime, works offline after initial load
- **Portability**: Token-based design system, modular component architecture
- **Accessibility**: 
  - Low-brightness themes with dark mode
  - Large focal elements for visibility
  - Keyboard, mouse, and touch support
  - High contrast text and borders
  - Auto-growing textareas for readability
  
## Privacy & Security

- **No Authentication**: No accounts or login required
- **Local-Only Storage**: All data persists in browser localStorage
- **No Tracking**: No analytics, cookies, or data collection
- **No Network Requests**: App runs entirely offline after initial load
- **GDPR Compliant**: No personal data processed or transmitted

## Future Enhancements (Post-v0)

- IndexedDB migration for larger data sets
- Sequence builder: chain multiple presets into linear flows
- Advanced breathing patterns with custom timing
- Additional EMDR visual modes
- Progressive Web App (PWA) support for offline installation
- Audio-guided sessions with voice instructions
- Session history and analytics (local only)

## Version History

### v0 (Current)
- Core breathing and bilateral modes
- Preset library with import/export
- Theme system (5 palettes + light/dark)
- Collapsible sidebar controls
- Auto-growing affirmations input
- Table and grid views for presets
- Inline preset editing
- Drag-and-drop import
- Default: Cool dark theme

## License

This project is built for personal wellness and self-directed nervous-system regulation.

