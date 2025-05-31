console.log('City Pass JS loaded');

// City data
const cityData = {
  casablanca: {
    name: "Casablanca",
    landmarks: ["Hassan II Mosque", "Old Medina", "Corniche"],
    description: "Morocco's economic capital, where modernity meets tradition along the Atlantic coast."
  },
  marrakech: {
    name: "Marrakech",
    landmarks: ["Jemaa el-Fnaa", "Majorelle Garden", "Koutoubia Mosque"],
    description: "The Red City, a vibrant imperial city with bustling souks and stunning palaces."
  },
  fes: {
    name: "Fes",
    landmarks: ["Fes el-Bali", "Al-Qarawiyyin Mosque", "Bou Inania Madrasa"],
    description: "The spiritual and cultural heart of Morocco, home to the world's oldest university."
  },
  tangier: {
    name: "Tangier",
    landmarks: ["Kasbah", "Caves of Hercules", "Cap Spartel"],
    description: "Gateway between Africa and Europe, a cosmopolitan city with rich history."
  },
  rabat: {
    name: "Rabat",
    landmarks: ["Hassan Tower", "Kasbah of the Udayas", "Royal Palace"],
    description: "Morocco's capital, a blend of historical heritage and modern governance."
  },
  agadir: {
    name: "Agadir",
    landmarks: ["Agadir Beach", "Kasbah", "Souk El Had"],
    description: "Modern beach resort city with golden sands and year-round sunshine."
  },
  essaouira: {
    name: "Essaouira",
    landmarks: ["Medina", "Skala de la Ville", "Essaouira Beach"],
    description: "Charming coastal city known for its Portuguese-influenced architecture and windsurfing."
  }
};

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

// Duration selection handler
function selectDuration(duration, price) {
  console.log('Selected duration:', duration, 'Price:', price);

  // Navigate to purchase page with parameters
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('city');

  const purchaseUrl = `./purchase.html?city=${cityId}&pass=city&duration=${duration}&price=${price}`;
  window.location.href = purchaseUrl;
}

// Scroll to durations section
function scrollToDurations() {
  const durationsSection = document.querySelector('#pass-content .py-20:nth-of-type(2)');
  if (durationsSection) {
    durationsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Load cities data from JSON
async function loadCitiesData() {
  try {
    const response = await fetch('../assets/data/cities.json');
    if (!response.ok) {
      throw new Error(`Failed to load cities data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading cities data:', error);
    return null;
  }
}

// Populate places categories from idealPlacesToSee data
function populatePlacesCategories(cityData) {
  const placesContainer = document.getElementById('places-categories');
  const discoverCityName = document.getElementById('discover-city-name');

  if (!placesContainer || !cityData.idealPlacesToSee) return;

  if (discoverCityName) {
    discoverCityName.textContent = cityData.name;
  }

  placesContainer.innerHTML = '';

  cityData.idealPlacesToSee.forEach((category, index) => {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'floating';
    categoryEl.style.animationDelay = `${index * 0.2}s`;

    categoryEl.innerHTML = `
      <div class="city-card rounded-3xl p-8 lg:p-12">
        <div class="flex flex-col lg:flex-row items-start gap-8">
          <!-- Category Header -->
          <div class="lg:w-1/3">
            <div class="city-feature-icon w-20 h-20 rounded-3xl flex items-center justify-center mb-6">
              <i class="fas fa-${category.icon} text-3xl"></i>
            </div>
            <h3 class="text-3xl font-bold city-gradient-text mb-4">${category.categoryTitle}</h3>
            <p class="text-[var(--color-text-muted)] text-lg">Discover the most amazing ${category.categoryTitle.toLowerCase()} that ${cityData.name} has to offer.</p>
          </div>

          <!-- Places Grid -->
          <div class="lg:w-2/3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${category.places.map((place, placeIndex) => `
                <div class="bg-white/50 dark:bg-gray-700/50 rounded-2xl p-6 border border-yellow-200/30 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div class="flex items-start">
                    <div class="w-3 h-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <div>
                      <h4 class="font-semibold text-[var(--color-text)] mb-2">${place}</h4>
                      <p class="text-sm text-[var(--color-text-muted)]">Included with your Urban City Pass</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    placesContainer.appendChild(categoryEl);
  });
}

// Go back to city page
function goBackToCity() {
  const urlParams = new URLSearchParams(window.location.search);
  const cityId = urlParams.get('city');
  if (cityId) {
    window.location.href = `./city.html?id=${cityId}`;
  } else {
    window.location.href = './destinations.html';
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOMContentLoaded fired in city-pass.js');

  try {
    // Load header and footer
    console.log('Loading partials...');
    await loadHTML('../partials/header.html', 'header-placeholder');
    await loadHTML('../partials/footer.html', 'footer-placeholder');
    console.log('Partials loaded');

    // Get city ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('city');
    console.log('City ID:', cityId);

    if (!cityId) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Load cities data from JSON
    const citiesData = await loadCitiesData();
    if (!citiesData) {
      showError('Failed to load city data. Please try again later.');
      return;
    }

    // Find the city data
    const cityFromData = citiesData.find(city => city.id === cityId);
    if (!cityFromData) {
      showError('City not found. Please select a valid destination.');
      return;
    }

    // Set page title
    document.title = `Urban City Pass in ${cityFromData.name} - My Urban Pass`;

    // Populate city-specific content
    const cityNameElement = document.getElementById('city-name');
    if (cityNameElement) {
      cityNameElement.textContent = cityFromData.name;
    }

    // Update all city name references
    const cityNameHighlights = document.getElementById('city-name-highlights');
    const cityNameCta = document.getElementById('city-name-cta');
    const cityNameCta2 = document.getElementById('city-name-cta2');
    const cityNameBack = document.getElementById('city-name-back');
    const cityNameFinal = document.getElementById('city-name-final');

    if (cityNameHighlights) cityNameHighlights.textContent = cityFromData.name;
    if (cityNameCta) cityNameCta.textContent = cityFromData.name;
    if (cityNameCta2) cityNameCta2.textContent = cityFromData.name;
    if (cityNameBack) cityNameBack.textContent = cityFromData.name;
    if (cityNameFinal) cityNameFinal.textContent = cityFromData.name;

    // Populate places categories from idealPlacesToSee
    populatePlacesCategories(cityFromData);

    // Populate city landmarks (if still needed)
    const landmarksContainer = document.getElementById('city-landmarks');
    if (landmarksContainer && cityFromData.idealPlacesToSee) {
      landmarksContainer.innerHTML = '';

      // Use the first few places from all categories as landmarks
      const allPlaces = cityFromData.idealPlacesToSee.flatMap(category =>
        category.places.slice(0, 2) // Take first 2 from each category
      ).slice(0, 6); // Limit to 6 total

      allPlaces.forEach((place, index) => {
        const landmarkEl = document.createElement('div');
        landmarkEl.className = 'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg';

        landmarkEl.innerHTML = `
          <div class="w-12 h-12 bg-[var(--color-primary)]/20 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-landmark text-[var(--color-primary)]"></i>
          </div>
          <h3 class="text-xl font-bold mb-2 text-[var(--color-text)]">${place}</h3>
          <p class="text-[var(--color-text-muted)]">Must-see attraction in ${cityFromData.name}</p>
        `;
        landmarksContainer.appendChild(landmarkEl);
      });
    }

    // Update breadcrumb
    const cityLink = document.getElementById('city-link');
    if (cityLink) {
      cityLink.textContent = cityFromData.name;
      cityLink.href = `./city.html?id=${cityId}`;
    }

    // Show content
    const loadingState = document.getElementById('loading-state');
    const passContent = document.getElementById('pass-content');

    if (loadingState) {
      loadingState.style.display = 'none';
    }

    if (passContent) {
      passContent.classList.remove('hidden');
      setTimeout(() => {
        passContent.classList.add('active');
      }, 100);
    }

  } catch (error) {
    console.error('Error loading city pass page:', error);
    showError('Failed to load page. Please try again later.');
  }
});

function showError(message) {
  const loadingState = document.getElementById('loading-state');
  loadingState.innerHTML = `
    <div class="text-center">
      <p class="text-red-600 dark:text-red-400 text-xl">${message}</p>
      <a href="./destinations.html" class="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline">
        Back to Destinations
      </a>
    </div>
  `;
}
