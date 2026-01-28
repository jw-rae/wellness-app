# Wellness App

A simple, self-directed nervous-system regulation tool. Zero ads, no accounts, no subscriptions—just you and the tools you need.

## Purpose

Provide high-quality wellness tools for acute stress relief, daily grounding routines, and personalized rituals. Built with a privacy-first, offline-ready approach.

## Features

- **Breathing Mode**: Visual focal point with customizable breathing patterns (Box Breathing, 4-7-8, etc.)
- **EMDR (Bilateral) Mode**: Lateral visual stimulation with optional bilateral audio tones
- **Preset Library**: Save and reuse custom settings for breathing and EMDR sessions
- **Sequence Builder**: Chain multiple presets into linear sequences for personalized rituals
- **Import/Export**: Backup and share your presets as JSON
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
│   ├── views/            # Page-level components (routes)
│   │   ├── BreathingView.vue
│   │   ├── BilateralView.vue
│   │   ├── PresetsView.vue
│   │   └── AboutView.vue
│   ├── stores/           # Pinia state management
│   │   ├── sessionStore.js    # Active session state & timer
│   │   └── presetStore.js     # Preset & sequence management
│   ├── services/         # Business logic & utilities
│   │   └── storageService.js  # localStorage persistence
│   ├── models/           # Data models with JSDoc types
│   │   ├── Preset.js
│   │   └── Sequence.js
│   ├── router/           # Vue Router configuration
│   │   └── index.js
│   ├── App.vue           # Root component with navigation
│   ├── main.ts           # App entry point
│   └── style.css         # Global styles (token-based)
├── package.json
└── vite.config.ts
```

### Core Data Models

**Preset**
- Represents a single breathing pattern, EMDR configuration, or affirmation
- Contains: id, name, type, duration, configuration, timestamps
- Default presets provided (Box Breathing, 4-7-8, Standard EMDR)

**Sequence**
- Linear chain of preset steps
- Contains: id, name, steps (ordered preset references), total duration

**Session**
- Active runtime state managed by `sessionStore`
- Tracks: current mode, active preset, elapsed time, progress, pause state

### Data Flow

1. **App Initialization**
   - Pinia stores initialized
   - Presets loaded from localStorage (or defaults if first run)
   - Router mounts initial view

2. **User Starts Session**
   - User selects preset or sequence
   - `sessionStore` activates session with selected config
   - Timer starts, progress tracked

3. **Session Execution**
   - Views respond to session state changes
   - Focal point animations driven by session data
   - Timer updates every second

4. **Data Persistence**
   - User saves new preset → `presetStore` → `storageService` → localStorage
   - User creates sequence → stored in localStorage
   - Import/Export: JSON serialization of all data

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

The app uses the `@jwrae/design-tokens` package for consistent styling. Design tokens include:

- **Colors**: Surface, text, brand, semantic colors (success, warning, error)
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl, 2xl)
- **Typography**: Font sizes, weights, line heights
- **Border Radius**: Consistent border radius values
- **Shadows**: Elevation shadows
- **Transitions**: Duration and easing functions

Themes can be switched dynamically by setting `data-theme` on the `<html>` element:
```javascript
document.documentElement.setAttribute('data-theme', 'warm');
document.documentElement.setAttribute('data-color-scheme', 'dark');
```

## Non-Functional Requirements

- **Performance**: App loads in <1 second
- **Scalability**: Static hosting scales infinitely via CDN
- **Reliability**: No backend = no downtime
- **Portability**: Token-based design system works across frameworks
- **Accessibility**: Low-brightness themes, large focal elements, keyboard/mouse/touch friendly

## Privacy & Security

- **No Authentication**: No accounts or login required
- **Local-Only Storage**: All data persists in browser localStorage
- **No Tracking**: No analytics, cookies, or data collection
- **GDPR Compliant**: No personal data processed

## Future Enhancements

- IndexedDB migration for larger data sets
- Advanced sequence builder with conditional logic
- Additional breathing patterns and EMDR configurations
- Progressive Web App (PWA) support for offline usage

## License

This project is built for personal wellness and self-directed nervous-system regulation.

