/**
 * CMS Content Loader
 * Dynamically loads content from CMS data files and renders it in the DOM
 */

// Configuration
const CMS_CONFIG = {
  baseDir: '_content',
  dataDir: 'data'
};

/**
 * Load JSON data from a file
 */
async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', error);
    return null;
  }
}

/**
 * Load YAML data from a file (requires js-yaml library)
 */
async function loadYAML(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    const text = await response.text();
    // If js-yaml is available, parse YAML; otherwise, return raw text
    if (typeof jsyaml !== 'undefined') {
      return jsyaml.load(text);
    }
    console.warn('js-yaml not loaded. Install it for YAML support.');
    return null;
  } catch (error) {
    console.error('Error loading YAML:', error);
    return null;
  }
}

/**
 * Load and render header navigation from CMS
 */
async function renderHeader() {
  const config = await loadJSON(`${CMS_CONFIG.dataDir}/config.json`);
  if (!config) return;

  const headerHTML = `
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">
        <div class="logo">
          <a href="/" aria-label="${config.site.name} - Home">
            <svg class="logo-icon" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
              <rect width="40" height="40" rx="8" fill="#0066cc"/>
              <path d="M12 28l6-10 4 6 8-14" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="logo-text">APV</span>
          </a>
        </div>
        
        <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-menu">
          <span class="hamburger"></span>
        </button>

        <ul class="nav-menu" id="nav-menu" role="menubar">
          <li role="none"><a href="#images" class="nav-link" role="menuitem">Images</a></li>
          <li role="none"><a href="#videos" class="nav-link" role="menuitem">Videos</a></li>
          <li role="none"><a href="#aerials" class="nav-link" role="menuitem">Aerials</a></li>
          <li role="none"><a href="/book-service.html" class="nav-link" role="menuitem">Book a Service</a></li>
          <li role="none"><a href="#about" class="nav-link" role="menuitem">About</a></li>
          <li role="none"><a href="/contact.html" class="nav-link" role="menuitem">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;

  const headerContainer = document.getElementById('header-container');
  if (headerContainer) headerContainer.innerHTML = headerHTML;
}

/**
 * Load and render hero section from CMS
 */
async function renderHeroSection() {
  const heroData = await loadYAML(`${CMS_CONFIG.baseDir}/sections/hero.yml`);
  if (!heroData) return;

  const heroHTML = `
    <div class="hero-content">
      <h1 class="hero-title">${heroData.title}</h1>
      <p class="hero-subtitle">${heroData.subtitle}</p>
      <div class="hero-buttons">
        <a href="${heroData.primary_cta_link}" class="btn btn-primary" aria-label="Browse stock photography collections">${heroData.primary_cta_text}</a>
        <a href="${heroData.secondary_cta_link}" class="btn btn-secondary" aria-label="Get in touch with us">${heroData.secondary_cta_text}</a>
      </div>
    </div>
    <div class="hero-image" role="img" aria-label="African landscape photography" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
  `;

  const heroSection = document.getElementById('hero-section');
  if (heroSection) heroSection.innerHTML = heroHTML;
}

/**
 * Load and render photographer section from CMS
 */
async function renderPhotographerSection() {
  const photoData = await loadYAML(`${CMS_CONFIG.baseDir}/sections/photographer.yml`);
  if (!photoData) return;

  const statsHTML = photoData.stats
    .map(stat => `
      <div class="stat">
        <span class="stat-number">${stat.value}</span>
        <span class="stat-label">${stat.label}</span>
      </div>
    `)
    .join('');

  const photographerHTML = `
    <div class="container">
      <div class="photographer-content">
        <div class="photographer-image" role="img" aria-label="${photoData.photographer_name}, award-winning photographer" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);"></div>
        <div class="photographer-info">
          <h2>${photoData.title}</h2>
          <h3>${photoData.photographer_name}</h3>
          <p>${photoData.bio}</p>
          <div class="photographer-stats">
            ${statsHTML}
          </div>
        </div>
      </div>
    </div>
  `;

  const photoSection = document.getElementById('photographer-section');
  if (photoSection) photoSection.innerHTML = photographerHTML;
}

/**
 * Load and render categories section from CMS
 */
async function renderCategoriesSection() {
  // Load all category files
  const categoryFiles = [
    'transportation', 'market', 'lifestyle', 'aerial', 'technology', 'food',
    'nature', 'backgrounds', 'festivals', 'people', 'business', 'corporate',
    'religion', 'travel', 'landmarks', 'editorial'
  ];

  const categories = [];
  for (const categoryName of categoryFiles) {
    const category = await loadYAML(`${CMS_CONFIG.baseDir}/categories/${categoryName}.yml`);
    if (category) categories.push(category);
  }

  const categoriesHTML = categories
    .map(cat => `
      <article class="category-card" role="region" aria-label="${cat.name} category">
        <div class="category-image" role="img" aria-label="African ${cat.name.toLowerCase()}" style="background: ${cat.gradient};"></div>
        <div class="category-info">
          <h3><a href="${cat.link}">${cat.name}</a></h3>
          <p>${cat.description}</p>
          <span class="image-count">${cat.image_count}</span>
        </div>
      </article>
    `)
    .join('');

  const categoriesSection = `
    <div class="container">
      <div class="section-header">
        <h2>Featured Categories</h2>
        <p>Explore our curated collections of authentic African content</p>
      </div>
      <div class="categories-grid">
        ${categoriesHTML}
      </div>
    </div>
  `;

  const section = document.getElementById('categories-section');
  if (section) section.innerHTML = categoriesSection;
}

/**
 * Load and render portfolio section from CMS
 */
async function renderPortfolioSection() {
  const portfolioFiles = ['getty-images', 'adobe-stock', 'shutterstock', 'pond5'];
  const portfolios = [];

  for (const portfolioName of portfolioFiles) {
    const portfolio = await loadYAML(`${CMS_CONFIG.baseDir}/portfolio/${portfolioName}.yml`);
    if (portfolio) portfolios.push(portfolio);
  }

  const portfolioHTML = portfolios
    .map(port => `
      <article class="portfolio-card" role="region" aria-label="${port.name} portfolio">
        <div class="portfolio-logo" role="img" aria-label="${port.name}" style="background: ${port.gradient};">
          <span class="logo-text">${port.name}</span>
        </div>
        <h3>${port.name}</h3>
        <p>${port.description}</p>
        <a href="${port.url}" class="btn btn-small" target="_blank" rel="noopener noreferrer">View Portfolio</a>
      </article>
    `)
    .join('');

  const portfolioSection = `
    <div class="container">
      <div class="section-header">
        <h2>Featured Portfolio</h2>
        <p>Access our content through leading global stock photography agencies</p>
      </div>
      <div class="portfolio-grid">
        ${portfolioHTML}
      </div>
    </div>
  `;

  const section = document.getElementById('portfolio-section');
  if (section) section.innerHTML = portfolioSection;
}

/**
 * Load and render why choose section (static content for now)
 */
function renderWhyChooseSection() {
  const whyChooseHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Why Choose African Photos and Videos?</h2>
        <p>Professional quality content, authentic representation, and trusted licensing</p>
      </div>
      <div class="benefits-grid">
        <article class="benefit-card" role="region" aria-label="Authentic African content">
          <div class="benefit-icon" aria-hidden="true">🌍</div>
          <h3>Authentic African Content</h3>
          <p>Genuine representation of African culture, landscapes, and communities captured by native photographers.</p>
        </article>
        <article class="benefit-card" role="region" aria-label="Professional quality">
          <div class="benefit-icon" aria-hidden="true">✨</div>
          <h3>Professional Quality</h3>
          <p>High-resolution, technically superior imagery meeting international editorial and commercial standards.</p>
        </article>
        <article class="benefit-card" role="region" aria-label="Commercial and editorial licensing">
          <div class="benefit-icon" aria-hidden="true">📄</div>
          <h3>Commercial & Editorial Licensing</h3>
          <p>Flexible licensing options through trusted global platforms for diverse project requirements.</p>
        </article>
        <article class="benefit-card" role="region" aria-label="High resolution images">
          <div class="benefit-icon" aria-hidden="true">🔍</div>
          <h3>High Resolution</h3>
          <p>4K to 8K imagery and footage suitable for print, digital, and broadcast applications.</p>
        </article>
        <article class="benefit-card" role="region" aria-label="Drone photography">
          <div class="benefit-icon" aria-hidden="true">🚁</div>
          <h3>Drone Photography</h3>
          <p>Unique aerial perspectives of African landscapes, cities, and natural environments.</p>
        </article>
        <article class="benefit-card" role="region" aria-label="Trusted global platforms">
          <div class="benefit-icon" aria-hidden="true">🌐</div>
          <h3>Trusted Global Platforms</h3>
          <p>Content licensed through Getty Images, Adobe Stock, Shutterstock, and Pond5.</p>
        </article>
      </div>
    </div>
  `;

  const section = document.getElementById('why-choose-section');
  if (section) section.innerHTML = whyChooseHTML;
}

/**
 * Load and render footer from CMS
 */
async function renderFooter() {
  const config = await loadJSON(`${CMS_CONFIG.dataDir}/config.json`);
  if (!config) return;

  const footerHTML = `
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul role="list">
            <li><a href="/">Home</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contact.html">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Categories</h4>
          <ul role="list">
            <li><a href="/categories/people.html">People</a></li>
            <li><a href="/categories/nature.html">Nature</a></li>
            <li><a href="/categories/business.html">Business</a></li>
            <li><a href="/categories/travel.html">Travel</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Portfolio Links</h4>
          <ul role="list">
            ${config.portfolioLinks.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a></li>`).join('')}
          </ul>
        </div>

        <div class="footer-section">
          <h4>Follow Us</h4>
          <ul class="social-links" role="list">
            <li><a href="${config.social.instagram}" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="${config.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="${config.social.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 ${config.site.name}. All rights reserved.</p>
        <ul class="footer-legal" role="list">
          <li><a href="/privacy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms of Service</a></li>
          <li><a href="/sitemap.xml">Sitemap</a></li>
        </ul>
      </div>
    </div>
  `;

  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) footerContainer.innerHTML = footerHTML;

  // Update structured data
  updateStructuredData(config);
}

/**
 * Update structured data schemas
 */
function updateStructuredData(config) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": config.site.name,
    "url": config.site.url,
    "description": config.site.description,
    "contact": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "url": config.site.url + "/contact.html"
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": config.site.author,
    "url": config.site.url,
    "jobTitle": "Photographer and Videographer",
    "description": "Award-winning photographer and videographer specializing in authentic African content"
  };

  document.getElementById('org-schema').textContent = JSON.stringify(orgSchema);
  document.getElementById('person-schema').textContent = JSON.stringify(personSchema);
}

/**
 * Initialize all CMS content loading
 */
async function initializeCMS() {
  await renderHeader();
  await renderHeroSection();
  await renderPhotographerSection();
  await renderCategoriesSection();
  await renderPortfolioSection();
  renderWhyChooseSection();
  // Additional sections (whats-new, blog, newsletter) can be added similarly
  await renderFooter();
}

// Load CMS content when DOM is ready
document.addEventListener('DOMContentLoaded', initializeCMS);
