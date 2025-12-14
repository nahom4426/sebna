import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useBreadcrumbStore } from '@/stores/breadcrumbStore';
import Sidebar from '@/components/Sidebar';
import NavBar from '@/components/NavBar';

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = (status) => {
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
    <div className="flex h-screen w-full bg-gradient-to-br from-[#F9FAFB] via-[#EEF2FF] to-[#E0E7FF] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl bg-blue-400/20 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-300/10 rounded-full blur-3xl animate-pulse-slower pointer-events-none"></div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar/Drawer */}
      <div
        className={`
          h-full transition-all duration-300 ease-in-out
          ${isMobile ? 'fixed left-0 top-0 z-50 h-full' : 'relative'}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
          ${!isMobile ? (isCollapsed ? 'w-20' : 'w-64') : 'w-64'}
          p-3
        `}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          isMobile={isMobile}
          isMobileOpen={isMobileMenuOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex relative z-10 flex-col flex-1 gap-2 md:gap-3 p-2 md:p-3 min-w-0 overflow-hidden">
        {/* NavBar */}
        <NavBar
          toggleMobileMenu={toggleMobileMenu}
          isMobile={isMobile}
          breadcrumbs={{ breadcrumbs }}
        />

        {/* Content Area */}
        <div className="show-scrollbar w-full flex-1 overflow-auto rounded-xl bg-white/70 backdrop-blur-md border border-white/40 shadow-lg shadow-indigo-100/40 p-2 md:p-4 transition-all duration-300 hover:shadow-indigo-200/60 min-w-0">
          <Outlet />
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.08);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }

        .show-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
