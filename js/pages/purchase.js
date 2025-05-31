console.log('Purchase JS loaded');

// Pass type configurations
const passConfigs = {
  city: {
    name: 'Urban City Pass',
    icon: 'fas fa-city',
    logo: '../images/Logos/city_pass.png',
    description: 'Complete city exploration with museums, transport, and attractions'
  },
  air: {
    name: 'Urban Air Pass',
    icon: 'fas fa-plane',
    logo: '../images/Logos/air_pass.png',
    description: 'Perfect for layovers and short airport visits'
  },
  sea: {
    name: 'Urban Sea Pass',
    icon: 'fas fa-ship',
    logo: '../images/Logos/sea_pass.png',
    description: 'Shore excursions for cruise passengers'
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

// Format card number input
function formatCardNumber(input) {
  let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  input.value = formattedValue;
}

// Format expiry date input
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  input.value = value;
}

// Populate order summary
function populateOrderSummary(cityData, passType, duration, price) {
  const passSummary = document.getElementById('pass-summary');
  const passPrice = document.getElementById('pass-price');
  const totalPrice = document.getElementById('total-price');
  
  if (!passSummary || !passPrice || !totalPrice) return;
  
  const passConfig = passConfigs[passType];
  const serviceFee = 2.50;
  const total = parseFloat(price) + serviceFee;
  
  passSummary.innerHTML = `
    <div class="flex items-center space-x-4 p-4 bg-[var(--color-bg-alt)] rounded-xl">
      <img src="${passConfig.logo}" alt="${passConfig.name}" class="w-16 h-16 rounded-lg">
      <div class="flex-1">
        <h4 class="font-bold text-lg text-[var(--color-text)]">${passConfig.name}</h4>
        <p class="text-[var(--color-text-muted)] text-sm">${cityData.name}</p>
        <p class="text-[var(--color-text-muted)] text-sm">${duration} duration</p>
      </div>
    </div>
    <div class="text-sm text-[var(--color-text-muted)]">
      ${passConfig.description}
    </div>
  `;
  
  passPrice.textContent = `€${price}`;
  totalPrice.textContent = `€${total.toFixed(2)}`;
}

// Update breadcrumb navigation
function updateBreadcrumb(cityData, passType) {
  const cityLink = document.getElementById('city-link');
  const passLink = document.getElementById('pass-link');
  
  if (cityLink && cityData) {
    cityLink.textContent = cityData.name;
    cityLink.href = `./city.html?id=${cityData.id}`;
  }
  
  if (passLink && passConfigs[passType]) {
    passLink.textContent = passConfigs[passType].name;
    passLink.href = `./${passType}-pass.html?city=${cityData.id}`;
  }
}

// Handle form submission
function handleFormSubmission(event) {
  event.preventDefault();
  
  // Get form data
  const formData = new FormData(event.target);
  const customerData = Object.fromEntries(formData);
  
  // Validate required fields
  const requiredFields = ['firstName', 'lastName', 'email', 'country', 'cardNumber', 'expiryDate', 'cvv', 'cardholderName'];
  const missingFields = requiredFields.filter(field => !customerData[field]);
  
  if (missingFields.length > 0) {
    alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
    return;
  }
  
  if (!customerData.terms) {
    alert('Please accept the terms and conditions to continue.');
    return;
  }
  
  // Simulate payment processing
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  submitButton.disabled = true;
  submitButton.textContent = 'Processing...';
  
  setTimeout(() => {
    // Simulate successful payment
    alert('Payment successful! Your pass has been sent to your email.');
    
    // Redirect to a confirmation page or back to city page
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('city');
    window.location.href = `./city.html?id=${cityId}&purchased=true`;
  }, 2000);
}

// Initialize form event listeners
function initializeFormListeners() {
  const form = document.getElementById('purchase-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmission);
  }
  
  // Card number formatting
  const cardNumberInput = document.querySelector('input[name="cardNumber"]');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => formatCardNumber(e.target));
  }
  
  // Expiry date formatting
  const expiryDateInput = document.querySelector('input[name="expiryDate"]');
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', (e) => formatExpiryDate(e.target));
  }
  
  // CVV validation
  const cvvInput = document.querySelector('input[name="cvv"]');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  console.log('DOMContentLoaded fired in purchase.js');
  
  try {
    // Load header and footer
    console.log('Loading partials...');
    await loadHTML('../partials/header.html', 'header-placeholder');
    await loadHTML('../partials/footer.html', 'footer-placeholder');
    console.log('Partials loaded');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cityId = urlParams.get('city');
    const passType = urlParams.get('pass');
    const duration = urlParams.get('duration');
    const price = urlParams.get('price');
    
    console.log('Purchase parameters:', { cityId, passType, duration, price });

    if (!cityId || !passType || !duration || !price) {
      showError('Invalid purchase parameters. Please try again.');
      return;
    }

    if (!passConfigs[passType]) {
      showError('Invalid pass type. Please try again.');
      return;
    }

    // Load cities data
    const citiesData = await loadCitiesData();
    if (!citiesData) {
      showError('Failed to load city data. Please try again later.');
      return;
    }

    // Find the city data
    const cityData = citiesData.find(city => city.id === cityId);
    if (!cityData) {
      showError('City not found. Please try again.');
      return;
    }
    
    // Set page title
    document.title = `Purchase ${passConfigs[passType].name} - ${cityData.name} - My Urban Pass`;

    // Populate order summary
    populateOrderSummary(cityData, passType, duration, price);
    
    // Update breadcrumb
    updateBreadcrumb(cityData, passType);
    
    // Initialize form listeners
    initializeFormListeners();

    // Show content
    const loadingState = document.getElementById('loading-state');
    const purchaseContent = document.getElementById('purchase-content');

    if (loadingState) {
      loadingState.style.display = 'none';
    }

    if (purchaseContent) {
      purchaseContent.classList.remove('hidden');
      setTimeout(() => {
        purchaseContent.classList.add('active');
      }, 100);
    }

  } catch (error) {
    console.error('Error loading purchase page:', error);
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
