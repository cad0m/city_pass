/**
 * Main JavaScript entry point
 * Initializes all necessary components based on the current page
 */
import { initPartials } from './core/loader.js';
import { qs } from './utils/utils.js';
import { initAuth, updateAuthUI } from './core/auth.js';
import { initUI } from './ui.js';

// Initialize the partials (header and footer)
initPartials();

// Make UI functions globally available immediately for inline handlers
import('./ui.js').then(uiModule => {
  window.toggleTheme = uiModule.toggleTheme;
  window.openMobileMenu = uiModule.openMobileMenu;
  window.closeMobileMenu = uiModule.closeMobileMenu;
}).catch(error => {
  console.error('Error making UI functions global:', error);
});

// Main initialization function
function init() {
  // Initialize UI components
  initUI();
  
  // Initialize theme and auth after partials are loaded
  document.addEventListener('partialLoaded', function(e) {
    if (e.detail.id === '#header-placeholder') {
      // Initialize authentication
      initAuth();

      // Reinitialize UI components after header is loaded to ensure theme toggle buttons work
      setTimeout(() => {
        import('./ui.js').then(uiModule => {
          // Reinitialize theme to attach event listeners to newly loaded theme toggle buttons
          uiModule.initTheme();
          // Also reinitialize scroll progress bar in case it wasn't working
          uiModule.initScrollProgressBar();
        }).catch(error => {
          console.error('Error reinitializing UI components:', error);
        });
      }, 100);
    }
  });
  
  // Also initialize auth for cases where partials might already be loaded
  initAuth();
  
  // Dynamically import page-specific modules based on data-page attribute
  const body = document.body;
  const pageName = body.dataset.page;
  
  if (pageName) {
    try {
      import(`./${pageName}-page.js`)
        .then(module => {
          if (typeof module.init === 'function') {
            module.init();
          } else if (typeof module.default === 'object' && typeof module.default.init === 'function') {
            module.default.init();
          }
        })
        .catch(error => console.error(`Error loading page module for ${pageName}:`, error));
    } catch (error) {
      console.error(`Error importing page module for ${pageName}:`, error);
    }
  }
}

// Make sure auth UI is updated when auth state changes
document.addEventListener('authStateChanged', () => {
  const mobileNavActions = qs('#mobile-nav-actions');
  if (mobileNavActions) {
    updateAuthUI(mobileNavActions);
  }
});

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}