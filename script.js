// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message
                const originalButton = this.querySelector('button');
                const originalText = originalButton.textContent;
                originalButton.textContent = 'Subscribed!';
                originalButton.style.background = '#4caf50';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    originalButton.textContent = originalText;
                    originalButton.style.background = '';
                    this.reset();
                }, 2000);
            }
        });
    }

    // Lazy Loading for Images
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Analytics Event Tracking
    trackPortfolioLinks();
});

// Portfolio Link Click Tracking
function trackPortfolioLinks() {
    const portfolioLinks = document.querySelectorAll('a[href*="gettyimages.com"], a[href*="adobe.com"], a[href*="shutterstock.com"], a[href*="pond5.com"]');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.href.split('/')[2].split('.')[0].toUpperCase();
            if (window.gtag) {
                gtag('event', 'portfolio_click', {
                    'platform': platform
                });
            }
        });
    });
}

// Dark Mode Toggle (optional enhancement)
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
}

// Performance: Defer non-critical JavaScript
window.addEventListener('load', function() {
    // Additional analytics or tracking can be loaded here
    console.log('Page fully loaded');
});
