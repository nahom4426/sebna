import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useBreadcrumbStore } from '@/stores/breadcrumbStore';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/NavBar';
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const contentArea = document.querySelector('.main-content-area');
      if (contentArea) {
        const scrollTop = contentArea.scrollTop;
        const scrollHeight = contentArea.scrollHeight - contentArea.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollProgress(progress);
      }
    };

    const contentArea = document.querySelector('.main-content-area');
    if (contentArea) {
      contentArea.addEventListener('scroll', handleScroll);
      return () => contentArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 via-sebna-navy/5 to-sebna-orange/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-sebna-navy/10 via-sebna-navy/5 to-sebna-orange/10 blur-3xl animate-gradient-orb-1"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-sebna-orange/10 via-sebna-navy/5 to-sebna-navy/10 blur-3xl animate-gradient-orb-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-sebna-navy/5 via-sebna-orange/5 to-sebna-navy/5 blur-3xl animate-gradient-orb-3"></div>
        
        {/* Geometric Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #00174b 1px, transparent 1px),
                             linear-gradient(to bottom, #00174b 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sebna-orange/25 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 7}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Mobile Overlay with Glass Effect */}
      {isMobileMenuOpen && isMobile && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-xl bg-black/40 md:hidden animate-fade-in"
        />
      )}

      {/* Floating Toggle Button (for desktop) */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed z-30 top-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
                     ${isCollapsed ? 'left-12' : 'left-64'} 
                     bg-gradient-to-r from-sebna-navy to-sebna-orange text-white p-1 
                     rounded-xl shadow-2xl shadow-sebna-navy/25 
                     hover:shadow-3xl hover:shadow-sebna-navy/35 hover:scale-105
                     active:scale-95 border border-white/20
                     flex items-center justify-center`}
          style={{
            transform: `translateY(${isCollapsed ? '0' : '-50%'}) rotate(${isCollapsed ? '180deg' : '0deg'})`
          }}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-sebna-navy to-sebna-orange 
                   text-white rounded-xl shadow-2xl shadow-sebna-navy/25 
                   hover:shadow-3xl hover:shadow-sebna-navy/35 hover:scale-105
                   active:scale-95 border border-white/20 transition-all duration-300"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      )}

      {/* Sidebar/Drawer with Glass Effect */}
      <div
        className={`
          fixed md:relative h-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isMobile ? 'z-40' : 'z-20'}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile ? (isCollapsed ? 'w-20' : 'w-72') : 'w-72'}
          p-2 md:p-3
        `}
        style={{
          transform: isMobile 
            ? isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
            : 'translateX(0)'
        }}
      >
        <div className="h-full rounded-2xl bg-gradient-to-b from-white/90 via-white/80 to-white/70 
                      backdrop-blur-2xl border border-white/40 shadow-2xl shadow-sebna-navy/10 
                      overflow-hidden">
          <Sidebar
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            isMobileOpen={isMobileMenuOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 gap-3 p-3 md:p-4 min-w-0 overflow-visible relative z-10">

        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sebna-navy/20 to-transparent z-10">
          <div 
            className="h-full bg-gradient-to-r from-sebna-navy via-sebna-orange to-sebna-navy transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* NavBar with Glass Effect */}
        <div className="relative z-50 overflow-visible rounded-2xl bg-gradient-to-r from-white/80 via-white/70 to-white/60 
                      backdrop-blur-2xl border border-white/40 shadow-xl shadow-sebna-navy/10 
                      transition-all duration-300 hover:shadow-2xl hover:shadow-sebna-navy/20">
          <NavBar
            toggleMobileMenu={toggleMobileMenu}
            isMobile={isMobile}
            breadcrumbs={{ breadcrumbs }}
          />
        </div>

        {/* Content Area with Glass Effect */}
        <div className="main-content-area show-scrollbar flex-1 overflow-auto rounded-2xl 
                       bg-gradient-to-br from-white/70 via-white/60 to-white/50 
                       backdrop-blur-2xl border border-white/40 
                       shadow-xl shadow-sebna-navy/10 
                       transition-all duration-500 hover:shadow-2xl hover:shadow-sebna-navy/20 
                       p-3 md:p-6 min-w-0 relative group">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sebna-navy/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-sebna-orange/5 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Content */}
          <Outlet />
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500">
            <div className="flex items-center justify-center w-10 h-10 
                          bg-gradient-to-br from-sebna-navy/10 to-sebna-orange/10 
                          backdrop-blur-sm rounded-full border border-white/20">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sebna-navy to-sebna-orange 
                            animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 
                    bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-2xl 
                    border border-white/40 rounded-full shadow-lg shadow-sebna-navy/10 
                    text-sm text-gray-600 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sebna-orange animate-pulse"></div>
          <span className="font-medium">System Status: </span>
          <span className="text-sebna-navy font-semibold">Online</span>
        </div>
        <div className="w-px h-4 bg-gray-300/50"></div>
        <div className="hidden sm:block">
          <span className="text-gray-500">Last updated: </span>
          <span className="font-medium">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes gradient-orb-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.1;
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
            opacity: 0.15;
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
            opacity: 0.1;
          }
        }

        @keyframes gradient-orb-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.1;
          }
          33% {
            transform: translate(-40px, 20px) rotate(-120deg);
            opacity: 0.15;
          }
          66% {
            transform: translate(20px, -20px) rotate(-240deg);
            opacity: 0.08;
          }
        }

        @keyframes gradient-orb-3 {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.05;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.08;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
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

        .animate-gradient-orb-1 {
          animation: gradient-orb-1 20s ease-in-out infinite;
        }

        .animate-gradient-orb-2 {
          animation: gradient-orb-2 25s ease-in-out infinite;
        }

        .animate-gradient-orb-3 {
          animation: gradient-orb-3 30s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .show-scrollbar {
          scroll-behavior: smooth;
        }

        .show-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .show-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }

        .show-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00174b, #f43b11);
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .show-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f43b11, #00174b);
        }

        /* Smooth transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        /* Gradient text effect */
        .gradient-text {
          background: linear-gradient(135deg, #00174b 0%, #f43b11 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Glass morphism enhancement */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 23, 75, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MainLayout;