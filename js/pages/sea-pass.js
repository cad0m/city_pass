console.log('Sea Pass JS loaded');

// City data for coastal cities
const cityData = {
  tangier: {
    name: "Tangier",
    port: "Port of Tangier",
    landmarks: ["Kasbah", "Caves of Hercules", "Cap Spartel"],
    description: "Gateway between Africa and Europe, a cosmopolitan city with rich history."
  },
  casablanca: {
    name: "Casablanca",
    port: "Port of Casablanca",
    landmarks: ["Hassan II Mosque", "Old Medina", "Corniche"],
    description: "Morocco's economic capital, where modernity meets tradition along the Atlantic coast."
  },
  agadir: {
    name: "Agadir",
    port: "Port of Agadir",
    landmarks: ["Agadir Beach", "Kasbah", "Souk El Had"],
    description: "Modern beach resort city with golden sands and year-round sunshine."
  },
  essaouira: {
    name: "Essaouira",
    port: "Port of Essaouira",
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

  const purchaseUrl = `./purchase.html?city=${cityId}&pass=sea&duration=${duration}&price=${price}`;
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
  console.log('DOMContentLoaded fired in sea-pass.js');
  
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
      showError('City not found or Sea Pass not available for this destination.');
      return;
    }

    const city = cityData[cityId];
    
    // Set page title
    document.title = `Urban Sea Pass in ${city.name} - My Urban Pass`;

    // Populate city-specific content
    const cityNameElement = document.getElementById('city-name');
    const shoreCityName = document.getElementById('shore-city-name');

    if (cityNameElement) {
      cityNameElement.textContent = city.name;
    }

    if (shoreCityName) {
      shoreCityName.textContent = city.name;
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
    console.error('Error loading sea pass page:', error);
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
