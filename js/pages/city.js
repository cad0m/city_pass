console.log('City.js script loaded');

// Simple fetch function to replace apiGet
async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

// Simple function to load HTML content
async function loadHTML(url, targetId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(targetId);
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error(`Error loading ${url}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOMContentLoaded fired in city.js');
  try {
    // Load header and footer
    console.log('Loading partials...');
    await loadHTML('../partials/header.html', 'header-placeholder');
    await loadHTML('../partials/footer.html', 'footer-placeholder');
    console.log('Partials loaded');

    // Get city ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('id');
    console.log('City ID:', cityId);

    if (!cityId) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Fetch city data from JSON
    console.log('Fetching cities data...');
    const allCities = await fetchJSON('../assets/data/cities.json');
    console.log('Cities loaded:', allCities.length);
    const city = allCities.find(c => c.id === cityId);
    console.log('Found city:', city?.name);

    if (!city) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Populate the page with city data
    console.log('Populating city data...');
    populateCityData(city);

    // Populate city pass card section
    console.log('Populating city pass card...');
    populateCityPassCard(city);

    // Hide loading state and show content FIRST
    console.log('Showing content...');
    const loadingState = document.getElementById('loading-state');
    const cityContent = document.getElementById('city-content');

    if (loadingState) {
      loadingState.style.display = 'none';
      console.log('Loading state hidden');
    }

    if (cityContent) {
      cityContent.style.display = 'block';
      cityContent.classList.remove('hidden');
      console.log('City content shown');
    }

    // Initialize enhanced pass selection system after content is shown
    setTimeout(() => {
      try {
        console.log('Initializing pass selection...');
        initPassSelectionSystem(city);
        console.log('Pass selection initialized');
      } catch (error) {
        console.error('Error initializing pass selection system:', error);
        // Don't let this error prevent the page from loading
      }
    }, 100);

  } catch (error) {
    console.error('Error loading city data:', error);
    showError('Failed to load city data. Please try again later.');
  }
});

// Add a fallback in case DOMContentLoaded has already fired
if (document.readyState === 'loading') {
  // DOMContentLoaded has not fired yet
} else {
  // DOMContentLoaded has already fired, run the initialization immediately
  console.log('DOM already loaded, running initialization...');
  setTimeout(() => {
    document.dispatchEvent(new Event('DOMContentLoaded'));
  }, 100);
}

/**
 * Shows an error message on the page
 * @param {string} message - Error message to display
 */
function showError(message) {
  const loadingState = document.getElementById('loading-state');
  loadingState.innerHTML = `
    <div class="text-center">
      <p class="text-red-600 dark:text-red-400 text-xl">${message}</p>
      <a href="/pages/destinations.html" class="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
        Back to Destinations
      </a>
    </div>
  `;
}

/**
 * Populates all sections of the page with city data
 * @param {Object} city - City data object
 */
function populateCityData(city) {
  try {
    // Set page title
    document.title = `${city.name} - Morocco Travel`;

    // Helper function to safely set element content
    function safeSetContent(id, content, property = 'textContent') {
      const element = document.getElementById(id);
      if (element) {
        element[property] = content;
      } else {
        console.warn(`Element with id '${id}' not found`);
      }
    }

    // Hero section
    safeSetContent('hero-image', city.heroImage, 'src');
    safeSetContent('hero-image', `${city.name} panorama`, 'alt');
    safeSetContent('city-name', city.name);
    safeSetContent('city-short-description', city.shortDescription);

    // Quick facts
    safeSetContent('best-time', city.quickFacts.bestTimeToVisit);
    safeSetContent('budget', city.quickFacts.averageBudget);
    safeSetContent('recommended-stay', city.quickFacts.recommendedStay);

    // About section
    safeSetContent('about-city-name', city.name);
    safeSetContent('about-description', city.about);

    // Highlights
    const highlightsContainer = document.getElementById('highlights-container');
    if (highlightsContainer && city.highlights) {
      highlightsContainer.innerHTML = '';

      city.highlights.forEach(highlight => {
        const highlightEl = document.createElement('div');
        highlightEl.className = 'flex items-start space-x-3';
        highlightEl.innerHTML = `
          <i class="fa-solid fa-${highlight.icon} text-2xl text-teal-400 dark:text-cyan-400"></i>
          <div>
            <h3 class="font-semibold dark:text-gray-100">${highlight.title}</h3>
            <p class="text-gray-600 dark:text-gray-300">${highlight.description}</p>
          </div>
        `;
        highlightsContainer.appendChild(highlightEl);
      });
    }

    // Gallery images
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && city.galleryImages) {
      galleryContainer.innerHTML = '';

      city.galleryImages.forEach(imgUrl => {
        const imgEl = document.createElement('img');
        imgEl.className = 'w-full h-48 object-cover rounded-lg';
        imgEl.src = imgUrl;
        imgEl.alt = `${city.name} gallery image`;
        galleryContainer.appendChild(imgEl);
      });
    }

  // Ideal Places to See
  const idealPlacesContainer = document.getElementById('ideal-places-container');
  if (idealPlacesContainer && city.idealPlacesToSee) {
    idealPlacesContainer.innerHTML = ''; // Clear existing content

    city.idealPlacesToSee.forEach(category => {
      const categoryEl = document.createElement('div');
      categoryEl.className = 'bg-white dark:bg-dark-bg-accent p-6 rounded-lg shadow-lg';

      const placesHTML = category.places.map(place =>
        `<li><i class="fas fa-check-circle text-green-500 dark:text-green-400 mr-2"></i>${place}</li>`
      ).join('');

      categoryEl.innerHTML = `
        <div class="flex items-center mb-4">
          <i class="fa-solid fa-${category.icon || 'map-marker-alt'} text-3xl text-teal-400 dark:text-cyan-400 mr-4"></i>
          <h3 class="text-xl font-semibold dark:text-gray-100">${category.categoryTitle}</h3>
        </div>
        <ul class="space-y-3 text-gray-600 dark:text-gray-300">
          ${placesHTML}
        </ul>
      `;
      idealPlacesContainer.appendChild(categoryEl);
    });
  } else if (idealPlacesContainer) {
    // Fallback if idealPlacesToSee is not defined or empty
    idealPlacesContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-400 col-span-full text-center">Information on ideal places to see is not available for this city yet.</p>';
  }

    // Video
    safeSetContent('city-video', city.videoUrl, 'src');

    // Map
    safeSetContent('map-city-name', city.name);
    safeSetContent('city-map', city.mapEmbedUrl, 'src');

    // Local guides
    safeSetContent('guide-city-name', city.name);

    const guidesContainer = document.getElementById('guides-container');
    if (guidesContainer && city.localGuides) {
      guidesContainer.innerHTML = '';

      city.localGuides.forEach(guide => {
        const guideEl = document.createElement('div');
        guideEl.className = 'bg-white dark:bg-dark-bg-accent p-4 rounded-lg text-center';

        // Create stars for rating
        let starsHTML = '';
        const fullStars = Math.floor(guide.rating);
        const hasHalfStar = guide.rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
          starsHTML += '<i class="fa-solid fa-star"></i>';
        }

        if (hasHalfStar) {
          starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        }

        guideEl.innerHTML = `
          <img src="${guide.avatar}" alt="${guide.name}" class="w-24 h-24 rounded-full mx-auto mb-4"/>
          <h3 class="font-semibold dark:text-gray-100">${guide.name}</h3>
          <p class="text-gray-600 dark:text-gray-300">${guide.profession}</p>
          <div class="flex justify-center mt-2 text-teal-400 dark:text-cyan-400">
            ${starsHTML}
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${guide.rating} (${guide.reviewCount} reviews)</p>
        `;

        guidesContainer.appendChild(guideEl);
      });
    }
  } catch (error) {
    console.error('Error populating city data:', error);
  }
}

/**
 * Populate the city pass card section with data
 * @param {Object} cityData - The city data object
 */
function populateCityPassCard(cityData) {
  const cityPassSection = document.getElementById('city-pass-card');
  const cityName = cityData.name;
  const cityId = cityData.id;

  // Function to check if an image exists
  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // Check if the city card image exists
  imageExists(`../assets/image/${cityId}.png`).then(exists => {
    if (!exists) {
      // If the city doesn't have a card image, hide the entire section
      console.log(`No city card available for ${cityName}, hiding section`);
      cityPassSection.style.display = 'none';
      return;
    }

    // City card exists, show the section and populate it
    cityPassSection.style.display = 'block';

    // Set city name in all places
    document.getElementById('city-card-name').textContent = cityName;
    document.getElementById('city-card-title').textContent = cityName;

    // Set the front card image
    const frontCardImage = document.getElementById('city-card-front-image');
    frontCardImage.src = `../assets/image/${cityId}.png`;
    frontCardImage.alt = `${cityName} City Card`;

    // Set city card link to the city-pass page for this city
    document.getElementById('city-card-link').href = `./city-card.html?city=${cityId}`;

    // Generate attraction tags based on highlights (limited to just 3 for overview)
    const attractionsContainer = document.getElementById('city-card-attractions');
    attractionsContainer.innerHTML = ''; // Clear existing content

    if (cityData.highlights) {
      // Use highlights to create attraction tags (just top 3)
      cityData.highlights.slice(0, 3).forEach(highlight => {
        const tag = document.createElement('span');
        tag.className = 'attraction-tag';
        tag.innerHTML = `<i class="fas fa-${highlight.icon} mr-1"></i> ${highlight.title}`;
        attractionsContainer.appendChild(tag);
      });
    }

    // Add a "more" tag to indicate there are more attractions
    const moreTag = document.createElement('span');
    moreTag.className = 'attraction-tag more-tag';
    moreTag.innerHTML = `<i class="fas fa-ellipsis-h mr-1"></i> And more...`;
    attractionsContainer.appendChild(moreTag);

    // Add 3D card flip effect interaction
    const cardContainer = document.querySelector('.city-card-3d-container');
    if (cardContainer) {
      // Preload the back image to ensure smooth flip
      const backImage = new Image();
      backImage.src = '../assets/image/back.png';

      // Add click event to flip the card
      cardContainer.addEventListener('click', function() {
        this.classList.toggle('flipped');

        // Add a subtle floating animation after flip
        if (this.classList.contains('flipped')) {
          this.style.animation = 'float 3s ease-in-out infinite';
        } else {
          this.style.animation = '';
        }
      });

      // Add touch events for mobile
      cardContainer.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.classList.toggle('flipped');

        // Add a subtle floating animation after flip
        if (this.classList.contains('flipped')) {
          this.style.animation = 'float 3s ease-in-out infinite';
        } else {
          this.style.animation = '';
        }
      });
    }
  });
}

/**
 * Initialize the enhanced pass selection system
 * @param {Object} cityData - The city data object
 */
function initPassSelectionSystem(cityData) {
  try {
    // Show/hide pass cards based on city availability
    const cityId = cityData.id;
    const airPassCard = document.getElementById('air-pass-card');
    const seaPassCard = document.getElementById('sea-pass-card');

    // Cities with airports (for Urban Air Pass)
    const airportCities = ['casablanca', 'rabat', 'marrakech', 'fez'];

    // Cities with seaports (for Urban Sea Pass)
    const seaportCities = ['tangier', 'casablanca', 'agadir', 'rabat'];

    // Show Air Pass card if city has airport
    if (airportCities.includes(cityId) && airPassCard) {
      airPassCard.style.display = 'block';
    }

    // Show Sea Pass card if city has seaport
    if (seaportCities.includes(cityId) && seaPassCard) {
      seaPassCard.style.display = 'block';
    }

    // Set the city name in the pass section
    const passCityName = document.getElementById('pass-city-name');
    if (passCityName) {
      passCityName.textContent = cityData.name;
    }

    // Define pass types and their availability based on city features (for the original system)
    const passTypes = getAvailablePassTypes(cityData);

    // Initialize event listeners with city data (for the original system)
    setupPassSelectionEventListeners(cityData, passTypes);
  } catch (error) {
    console.error('Error in initPassSelectionSystem:', error);
    // Hide the pass selection section if there's an error
    const passSection = document.getElementById('pass-selection-section');
    if (passSection) {
      passSection.style.display = 'none';
    }
  }
}

/**
 * Determine which pass types are available for the current city
 * @param {Object} cityData - The city data object
 * @returns {Array} Array of available pass types
 */
function getAvailablePassTypes(cityData) {
  const cityId = cityData.id;
  const cityName = cityData.name;

  // Cities with airports (for Urban Air Pass)
  const airportCities = ['casablanca', 'rabat', 'marrakech', 'fez'];

  // Cities with seaports (for Urban Sea Pass)
  const seaportCities = ['tangier', 'casablanca', 'agadir', 'rabat'];

  const passTypes = [
    {
      id: 'urban-city',
      name: 'Urban City Pass',
      icon: 'fas fa-city',
      iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      description: 'Perfect for tourists and locals exploring the city',
      subtitle: 'Complete city exploration experience',
      features: [
        'Access to all major attractions',
        'Unlimited public transportation',
        'Skip-the-line privileges',
        'Free guided tours',
        'Digital city guide'
      ],
      durations: [
        { id: '24h', name: '24 Hours', price: 45, popular: false },
        { id: '48h', name: '48 Hours', price: 79, popular: true },
        { id: '72h', name: '72 Hours', price: 109, popular: false },
        { id: '1week', name: '1 Week', price: 189, popular: false }
      ],
      available: true
    }
  ];

  // Add Urban Air Pass if city has airport
  if (airportCities.includes(cityId)) {
    passTypes.push({
      id: 'urban-air',
      name: 'Urban Air Pass',
      icon: 'fas fa-plane',
      iconColor: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      description: 'Ideal for airline passengers during layovers',
      subtitle: 'Quick city highlights for travelers',
      features: [
        'Express city highlights tour',
        'Airport transfer included',
        'Fast-track attractions',
        'Luggage storage options',
        'Mobile concierge service'
      ],
      durations: [
        { id: '6h', name: '6 Hours', price: 65, popular: false },
        { id: '12h', name: '12 Hours', price: 95, popular: true }
      ],
      available: true
    });
  }

  // Add Urban Sea Pass if city has seaport
  if (seaportCities.includes(cityId)) {
    passTypes.push({
      id: 'urban-sea',
      name: 'Urban Sea Pass',
      icon: 'fas fa-anchor',
      iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      description: 'Perfect for cruise passengers on shore excursions',
      subtitle: 'Coastal city discovery experience',
      features: [
        'Shore excursion highlights',
        'Port transfer included',
        'Coastal attractions focus',
        'Flexible timing options',
        'Return guarantee to ship'
      ],
      durations: [
        { id: '4h', name: '4 Hours', price: 55, popular: false },
        { id: '8h', name: '8 Hours', price: 85, popular: true },
        { id: '12h', name: '12 Hours', price: 115, popular: false }
      ],
      available: true
    });
  }

  return passTypes;
}

/**
 * Render pass type cards
 * @param {Array} passTypes - Array of available pass types
 */
function renderPassTypeCards(passTypes) {
  const container = document.getElementById('pass-type-cards');
  if (!container) return;

  container.innerHTML = passTypes.map(passType => `
    <div class="pass-type-card" data-pass-type="${passType.id}">
      <div class="pass-type-icon ${passType.iconColor}">
        <i class="${passType.icon}"></i>
      </div>
      <h4 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">${passType.name}</h4>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">${passType.subtitle}</p>
      <p class="text-gray-600 dark:text-gray-300 mb-4">${passType.description}</p>
      <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        ${passType.features.slice(0, 3).map(feature => `
          <li class="flex items-center">
            <i class="fas fa-check text-green-500 mr-2"></i>
            ${feature}
          </li>
        `).join('')}
        ${passType.features.length > 3 ? `<li class="text-primary dark:text-primary-dark font-medium">+${passType.features.length - 3} more benefits</li>` : ''}
      </ul>
    </div>
  `).join('');
}

/**
 * Set up event listeners for pass selection
 * @param {Object} cityData - The city data object
 * @param {Array} passTypesData - Array of available pass types
 */
function setupPassSelectionEventListeners(cityData, passTypesData) {
  // Store selected pass data
  let selectedPassType = null;
  let selectedDuration = null;

  // Get the pass selection section to scope our event listeners
  const passSelectionSection = document.getElementById('pass-selection-section');
  if (!passSelectionSection) return;

  // Pass type selection - use event delegation on the section
  passSelectionSection.addEventListener('click', function(e) {
    const passCard = e.target.closest('.pass-type-card');
    if (passCard) {
      // Remove selection from all cards
      passSelectionSection.querySelectorAll('.pass-type-card').forEach(card => {
        card.classList.remove('selected');
      });

      // Select clicked card
      passCard.classList.add('selected');

      // Get selected pass type
      const passTypeId = passCard.dataset.passType;
      selectedPassType = passTypeId;

      // Find the selected pass data
      const selectedPassData = passTypesData.find(p => p.id === passTypeId);

      if (selectedPassData) {
        showDurationSelection(selectedPassData);
      }
      return;
    }

    // Duration selection
    const durationCard = e.target.closest('.duration-card');
    if (durationCard && selectedPassType) {
      // Remove selection from all duration cards
      passSelectionSection.querySelectorAll('.duration-card').forEach(card => {
        card.classList.remove('selected');
      });

      // Select clicked card
      durationCard.classList.add('selected');

      // Get selected duration
      const durationId = durationCard.dataset.duration;
      selectedDuration = durationId;

      // Show pricing summary
      showPricingSummary(selectedPassType, selectedDuration, passTypesData);
      return;
    }

    // Proceed to booking button
    if (e.target.id === 'proceed-to-booking' || e.target.closest('#proceed-to-booking')) {
      handleProceedToBooking(selectedPassType, selectedDuration);
      return;
    }
  });
}

/**
 * Show duration selection for selected pass type
 * @param {Object} passData - Selected pass type data
 */
function showDurationSelection(passData) {
  const durationSection = document.getElementById('duration-selection');
  const durationContainer = document.getElementById('duration-cards');

  if (!durationSection || !durationContainer) return;

  // Render duration cards
  durationContainer.innerHTML = passData.durations.map(duration => `
    <div class="duration-card ${duration.popular ? 'popular' : ''}" data-duration="${duration.id}">
      <h5 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">${duration.name}</h5>
      <div class="text-2xl font-bold text-primary dark:text-primary-dark mb-2">€${duration.price}</div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Perfect for ${duration.name.toLowerCase()} stays</p>
    </div>
  `).join('');

  // Show duration selection with animation
  durationSection.style.display = 'block';
  setTimeout(() => {
    durationSection.classList.add('show');
  }, 100);
}

/**
 * Show pricing summary
 * @param {string} passTypeId - Selected pass type ID
 * @param {string} durationId - Selected duration ID
 * @param {Array} passTypesData - All pass types data
 */
function showPricingSummary(passTypeId, durationId, passTypesData) {
  const pricingSection = document.getElementById('pricing-summary');
  const summaryElement = document.getElementById('selected-summary');
  const totalPriceElement = document.getElementById('total-price');
  const savingsElement = document.getElementById('savings-amount');
  const proceedButton = document.getElementById('proceed-to-booking');

  if (!pricingSection || !passTypesData) return;

  const passData = passTypesData.find(p => p.id === passTypeId);
  const durationData = passData?.durations.find(d => d.id === durationId);

  if (!passData || !durationData) return;

  // Calculate savings (assuming 20% savings compared to individual purchases)
  const regularPrice = Math.round(durationData.price * 1.25);
  const savings = regularPrice - durationData.price;

  // Update summary content
  summaryElement.innerHTML = `
    <div class="flex items-center justify-center gap-2 mb-2">
      <div class="pass-type-icon ${passData.iconColor} !w-8 !h-8 !text-sm">
        <i class="${passData.icon}"></i>
      </div>
      <span class="font-semibold">${passData.name}</span>
    </div>
    <p class="text-sm">${durationData.name} • ${passData.subtitle}</p>
  `;

  totalPriceElement.textContent = `€${durationData.price}`;
  savingsElement.textContent = `€${savings}`;

  // Enable proceed button
  proceedButton.disabled = false;

  // Show pricing summary with animation
  pricingSection.style.display = 'block';
  setTimeout(() => {
    pricingSection.classList.add('show');
  }, 100);
}

/**
 * Handle proceed to booking
 * @param {string} passTypeId - Selected pass type ID
 * @param {string} durationId - Selected duration ID
 */
function handleProceedToBooking(passTypeId, durationId) {
  // Get current city ID
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id');

  // Create booking URL with parameters
  const bookingUrl = `./booking.html?city=${cityId}&passType=${passTypeId}&duration=${durationId}`;

  // For now, show an alert (in a real implementation, this would redirect to booking)
  alert(`Proceeding to booking for ${passTypeId} pass (${durationId}) in ${cityId}.\n\nBooking URL: ${bookingUrl}`);

  // Uncomment the line below when booking page is ready
  // window.location.href = bookingUrl;
}

// Navigation functions for the new pass cards
function navigateToCityPass() {
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id');
  if (cityId) {
    window.location.href = `./city-pass.html?city=${cityId}`;
  }
}

function navigateToAirPass() {
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id');
  if (cityId) {
    window.location.href = `./air-pass.html?city=${cityId}`;
  }
}

function navigateToSeaPass() {
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('id');
  if (cityId) {
    window.location.href = `./sea-pass.html?city=${cityId}`;
  }
}