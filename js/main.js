/**
 * main.js — Entry point for the JavaScript Learning Platform
 *
 * TEACHING: DOMContentLoaded fires after HTML is parsed but before
 * images/stylesheets finish loading — the right time to manipulate the DOM.
 *
 * We import initPlatform() from platform.js which handles:
 *   - Rendering the curriculum dashboard
 *   - Loading and rendering individual lessons
 *   - Running interactive coding challenges
 */

import { initPlatform } from './platform.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initPlatform();
  } catch (error) {
    console.error('Platform bootstrap error:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<div style="padding:2rem;color:#ff6b6b;font-family:monospace">
        <h2>❌ Failed to start JavaScript Learning Platform</h2>
        <p>${error.message}</p>
        <p>Please ensure you are serving this over HTTP (not file://).</p>
        <p>Try: <code>npx serve .</code> or <code>python -m http.server 8080</code></p>
      </div>`;
    }
  }
});
