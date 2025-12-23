import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from '@/components';
import { getLandingPosts, getPublicPostById } from '@/pages/admin/posts/api/PostsApi';
import { checkIfPublicUserLiked, togglePublicLike } from '@/pages/admin/posts/api/LikesApi';
import { getPublicPostComments, createPublicComment } from '@/pages/admin/comments/api/CommentsApi';
import { getPricePerSharePublic } from '@/pages/admin/api/SebnaSettingsApi';
import brandLogo from '@/assets/logo.svg';
import brandIcon from '@/assets/Icon@300x.png';
import { 
  ArrowUpIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  StarIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  EyeIcon,
  TrophyIcon,
  ScaleIcon,
  ArrowPathIcon,
  WalletIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  RocketLaunchIcon,
  PlayIcon,
  PlusIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  EyeIcon as EyeOpenIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  BriefcaseIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import { 
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';

const NAV_ITEMS = ['home', 'about', 'services', 'investment', 'banking', 'news', 'contact'];

const SebnaLanding = () => {
  const navigate = useNavigate();
  const deviceIdRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(10000);
  const [priceChange, setPriceChange] = useState(0);
  const [priceHistory, setPriceHistory] = useState(() => Array.from({ length: 24 }, () => 10000));
  const [priceLoading, setPriceLoading] = useState(true);
  const hasLoadedPriceRef = useRef(false);
  const [newsFilter, setNewsFilter] = useState('all');
  const [landingPosts, setLandingPosts] = useState([]);
  const [newsLimit, setNewsLimit] = useState(8);
  const [newsTotalElements, setNewsTotalElements] = useState(0);
  const [newsLast, setNewsLast] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);

  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postModalLoading, setPostModalLoading] = useState(false);
  const [postModalLikeLoading, setPostModalLikeLoading] = useState(false);

  const [modalComments, setModalComments] = useState([]);
  const [modalCommentsLoading, setModalCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentSubmitting, setNewCommentSubmitting] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOrCreateDeviceId = () => {
    if (deviceIdRef.current) return deviceIdRef.current;
    try {
      const existing = window.localStorage.getItem('sebna_device_id');
      if (existing) {
        deviceIdRef.current = existing;
        return existing;
      }
      const generated = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem('sebna_device_id', generated);
      deviceIdRef.current = generated;
      return generated;
    } catch (e) {
      const fallback = `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
      deviceIdRef.current = fallback;
      return fallback;
    }
  };

  const getCurrentPost = () => {
    return selectedPost || (selectedPostIndex != null ? landingPosts[selectedPostIndex] : null);
  };

  const closePostModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
    setSelectedPostIndex(null);
    setModalComments([]);
    setNewCommentText('');
  };

  const scrollToSection = (sectionId) => {
    if (sectionId === 'news') {
      navigate('/news');
      setMobileMenuOpen(false);
      return;
    }

    try {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const headerOffset = isMobile ? 72 : 80;
      const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      setMobileMenuOpen(false);
    } catch (e) {
      console.error('Scroll error:', e);
    }
  };

  const displayCategory = (category) => {
    if (!category) return '';
    const normalized = String(category).toLowerCase();
    if (normalized.includes('investment') || normalized === 'investment') return 'investment';
    if (normalized.includes('market') || normalized === 'market') return 'market';
    if (normalized.includes('company') || normalized === 'company') return 'company';
    return normalized;
  };

  const getImageSrc = (post) => {
    if (!post) return '';
    if (post.imageUrl) return post.imageUrl;
    if (post.image) return post.image;
    if (post.imageBase64) {
      return post.imageBase64.startsWith('data:') ? post.imageBase64 : `data:image/jpeg;base64,${post.imageBase64}`;
    }
    return '';
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        mirror: true,
        offset: 100,
        delay: 100,
      });
      AOS.refresh();
    } catch (e) {
      console.error('AOS init error:', e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchLandingPosts = async () => {
      setNewsLoading(true);
      try {
        const res = await getLandingPosts({ category: newsFilter, page: 0, limit: newsLimit });
        if (res?.success) {
          const data = res.data;
          const content = data?.content || data?.posts || data?.response || data || [];
          setLandingPosts(Array.isArray(content) ? content : []);
          setNewsTotalElements(Number(data?.totalElements ?? 0));
          setNewsLast(Boolean(data?.last));
        } else {
          setLandingPosts([]);
          setNewsTotalElements(0);
          setNewsLast(true);
        }
      } catch (e) {
        setLandingPosts([]);
        setNewsTotalElements(0);
        setNewsLast(true);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchLandingPosts();
  }, [newsFilter, newsLimit]);

  const handleLoadMoreNews = () => {
    if (newsLoading) return;
    navigate('/news');
  };

  useEffect(() => {
    let isMounted = true;

    const applyPrice = (nextPrice) => {
      const next = Number(nextPrice);
      if (!Number.isFinite(next) || next <= 0) return;

      setCurrentPrice((prev) => {
        const prevNum = Number(prev);
        const change = prevNum > 0 ? ((next - prevNum) / prevNum) * 100 : 0;
        setPriceChange(Number.isFinite(change) ? change : 0);
        return next;
      });

      setPriceHistory((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const trimmed = safePrev.slice(-23);
        return [...trimmed, next];
      });
    };

    const fetchLivePrice = async () => {
      const isInitial = !hasLoadedPriceRef.current;
      if (isInitial) setPriceLoading(true);
      try {
        const res = await getPricePerSharePublic();
        const pps = res?.data?.pricePerShare;
        if (!isMounted) return;
        if (Number.isFinite(Number(pps)) && Number(pps) > 0) {
          applyPrice(Number(pps));
        } else {
          applyPrice(10000);
        }
      } catch (e) {
        if (!isMounted) return;
        applyPrice(10000);
      } finally {
        if (!isMounted) return;
        if (!hasLoadedPriceRef.current) {
          hasLoadedPriceRef.current = true;
          setPriceLoading(false);
        }
      }
    };

    fetchLivePrice();
    const intervalId = setInterval(fetchLivePrice, 60_000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closePostModal();
      }
    };

    if (postModalOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [postModalOpen]);

  const loadEngagementForPost = async (postId, idx) => {
    const deviceId = getOrCreateDeviceId();
    try {
      const likedRes = await checkIfPublicUserLiked(postId, deviceId);
      const likedData = likedRes?.data || likedRes;
      const liked = typeof likedData?.liked === 'boolean' ? likedData.liked : (typeof likedData === 'boolean' ? likedData : false);
      setSelectedPost((prev) => (prev ? { ...prev, userLiked: liked } : prev));
      if (idx != null) {
        setLandingPosts((prev) => {
          const next = [...prev];
          const base = next[idx];
          if (base) next[idx] = { ...base, userLiked: liked };
          return next;
        });
      }
    } catch (e) {
      console.error('Error loading engagement:', e);
    }
  };

  const loadCommentsForPost = async (postId) => {
    const deviceId = getOrCreateDeviceId();
    setModalCommentsLoading(true);
    try {
      const res = await getPublicPostComments(postId, 0, 10, deviceId);
      const data = res?.data || res;
      const list = Array.isArray(data) ? data : (data?.content || data?.comments || []);
      setModalComments(Array.isArray(list) ? list : []);
    } catch (e) {
      setModalComments([]);
    } finally {
      setModalCommentsLoading(false);
    }
  };

  const openPostModalByIndex = async (idx) => {
    if (idx == null || idx < 0 || idx >= landingPosts.length) return;

    const base = landingPosts[idx];
    const id = base?.id || base?.postId;
    if (!id) return;

    setSelectedPostIndex(idx);
    setPostModalOpen(true);
    setPostModalLoading(true);
    setModalComments([]);
    setNewCommentText('');
    try {
      const res = await getPublicPostById(id);
      if (res?.success) {
        setSelectedPost(res.data);
        setLandingPosts((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], ...res.data };
          return next;
        });
      } else {
        setSelectedPost(base);
      }
    } catch (e) {
      setSelectedPost(base);
    } finally {
      setPostModalLoading(false);
    }

    await Promise.all([
      loadEngagementForPost(id, idx),
      loadCommentsForPost(id),
    ]);
  };

  const goToNextPost = () => {
    if (selectedPostIndex == null) return;
    const next = selectedPostIndex + 1;
    if (next < landingPosts.length) {
      openPostModalByIndex(next);
    }
  };

  const goToPreviousPost = () => {
    if (selectedPostIndex == null) return;
    const prev = selectedPostIndex - 1;
    if (prev >= 0) {
      openPostModalByIndex(prev);
    }
  };

  const MetricSkeleton = () => (
    <div className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-slate-200/70 mb-4" />
      <div className="h-7 w-28 rounded-lg bg-slate-200/70 mb-2" />
      <div className="h-4 w-36 rounded-full bg-slate-200/70 mb-3" />
      <div className="h-4 w-16 rounded-full bg-slate-200/70" />
    </div>
  );

  const NewsCardSkeleton = () => (
    <div className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/40 shadow-lg animate-pulse">
      <div className="h-48 w-full bg-slate-200/70" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-24 rounded-full bg-slate-200/70" />
          <div className="h-4 w-20 rounded-full bg-slate-200/70" />
        </div>
        <div className="h-5 w-5/6 rounded-lg bg-slate-200/70 mb-3" />
        <div className="h-4 w-full rounded-lg bg-slate-200/70 mb-2" />
        <div className="h-4 w-4/5 rounded-lg bg-slate-200/70 mb-4" />
        <div className="h-4 w-24 rounded-full bg-slate-200/70" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sebna-navy/5 to-sebna-orange/5 overflow-x-hidden">
      {/* Loading Screen */}
      {showLoadingScreen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-sebna-navy via-sebna-navy to-sebna-navy">
          <div className="relative">
            {/* Animated orbs */}
            <div className="absolute -inset-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-sebna-navy/20 via-sebna-orange/15 to-sebna-navy/20 blur-3xl animate-gradient-orb-1"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-sebna-orange/20 via-sebna-navy/10 to-sebna-orange/20 blur-3xl animate-gradient-orb-2"></div>
            </div>
            
            {/* Loading content */}
            <div className="relative z-10 text-center text-white">
              <div className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-sebna-orange/30 to-white bg-clip-text text-transparent animate-gradient-shift">
                SEBNA
              </div>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-white animate-pulse animation-delay-200"></div>
                <div className="w-3 h-3 rounded-full bg-white animate-pulse animation-delay-400"></div>
              </div>
              <p className="text-lg md:text-xl text-white/90 animate-fade-in">Empowering Shared Investment</p>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-sebna-navy/10 via-sebna-navy/5 to-sebna-orange/10 blur-3xl animate-gradient-orb-1"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-sebna-orange/10 via-sebna-navy/5 to-sebna-navy/10 blur-3xl animate-gradient-orb-2"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, #00174b 1px, transparent 1px),
                           linear-gradient(to bottom, #00174b 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-sebna-navy/20 to-sebna-orange/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 7}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-sebna-navy/10 border-b border-white/20 py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sebna-navy to-sebna-orange flex items-center justify-center shadow-lg overflow-hidden">
                  <img src={brandIcon} alt="Sebna" className="w-8 h-8 object-contain" />
                </div> */}
                <div className="absolute -inset-1 bg-gradient-to-br from-sebna-navy to-sebna-orange rounded-xl blur opacity-30 animate-pulse-slow"></div>
              </div>
              <img src={brandLogo} alt="Sebna" className="h-6 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="px-4 py-2 text-gray-700 hover:text-sebna-navy font-medium transition-all duration-300 rounded-lg hover:bg-white/50 hover:shadow-sm capitalize text-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => navigate('/auth/sign-in')}
                className="px-4 py-2 text-gray-700 hover:text-sebna-navy font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/dashboard/home')}
                className="px-6 py-2.5 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-semibold rounded-xl shadow-lg shadow-sebna-navy/25 hover:shadow-2xl hover:shadow-sebna-navy/35 transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sebna-navy/15 border border-white/30 animate-slide-in-down overflow-hidden">
              <div className="p-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="w-full px-4 py-3 text-gray-700 hover:text-sebna-navy hover:bg-sebna-navy/5 font-medium transition-all duration-300 rounded-xl capitalize text-left flex items-center gap-3"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                    {item}
                  </button>
                ))}
                <div className="border-t border-gray-200/50 pt-3 mt-3 space-y-2">
                  <button 
                    onClick={() => navigate('/auth/sign-in')}
                    className="w-full px-4 py-3 text-gray-700 hover:text-sebna-navy hover:bg-sebna-navy/5 font-medium transition-all duration-300 rounded-xl text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/home')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-semibold rounded-xl shadow-lg shadow-sebna-navy/25 transition-all duration-300"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sebna-navy/5 via-transparent to-sebna-orange/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-sebna-orange/10 to-sebna-navy/10 blur-3xl animate-float-slower"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div 
                data-aos="fade-up" 
                data-aos-delay="100"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
              >
                <StarIcon className="w-4 h-4 text-sebna-orange" />
                <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                  Trusted by 10,000+ Investors
                </span>
              </div>

              <h1 
                data-aos="fade-up" 
                data-aos-delay="200"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="block text-gray-900">You are the</span>
                <span className="block bg-gradient-to-r from-sebna-navy via-sebna-navy to-sebna-orange bg-clip-text text-transparent animate-gradient-shift">
                  Epicenter
                </span>
              </h1>

              <p 
                data-aos="fade-up" 
                data-aos-delay="300"
                className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl"
              >
                Empowering shared investment, enabling shared growth. Join Sebna and be part of Tigray's leading platform for collaborative growth and sustainable prosperity.
              </p>

              {/* Stats */}
              <div 
                data-aos="fade-up" 
                data-aos-delay="400"
                className="grid grid-cols-3 gap-6 mb-8"
              >
                {[ 
                  { value: '15,000', label: 'Active Investors', color: 'from-sebna-navy to-sebna-navy' },
                  { value: '250M', label: 'ETB Invested', color: 'from-sebna-navy to-sebna-navy' },
                  { value: '45', label: 'Projects Funded', color: 'from-sebna-orange to-sebna-orange' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div 
                data-aos="fade-up" 
                data-aos-delay="500"
                className="flex flex-col sm:flex-row gap-4"
              >
                <button className="group relative px-8 py-4 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-semibold rounded-2xl shadow-xl shadow-sebna-navy/25 hover:shadow-2xl hover:shadow-sebna-navy/35 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sebna-navy to-sebna-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    <RocketLaunchIcon className="w-5 h-5" />
                    Start Investing Today
                  </span>
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="group px-8 py-4 border-2 border-sebna-navy text-sebna-navy font-semibold rounded-2xl hover:bg-sebna-navy hover:text-white transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-sebna-navy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    <PlayIcon className="w-5 h-5" />
                    Watch Our Story
                  </span>
                </button>
              </div>
            </div>

            {/* Right Card */}
            <div 
              data-aos="fade-left" 
              data-aos-delay="600"
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-2xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-sebna-navy/15 border border-white/30">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-sebna-orange rounded-full animate-pulse"></div>
                      <div className="absolute -inset-1 bg-sebna-orange rounded-full blur animate-ping-slow"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Share Price</h3>
                  </div>
                  <button className="p-2 hover:bg-white/50 rounded-xl transition-all duration-300 hover:rotate-180">
                    <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {priceLoading && (
                  <div className="mb-6 flex items-center justify-center">
                    <div className="relative">
                      <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar"></div>
                      </div>
                      <div className="mt-2 text-center text-sm font-semibold text-gray-600 animate-pulse">
                        Loading price...
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Display */}
                <div className="text-center mb-6">
                  {priceLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-56 rounded-2xl bg-gray-200 animate-pulse" />
                      <div className="h-4 w-40 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                  ) : (
                    <div className="inline-flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-gray-500">ETB</span>
                      <span className="text-5xl md:text-6xl font-bold text-gray-900">{Number(currentPrice || 0).toLocaleString()}</span>
                      <span className="bg-sebna-orange/10 text-sebna-orange px-3 py-1 rounded-xl text-sm font-semibold">
                        {priceChange >= 0 ? '+' : ''}{Number(priceChange || 0).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Real-time trading data</p>
                </div>

                {/* Chart Placeholder */}
                <div className="h-48 mb-6 rounded-xl bg-gradient-to-br from-sebna-navy/5 to-sebna-orange/5 border border-white/50 overflow-hidden">
                  {priceLoading ? (
                    <div className="w-full h-full bg-white/40 animate-pulse" />
                  ) : (
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="sebnaLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#1f3a5f" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <linearGradient id="sebnaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1f3a5f" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <polyline points="0,40 20,20 40,40 60,20 80,40 100,20" fill="none" stroke="url(#sebnaLine)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-sebna-navy/5 to-sebna-orange/5 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">24h High</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {priceLoading ? (
                        <div className="h-6 w-28 rounded-lg bg-gray-200 animate-pulse" />
                      ) : (
                        <>ETB {Math.max(...priceHistory).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-sebna-orange/5 to-sebna-navy/5 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">24h Low</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {priceLoading ? (
                        <div className="h-6 w-28 rounded-lg bg-gray-200 animate-pulse" />
                      ) : (
                        <>ETB {Math.min(...priceHistory).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around card */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-sebna-navy to-sebna-orange blur-sm animate-float"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-sebna-orange to-sebna-navy blur-sm animate-float animation-delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div 
            data-aos="fade-up" 
            data-aos-delay="800"
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-gray-500">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-sebna-navy to-sebna-orange rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <ShieldCheckIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                About Sebna
              </span>
            </div>

            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="block text-gray-900">Breaking the Cycle of</span>
              <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Broken Promises
              </span>
            </h2>

            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Sebna is a new share company based in Tigray, entering diverse sectors like education and real estate. Unlike previous share companies that made promises and failed, Sebna is committed to delivering results.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  icon: BuildingLibraryIcon,
                  title: 'Diverse Sectors',
                  description: 'Strategic investments across education and real estate sectors, creating multiple revenue streams and growth opportunities.',
                  gradient: 'from-sebna-navy to-sebna-navy'
                },
                {
                  icon: ShieldCheckIcon,
                  title: 'Proven Commitment',
                  description: 'All registration documentation finalized. We\'re ready to deliver on our promises where others have failed.',
                  gradient: 'from-sebna-navy to-sebna-orange'
                },
                {
                  icon: UserGroupIcon,
                  title: 'Community Focused',
                  description: 'Sebna means "our people" in Tigrinya. We prioritize our buyers, employees, and stakeholders above all.',
                  gradient: 'from-sebna-orange to-sebna-orange'
                }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={300 + idx * 100}
                  className="group flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image */}
            <div 
              data-aos="fade-left"
              data-aos-delay="400"
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/img/3WKayx05pJw1.jpg" 
                  alt="Business Meeting" 
                  className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="/img/oMF3X7wxIJ0X.jpg"
                  alt="Office Building"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-sebna-navy/90 via-sebna-navy/85 to-sebna-navy/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div 
              data-aos="fade-up"
              className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-sebna-navy/20 to-sebna-orange/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-sebna-navy to-sebna-orange flex items-center justify-center">
                  <EyeIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white text-center mb-4">Our Mission</h3>
              <p className="text-lg text-white/80 text-center leading-relaxed">
                Empowering shared investment, enabling shared growth through transparent and sustainable partnerships.
              </p>
            </div>

            {/* Vision */}
            <div 
              data-aos="fade-up"
              data-aos-delay="200"
              className="group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-sebna-orange/20 to-sebna-navy/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-sebna-orange to-sebna-navy flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white text-center mb-4">Vision 2035</h3>
              <p className="text-lg text-white/80 text-center leading-relaxed">
                To be the leading platform for collaborative growth and sustainable prosperity in Tigray.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <StarIcon className="w-4 h-4 text-sebna-orange" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Our Values
              </span>
            </div>

            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              The <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">SEBNA</span> Values
            </h2>

            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Our core values guide every decision and action we take, ensuring we deliver on our promises.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { letter: 'S', title: 'Sincerity', icon: ShieldCheckIcon, gradient: 'from-sebna-navy to-sebna-navy', delay: '100' },
              { letter: 'E', title: 'Excellence', icon: TrophyIcon, gradient: 'from-sebna-navy to-sebna-orange', delay: '200' },
              { letter: 'B', title: 'Bravery', icon: BriefcaseIcon, gradient: 'from-sebna-navy to-sebna-orange', delay: '300' },
              { letter: 'N', title: 'Neutrality', icon: ScaleIcon, gradient: 'from-sebna-navy to-sebna-navy', delay: '400' },
              { letter: 'A', title: 'Adaptability', icon: ArrowPathIcon, gradient: 'from-sebna-orange to-sebna-orange', delay: '500' },
            ].map((value, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={value.delay}
                className="group relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${value.gradient} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white font-bold text-lg">{value.letter}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{value.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <ChartBarIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Our Services
              </span>
            </div>

            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Investment <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">Opportunities</span>
            </h2>

            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Explore our diverse portfolio of investment opportunities across key sectors in Tigray.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {priceLoading ? (
              [...Array(3)].map((_, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={300 + idx * 100}>
                  <MetricSkeleton />
                </div>
              ))
            ) : (
              [
                {
                  icon: ChartBarIcon,
                  value: `ETB ${Number(currentPrice || 0).toLocaleString()}`,
                  label: 'Current Share Price',
                  change: `${priceChange >= 0 ? '+' : ''}${Number(priceChange || 0).toFixed(1)}%`,
                  gradient: 'from-sebna-navy to-sebna-orange'
                },
                { icon: WalletIcon, value: 'ETB 250M', label: 'Total Investment', change: '+15.2%', gradient: 'from-sebna-navy to-sebna-orange' },
                { icon: UserGroupIcon, value: '15,247', label: 'Active Investors', change: '+8.3%', gradient: 'from-sebna-navy to-sebna-orange' },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={300 + idx * 100}
                  className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center mb-4`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                  <div className="text-sm text-green-600 font-semibold">{metric.change}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Investment Dashboard */}
      <section id="investment" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <ChartBarIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Live Dashboard
              </span>
            </div>
            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Investment <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">Performance</span>
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Real-time insights into our investment performance and market trends.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {priceLoading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} data-aos="fade-up" data-aos-delay={300 + idx * 100}>
                  <MetricSkeleton />
                </div>
              ))
            ) : (
              [
                {
                  icon: ChartBarIcon,
                  value: `ETB ${Number(currentPrice || 0).toLocaleString()}`,
                  label: 'Current Share Price',
                  change: `${priceChange >= 0 ? '+' : ''}${Number(priceChange || 0).toFixed(1)}%`,
                  gradient: 'from-sebna-navy to-sebna-orange'
                },
                { icon: WalletIcon, value: 'ETB 250M', label: 'Total Investment', change: '+15.2%', gradient: 'from-sebna-navy to-sebna-orange' },
                { icon: UserGroupIcon, value: '15,247', label: 'Active Investors', change: '+8.3%', gradient: 'from-sebna-navy to-sebna-orange' },
                { icon: BanknotesIcon, value: '16.8%', label: 'Average ROI', change: '+1.2%', gradient: 'from-sebna-navy to-sebna-orange' },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={300 + idx * 100}
                  className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.gradient} flex items-center justify-center mb-4`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                  <div className="text-sm text-green-600 font-semibold">{metric.change}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Banking Partners */}
      <section id="banking" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <BanknotesIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Banking Partners
              </span>
            </div>
            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Trusted <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">Financial Partners</span>
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Seamless integration with Ethiopia's leading banks for secure and convenient transactions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: '/img/W83dIgAvVmg6.jpg',
                name: 'Commercial Bank',
                fullName: 'Commercial Bank of Ethiopia',
                description: 'Ethiopia\'s largest bank with nationwide coverage and digital banking solutions.',
                features: ['Mobile Banking', 'Online Transfer', '24/7 Support'],
                gradient: 'from-sebna-navy to-sebna-orange',
                delay: '100'
              },
              {
                image: '/img/dashen.jpg',
                name: 'Dashen Bank',
                fullName: 'Dashen Bank',
                description: 'Leading private bank known for innovation and customer service excellence.',
                features: ['Digital Wallet', 'Quick Transfer', 'Investment Advisory'],
                gradient: 'from-sebna-navy to-sebna-orange',
                delay: '200'
              },
              {
                image: '/img/yWqmB1gqtEEQ.jpg',
                name: 'Awash Bank',
                fullName: 'Awash Bank',
                description: 'Pioneering private bank with comprehensive financial services and modern technology.',
                features: ['Internet Banking', 'SMS Banking', 'Corporate Services'],
                gradient: 'from-sebna-navy to-sebna-orange',
                delay: '300'
              },
              {
                image: '/img/wegagen.jpg',
                name: 'WEGAGEN Bank',
                fullName: 'WEGAGEN Bank',
                description: 'International banking services with focus on trade finance and foreign exchange.',
                features: ['Foreign Exchange', 'Trade Finance', 'International Transfer'],
                gradient: 'from-sebna-navy to-sebna-orange',
                delay: '400'
              }
            ].map((bank, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={bank.delay}
                className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-20 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img
                    src={bank.image}
                    alt={bank.name}
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{bank.name}</h3>
                <p className="text-sm text-gray-600 text-center mb-4">{bank.description}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {bank.features.map((feature, fidx) => (
                    <span
                      key={fidx}
                      className="px-2 py-1 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 text-sebna-navy text-xs font-semibold rounded-lg"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <GlobeAltIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Latest News
              </span>
            </div>
            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Stay <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">Updated</span>
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get the latest updates on our investments, market insights, and company developments.
            </p>
          </div>

          {/* Filters */}
          <div 
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {['all', 'investment', 'market', 'company'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setNewsFilter(filter);
                  setNewsLimit(8);
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  newsFilter === filter
                    ? 'bg-gradient-to-r from-sebna-navy to-sebna-orange text-white shadow-lg shadow-sebna-navy/25'
                    : 'bg-gradient-to-br from-white/60 to-white/40 text-gray-700 hover:bg-white/80'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} News
              </button>
            ))}
          </div>

          {/* News Grid */}
          {newsLoading && landingPosts.length > 0 && (
            <div className="mb-6 flex items-center justify-center" data-aos="fade-up">
              <div className="relative">
                <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar"></div>
                </div>
                <div className="mt-2 text-center text-sm font-semibold text-gray-600 animate-pulse">
                  Updating news...
                </div>
              </div>
            </div>
          )}

          {newsLoading && landingPosts.length === 0 ? (
            <div className="mb-12" data-aos="fade-up">
              <div className="mb-8 flex items-center justify-center">
                <div className="relative">
                  <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sebna-navy to-sebna-orange animate-loading-bar"></div>
                  </div>
                  <div className="mt-2 text-center text-sm font-semibold text-gray-600 animate-pulse">
                    Loading news...
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {landingPosts.map((post, idx) => (
                <div
                  key={post.id || post.postId || idx}
                  data-aos="fade-up"
                  data-aos-delay={400 + (idx % 4) * 100}
                  className="group bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageSrc(post) || '/img/4u2kdUqkvMAv.jpg'}
                      alt={post.title || 'News'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white text-xs font-semibold rounded-full">
                        {displayCategory(post.category)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <EyeOpenIcon className="w-4 h-4" />
                          {post.views ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          {post.likeCount ?? 0}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.content ? String(post.content).slice(0, 120) : ''}
                    </p>

                    <button
                      type="button"
                      onClick={() => openPostModalByIndex(idx)}
                      className="flex items-center gap-2 text-sebna-navy font-semibold text-sm hover:text-sebna-orange transition-colors"
                    >
                      Read More
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Post Modal */}
          {postModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
              onClick={closePostModal}
            >
              <div
                className="bg-white/80 rounded-3xl p-8 w-full max-w-2xl mx-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/30">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white text-sm font-semibold rounded-full">
                      {displayCategory((selectedPost || landingPosts[selectedPostIndex])?.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(selectedPost || landingPosts[selectedPostIndex])?.createdAt
                        ? new Date((selectedPost || landingPosts[selectedPostIndex]).createdAt).toLocaleString()
                        : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={closePostModal}
                    className="w-10 h-10 rounded-full hover:bg-white/50 flex items-center justify-center transition-all duration-300"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[70vh]">
                  <div className="h-80">
                    <img
                      src={getImageSrc(selectedPost || landingPosts[selectedPostIndex]) || '/img/4u2kdUqkvMAv.jpg'}
                      alt={(selectedPost || landingPosts[selectedPostIndex])?.title || 'Post'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {(selectedPost || landingPosts[selectedPostIndex])?.title}
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <EyeOpenIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">{(selectedPost || landingPosts[selectedPostIndex])?.views ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">{(selectedPost || landingPosts[selectedPostIndex])?.likeCount ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600">{(selectedPost || landingPosts[selectedPostIndex])?.commentCount ?? 0}</span>
                      </div>
                    </div>

                    {postModalLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sebna-navy border-t-transparent"></div>
                      </div>
                    ) : (
                      <div className="prose prose-lg text-gray-700">
                        {(selectedPost || landingPosts[selectedPostIndex])?.content}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/30">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={goToPreviousPost}
                      disabled={selectedPostIndex === 0}
                      className="px-4 py-2 rounded-lg bg-gradient-to-br from-white/60 to-white/40 text-gray-700 font-semibold disabled:opacity-50 transition-all duration-300 hover:bg-white/80"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-500">
                      {selectedPostIndex != null ? `${selectedPostIndex + 1} / ${landingPosts.length}` : ''}
                    </div>
                    <button
                      type="button"
                      onClick={goToNextPost}
                      disabled={selectedPostIndex == null || selectedPostIndex >= landingPosts.length - 1}
                      className="px-4 py-2 rounded-lg bg-gradient-to-br from-white/60 to-white/40 text-gray-700 font-semibold disabled:opacity-50 transition-all duration-300 hover:bg-white/80"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Load More */}
          {!newsLast && (newsTotalElements === 0 || landingPosts.length < newsTotalElements) && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleLoadMoreNews}
                disabled={newsLoading}
                className="group px-8 py-3 border-2 border-sebna-navy text-sebna-navy font-semibold rounded-xl hover:bg-sebna-navy hover:text-white transition-all duration-500 overflow-hidden relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-sebna-navy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <PlusIcon className="w-5 h-5" />
                  {newsLoading ? 'Loading...' : 'Load More News'}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div 
              data-aos="fade-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6"
            >
              <EnvelopeIcon className="w-4 h-4 text-sebna-navy" />
              <span className="text-sm font-semibold bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">
                Get In Touch
              </span>
            </div>
            <h2 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Contact <span className="bg-gradient-to-r from-sebna-navy to-sebna-orange bg-clip-text text-transparent">Us</span>
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Ready to start your investment journey? Get in touch with our expert team.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: MapPinIcon, title: 'Visit Our Office', content: 'Mekelle, Tigray, Ethiopia\nNear Commercial Bank Building' },
                { icon: PhoneIcon, title: 'Call Us', content: '+251 914 858 538\n+251 911 234 567' },
                { icon: EnvelopeIcon, title: 'Email Us', content: 'info@sebna.et\ninvest@sebna.et' },
                { icon: ClockIcon, title: 'Business Hours', content: 'Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM' },
              ].map((contact, idx) => (
                <div
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={300 + idx * 100}
                  className="group flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-sebna-navy to-sebna-orange flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <contact.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{contact.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{contact.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div 
              data-aos="fade-left"
              data-aos-delay="300"
              className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-2xl"
            >
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300"
                />
                <select className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300">
                  <option>Select a subject</option>
                  <option>Investment Inquiry</option>
                  <option>Partnership</option>
                  <option>Customer Support</option>
                  <option>Other</option>
                </select>
                <textarea
                  placeholder="Message"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/40 focus:border-sebna-navy focus:ring-2 focus:ring-sebna-navy/20 outline-none transition-all duration-300 resize-none"
                ></textarea>
                <button className="group w-full px-8 py-3 bg-gradient-to-r from-sebna-navy to-sebna-orange text-white font-semibold rounded-xl shadow-lg shadow-sebna-navy/25 hover:shadow-xl hover:shadow-sebna-navy/35 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sebna-navy to-sebna-orange opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Send Message
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-gray-50 to-slate-600 text-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className=" h-10 rounded-xl bg-gradient-to-br flex items-center justify-center">
              <img src={brandLogo} alt="Sebna" className="h-6 w-auto" />
              </div>
             
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Empowering shared investment, enabling shared growth. Join us in building a prosperous future for Tigray.
            </p>
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Sebna S.C. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-sebna-navy to-sebna-orange text-white shadow-2xl shadow-sebna-navy/25 hover:shadow-3xl hover:shadow-sebna-navy/35 transition-all duration-500 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <ArrowUpIcon className="w-5 h-5 mx-auto" />
      </button>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-orb-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(50px, -50px) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes gradient-orb-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(-30px, 30px) scale(1.1);
            opacity: 0.4;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, -20px);
          }
          66% {
            transform: translate(-10px, 10px);
          }
        }

        @keyframes float-slower {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(-15px, 15px);
          }
          66% {
            transform: translate(10px, -10px);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes slide-in-down {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-gradient-orb-1 {
          animation: gradient-orb-1 20s ease-in-out infinite;
        }

        .animate-gradient-orb-2 {
          animation: gradient-orb-2 25s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 20s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradient-shift 3s ease-in-out infinite;
        }

        .animate-slide-in-down {
          animation: slide-in-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00174b, #f97316);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #00123a, #ea580c);
        }
      `}</style>
    </div>
  );
};

export default SebnaLanding;