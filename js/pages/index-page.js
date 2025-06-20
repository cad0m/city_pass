/**
 * JavaScript for the index page
 * Handles specific functionality and interactions for the home page
 */
import { selectors, defaults } from '../core/config.js';
import { qs, qsa, on, createElement } from '../utils/utils.js';
import { isValidEmail } from '../utils/validate.js';
import { initUI } from '../ui.js';
import { apiGet } from '../core/api.js';
/**
 * Initialize the testimonial carousel
 */
export function initTestimonialCarousel() {
  const container = qs(selectors.testimonialContainer);

  // Exit if testimonial container doesn't exist on this page
  if (!container) return;

  let currentSlide = 0;
  let carouselIntervalId = null;

  // Get navigation elements
  const prevButton = qs('#testimonial-prev');
  const nextButton = qs('#testimonial-next');

  // Fetch testimonial data from JSON file
  apiGet('./assets/data/testimonials.json')
    .then(testimonialData => {
      console.log('Testimonial data loaded:', testimonialData);

      // Group testimonials into pairs for slides
      const testimonials = groupTestimonialsInPairs(testimonialData);
      console.log('Grouped testimonials:', testimonials);

      // Create slides
      testimonials.forEach((slideData, index) => {
        const slide = createTestimonialSlide(slideData, index);
        container.appendChild(slide);
      });

      // Create navigation dots
      createNavigationDots(testimonials.length);

      // Set up navigation buttons
      if (prevButton) {
        on(prevButton, 'click', () => {
          goToPrevSlide();
          resetCarouselTimer();
        });
      }

      if (nextButton) {
        on(nextButton, 'click', () => {
          goToNextSlide();
          resetCarouselTimer();
        });
      }

      // Add keyboard navigation
      on(document, 'keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          goToPrevSlide();
          resetCarouselTimer();
        } else if (e.key === 'ArrowRight') {
          goToNextSlide();
          resetCarouselTimer();
        }
      });

      // Start auto-rotation
      startCarouselRotation();

      // Add event listeners for pause/resume
      on(container, 'mouseenter', pauseCarouselRotation);
      on(container, 'mouseleave', startCarouselRotation);
    })
    .catch(error => {
      console.error('Failed to load testimonials:', error);

      // Use fallback data
      console.log('Using fallback testimonial data');
      const fallbackData = [
        {
          "name": "Sarah M.",
          "location": "New York, USA",
          "rating": 5,
          "text": "Tsafira made planning our Moroccan adventure effortless. The personalized itinerary perfectly matched our interests and budget.",
          "avatar": "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
        },
        {
          "name": "James R.",
          "location": "London, UK",
          "rating": 5,
          "text": "An incredible experience from start to finish. The local expertise really showed in the unique experiences we had.",
          "avatar": "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
        },
        {
          "name": "Maria L.",
          "location": "Barcelona, Spain",
          "rating": 5,
          "text": "Our family trip to Morocco was the highlight of our year. The local guides were exceptional and the accommodations were perfect.",
          "avatar": "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"
        },
        {
          "name": "David K.",
          "location": "Toronto, Canada",
          "rating": 4,
          "text": "The attention to detail in our itinerary was impressive. Every recommendation was spot on and saved us so much research time.",
          "avatar": "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg"
        }
      ];

      // Process the fallback data
      const testimonials = groupTestimonialsInPairs(fallbackData);
      console.log('Using fallback grouped testimonials:', testimonials);

      // Create slides
      testimonials.forEach((slideData, index) => {
        const slide = createTestimonialSlide(slideData, index);
        container.appendChild(slide);
      });

      // Create navigation dots
      createNavigationDots(testimonials.length);

      // Set up navigation buttons
      if (prevButton) {
        on(prevButton, 'click', () => {
          goToPrevSlide();
          resetCarouselTimer();
        });
      }

      if (nextButton) {
        on(nextButton, 'click', () => {
          goToNextSlide();
          resetCarouselTimer();
        });
      }

      // Start auto-rotation
      startCarouselRotation();

      // Add event listeners for pause/resume
      on(container, 'mouseenter', pauseCarouselRotation);
      on(container, 'mouseleave', startCarouselRotation);
    });

  /**
   * Group testimonials into pairs for slides
   * @param {Array} flatTestimonials - Flat array of testimonial objects
   * @returns {Array} - Array of testimonial pairs for slides
   */
  function groupTestimonialsInPairs(flatTestimonials) {
    const groupedTestimonials = [];

    // Loop through the flat array and create pairs
    for (let i = 0; i < flatTestimonials.length; i += 2) {
      // If we have an odd number of testimonials, the last "pair" might only have one item
      const pair = flatTestimonials.slice(i, i + 2);
      groupedTestimonials.push(pair);
    }

    return groupedTestimonials;
  }

  /**
   * Create a testimonial slide
   * @param {Array} slideData - Data for testimonials in the slide
   * @param {number} index - Slide index
   * @returns {HTMLElement} - Slide element
   */
  function createTestimonialSlide(slideData, index) {
    console.log('Creating slide', index, 'with data:', slideData);

    const slide = createElement('div', {
      className: `testimonial-slide ${index === 0 ? 'active' : ''}`,
      dataset: { index }
    });

    // Create grid container for the two testimonials
    const gridContainer = createElement('div', {
      className: 'grid md:grid-cols-2 gap-8'
    });

    // Add testimonials to the grid
    slideData.forEach(testimonial => {
      console.log('Processing testimonial:', testimonial);
      const stars = Array(testimonial.rating)
        .fill('<i class="fas fa-star"></i>')
        .join('');

      const card = createElement('div', {
        className: 'testimonial-card p-6 md:p-8'
      });

      // Create the card content with individual elements instead of innerHTML
      const headerDiv = createElement('div', {
        className: 'flex items-center mb-6'
      });

      const avatar = createElement('img', {
        src: testimonial.avatar || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
        alt: testimonial.name,
        className: 'testimonial-avatar mr-4'
      });

      const infoDiv = createElement('div', {});

      const nameHeading = createElement('h4', {
        className: 'font-bold text-lg dark:text-gray-100'
      }, testimonial.name);

      const locationPara = createElement('p', {
        className: 'text-gray-600 dark:text-gray-400 text-sm'
      }, testimonial.location);

      infoDiv.appendChild(nameHeading);
      infoDiv.appendChild(locationPara);

      headerDiv.appendChild(avatar);
      headerDiv.appendChild(infoDiv);

      const starsDiv = createElement('div', {
        className: 'testimonial-stars mb-4'
      });
      starsDiv.innerHTML = stars;

      const quoteDiv = createElement('div', {
        className: 'testimonial-quote mb-4'
      });

      const quotePara = createElement('p', {
        className: 'text-gray-700 dark:text-gray-300'
      }, `"${testimonial.text}"`);

      quoteDiv.appendChild(quotePara);

      card.appendChild(headerDiv);
      card.appendChild(starsDiv);
      card.appendChild(quoteDiv);

      gridContainer.appendChild(card);
    });

    slide.appendChild(gridContainer);
    return slide;
  }

  /**
   * Create navigation dots for the carousel
   * @param {number} totalSlides - Total number of slides
   */
  function createNavigationDots(totalSlides) {
    const dotsContainer = qs(selectors.carouselDots);

    // Exit if dots container doesn't exist
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalSlides; i++) {
      const dot = createElement('button', {
        className: `carousel-dot w-3 h-3 rounded-full ${i === 0 ? 'bg-teal-400' : 'bg-gray-300'}`,
        dataset: { index: i },
        'aria-label': `Go to slide ${i + 1}`,
        onclick: () => goToSlide(i)
      });

      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Go to a specific slide
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    const slides = qsa('.testimonial-slide');
    const dots = qsa('.carousel-dot');

    // Validate index
    if (index < 0 || index >= slides.length) return;

    // Determine direction for animation
    const direction = index > currentSlide ? 'next' : 'prev';
    const currentIdx = currentSlide;

    // Hide all slides and deactivate all dots
    slides.forEach(slide => {
      slide.classList.remove('active');
      // Set initial position for animation
      if (parseInt(slide.dataset.index) === index) {
        slide.style.transform = direction === 'next' ? 'translateX(50px) scale(0.95)' : 'translateX(-50px) scale(0.95)';
      }
    });

    dots.forEach(dot => dot.classList.replace('bg-teal-400', 'bg-gray-300'));

    // Small delay for better animation
    setTimeout(() => {
      // Show the selected slide and activate the corresponding dot
      slides[index].classList.add('active');
      dots[index].classList.replace('bg-gray-300', 'bg-teal-400');

      // Update current slide index
      currentSlide = index;
    }, 50);
  }

  /**
   * Go to the next slide
   */
  function goToNextSlide() {
    const totalSlides = qsa('.testimonial-slide').length;
    if (totalSlides > 0) {
      const nextIndex = (currentSlide + 1) % totalSlides;
      goToSlide(nextIndex);
    }
  }

  /**
   * Go to the previous slide
   */
  function goToPrevSlide() {
    const totalSlides = qsa('.testimonial-slide').length;
    if (totalSlides > 0) {
      const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
      goToSlide(prevIndex);
    }
  }

  /**
   * Reset the carousel timer
   */
  function resetCarouselTimer() {
    pauseCarouselRotation();
    startCarouselRotation();
  }

  /**
   * Start carousel auto-rotation
   */
  function startCarouselRotation() {
    // Clear any existing interval
    if (carouselIntervalId) clearInterval(carouselIntervalId);

    // Set new interval
    carouselIntervalId = setInterval(() => {
      goToNextSlide();
    }, defaults.carouselAutoplayDelay);
  }

  /**
   * Pause carousel auto-rotation
   */
  function pauseCarouselRotation() {
    if (carouselIntervalId) {
      clearInterval(carouselIntervalId);
      carouselIntervalId = null;
    }
  }
}

/**
 * Initialize the newsletter form
 */
export function initNewsletterForm() {
  const form = qs(selectors.newsletterForm);
  if (!form) return;

  const emailInput = qs(selectors.emailInput);
  const subscribeButton = qs(selectors.subscribeButton);
  const checkbox = qs(selectors.checkbox);
  const newsletterContainer = qs(selectors.newsletterContainer);

  // Add validation states and enable button only when valid
  on(emailInput, 'input', validateEmail);
  on(checkbox, 'change', validateForm);

  // Form submission
  on(form, 'submit', function(e) {
    e.preventDefault();

    if (!isValidEmail(emailInput.value)) {
      showError('Please enter a valid email address');
      return;
    }

    if (!checkbox.checked) {
      showError('Please agree to receive newsletters');
      return;
    }

    // Show loading state
    subscribeButton.disabled = true;
    subscribeButton.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Subscribing...
    `;

    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
      // Show success message
      newsletterContainer.innerHTML = `
        <div class="text-center">
          <div class="mx-auto mb-6 rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-2 text-gray-800">Thank you for subscribing!</h3>
          <p class="text-gray-600">We've sent a confirmation email to <span class="font-medium">${emailInput.value}</span></p>
        </div>
      `;
    }, 1500);
  });

  /**
   * Validate email input
   */
  function validateEmail() {
    if (emailInput.value.trim() === '') {
      setEmailState('empty');
    } else if (isValidEmail(emailInput.value)) {
      setEmailState('valid');
    } else {
      setEmailState('invalid');
    }
    validateForm();
  }

  /**
   * Set email input state with appropriate styling
   * @param {string} state - State of the email input ('empty', 'valid', or 'invalid')
   */
  function setEmailState(state) {
    // Remove all states
    emailInput.classList.remove(
      'border-gray-300', 'border-red-500', 'border-green-500',
      'bg-red-50', 'bg-green-50', 'pr-10'
    );

    // Remove any existing icons
    const existingIcon = emailInput.parentElement.querySelector('.validation-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // Set appropriate classes based on state
    switch(state) {
      case 'empty':
        emailInput.classList.add('border-gray-300');
        break;
      case 'valid':
        emailInput.classList.add('border-green-500', 'bg-green-50', 'pr-10');
        // Add checkmark icon
        addValidationIcon('check', 'text-green-500');
        break;
      case 'invalid':
        emailInput.classList.add('border-red-500', 'bg-red-50', 'pr-10');
        // Add error icon
        addValidationIcon('error', 'text-red-500');
        break;
    }
  }

  /**
   * Add validation icon to input
   * @param {string} type - Icon type ('check' or 'error')
   * @param {string} className - CSS class for icon color
   */
  function addValidationIcon(type, className) {
    const iconWrapper = createElement('div', {
      className: 'validation-icon absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none'
    });

    if (type === 'check') {
      iconWrapper.innerHTML = `
        <svg class="w-5 h-5 ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      `;
    } else {
      iconWrapper.innerHTML = `
        <svg class="w-5 h-5 ${className}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      `;
    }

    // Add icon inside the input's parent container
    const inputContainer = emailInput.parentElement;
    inputContainer.style.position = 'relative';
    inputContainer.appendChild(iconWrapper);
  }

  /**
   * Validate form and update button state
   */
  function validateForm() {
    const isEmailValid = isValidEmail(emailInput.value);
    const isCheckboxChecked = checkbox.checked;

    // Enable/disable button based on validation
    if (isEmailValid && isCheckboxChecked) {
      subscribeButton.disabled = false;
      subscribeButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      subscribeButton.disabled = true;
      subscribeButton.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message text
   */
  function showError(message) {
    // Remove any existing error message
    const existingError = form.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Create error message
    const errorDiv = createElement('div', {
      className: 'error-message text-red-500 text-sm mt-2 animate-fadeIn'
    });
    errorDiv.textContent = message;

    // Add error message to form
    form.appendChild(errorDiv);

    // Auto-remove error after 4 seconds
    setTimeout(function() {
      errorDiv.classList.add('animate-fadeOut');
      setTimeout(function() {
        errorDiv.remove();
      }, 300);
    }, 4000);
  }

  // Initial validation
  validateEmail();
  validateForm();
}

/**
 * Handle the quick trip form submission from the index page
 */
export function initQuickTripForm() {
  const quickFormButton = document.getElementById('quick-generate-btn');
  if (!quickFormButton) return;

  quickFormButton.addEventListener('click', function(e) {
    e.preventDefault();

    // Get form values
    const budget = document.getElementById('quick-budget').value;
    const departure = document.getElementById('quick-departure').value;
    const startDate = document.getElementById('quick-start-date').value;
    const endDate = document.getElementById('quick-end-date').value;

    // Get preferences
    const cultureChecked = document.getElementById('quick-culture').checked;
    const natureChecked = document.getElementById('quick-nature').checked;
    const luxuryChecked = document.getElementById('quick-luxury').checked;
    const sightseeingChecked = document.getElementById('quick-sightseeing').checked;

    // Validate the form
    if (!validateQuickForm(startDate, endDate, departure)) {
      return;
    }

    // Create wizard state object
    const tripWizardState = {
      budget: budget,
      currency: "MAD", // Default currency
      startDate: startDate,
      endDate: endDate,
      flexibleDates: false, // Default
      departure: departure,
      preferences: {
        culture: cultureChecked,
        nature: natureChecked,
        luxury: luxuryChecked,
        sightseeing: sightseeingChecked
      },
      interestLevels: {}, // Will be populated below
      dietary: "No specific requirements", // Default
      accessibility: "No specific requirements", // Default
      specialRequests: "",
      emailCopy: false,
      termsAgreed: true, // Set to true by default for quick form
      currentStep: 2 // Set to step 3 (index 2)
    };

    // Set medium interest level (50) for any checked preference
    if (cultureChecked) tripWizardState.interestLevels.culture = 50;
    if (natureChecked) tripWizardState.interestLevels.nature = 50;
    if (luxuryChecked) tripWizardState.interestLevels.luxury = 50;
    if (sightseeingChecked) tripWizardState.interestLevels.sightseeing = 50;

    // Save to localStorage
    localStorage.setItem('tripWizardState', JSON.stringify(tripWizardState));

    // Redirect to wizard page step 3
    window.location.href = './pages/wizard.html?step=3';
  });

  /**
   * Validate the quick form
   * @param {string} startDate - Check-in date
   * @param {string} endDate - Check-out date
   * @param {string} departure - Departure airport
   * @returns {boolean} - Whether the form is valid
   */
  function validateQuickForm(startDate, endDate, departure) {
    let isValid = true;

    // Clear previous error messages
    const errorMessages = document.querySelectorAll('.quick-form-error');
    errorMessages.forEach(el => el.remove());

    // Validate start date
    if (!startDate) {
      showQuickFormError('quick-start-date', 'Please select a check-in date');
      isValid = false;
    }

    // Validate end date
    if (!endDate) {
      showQuickFormError('quick-end-date', 'Please select a check-out date');
      isValid = false;
    }

    // Validate date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        showQuickFormError('quick-end-date', 'Check-out date must be after check-in date');
        isValid = false;
      }
    }

    // Validate departure
    if (!departure) {
      showQuickFormError('quick-departure', 'Please enter your departure location');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Show an error message for a form field
   * @param {string} elementId - ID of the form element
   * @param {string} message - Error message
   */
  function showQuickFormError(elementId, message) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Add error styling to element
    element.classList.add('border-red-500');

    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'quick-form-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;

    // Insert after the element
    element.parentNode.insertBefore(errorElement, element.nextSibling);

    // Remove error after 3 seconds
    setTimeout(() => {
      element.classList.remove('border-red-500');
      errorElement.remove();
    }, 3000);
  }
}

/**
 * Initialize index page functionality
 */
export function init() {
  console.log('Initializing index page');

  // Initialize UI framework components first
  initUI();

  // Initialize page-specific components
  initTestimonialCarousel();
  initNewsletterForm();
  initQuickTripForm();

  // Handle destination selection
  const destinationCards = qsa(selectors.destinationCard);
  destinationCards.forEach(card => {
    on(card, 'click', function(e) {
      e.preventDefault();
      const destination = this.dataset.destination;
      window.location.href = `/pages/destination.html?name=${destination}`;
    });
  });

  console.log('Index page initialization complete');
}

// Export main functions
export default {
  init,
  initTestimonialCarousel,
  initNewsletterForm,
  initQuickTripForm
};