import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Chart from 'chart.js/auto';
import { Button } from '@/components';

const SebnaLanding = () => {
  const navigate = useNavigate();
  const [currentPrice, setCurrentPrice] = useState(125.75);
  const [priceChange, setPriceChange] = useState(2.8);
  const [priceChart, setPriceChart] = useState(null);
  const [performanceChart, setPerformanceChart] = useState(null);
  const [portfolioChart, setPortfolioChart] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all');
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize AOS animations with mobile optimizations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: isMobile ? true : false, // Only animate once on mobile for performance
      offset: isMobile ? 50 : 100,
      mirror: !isMobile,
      disable: window.innerWidth < 768 ? false : false, // Keep enabled for all sizes
    });

    // Hide loading screen faster on mobile
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, isMobile ? 1500 : 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Refresh AOS on scroll for persistent animations
  useEffect(() => {
    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize charts with mobile responsive settings
  useEffect(() => {
    if (!showLoadingScreen) {
      initializePriceChart();
      initializePerformanceChart();
      initializePortfolioChart();
    }
  }, [showLoadingScreen]);

  // Price chart with mobile optimizations
  const initializePriceChart = () => {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, isMobile ? 150 : 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

    if (priceChart) priceChart.destroy();

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: generateTimeLabels(isMobile ? 12 : 24),
        datasets: [
          {
            label: 'Share Price',
            data: generatePriceData(isMobile ? 12 : 24),
            borderColor: '#3b82f6',
            backgroundColor: gradient,
            borderWidth: isMobile ? 2 : 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: isMobile ? 4 : 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: !isMobile,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });

    setPriceChart(chart);
  };

  // Performance chart with mobile optimizations
  const initializePerformanceChart = () => {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    if (performanceChart) performanceChart.destroy();

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Performance',
            data: [100, 112, 108, 125, 118, 135],
            borderColor: '#f43b11',
            backgroundColor: 'rgba(244, 59, 17, 0.1)',
            borderWidth: isMobile ? 2 : 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#f43b11',
            pointBorderColor: '#ffffff',
            pointBorderWidth: isMobile ? 1 : 2,
            pointRadius: isMobile ? 3 : 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: !isMobile,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#f43b11',
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { 
              color: '#6b7280',
              font: {
                size: isMobile ? 10 : 12
              }
            },
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { 
              color: '#6b7280',
              font: {
                size: isMobile ? 10 : 12
              }
            },
          },
        },
      },
    });

    setPerformanceChart(chart);
  };

  // Portfolio chart with mobile optimizations
  const initializePortfolioChart = () => {
    const ctx = document.getElementById('portfolioChart');
    if (!ctx) return;

    if (portfolioChart) portfolioChart.destroy();

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Education', 'Real Estate', 'Agriculture', 'Other'],
        datasets: [
          {
            data: [40, 35, 20, 5],
            backgroundColor: ['#3b82f6', '#f43b11', '#10b981', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: isMobile ? 5 : 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              padding: isMobile ? 10 : 20, 
              usePointStyle: true, 
              color: '#6b7280',
              font: {
                size: isMobile ? 10 : 12
              }
            },
          },
          tooltip: {
            enabled: !isMobile,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        cutout: isMobile ? '50%' : '60%',
      },
    });

    setPortfolioChart(chart);
  };

  // Helper functions
  const generateTimeLabels = (hours) => {
    const labels = [];
    const now = new Date();
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: isMobile ? true : false
      }));
    }
    return labels;
  };

  const generatePriceData = (points) => {
    const data = [];
    let basePrice = 120;
    for (let i = 0; i < points; i++) {
      basePrice += (Math.random() - 0.5) * 2;
      data.push(Math.max(100, Math.min(150, basePrice)));
    }
    return data;
  };

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // News data
  const newsData = [
    {
      id: 1,
      title: 'Sebna S.C Announces Major Education Sector Investment',
      excerpt: 'New partnership with leading universities to develop educational infrastructure across Tigray region.',
      category: 'investment',
      date: '2024-06-07',
      image: '/search_images/4u2kdUqkvMAv.jpg',
    },
    {
      id: 2,
      title: 'Q2 2024 Financial Results Show Strong Growth',
      excerpt: 'Company reports 18% increase in revenue and expanding investor base across Ethiopia.',
      category: 'company',
      date: '2024-06-05',
      image: '/search_images/3WKayx05pJw1.jpg',
    },
    {
      id: 3,
      title: 'Real Estate Market Analysis: Tigray Region Outlook',
      excerpt: 'Comprehensive analysis of real estate opportunities and market trends in northern Ethiopia.',
      category: 'market',
      date: '2024-06-03',
      image: '/search_images/42fr15EGxcLv.jpg',
    },
    {
      id: 4,
      title: 'New Banking Partnership with Commercial Bank of Ethiopia',
      excerpt: 'Enhanced digital payment solutions and investment services for Sebna shareholders.',
      category: 'investment',
      date: '2024-06-01',
      image: '/search_images/oMF3X7wxIJ0X.jpg',
    },
  ];

  const filteredNews = newsFilter === 'all' ? newsData : newsData.filter((n) => n.category === newsFilter);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Loading Screen */}
      {showLoadingScreen && (
        <div className="fixed inset-0 bg-gradient-to-r from-blue-900 to-orange-600 flex items-center justify-center z-[9999]">
          <div className="text-center text-white">
            <div className="text-4xl md:text-6xl font-bold mb-4">Sebna</div>
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg md:text-xl">Loading Sebna Platform...</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-md border-b border-blue-900 border-opacity-10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="text-xl md:text-2xl font-bold text-blue-900">Sebna</div>
            <div className="hidden md:flex gap-4 lg:gap-6">
              {['home', 'about', 'services', 'investment', 'banking', 'news', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-gray-600 hover:text-blue-900 font-medium transition-colors text-sm lg:text-base capitalize"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mobile-menu-button"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-600 text-lg`}></i>
            </button>
            
            <div className="hidden md:flex gap-3">
              <button className="p-2 hover:bg-blue-900 hover:bg-opacity-10 rounded-lg transition-colors">
                <i className="fas fa-user text-gray-600"></i>
              </button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth/sign-in')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/dashboard/home')}
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
            </div>
            
            {/* Mobile only auth buttons */}
            <div className="md:hidden flex gap-2">
              <Button 
                variant="outline" 
                size="xs"
                onClick={() => navigate('/auth/sign-in')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg mobile-menu">
            <div className="px-4 py-3 space-y-1">
              {['home', 'about', 'services', 'investment', 'banking', 'news', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-lg transition-colors font-medium capitalize"
                >
                  {item}
                </button>
              ))}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard/home');
                  }}
                  className="w-full justify-center"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 md:pt-32 pb-12 md:pb-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 md:top-20 left-4 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 md:top-40 right-4 md:right-10 w-48 md:w-72 h-48 md:h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Hero Content */}
            <div data-aos="fade-up">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 md:px-4 md:py-2 rounded-full mb-4 md:mb-6 text-sm md:text-base">
                <i className="fas fa-star text-xs md:text-sm"></i>
                <span className="font-semibold">Trusted by 10,000+ Investors</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                You are the <span className="bg-gradient-to-r from-blue-900 to-orange-600 bg-clip-text text-transparent">epicenter</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                Empowering shared investment, enabling shared growth. Join Sebna and be part of Tigray's leading platform for collaborative growth and sustainable prosperity.
              </p>

              {/* Stats - Mobile optimized */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6 md:mb-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">15,000</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Active Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">250M</div>
                  <div className="text-gray-500 text-xs sm:text-sm">ETB Invested</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">45</div>
                  <div className="text-gray-500 text-xs sm:text-sm">Projects Funded</div>
                </div>
              </div>

              {/* Buttons - Mobile optimized */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="bg-gradient-to-r from-blue-900 to-orange-600 text-white px-6 py-3 md:px-8 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                  <i className="fas fa-rocket"></i>
                  Start Investing Today
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="border-2 border-blue-900 text-blue-900 px-6 py-3 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <i className="fas fa-play"></i>
                  Watch Our Story
                </button>
              </div>
            </div>

            {/* Hero Visual - Price Card */}
            <div data-aos="fade-left" className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-4 md:p-6 lg:p-8 animate-float">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="flex items-center gap-2 text-base md:text-lg font-semibold text-gray-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live Share Price
                  </h3>
                  <button className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-sync-alt text-gray-500"></i>
                  </button>
                </div>

                <div className="text-center mb-4 md:mb-6">
                  <span className="text-gray-500 text-base md:text-lg">ETB</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mx-2">{currentPrice.toFixed(2)}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 md:px-3 md:py-1 rounded-lg text-xs md:text-sm font-semibold">+{priceChange.toFixed(1)}%</span>
                </div>

                <div className="h-40 sm:h-48 mb-4 md:mb-6">
                  <canvas id="priceChart"></canvas>
                </div>

                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">24h High</div>
                    <div className="font-semibold text-gray-800">ETB 127.50</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">24h Low</div>
                    <div className="font-semibold text-gray-800">ETB 123.20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">About Sebna</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Breaking the Cycle of Broken Promises</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Sebna is a new share company based in Tigray, entering diverse sectors like education and real estate. Unlike previous share companies that made promises and failed, Sebna is committed to delivering results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Features */}
            <div data-aos="fade-right" className="space-y-4 md:space-y-6">
              {[
                {
                  icon: 'fa-chart-line',
                  title: 'Diverse Sectors',
                  desc: 'Strategic investments across education and real estate sectors, creating multiple revenue streams and growth opportunities.',
                },
                {
                  icon: 'fa-shield-alt',
                  title: 'Proven Commitment',
                  desc: 'All registration documentation finalized. We\'re ready to deliver on our promises where others have failed.',
                },
                {
                  icon: 'fa-users',
                  title: 'Community Focused',
                  desc: 'Sebna means "our people" in Tigrinya. We prioritize our buyers, employees, and stakeholders above all.',
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-900 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${feature.icon} text-white text-lg md:text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">{feature.title}</h3>
                    <p className="text-sm md:text-base text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Images - Mobile optimized */}
            <div data-aos="fade-left" className="relative mt-8 lg:mt-0">
              <img 
                src="/search_images/3WKayx05pJw1.jpg" 
                alt="Business Meeting" 
                className="w-full rounded-xl shadow-lg" 
                loading="lazy"
              />
              <img
                src="/search_images/oMF3X7wxIJ0X.jpg"
                alt="Office Building"
                className="hidden md:block absolute -bottom-6 -right-6 w-32 h-28 lg:w-48 lg:h-40 rounded-xl shadow-lg border-4 border-white"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-900 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div data-aos="fade-up" className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <i className="fas fa-bullseye text-2xl md:text-3xl"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Our Mission</h3>
              <p className="text-base md:text-lg opacity-90">Empowering shared investment, enabling shared growth.</p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <i className="fas fa-eye text-2xl md:text-3xl"></i>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Vision 2035</h3>
              <p className="text-base md:text-lg opacity-90">To be the leading platform for collaborative growth in Tigray.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Our Values</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">The SEBNA Values</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision and action we take, ensuring we deliver on our promises.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {[
              { letter: 'S', title: 'Sincerity', icon: 'fa-handshake', delay: '0' },
              { letter: 'E', title: 'Excellence', icon: 'fa-trophy', delay: '100' },
              { letter: 'B', title: 'Bravery', icon: 'fa-shield-alt', delay: '200' },
              { letter: 'N', title: 'Neutrality', icon: 'fa-balance-scale', delay: '300' },
              { letter: 'A', title: 'Adaptability', icon: 'fa-sync-alt', delay: '400' },
            ].map((value, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={value.delay} className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-6 text-center hover:shadow-md md:hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <i className={`fas ${value.icon} text-blue-900 text-lg md:text-2xl`}></i>
                </div>
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-blue-900 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <span className="text-white font-bold text-sm md:text-lg">{value.letter}</span>
                </div>
                <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Our Services</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Investment Opportunities</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse portfolio of investment opportunities across key sectors in Tigray.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                image: '/search_images/4u2kdUqkvMAv.jpg',
                icon: 'fa-graduation-cap',
                title: 'Education Sector',
                desc: 'Investing in the future through educational infrastructure, technology, and human capital development.',
                roi: '15-20%',
                risk: 'Low',
                delay: '100',
              },
              {
                image: '/search_images/42fr15EGxcLv.jpg',
                icon: 'fa-building',
                title: 'Real Estate',
                desc: 'Strategic real estate investments in residential, commercial, and mixed-use developments across Tigray.',
                roi: '12-18%',
                risk: 'Medium',
                delay: '200',
              },
              {
                image: '/search_images/NDWoPWeMGLZ3.jpg',
                icon: 'fa-seedling',
                title: 'Agriculture',
                desc: 'Sustainable agricultural investments leveraging Tigray\'s fertile lands and traditional farming expertise.',
                roi: '10-15%',
                risk: 'Medium',
                delay: '300',
              },
            ].map((service, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={service.delay} className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm md:shadow-md hover:shadow-lg md:hover:shadow-xl transition-shadow">
                <div className="relative h-40 md:h-48 overflow-hidden group">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-blue-900 bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-300">
                    <button className="bg-gradient-to-r from-blue-900 to-orange-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm md:text-base">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-900 to-orange-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    <i className={`fas ${service.icon} text-white text-base md:text-xl`}></i>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{service.desc}</p>
                  <div className="flex justify-between text-xs md:text-sm">
                    <div>
                      <span className="text-gray-500">ROI</span>
                      <div className="font-semibold text-gray-900">{service.roi}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk</span>
                      <div className={`font-semibold ${service.risk === 'Low' ? 'text-green-600' : 'text-yellow-600'}`}>{service.risk}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Dashboard */}
      <section id="investment" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Live Dashboard</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Investment Performance</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time insights into our investment performance and market trends.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 lg:p-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Share Performance</h3>
              <div className="h-48 md:h-64">
                <canvas id="performanceChart"></canvas>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200" className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 lg:p-8">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Portfolio Distribution</h3>
              <div className="h-48 md:h-64">
                <canvas id="portfolioChart"></canvas>
              </div>
            </div>
          </div>

          {/* Metrics - Mobile optimized */}
          <div data-aos="fade-up" data-aos-delay="300" className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              { icon: 'fa-chart-line', value: 'ETB 125.75', label: 'Current Share Price', change: '+2.8%' },
              { icon: 'fa-wallet', value: 'ETB 250M', label: 'Total Investment', change: '+15.2%' },
              { icon: 'fa-users', value: '15,247', label: 'Active Investors', change: '+8.3%' },
              { icon: 'fa-percentage', value: '16.8%', label: 'Average ROI', change: '+1.2%' },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-900 to-orange-600 rounded-lg flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                  <i className={`fas ${metric.icon} text-white text-sm md:text-base lg:text-xl`}></i>
                </div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-xs md:text-sm text-gray-500 mb-1 md:mb-2">{metric.label}</div>
                <div className="text-xs md:text-sm text-green-600 font-semibold">{metric.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banking Partners */}
      <section id="banking" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Banking Partners</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Trusted Financial Partners</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Seamless integration with Ethiopia's leading banks for secure and convenient transactions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[
              {
                image: '/search_images/oMF3X7wxIJ0X.jpg',
                name: 'Commercial Bank',
                fullName: 'Commercial Bank of Ethiopia',
                desc: 'Ethiopia\'s largest bank with nationwide coverage and digital banking solutions.',
                features: ['Mobile Banking', 'Online Transfer', '24/7 Support'],
                delay: '100',
              },
              {
                image: '/search_images/vCjGSjoXohCH.png',
                name: 'Dashen Bank',
                fullName: 'Dashen Bank',
                desc: 'Leading private bank known for innovation and customer service excellence.',
                features: ['Digital Wallet', 'Quick Transfer', 'Investment Advisory'],
                delay: '200',
              },
              {
                image: '/search_images/yWqmB1gqtEEQ.jpg',
                name: 'Awash Bank',
                fullName: 'Awash Bank',
                desc: 'Pioneering private bank with comprehensive financial services and modern technology.',
                features: ['Internet Banking', 'SMS Banking', 'Corporate Services'],
                delay: '300',
              },
              {
                image: '/search_images/GE0ArumTXX7m.png',
                name: 'NIB Bank',
                fullName: 'NIB International Bank',
                desc: 'International banking services with focus on trade finance and foreign exchange.',
                features: ['Foreign Exchange', 'Trade Finance', 'International Transfer'],
                delay: '400',
              },
            ].map((bank, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={bank.delay} className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 lg:p-6 text-center hover:shadow-md md:hover:shadow-lg transition-shadow">
                <div className="w-16 h-14 md:w-20 md:h-16 lg:w-24 lg:h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <img 
                    src={bank.image} 
                    alt={bank.name} 
                    className="max-w-full max-h-full object-contain p-1"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                  <span className="md:hidden">{bank.name}</span>
                  <span className="hidden md:inline">{bank.fullName}</span>
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 line-clamp-2">{bank.desc}</p>
                <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                  {bank.features.map((feature, fidx) => (
                    <span key={fidx} className="bg-blue-100 text-blue-900 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-semibold">
                      {isMobile && fidx < 2 ? feature.split(' ')[0] : feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Latest News</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Stay Updated</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Get the latest updates on our investments, market insights, and company developments.
            </p>
          </div>

          {/* Filters - Mobile scrollable */}
          <div data-aos="fade-up" className="flex gap-2 md:gap-3 justify-start md:justify-center mb-6 md:mb-12 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['all', 'investment', 'market', 'company'].map((filter) => (
              <button
                key={filter}
                onClick={() => setNewsFilter(filter)}
                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-lg font-semibold transition-all whitespace-nowrap text-sm md:text-base ${
                  newsFilter === filter
                    ? 'bg-blue-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} News
              </button>
            ))}
          </div>

          {/* News Grid - Mobile optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {filteredNews.map((news, idx) => (
              <div key={news.id} data-aos="fade-up" className="bg-white border border-gray-200 rounded-lg md:rounded-xl overflow-hidden hover:shadow-md md:hover:shadow-lg transition-shadow">
                <div className="h-32 md:h-40 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <span className="bg-gradient-to-r from-blue-900 to-orange-600 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-semibold">
                      {news.category}
                    </span>
                    <span className="text-gray-500 text-xs">{news.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 line-clamp-2 text-sm md:text-base">{news.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">{news.excerpt}</p>
                  <a href="#" className="text-blue-900 font-semibold text-xs md:text-sm hover:text-orange-600 transition-colors flex items-center gap-1">
                    Read More <i className="fas fa-arrow-right text-xs"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="border-2 border-blue-900 text-blue-900 px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-all flex items-center gap-2 mx-auto text-sm md:text-base">
              <i className="fas fa-plus"></i>
              Load More News
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-16" data-aos="fade-up">
            <div className="inline-block bg-blue-100 text-blue-900 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">Get In Touch</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Contact Us</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to start your investment journey? Get in touch with our expert team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Info */}
            <div data-aos="fade-right" className="space-y-4 md:space-y-6">
              {[
                { icon: 'fa-map-marker-alt', title: 'Visit Our Office', content: 'Mekelle, Tigray, Ethiopia\nNear Commercial Bank Building' },
                { icon: 'fa-phone', title: 'Call Us', content: '+251 914 858 538\n+251 911 234 567' },
                { icon: 'fa-envelope', title: 'Email Us', content: 'info@sebna.et\ninvest@sebna.et' },
                { icon: 'fa-clock', title: 'Business Hours', content: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM' },
              ].map((contact, idx) => (
                <div key={idx} className="flex gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-900 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${contact.icon} text-white text-lg md:text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{contact.title}</h3>
                    <p className="text-sm md:text-base text-gray-600 whitespace-pre-line">{contact.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div data-aos="fade-left" className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-lg">
              <form className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900" 
                />
                <select className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900">
                  <option>Select a subject</option>
                  <option>Investment Inquiry</option>
                  <option>Partnership</option>
                  <option>Customer Support</option>
                  <option>Other</option>
                </select>
                <textarea 
                  placeholder="Message" 
                  rows="4" 
                  className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:border-blue-900 focus:ring-1 focus:ring-blue-900"
                ></textarea>
                <button className="w-full bg-gradient-to-r from-blue-900 to-orange-600 text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="opacity-75 text-sm md:text-base">
            © 2024 Sebna S.C Components Library. Built with React and Tailwind CSS.
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-900 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-10px, 10px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Touch-friendly button styles */
        @media (max-width: 768px) {
          button, 
          .btn,
          [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          input, 
          select, 
          textarea {
            font-size: 16px; /* Prevents iOS zoom on focus */
          }
        }
      `}</style>
    </div>
  );
};

export default SebnaLanding;