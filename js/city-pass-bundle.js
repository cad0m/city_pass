/**
 * Consolidated City Pass JavaScript
 * Optimized version with streamlined code
 */

document.addEventListener('DOMContentLoaded', function() {
  initCityPass();
});

/**
 * Initialize the entire City Pass page
 */
function initCityPass() {
  try {
    // First, load the partials
    loadPartial('./partials/header.html', 'header-placeholder');
    loadPartial('./partials/footer.html', 'footer-placeholder');
    
    // Show loading indicator
    showLoadingMessage();
    
    // Set default background immediately
    const heroSection = document.querySelector('#hero-section');
    if (heroSection) {
      heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://www.kanaga-at.com/wp-content/uploads/2021/07/marocco_chefchaouen.jpg')`;
    }
    
    // Load data and initialize UI components
    fetchData()
      .then(data => {
        hideLoadingMessage();
        renderHero(data.hero);
        initBenefits(data.benefits);
        initChart(data.savings);
        initPurchaseOptions(data.purchase);
        renderFaq(data.faq);
        setupScrollProgress();
        setupSmoothScrolling();
      })
      .catch(error => {
        console.error('Error initializing page:', error);
        hideLoadingMessage();
        showErrorMessage('Failed to load page content. Please refresh the page.');
      });
  } catch (error) {
    hideLoadingMessage();
    showErrorMessage('Something went wrong. Please refresh the page.');
  }
}

/**
 * Fetch data from JSON file or use fallback data
 */
function fetchData() {
  return new Promise((resolve) => {
    // Fallback data to use if fetch fails
    const fallbackData = {
      hero: {
        title: "Discover the Ultimate City Pass",
        subtitle: "Unlock unlimited museums, transport & tours—one simple pass.",
        buttonText: "Buy Your Pass",
        backgroundImage: "https://www.kanaga-at.com/wp-content/uploads/2021/07/marocco_chefchaouen.jpg"
      },
      benefits: {
        title: "Top Benefits",
        items: [
          {
            icon: "ticket",
            title: "Skip-the-Line Access",
            description: "No waiting in long queues—get priority entry to all major attractions."
          },
          {
            icon: "train",
            title: "Unlimited Transport",
            description: "Free access to all public transportation within the city during pass validity."
          },
          {
            icon: "map-location-dot",
            title: "20+ Attractions",
            description: "Entry to over 20 top museums, landmarks, and guided tours included."
          },
          {
            icon: "money-bill-wave",
            title: "Significant Savings",
            description: "Save up to 40% compared to purchasing individual tickets."
          }
        ]
      },
      savings: {
        title: "See Your Savings",
        description: "Compare the City Pass price against buying individual tickets.",
        regularPrice: 240,
        passPrice: 149,
        currency: "€"
      },
      purchase: {
        title: "Choose Your Duration",
        subtitle: "Select the pass that fits your trip duration",
        options: [
          {
            id: "2-day",
            duration: "2-Day Pass",
            price: 79,
            priceDetails: "€39.50 per day",
            popular: false,
            features: ["Access to all attractions", "Unlimited public transport", "1 guided tour included"]
          },
          {
            id: "4-day",
            duration: "4-Day Pass",
            price: 149,
            priceDetails: "€37.25 per day",
            popular: true,
            features: ["Access to all attractions", "Unlimited public transport", "2 guided tours included", "1 premium attraction"]
          },
          {
            id: "7-day",
            duration: "7-Day Pass",
            price: 199,
            priceDetails: "€28.43 per day",
            popular: false,
            features: ["Access to all attractions", "Unlimited public transport", "3 guided tours included", "2 premium attractions", "Airport transfers"]
          }
        ],
        buttonText: "Proceed to Purchase"
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "How does the City Pass work?",
            answer: "The City Pass is activated on first use and remains valid for the consecutive days of your chosen duration. Simply show your digital pass (on your phone) or printed pass at each attraction or transport entrance for free entry."
          },
          {
            question: "Are all attractions included in the pass?",
            answer: "The City Pass includes entry to over 20 major attractions, museums, and landmarks. Some special exhibitions or limited-time events may require an additional fee. Check the full list of included attractions in our digital guide."
          },
          {
            question: "Do I need to make reservations for attractions?",
            answer: "Most attractions offer direct entry with your City Pass. However, some popular sites may require reservations during peak season. Your digital guide will indicate which attractions recommend reservations."
          },
          {
            question: "Can I use public transportation with the City Pass?",
            answer: "Yes! Your City Pass includes unlimited use of all public transportation within the city zone, including buses, trams, metro, and local trains for the duration of your pass."
          },
          {
            question: "How do I receive my City Pass?",
            answer: "After purchase, you'll receive your digital City Pass via email. You can either use it on your smartphone through our mobile app or print it at home. Physical cards can also be picked up at our welcome centers in the city."
          }
        ]
      }
    };
    
    // Try to load the JSON file
    fetch('data/city-pass-data.json')
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
        return response.json();
      })
      .then(data => resolve(data))
      .catch(() => resolve(fallbackData)); // Use fallback data on error
  });
}

/**
 * Load a partial HTML file
 */
function loadPartial(url, placeholderId) {
  const placeholderElement = document.getElementById(placeholderId);
  if (!placeholderElement) return;
  
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load partial: ${response.status}`);
      return response.text();
    })
    .then(html => {
      placeholderElement.innerHTML = html;
    })
    .catch(() => {
      placeholderElement.innerHTML = `<div class="p-4 text-center">Failed to load content</div>`;
    });
}

/**
 * Show loading message
 */
function showLoadingMessage() {
  if (document.getElementById('loading-message')) return;
  
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-message';
  loadingDiv.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 z-50';
  loadingDiv.innerHTML = `
    <div class="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Loading city pass information...</p>
    </div>
  `;
  
  document.body.appendChild(loadingDiv);
}

/**
 * Hide loading message
 */
function hideLoadingMessage() {
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) loadingMessage.remove();
}

/**
 * Show error message
 */
function showErrorMessage(message) {
  const mainContainer = document.querySelector('main[data-page]');
  if (!mainContainer) return;
  
  mainContainer.innerHTML = `
    <div class="py-16 text-center">
      <h2 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
      <button class="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full" onclick="location.reload()">
        Refresh Page
      </button>
    </div>
  `;
}

/**
 * Render the hero section
 */
function renderHero(heroData) {
  if (!heroData) return;
  
  const heroSection = document.querySelector('#hero-section');
  if (!heroSection) return;
  
  // Set background image
  heroSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${heroData.backgroundImage})`;
  
  // Update content
  const titleElement = heroSection.querySelector('#hero-title');
  const subtitleElement = heroSection.querySelector('#hero-subtitle');
  const ctaElement = heroSection.querySelector('#hero-cta');
  
  if (titleElement) titleElement.textContent = heroData.title;
  if (subtitleElement) subtitleElement.textContent = heroData.subtitle;
  if (ctaElement) ctaElement.textContent = heroData.buttonText;
}

/**
 * Initialize benefits section
 */
function initBenefits(benefitsData) {
  if (!benefitsData || !benefitsData.items || !benefitsData.items.length) return;
  
  // Set title
  const titleElement = document.querySelector('#benefits-title');
  if (titleElement) titleElement.textContent = benefitsData.title;
  
  // Get container
  const benefitsContainer = document.querySelector('#benefits-container');
  if (!benefitsContainer) return;
  
  // Clear container
  benefitsContainer.innerHTML = '';
  
  // Add visible benefits (first 3)
  const visibleBenefits = benefitsData.items.slice(0, Math.min(3, benefitsData.items.length));
  visibleBenefits.forEach(benefit => {
    benefitsContainer.appendChild(createBenefitCard(benefit));
  });
  
  // Add hidden benefits if there are more than 3
  if (benefitsData.items.length > 3) {
    const hiddenBenefits = benefitsData.items.slice(3);
    const benefitsSection = document.querySelector('#benefits-section');
    
    if (benefitsSection) {
      // Create container for hidden benefits
      const hiddenContainer = document.createElement('div');
      hiddenContainer.id = 'hidden-benefits';
      hiddenContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 hidden overflow-hidden transition-all duration-500 ease-in-out';
      hiddenContainer.setAttribute('aria-hidden', 'true');
      
      // Add hidden benefits to container
      hiddenBenefits.forEach(benefit => {
        hiddenContainer.appendChild(createBenefitCard(benefit));
      });
      
      // Add hidden container to section
      benefitsSection.appendChild(hiddenContainer);
      
      // Add "Show more" button
      const showMoreContainer = document.createElement('div');
      showMoreContainer.className = 'flex justify-center mt-8';
      
      const showMoreButton = document.createElement('button');
      showMoreButton.id = 'show-more-benefits';
      showMoreButton.className = 'flex items-center space-x-2 text-primary hover:text-primary-hover dark:text-primary-dark dark:hover:text-primary-hover font-medium';
      showMoreButton.setAttribute('aria-expanded', 'false');
      showMoreButton.setAttribute('aria-controls', 'hidden-benefits');
      showMoreButton.innerHTML = `
        <span id="show-more-text">+ Show all benefits</span>
        <i class="fas fa-chevron-down transition-transform duration-300"></i>
      `;
      
      // Add click event
      showMoreButton.addEventListener('click', function() {
        const hiddenBenefits = document.querySelector('#hidden-benefits');
        const showMoreText = document.querySelector('#show-more-text');
        const chevron = this.querySelector('i');
        
        if (!hiddenBenefits) return;
        
        const isHidden = hiddenBenefits.classList.contains('hidden');
        
        if (isHidden) {
          // Show hidden benefits
          hiddenBenefits.classList.remove('hidden');
          
          // Get height for animation
          const targetHeight = hiddenBenefits.scrollHeight;
          hiddenBenefits.style.maxHeight = '0';
          hiddenBenefits.style.opacity = '0';
          
          setTimeout(() => {
            hiddenBenefits.style.maxHeight = `${targetHeight}px`;
            hiddenBenefits.style.opacity = '1';
            showMoreText.textContent = '- Show fewer benefits';
            chevron.classList.add('rotate-180');
            showMoreButton.setAttribute('aria-expanded', 'true');
            hiddenBenefits.setAttribute('aria-hidden', 'false');
          }, 10);
        } else {
          // Hide benefits
          hiddenBenefits.style.maxHeight = '0';
          hiddenBenefits.style.opacity = '0';
          
          showMoreText.textContent = '+ Show all benefits';
          chevron.classList.remove('rotate-180');
          showMoreButton.setAttribute('aria-expanded', 'false');
          hiddenBenefits.setAttribute('aria-hidden', 'true');
          
          setTimeout(() => {
            hiddenBenefits.classList.add('hidden');
          }, 500);
        }
      });
      
      showMoreContainer.appendChild(showMoreButton);
      benefitsSection.appendChild(showMoreContainer);
    }
  }
}

/**
 * Create a benefit card
 */
function createBenefitCard(benefit) {
  const card = document.createElement('div');
  card.className = 'bg-white dark:bg-dark-bg-accent p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center';
  
  card.innerHTML = `
    <div class="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center mb-4">
      <i class="fas fa-${benefit.icon} text-2xl text-primary dark:text-primary-dark"></i>
    </div>
    <h3 class="text-xl font-bold mb-2 dark:text-gray-100">${benefit.title}</h3>
    <p class="text-gray-600 dark:text-gray-300">${benefit.description}</p>
  `;
  
  return card;
}

/**
 * Initialize chart section
 */
function initChart(savingsData) {
  if (!savingsData) return;
  
  // Set title and description
  const titleElement = document.querySelector('#savings-title');
  const descriptionElement = document.querySelector('#savings-description');
  
  if (titleElement) titleElement.textContent = savingsData.title;
  if (descriptionElement) descriptionElement.textContent = savingsData.description;
  
  // Get price elements
  const regularPriceElement = document.querySelector('#regular-price-value');
  const passPriceElement = document.querySelector('#pass-price-value');
  const savingsAmountElement = document.querySelector('#savings-amount');
  const savingsPercentageElement = document.querySelector('#savings-percentage');
  
  // Calculate values
  const regularPrice = savingsData.regularPrice;
  const passPrice = savingsData.passPrice;
  const currency = savingsData.currency || '€';
  const savingsAmount = regularPrice - passPrice;
  const savingsPercentage = Math.round((savingsAmount / regularPrice) * 100);
  
  // Update text values
  if (regularPriceElement) regularPriceElement.textContent = `${currency}${regularPrice}`;
  if (passPriceElement) passPriceElement.textContent = `${currency}${passPrice}`;
  if (savingsAmountElement) savingsAmountElement.textContent = `${currency}${savingsAmount}`;
  if (savingsPercentageElement) savingsPercentageElement.textContent = `${savingsPercentage}%`;
  
  // Animate chart bars
  const regularPriceBar = document.querySelector('#regular-price-bar');
  const passPriceBar = document.querySelector('#pass-price-bar');
  
  if (regularPriceBar && passPriceBar) {
    // Calculate height percentages
    const maxPrice = Math.max(regularPrice, passPrice);
    const regularHeightPercent = (regularPrice / maxPrice) * 100;
    const passHeightPercent = (passPrice / maxPrice) * 100;
    
    // Set initial heights
    regularPriceBar.style.height = '0%';
    passPriceBar.style.height = '0%';
    
    // Force browser to process style changes
    void regularPriceBar.offsetHeight;
    
    // Animate to final heights
    setTimeout(() => {
      regularPriceBar.style.height = `${regularHeightPercent}%`;
      passPriceBar.style.height = `${passHeightPercent}%`;
    }, 100);
  }
}

// Track selected option
let selectedOption = null;

/**
 * Initialize purchase options
 */
function initPurchaseOptions(purchaseData) {
  if (!purchaseData || !purchaseData.options || !purchaseData.options.length) return;
  
  // Set title and subtitle
  const titleElement = document.querySelector('#purchase-title');
  const subtitleElement = document.querySelector('#purchase-subtitle');
  
  if (titleElement) titleElement.textContent = purchaseData.title;
  if (subtitleElement) subtitleElement.textContent = purchaseData.subtitle;
  
  // Set button text
  const proceedButton = document.querySelector('#proceed-button');
  if (proceedButton) {
    proceedButton.textContent = purchaseData.buttonText;
    proceedButton.disabled = true;
    proceedButton.addEventListener('click', handleProceedClick);
  }
  
  // Get all option elements
  const optionElements = document.querySelectorAll('.duration-option');
  
  // Update each option with data
  optionElements.forEach((optionElement, index) => {
    if (index < purchaseData.options.length) {
      const option = purchaseData.options[index];
      
      // Get elements
      const durationElement = optionElement.querySelector('.duration-title');
      const priceElement = optionElement.querySelector('.duration-price');
      const priceDetailsElement = optionElement.querySelector('.duration-price-details');
      const featuresList = optionElement.querySelector('.duration-features');
      const popularBadge = optionElement.querySelector('.popular-badge');
      
      // Update content
      if (durationElement) durationElement.textContent = option.duration;
      if (priceElement) priceElement.textContent = `€${option.price}`;
      if (priceDetailsElement) priceDetailsElement.textContent = option.priceDetails;
      
      // Update features list
      if (featuresList && option.features && option.features.length) {
        featuresList.innerHTML = '';
        
        option.features.forEach(feature => {
          const listItem = document.createElement('li');
          listItem.className = 'flex items-start space-x-2 mb-2';
          listItem.innerHTML = `
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>${feature}</span>
          `;
          featuresList.appendChild(listItem);
        });
      }
      
      // Show/hide popular badge
      if (popularBadge) {
        popularBadge.classList.toggle('hidden', !option.popular);
      }
      
      // Set option ID
      optionElement.setAttribute('data-option-id', option.id);
      
      // Add click event
      optionElement.addEventListener('click', function() {
        // Deselect all options
        const allOptions = document.querySelectorAll('.duration-option');
        allOptions.forEach(option => {
          option.classList.remove('border-primary', 'dark:border-primary-dark');
          option.classList.add('border-gray-200', 'dark:border-dark-border');
          option.setAttribute('aria-checked', 'false');
        });
        
        // Select the clicked option
        this.classList.remove('border-gray-200', 'dark:border-dark-border');
        this.classList.add('border-primary', 'dark:border-primary-dark');
        this.setAttribute('aria-checked', 'true');
        
        // Store selected option ID
        selectedOption = this.getAttribute('data-option-id');
        
        // Enable proceed button
        if (proceedButton) {
          proceedButton.disabled = false;
        }
      });
    }
  });
}

/**
 * Handle proceed button click
 */
function handleProceedClick() {
  if (!selectedOption) {
    alert('Please select a duration option');
    return;
  }
  
  alert(`You selected the ${selectedOption} option. Proceeding to checkout...`);
}

/**
 * Render FAQ section
 */
function renderFaq(faqData) {
  if (!faqData || !faqData.items || !faqData.items.length) return;
  
  // Set title
  const titleElement = document.querySelector('#faq-title');
  if (titleElement) titleElement.textContent = faqData.title;
  
  // Get container
  const faqContainer = document.querySelector('#faq-accordion');
  if (!faqContainer) return;
  
  // Clear container
  faqContainer.innerHTML = '';
  
  // Add FAQ items
  faqData.items.forEach((item, index) => {
    const details = document.createElement('details');
    details.id = `faq-${index}`;
    details.className = 'bg-white dark:bg-dark-bg-accent rounded-lg shadow-sm mb-4 group';
    details.setAttribute('data-faq-item', '');
    
    const summary = document.createElement('summary');
    summary.className = 'p-4 font-medium flex items-center justify-between cursor-pointer list-none';
    summary.innerHTML = `
      <span>${item.question}</span>
      <span class="text-primary transition-transform duration-300 group-open:rotate-180">
        <i class="fas fa-chevron-down"></i>
      </span>
    `;
    
    const content = document.createElement('div');
    content.className = 'p-4 pt-0 text-gray-600 dark:text-gray-300';
    content.textContent = item.answer;
    
    details.appendChild(summary);
    details.appendChild(content);
    faqContainer.appendChild(details);
    
    // Add click event to toggle aria-expanded attribute
    summary.addEventListener('click', function() {
      setTimeout(() => {
        this.setAttribute('aria-expanded', details.open ? 'true' : 'false');
      }, 0);
    });
  });
}

/**
 * Set up scroll progress indicator
 */
function setupScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', function() {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
} 