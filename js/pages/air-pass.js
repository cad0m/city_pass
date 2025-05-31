console.log('Air Pass JS loaded');

// City data for airport cities
const cityData = {
  casablanca: {
    name: "Casablanca",
    airport: "Mohammed V International",
    landmarks: ["Hassan II Mosque", "Old Medina", "Corniche"],
    description: "Morocco's economic capital, where modernity meets tradition along the Atlantic coast."
  },
  marrakech: {
    name: "Marrakech",
    airport: "Marrakech Menara Airport",
    landmarks: ["Jemaa el-Fnaa", "Majorelle Garden", "Koutoubia Mosque"],
    description: "The Red City, a vibrant imperial city with bustling souks and stunning palaces."
  },
  fes: {
    name: "Fes",
    airport: "Fes–Saïs Airport",
    landmarks: ["Fes el-Bali", "Al-Qarawiyyin Mosque", "Bou Inania Madrasa"],
    description: "The spiritual and cultural heart of Morocco, home to the world's oldest university."
  },
  rabat: {
    name: "Rabat",
    airport: "Rabat–Salé Airport",
    landmarks: ["Hassan Tower", "Kasbah of the Udayas", "Royal Palace"],
    description: "Morocco's capital, a blend of historical heritage and modern governance."
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

  const purchaseUrl = `./purchase.html?city=${cityId}&pass=air&duration=${duration}&price=${price}`;
  window.location.href = purchaseUrl;
}

// Scroll to durations section
function scrollToDurations() {
  const durationsSection = document.querySelector('#pass-content .py-20:nth-of-type(2)');
  if (durationsSection) {
    durationsSection.scrollIntoView({ behavior: 'smooth' });
  }
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
  console.log('DOMContentLoaded fired in air-pass.js');
  
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

    if (!cityId || !cityData[cityId]) {
      showError('City not found or Air Pass not available for this destination.');
      return;
    }

    const city = cityData[cityId];
    
    // Set page title
    document.title = `Urban Air Pass in ${city.name} - My Urban Pass`;

    // Populate city-specific content
    const cityNameElement = document.getElementById('city-name');
    const layoverCityName = document.getElementById('layover-city-name');

    if (cityNameElement) {
      cityNameElement.textContent = city.name;
    }

    if (layoverCityName) {
      layoverCityName.textContent = city.name;
    }

    // Update breadcrumb
    const cityLink = document.getElementById('city-link');
    if (cityLink) {
      cityLink.textContent = city.name;
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
    console.error('Error loading air pass page:', error);
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
