// Destinations page module - bridges main.js and pages/destinations.js
import { init as initDestinationsPage } from './pages/destinations.js';

console.log('Destinations-page.js loaded');

// Export init function for main.js
export function init() {
  console.log('Destinations-page init called');
  initDestinationsPage();
}
