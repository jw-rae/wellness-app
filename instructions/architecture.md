# Wellness App - Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      User Browser                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │          Vue 3 Single Page Application            │ │
│  │                                                    │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │ │
│  │  │Breathing │  │Bilateral │  │  Presets │       │ │
│  │  │   View   │  │   View   │  │   View   │       │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘       │ │
│  │       │             │              │              │ │
│  │       └─────────────┴──────────────┘              │ │
│  │                     │                              │ │
│  │              ┌──────▼──────┐                      │ │
│  │              │   Pinia     │                      │ │
│  │              │   Stores    │                      │ │
│  │              │             │                      │ │
│  │              │ ┌─────────┐ │                      │ │
│  │              │ │ Session │ │ (Runtime State)     │ │
│  │              │ │  Store  │ │                      │ │
│  │              │ └─────────┘ │                      │ │
│  │              │             │                      │ │
│  │              │ ┌─────────┐ │                      │ │
│  │              │ │ Preset  │ │ (Data Management)   │ │
│  │              │ │  Store  │ │                      │ │
│  │              │ └────┬────┘ │                      │ │
│  │              └──────┼──────┘                      │ │
│  │                     │                              │ │
│  │              ┌──────▼──────┐                      │ │
│  │              │  Storage    │                      │ │
│  │              │  Service    │                      │ │
│  │              └──────┬──────┘                      │ │
│  │                     │                              │ │
│  │              ┌──────▼──────┐                      │ │
│  │              │ localStorage│                      │ │
│  │              │   (JSON)    │                      │ │
│  │              └─────────────┘                      │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  No Backend • No Server • Static Hosting                │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.vue (Root)
├── Navigation Bar
│   ├── App Title
│   └── Route Links (Breathing, Bilateral, Presets, About)
│
└── RouterView (Main Content)
    ├── BreathingView.vue
    │   ├── Focal Point (SVG)
    │   ├── Session Controls
    │   └── Timer Display
    │
    ├── BilateralView.vue
    │   ├── Lateral Motion (SVG)
    │   ├── Session Controls
    │   └── Timer Display
    │
    ├── PresetsView.vue
    │   ├── Preset Grid
    │   │   ├── Breathing Presets
    │   │   └── EMDR Presets
    │   ├── Preset Actions
    │   └── Import/Export Controls
    │
    └── AboutView.vue
        └── Static Content
```

## Data Model Relationships

```
┌─────────────┐
│   Preset    │
├─────────────┤
│ id          │
│ name        │
│ type        │ (breathing | emdr | affirmation)
│ duration    │
│ config      │ (breathing pattern or EMDR settings)
│ isDefault   │
└──────┬──────┘
       │
       │ referenced by
       │
       ▼
┌─────────────┐
│  Sequence   │
├─────────────┤
│ id          │
│ name        │
│ steps[]     │ ──→ [{ presetId, order }]
│ description │
└─────────────┘

┌─────────────┐
│   Session   │ (Runtime State)
├─────────────┤
│ isActive    │
│ isPaused    │
│ currentMode │
│ currentPreset │ ──→ references Preset
│ elapsedTime │
│ progress    │
└─────────────┘
```

## State Management Flow

```
┌──────────────┐
│     User     │
│   Interaction│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   View       │
│  Component   │
└──────┬───────┘
       │
       │ calls action
       ▼
┌──────────────┐
│ Pinia Store  │
│   (Actions)  │
└──────┬───────┘
       │
       │ updates state
       ▼
┌──────────────┐
│    State     │
│  (Reactive)  │
└──────┬───────┘
       │
       │ triggers re-render
       ▼
┌──────────────┐
│     View     │
│   Updated    │
└──────────────┘

For persistence:
Store → storageService → localStorage → JSON
```

## Session Lifecycle

```
IDLE
  │
  │ user clicks "Start"
  ▼
┌─────────────┐
│   ACTIVE    │
│  (Running)  │
└──────┬──────┘
       │
       ├──→ user clicks "Pause" ──→ PAUSED ──→ user clicks "Resume" ──┐
       │                                                               │
       ├───────────────────────────────────────────────────────────────┘
       │
       │ timer reaches duration
       ▼
┌─────────────┐
│  COMPLETE   │
└──────┬──────┘
       │
       │ user clicks "Reset" or "Stop"
       ▼
     IDLE
```

## Routing Flow

```
URL Change
    │
    ▼
┌─────────────┐
│ Vue Router  │
└──────┬──────┘
       │
       ├──→ /breathing  ──→ BreathingView.vue
       │
       ├──→ /bilateral ──→ BilateralView.vue
       │
       ├──→ /presets   ──→ PresetsView.vue
       │
       └──→ /about     ──→ AboutView.vue

Note: All routing is client-side (no page reload)
```

## Technology Stack Layers

```
┌───────────────────────────────────────┐
│         Presentation Layer            │
│  Vue 3 Components + Design Tokens     │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│          State Layer                  │
│     Pinia Stores (Session, Presets)   │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│         Service Layer                 │
│   Storage Service (localStorage API)  │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│          Data Layer                   │
│    Browser localStorage (JSON)        │
└───────────────────────────────────────┘
```

## Build & Deployment Flow

```
Source Code (src/)
       │
       │ npm run build
       ▼
┌──────────────┐
│     Vite     │
│  Build Tool  │
└──────┬───────┘
       │
       │ TypeScript compilation
       │ Vue SFC compilation
       │ CSS bundling
       │ Tree-shaking
       │ Minification
       ▼
┌──────────────┐
│   dist/      │
│  (Static     │
│   Assets)    │
└──────┬───────┘
       │
       │ deploy to CDN
       ▼
┌──────────────┐
│   Static     │
│   Hosting    │
│ (Netlify,    │
│  Vercel,     │
│  GitHub      │
│  Pages)      │
└──────────────┘
```

## Key Design Principles

1. **Static-First**: No server-side logic, infinite scalability via CDN
2. **Framework-Agnostic Tokens**: Design system outlives framework changes
3. **Local-Only Data**: Privacy by design—no backend, no tracking
4. **Progressive Enhancement**: Core functionality works without JavaScript
5. **Minimal Dependencies**: Keep bundle size small for fast loading
