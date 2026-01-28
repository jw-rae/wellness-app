<template>
  <div class="view-container">
    <div class="view-header">
      <h1>About</h1>
      <p class="tagline">Simple, self-directed nervous-system regulation</p>
    </div>

    <div class="view-content">
      <section class="about-section">
        <h2>Purpose</h2>
        <p>
          This is a simple wellness tool designed for calm, focus, and grounding.
          No ads, no accounts, no subscriptions—just you and the tools you need.
        </p>
      </section>

      <section class="about-section">
        <h2>Features</h2>
        <ul>
          <li><strong>Breathing Mode:</strong> Visual focal point with customizable breathing patterns</li>
          <li><strong>EMDR (Bilateral) Mode:</strong> Lateral visual stimulation with optional bilateral audio</li>
          <li><strong>Presets:</strong> Save and reuse your favorite settings</li>
          <li><strong>Sequences:</strong> Chain multiple presets into custom rituals</li>
          <li><strong>Privacy-First:</strong> All data stays on your device</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Design Principles</h2>
        <ul>
          <li>Silent by default</li>
          <li>Minimal UI, no clutter</li>
          <li>Offline-ready</li>
          <li>No hidden data collection</li>
          <li>Device-local storage only</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Technology</h2>
        <p>
          Built with Vue 3, Vite, and a token-based design system.
          Static-first architecture ensures fast loading and infinite scalability.
        </p>
      </section>

      <section class="about-section">
        <h2>Your Data</h2>
        <p>
          All presets and sequences are stored locally in your browser.
          Nothing is sent to any server. You can export your data as JSON
          and import it on another device if needed.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// No script logic needed for this static view
</script>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-xl);
  overflow-y: auto;
}

.view-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.view-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-sm);
}

.tagline {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.view-content {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.about-section {
  margin-bottom: var(--space-2xl);
}

.about-section h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-md);
  color: var(--color-text-primary);
}

.about-section p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.about-section ul {
  list-style: none;
  padding: 0;
}

.about-section li {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: var(--space-lg);
  position: relative;
  margin-bottom: var(--space-sm);
}

.about-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-brand-primary-500);
  font-weight: var(--font-weight-bold);
}

.about-section strong {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}
</style>
