import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import defaultProfile from '@/assets/img/profile.png';

const NavBar = ({ toggleMobileMenu, isMobile, breadcrumbs = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuthStore((state) => state.auth);
  const logout = useAuthStore((state) => state.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [animateElements, setAnimateElements] = useState(true);
  const userMenuRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process profile picture
  useEffect(() => {
    if (auth?.user?.imageData) {
      if (!auth.user.imageData.startsWith('data:image/')) {
        setProfilePicture(`data:image/png;base64,${auth.user.imageData}`);
      } else {
        setProfilePicture(auth.user.imageData);
      }
    }
  }, [auth?.user?.imageData]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageError = (e) => {
    e.target.src = '';
  };

  const breadcrumbsList = breadcrumbs?.breadcrumbs || [];
  const currentPage = breadcrumbsList.length > 0 ? breadcrumbsList[breadcrumbsList.length - 1]?.name : 'Sebna';
  const isMessagesActive = location?.pathname?.startsWith('/admin/messages');

  return (
    <div
      className={`sticky top-0 z-30 flex items-center justify-between h-16 px-3 md:px-6 rounded-xl transition-all duration-300 backdrop-blur-xl bg-white/95 ${
        isScrolled ? 'shadow-xl scale-[1.002] border border-transparent' : 'shadow-md border border-gray-100'
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3 md:gap-6 animate-fade-in">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 group hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 transition-colors group-hover:text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Back Button (Desktop) */}
        {!isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-primary/10 group hover:scale-105"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-600 transition-colors duration-200 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Breadcrumbs and Title */}
        <div className="flex flex-col flex-1 min-w-0">
          <h1 className="text-base font-semibold text-gray-800 truncate md:text-lg animate-slide-in-left">
            {currentPage}
          </h1>
          {breadcrumbsList.length > 1 && !isMobile && (
            <p className="flex gap-1 items-center text-xs text-gray-500 truncate animate-fade-in">
              {breadcrumbsList.map((crumb, index) => (
                <span key={index}>
                  {index > 0 && <span>/</span>}
                  <span className="transition-colors hover:text-blue-600">{crumb.name}</span>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {/* Center Section - Company Name */}
      <div className="hidden items-center md:flex animate-zoom-in">
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-indigo-600/10 rounded-xl border border-blue-600/30 shadow-md backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full animate-pulse bg-blue-600"></div>
            <span className="text-sm font-bold tracking-wide text-blue-600 md:text-base">
              {auth?.user?.companyName || `${auth?.user?.firstName} ${auth?.user?.fatherName}` || 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex gap-2 items-center md:gap-4">
        <button
          type="button"
          onClick={() => navigate('/admin/messages')}
          className={`relative p-2 rounded-xl transition-all duration-200 group hover:scale-105 active:scale-95 ${
            isMessagesActive
              ? 'bg-gradient-to-r from-blue-600/15 to-indigo-600/15 border border-blue-600/30 shadow-sm'
              : 'hover:bg-gray-100'
          }`}
          aria-label="Messages"
        >
          <svg
            className={`w-6 h-6 transition-colors ${isMessagesActive ? 'text-blue-600' : 'text-gray-600'} group-hover:text-blue-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h8m-8 4h5m6 5l-3.5-2.3a2 2 0 00-1.1-.3H8a4 4 0 01-4-4V7a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-2 3.5V19z"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* Language Selector (Hidden on mobile) */}
        {!isMobile && (
          <div ref={languageMenuRef} className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex gap-2 items-center px-2 py-2 rounded-lg transition-all duration-200 md:px-3 hover:bg-gray-100 group hover:scale-105"
            >
              <span className="text-xs font-medium text-gray-700 md:text-sm group-hover:text-blue-600">ENG</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform group-hover:text-blue-600 ${showLanguageMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-100 shadow-lg backdrop-blur-sm bg-white/95 animate-dropdown z-50">
                <button className="w-full text-left p-2 rounded-md transition-colors hover:bg-gray-50 text-sm text-gray-700">
                  English
                </button>
              </div>
            )}
          </div>
        )}

        {/* User Profile Dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex gap-2 items-center px-2 py-2 rounded-lg transition-all duration-200 cursor-pointer md:gap-3 md:px-3 hover:bg-gray-100 group hover:scale-105"
          >
            <div className="relative">
              <div className="overflow-hidden w-8 h-8 rounded-full border-2 border-white shadow-md md:w-9 md:h-9">
                <img
                  src={profilePicture || defaultProfile}
                  alt="User avatar"
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  onError={handleImageError}
                />
              </div>
              <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white md:w-3 md:h-3"></span>
            </div>

            <div className="hidden flex-col items-start lg:flex">
              <span className="text-sm font-semibold text-gray-800 max-w-[120px] line-clamp-1">
                {auth?.user?.firstName} {auth?.user?.fatherName || 'User'}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-600/10 text-blue-600">
                {auth?.user?.roleName || 'Admin'}
              </span>
            </div>
            <svg
              className={`hidden w-4 h-4 text-gray-500 transition-transform md:block group-hover:text-blue-600 ${showUserMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 z-50 flex flex-col gap-1 p-2 mt-2 w-48 rounded-xl border border-gray-100 shadow-xl backdrop-blur-sm md:w-56 bg-white/95 animate-dropdown">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">
                  {auth?.user?.firstName} {auth?.user?.fatherName}
                </p>
                <p className="text-xs text-gray-500">{auth?.user?.email}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/dashboard/profile');
                  setShowUserMenu(false);
                }}
                className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 text-gray-700"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">My Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate('/dashboard/profile?tab=security');
                  setShowUserMenu(false);
                }}
                className="flex gap-3 items-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 text-gray-700"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Settings</span>
              </button>

              <div className="my-1 border-t border-gray-100"></div>

              <button
                onClick={() => {
                  logout();
                  navigate('/auth/sign-in', { replace: true });
                  setShowUserMenu(false);
                }}
                className="flex gap-3 items-center p-2 text-red-500 rounded-lg transition-all duration-200 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-in-left {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes dropdown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.4s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out; }
        .animate-dropdown { animation: dropdown 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default NavBar;
