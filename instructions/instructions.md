Development schedule: 
3
Architecture & Diagrams
SPA architecture diagram, data models (preset, sequence), repo structure
Architecture diagram, data model diagram
4
App Skeleton
Vue 3 + Vite setup, token integration, session state engine, base UI
Running SPA shell, session engine
5
Breathing Mode
SVG focal point, breathing patterns, controls, preset schema
Breathing mode functional
6
EMDR + Presets
Lateral motion, bilateral tone (optional), save/load presets
EMDR mode, local persistence
7
Sequences & Import/Export
Linear sequence builder, execution, JSON import/export
Ritual builder, offline workflows


1. Purpose & Context: Purpose, problem statement, target audience, value proposition, measurable success signal
Purpose: Provide a simple, self-directed nervous-system regulation tool.
Problem Statement: Existing wellness apps are cluttered, branded, subscription-heavy, and cognitively noisy.
Target Audience: Individuals seeking calm, focus, and grounding.
Value Proposition:
High-quality wellness tools
Zero ads
No account required
User-controlled experience
Measurable Success Signals:
Users complete breathing sessions ≥3 times per week
Preset import/export tools are used
Low bounce rate on breathing and EMDR tools


4. Scope Definition: MVP in-scope features, explicit exclusions, assumptions, constraints, dependencies
In-Scope Features:
Breathing mode with visual focal point and breathing patterns
EMDR mode with lateral visual focal point and optional bilateral headphone tone
Text-based affirmations
Custom sequence builder (save presets, reorder steps)
Explicit Exclusions:
Audio narration / music layers
Social features
Payments / subscriptions
Authentication / login
Assumptions / Constraints:
Device-local persistence only
Offline-ready
Minimal, single-page UI / different tabs

Use Cases & User Value: Primary/secondary use cases, expected outcomes, adoption rationale
Primary Use Cases:
Acute stress relief (immediate calming)
Daily grounding routine
Secondary Use Cases:
Personalized rituals
Offline and private usage
Expected Outcomes:
Reduced anxiety
Increased focus
Adoption Rationale:
No friction
No account required
No upsell

Product & UX: Core user journeys, UX principles, models, UI complexity, platforms, essential responsiveness/accessibility expectations
Core UX Principles:
Silent by default
Minimal UI
No loud branding
UI Complexity: Single-screen, no nested menus
Platforms: Web (responsive, touch and mouse compatible)
Accessibility:
Low-brightness themes
Large focal elements
Keyboard/mouse/touch friendly
Core User Journeys:
Open app → start breathing or EMDR with default settings → complete session
Adjust settings → save preset → add to preset library
Create sequence from presets → linear builder → start session
Reuse saved presets locally or via JSON import/export
Anti-Journeys:
No heavy notifications
No feature unlocking
No voice or narration functionality
Data Principles: Presets stored locally only; no hidden persistence; no surprise data loss


Architecture & Tech Stack: Macro system architecture, main components, core data flows, essential frameworks/languages/databases, non-functional requirements (performance, scalability, reliability)
Architecture:
Frontend-only SPA
Static assets only; no server-side logic
Local persistence for user presets and ritual sequences (JSON via localStorage)


Tech Stack:
Language: JavaScript
Framework: Vue.js v3
Build: Vite
Styling: CSS with token-based themes
Storage: LocalStorage (IndexedDB optional for future scalability)


Non-functional Requirements:
Performance: App loads in <1 second
Scalability: Client-side only; CDN-backed distribution
Reliability: Static hosting
Portability: Framework-agnostic token-based design system for reuse across projects


Assumptions / Principles:
Static-first scales infinitely
Tokens outlive frameworks
Simplicity beats extensibility for MVP


Include architecture diagram 
8. Security & Compliance: Authentication, authorization, essential encryption, logging, privacy/GDPR considerations
Authentication / Authorization: None required
Data Handling:
Presets stored locally only
No backend storage
Compliance:
No personal data processed
No GDPR concerns
No logging or cookies
Assumption: Low-risk static content


Use jw-rae/design-tokens npm package... I included three files to help you use it. 


