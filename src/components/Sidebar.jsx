import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROLES } from '@/constants/roles';
import { isSuperAdmin, hasAllPrivileges } from '@/utils/rbacUtils';
import brandIcon from '@/assets/Icon@300x.png';
const Sidebar = ({ isCollapsed, isMobile, isMobileOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState([]);
  const auth = useAuthStore((state) => state.auth);

  const navs = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/dashboard/home',
      requiredRoles: [ROLES.READ_REPORTS],
    },
     {
      name: 'My Shares',
      icon: '🏠',
      path: '/dashboard/shareholder',
      requiredRoles: [ROLES.READ_POSTS],
    },
    
    {
      name: 'Posts',
      icon: '📰',
      path: '/admin/posts',
      requiredRoles: [
        ROLES.READ_POSTS,
      ],
    },
      {
      name: 'Admin Panel',
      icon: '⚙️',
      requiredRoles: [],
      navs: [
        {
          name: 'Users',
          icon: '👥',
          path: '/admin/users',
          requiredRoles: [
            ROLES.READ_USERS,
          ],
        },
        {
          name: 'Roles',
          icon: '🔐',
          path: '/admin/roles',
          requiredRoles: [
            ROLES.READ_ROLE,
          ],
        },
        {
          name: 'Privileges',
          icon: '🛡️',
          path: '/admin/privileges',
          requiredRoles: [
            ROLES.READ_PRIVILEGES,
          ],
        },
         {
      name: 'Logs',
      icon: '📋',
      path: '/admin/logs',
      requiredRoles: [ROLES.READ_LOGS],
    },
      ],
    },
    // {
    //   name: 'Messages',
    //   icon: '✉️',
    //   path: '/admin/messages',
    //   requiredRoles: [
    //     ROLES.READ_MESSAGES,
    //   ],
    // },
    // {
    //   name: 'Comments',
    //   icon: '💬',
    //   path: '/admin/comments',
    //   requiredRoles: [
    //     ROLES.READ_COMMENTS,
    //   ],
    // },
   
    // {
    //   name: 'Profile',
    //   icon: '👤',
    //   path: '/dashboard/profile',
    //   requiredRoles: [],
    // },
    // {
    //   name: 'Tables',
    //   icon: '📊',
    //   path: '/dashboard/tables',
    //   requiredRoles: [],
    // },
    // {
    //   name: 'Notifications',
    //   icon: '🔔',
    //   path: '/dashboard/notifications',
    //   requiredRoles: [],
    // },
  ];

  const hasPrivilege = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const userPrivileges = auth?.user?.privileges || [];
    const userRole = auth?.user?.roleName;

    if (isSuperAdmin(userRole) || hasAllPrivileges(userPrivileges)) {
      return true;
    }

    return requiredRoles.some((role) => userPrivileges.includes(role));
  };

  const filteredNavs = useMemo(() => {
    return navs
      .map((item) => {
        if (item.navs) {
          const filteredChildren = item.navs.filter((child) =>
            hasPrivilege(child.requiredRoles)
          );
          return filteredChildren.length > 0 ? { ...item, navs: filteredChildren } : null;
        }
        return hasPrivilege(item.requiredRoles) ? item : null;
      })
      .filter(Boolean);
  }, [auth?.user?.privileges, auth?.user?.roleName]);

  // Toggle menu expansion
  const toggleMenu = (name) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [name]
    );
  };

  // Handle single item click (close mobile menu)
  const handleSingleItemClick = () => {
    if (isMobile && isMobileOpen) {
      toggleSidebar();
    }
  };

  // Check if path is active
  const isActive = (path) => location.pathname === path;

  const userData = auth?.user || {};

  return (
    <div className="flex relative flex-col space-y-4 h-full rounded-2xl border border-gray-100 shadow-xl backdrop-blur-lg transition-all duration-300 bg-white/95">
      {/* Collapse Button */}
      {!isMobile && (
        <button
          onClick={() => toggleSidebar(!isCollapsed)}
          className={`flex absolute -right-3 top-10 z-10 justify-center items-center bg-white rounded-full border border-gray-200 shadow-sm transition-all duration-300 cursor-pointer size-6 hover:bg-gray-50 hover:shadow-md ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Header Section */}
      <div className="flex-shrink-0 space-y-4">
        <div className="flex gap-2 justify-center items-center py-4 w-full">
          <span className="transition-transform transform text-sebna-navy hover:scale-110 text-2xl">
                  <img src={brandIcon} alt="Sebna" className="w-8 h-8 object-contain" />
          </span>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sebna-navy animate-fade-in">Sebna</span>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={() => toggleSidebar()}
          className="absolute top-4 right-4 z-20 p-2 rounded-lg transition-colors hover:bg-white/50"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Navigation Menu */}
      <div
        className={`overflow-y-auto h-full scrollbar-hide text-gray-700 ${
          isCollapsed ? 'items-center' : 'px-4'
        }`}
      >
        <div className="flex overflow-x-hidden flex-col gap-2 justify-center">
          {filteredNavs.map((item) => (
            <div key={item.path || item.name}>
              {/* Menu with children */}
              {item.navs && item.navs.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex justify-between items-center w-full h-12 rounded-xl transition-all duration-200 group ${
                      expandedMenus.includes(item.name) && !isCollapsed
                        ? 'bg-gradient-to-r from-sebna-navy/10 to-sebna-orange/10 shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex gap-4 items-center ml-3">
                      <span className="transition-transform text-sebna-navy group-hover:scale-110 text-lg">
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="text-sm font-semibold text-gray-700 transition-colors md:whitespace-nowrap group-hover:text-sebna-navy">
                          {item.name}
                        </span>
                      )}
                    </span>
                    {!isCollapsed && (
                      <svg
                        className={`mr-3 w-4 h-4 text-gray-400 transition-transform duration-300 ${
                          expandedMenus.includes(item.name) ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </button>

                  {/* Submenu Items */}
                  {expandedMenus.includes(item.name) && (
                    <div
                      className={`pl-1 mt-1 space-y-2 border-l-2 border-sebna-navy/20 ${
                        isCollapsed ? '' : 'ml-6'
                      }`}
                    >
                      {item.navs.map((child) => (
                        <button
                          key={child.path}
                          onClick={() => {
                            navigate(child.path);
                            handleSingleItemClick();
                          }}
                          className={`flex pl-3 h-10 rounded-lg transition-all duration-200 group w-full ${
                            isActive(child.path)
                              ? 'bg-sebna-navy text-white shadow-md'
                              : 'hover:bg-sebna-navy/10 text-gray-600'
                          }`}
                        >
                          <span className="flex gap-3 items-center">
                            <span className={`text-lg ${isActive(child.path) ? 'text-white' : 'text-gray-500'}`}>
                              {child.icon}
                            </span>
                            {!isCollapsed && (
                              <span
                                className={`text-sm font-medium transition-colors ${
                                  isActive(child.path)
                                    ? 'text-white'
                                    : 'text-gray-600 group-hover:text-gray-900'
                                }`}
                              >
                                {child.name}
                              </span>
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Single menu item */
                <button
                  onClick={() => {
                    navigate(item.path);
                    handleSingleItemClick();
                  }}
                  className={`flex h-12 rounded-xl transition-all duration-200 group w-full ${
                    isActive(item.path)
                      ? 'bg-sebna-navy text-white shadow-md'
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  } ${isCollapsed ? 'justify-center' : 'pl-3'}`}
                >
                  <span className="flex gap-3 items-center">
                    <span className={`text-lg ${isActive(item.path) ? 'text-white' : 'text-sebna-navy'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span
                        className={`text-sm font-semibold transition-all duration-200 ${
                          isActive(item.path)
                            ? 'text-white'
                            : 'text-gray-700 group-hover:text-sebna-navy'
                        }`}
                      >
                        {item.name}
                      </span>
                    )}
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
          <div className="flex gap-3 items-center p-3 rounded-xl bg-sebna-navy/5">
            <div className="flex justify-center items-center w-10 h-10 rounded-full bg-sebna-navy/10">
                             <img src={brandIcon} alt="Sebna" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {userData.firstName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{userData.roleName || 'Role'}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        button,
        a {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .router-link-active::before {
            width: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
