// Sebna S.C - Modern Investment Platform
// Advanced JavaScript functionality with animations and interactivity

// Global Variables
let currentPrice = 125.75;
let priceChart = null;
let performanceChart = null;
let portfolioChart = null;
let newsData = [];
let currentNewsFilter = 'all';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize loading screen
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize counters
    initializeCounters();
    
    // Initialize news
    initializeNews();
    
    // Initialize price updates
    startPriceUpdates();
    
    // Initialize modals
    initializeModals();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Loading Screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Charts Initialization
function initializeCharts() {
    initializePriceChart();
    initializePerformanceChart();
    initializePortfolioChart();
}

function initializePriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;
    
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [{
                label: 'Share Price',
                data: generatePriceData(24),
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#3b82f6',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `ETB ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Performance',
                data: [100, 112, 108, 125, 118, 135],
                borderColor: '#f43b11',
                backgroundColor: 'rgba(244, 59, 17, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f43b11',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#f43b11',
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        color: '#6b7280',
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function initializePortfolioChart() {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;
    
    portfolioChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Education', 'Real Estate', 'Agriculture', 'Other'],
            datasets: [{
                data: [40, 35, 20, 5],
                backgroundColor: [
                    '#3b82f6',
                    '#f43b11',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: '#6b7280'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Helper functions for chart data
function generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
}

function generatePriceData(points) {
    const data = [];
    let basePrice = 120;
    for (let i = 0; i < points; i++) {
        basePrice += (Math.random() - 0.5) * 2;
        data.push(Math.max(100, Math.min(150, basePrice)));
    }
    return data;
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Price Updates
function startPriceUpdates() {
    setInterval(() => {
        updatePrice();
    }, 5000);
}

function updatePrice() {
    const change = (Math.random() - 0.5) * 2;
    const newPrice = Math.max(100, Math.min(150, currentPrice + change));
    const priceChange = ((newPrice - currentPrice) / currentPrice * 100);
    
    currentPrice = newPrice;
    
    // Update price display
    const priceElement = document.getElementById('currentPrice');
    const changeElement = document.getElementById('priceChange');
    
    if (priceElement) {
        priceElement.textContent = currentPrice.toFixed(2);
    }
    
    if (changeElement) {
        changeElement.textContent = (priceChange >= 0 ? '+' : '') + priceChange.toFixed(1) + '%';
        changeElement.className = 'change ' + (priceChange >= 0 ? 'positive' : 'negative');
    }
    
    // Update chart
    if (priceChart) {
        priceChart.data.datasets[0].data.shift();
        priceChart.data.datasets[0].data.push(currentPrice);
        priceChart.data.labels.shift();
        priceChart.data.labels.push(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        priceChart.update('none');
    }
}

// News System
function initializeNews() {
    newsData = [
        {
            id: 1,
            title: "Sebna S.C Announces Major Education Sector Investment",
            excerpt: "New partnership with leading universities to develop educational infrastructure across Tigray region.",
            category: "investment",
            date: "2024-06-07",
            image: "search_images/4u2kdUqkvMAv.jpg"
        },
        {
            id: 2,
            title: "Q2 2024 Financial Results Show Strong Growth",
            excerpt: "Company reports 18% increase in revenue and expanding investor base across Ethiopia.",
            category: "company",
            date: "2024-06-05",
            image: "search_images/3WKayx05pJw1.jpg"
        },
        {
            id: 3,
            title: "Real Estate Market Analysis: Tigray Region Outlook",
            excerpt: "Comprehensive analysis of real estate opportunities and market trends in northern Ethiopia.",
            category: "market",
            date: "2024-06-03",
            image: "search_images/42fr15EGxcLv.jpg"
        },
        {
            id: 4,
            title: "New Banking Partnership with Commercial Bank of Ethiopia",
            excerpt: "Enhanced digital payment solutions and investment services for Sebna shareholders.",
            category: "investment",
            date: "2024-06-01",
            image: "search_images/oMF3X7wxIJ0X.jpg"
        },
        {
            id: 5,
            title: "Agricultural Investment Initiative Launched",
            excerpt: "Supporting local farmers with modern technology and sustainable farming practices.",
            category: "investment",
            date: "2024-05-30",
            image: "search_images/NDWoPWeMGLZ3.jpg"
        },
        {
            id: 6,
            title: "Market Update: Ethiopian Investment Landscape",
            excerpt: "Analysis of current market conditions and opportunities for growth in the region.",
            category: "market",
            date: "2024-05-28",
            image: "search_images/QfyD19FYFhXo.jpeg"
        }
    ];
    
    renderNews();
}

function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    const filteredNews = currentNewsFilter === 'all' 
        ? newsData 
        : newsData.filter(news => news.category === currentNewsFilter);
    
    container.innerHTML = filteredNews.map(news => `
        <article class="news-card" data-aos="fade-up">
            <div class="news-image">
                <img src="${news.image}" alt="${news.title}" loading="lazy">
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-category">${news.category}</span>
                    <span class="news-date">${formatDate(news.date)}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-excerpt">${news.excerpt}</p>
                <a href="#" class="news-link">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `).join('');
}

function filterNews(category) {
    currentNewsFilter = category;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render news
    renderNews();
    
    // Re-initialize AOS for new elements
    AOS.refresh();
}

function loadMoreNews() {
    // Simulate loading more news
    const moreNews = [
        {
            id: 7,
            title: "Sebna S.C Wins Best Investment Company Award",
            excerpt: "Recognition for outstanding performance and commitment to stakeholder value.",
            category: "company",
            date: "2024-05-25",
            image: "search_images/LI6fXIUGroB1.webp"
        },
        {
            id: 8,
            title: "Digital Transformation Initiative Progress Update",
            excerpt: "Latest developments in our technology infrastructure and digital services.",
            category: "company",
            date: "2024-05-22",
            image: "search_images/4AHnJj4R9B2d.png"
        }
    ];
    
    newsData = [...newsData, ...moreNews];
    renderNews();
    AOS.refresh();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Modal System
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openInvestmentModal() {
    const modal = document.getElementById('investment-modal');
    if (!modal) return;
    
    // Populate modal content
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="investment-tabs">
            <button class="tab-btn active" onclick="switchTab('buy-shares')">Buy Shares</button>
            <button class="tab-btn" onclick="switchTab('portfolio')">My Portfolio</button>
            <button class="tab-btn" onclick="switchTab('history')">Transaction History</button>
        </div>
        
        <div id="buy-shares" class="tab-content active">
            <div class="price-info">
                <div class="current-price">
                    <span class="label">Current Price:</span>
                    <span class="value">ETB ${currentPrice.toFixed(2)} <span class="change positive">+2.8%</span></span>
                </div>
            </div>
            
            <form class="investment-form" onsubmit="processInvestment(event)">
                <div class="form-group">
                    <label for="investment-amount">Investment Amount (ETB)</label>
                    <input type="number" id="investment-amount" min="1000" step="100" placeholder="Minimum 1,000 ETB" required>
                    <small>Shares to purchase: <span id="shares-count">0</span></small>
                </div>
                
                <div class="form-group">
                    <label for="payment-method">Payment Method</label>
                    <select id="payment-method" required>
                        <option value="">Select Payment Method</option>
                        <option value="cbe">Commercial Bank of Ethiopia</option>
                        <option value="dashen">Dashen Bank</option>
                        <option value="awash">Awash Bank</option>
                        <option value="nib">NIB International Bank</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="account-number">Account Number</label>
                    <input type="text" id="account-number" placeholder="Enter your account number" required>
                </div>
                
                <div class="investment-summary">
                    <div class="summary-row">
                        <span>Investment Amount:</span>
                        <span id="summary-amount">ETB 0</span>
                    </div>
                    <div class="summary-row">
                        <span>Transaction Fee (2%):</span>
                        <span id="summary-fee">ETB 0</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total Amount:</span>
                        <span id="summary-total">ETB 0</span>
                    </div>
                </div>
                
                <button type="submit" class="btn-primary btn-large">
                    <i class="fas fa-credit-card"></i>
                    Proceed to Payment
                </button>
            </form>
        </div>
        
        <div id="portfolio" class="tab-content">
            <div class="portfolio-summary">
                <div class="portfolio-card">
                    <h4>Total Shares</h4>
                    <p class="portfolio-value">1,250</p>
                </div>
                <div class="portfolio-card">
                    <h4>Current Value</h4>
                    <p class="portfolio-value">ETB 156,875</p>
                </div>
                <div class="portfolio-card">
                    <h4>Total Return</h4>
                    <p class="portfolio-value positive">+25.5%</p>
                </div>
            </div>
        </div>
        
        <div id="history" class="tab-content">
            <div class="transaction-list">
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-type">Purchase</span>
                        <span class="transaction-date">2024-05-15</span>
                    </div>
                    <div class="transaction-details">
                        <span class="transaction-amount">500 shares</span>
                        <span class="transaction-value">ETB 62,500</span>
                    </div>
                </div>
                <div class="transaction-item">
                    <div class="transaction-info">
                        <span class="transaction-type">Purchase</span>
                        <span class="transaction-date">2024-04-20</span>
                    </div>
                    <div class="transaction-details">
                        <span class="transaction-amount">750 shares</span>
                        <span class="transaction-value">ETB 93,750</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Add event listeners for investment calculation
    const amountInput = document.getElementById('investment-amount');
    if (amountInput) {
        amountInput.addEventListener('input', calculateInvestment);
    }
}

function openLoginModal() {
    const modal = document.getElementById('login-modal');
    if (!modal) return;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
        <form class="login-form" onsubmit="processLogin(event)">
            <div class="form-group">
                <label for="login-email">Email Address</label>
                <input type="email" id="login-email" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" id="login-password" placeholder="Enter your password" required>
            </div>
            
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" id="remember-me">
                    <span class="checkmark"></span>
                    Remember me
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" class="btn-primary btn-large">
                <i class="fas fa-sign-in-alt"></i>
                Sign In
            </button>
            
            <div class="login-divider">
                <span>or</span>
            </div>
            
            <button type="button" class="btn-outline btn-large" onclick="showRegisterForm()">
                <i class="fas fa-user-plus"></i>
                Create New Account
            </button>
        </form>
    `;
    
    modal.classList.add('active');
}

function closeInvestmentModal() {
    const modal = document.getElementById('investment-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Investment Functions
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function calculateInvestment() {
    const amount = parseFloat(document.getElementById('investment-amount').value) || 0;
    const shares = Math.floor(amount / currentPrice);
    const fee = amount * 0.02;
    const total = amount + fee;
    
    document.getElementById('shares-count').textContent = shares.toLocaleString();
    document.getElementById('summary-amount').textContent = `ETB ${amount.toLocaleString()}`;
    document.getElementById('summary-fee').textContent = `ETB ${fee.toLocaleString()}`;
    document.getElementById('summary-total').textContent = `ETB ${total.toLocaleString()}`;
}

function processInvestment(event) {
    event.preventDefault();
    
    // Simulate investment processing
    showNotification('Investment order submitted successfully! You will receive a confirmation email shortly.', 'success');
    closeInvestmentModal();
}

function processLogin(event) {
    event.preventDefault();
    
    // Simulate login processing
    showNotification('Login successful! Welcome back to Sebna.', 'success');
    closeLoginModal();
}

// Contact Form
function submitContactForm(event) {
    event.preventDefault();
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
    event.target.reset();
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance Monitoring
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        });
    }
}

// Initialize performance tracking
trackPagePerformance();

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

