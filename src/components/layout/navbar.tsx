'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Settings,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Globe,
  Package,
  ShoppingBag,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { getCurrentOrders } from '@/data/mock-orders';
import { getUnreadNotifications, formatNotificationTime, getNotificationIcon, type Notification } from '@/data/mock-notifications';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const router = useRouter();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const mobileNotificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node) &&
          mobileNotificationsRef.current && !mobileNotificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const { language, setLanguage, t } = useLanguage();
  
  // Mock authentication state for UI development
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('unauthenticated');
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  
  const isAuthenticated = authState === 'authenticated';
  const isLoading = authState === 'loading';


  const handleSignOut = () => {
    setAuthState('unauthenticated');
    setIsUserMenuOpen(false);
  };

  const navigationItems = [
    { name: t('home'), href: '/' },
  ];

  // Get current orders count for notification badge
  const currentOrders = getCurrentOrders();
  const currentOrdersCount = currentOrders.length;
  
  // Get unread notifications count
  const unreadNotifications = getUnreadNotifications();
  const notificationsCount = unreadNotifications.length;
  
  const handleNotificationClick = (notification: Notification) => {
    setIsNotificationsOpen(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };
  
  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsUserMenuOpen(false); // Close user menu when opening notifications
  };
  
  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsNotificationsOpen(false); // Close notifications when opening user menu
  };

  return (
    <nav className={cn(' my-4', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-blue.svg"
                alt="Aawni"
                width={220}
                height={208}
                className="h-12 w-auto"
              />
            </Link>

          </div>

                     <button 
              onClick={() => setAuthState(prev => 
                prev === 'unauthenticated' ? 'authenticated' : 
                prev === 'authenticated' ? 'loading' : 'unauthenticated'
              )}
              className="ml-4 px-2 py-1 text-xs rounded border text-gray-600"
              title="Toggle auth state (dev only)"
            >
              {authState}
            </button>


          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full animate-pulse border border-gray-300"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Orders Icon with Badge */}
                <Link href="/orders" className="p-2 text-neutral hover:text-primary rounded-full transition-colors relative">
                  <Package className="h-5 w-5" />
                  {currentOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {currentOrdersCount > 9 ? '9+' : currentOrdersCount}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button 
                    onClick={handleNotificationsToggle}
                    className="p-2 text-neutral hover:text-primary rounded-full transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {notificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notificationsCount > 9 ? '9+' : notificationsCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-lg border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                      <div className="p-3 sm:p-4 border-b border-gray-100">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notifications</h3>
                        {notificationsCount > 0 && (
                          <p className="text-sm text-gray-500">{notificationsCount} unread</p>
                        )}
                      </div>
                      <div className="py-2">
                        {unreadNotifications.length === 0 ? (
                          <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-500">
                            <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm sm:text-base">No new notifications</p>
                          </div>
                        ) : (
                          unreadNotifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className="w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-start space-x-2 sm:space-x-3">
                                <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                      {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                      {formatNotificationTime(notification.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                      {unreadNotifications.length > 0 && (
                        <div className="p-2 sm:p-3 border-t border-gray-100">
                          <Link href="/notifications" className="block">
                             <button className="w-full text-center text-xs sm:text-sm text-primary hover:text-primary-600 font-medium py-1">
                               View all notifications
                             </button>
                           </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 p-2 text-neutral hover:text-primary rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {mockUser.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-3xl shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-neutral hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Orders
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-neutral hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('settings')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-neutral hover:text-primary"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/signup"
                  className="text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  Join as Tasker
                </Link>
                <Link href="/login">
                  <Button size="md">
                    Login
                  </Button>
                </Link>
      
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3">
            {isLoading ? (
              <div className="flex items-center px-5">
                <div className="w-8 h-8 rounded-full animate-pulse border border-gray-300"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="px-5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-800">
                      {mockUser.name || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {mockUser.email}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {/* Orders Icon with Badge */}
                    <Link href="/orders" className="p-2 text-neutral hover:text-primary rounded-full transition-colors relative">
                      <Package className="h-5 w-5" />
                      {currentOrdersCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {currentOrdersCount > 9 ? '9+' : currentOrdersCount}
                        </span>
                      )}
                    </Link>
                    
                    {/* Notifications */}
                    <div className="relative" ref={mobileNotificationsRef}>
                      <button 
                         onClick={handleNotificationsToggle}
                         className="p-2 text-neutral hover:text-primary rounded-full transition-colors relative"
                       >
                        <Bell className="h-5 w-5" />
                        {notificationsCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {notificationsCount > 9 ? '9+' : notificationsCount}
                          </span>
                        )}
                      </button>
                      
                      {/* Mobile Notifications Dropdown */}
                      {isNotificationsOpen && (
                        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-lg border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                          <div className="p-3 sm:p-4 border-b border-gray-100">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Notifications</h3>
                            {notificationsCount > 0 && (
                              <p className="text-sm text-gray-500">{notificationsCount} unread</p>
                            )}
                          </div>
                          <div className="py-2">
                            {unreadNotifications.length === 0 ? (
                              <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-gray-500">
                                <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm sm:text-base">No new notifications</p>
                              </div>
                            ) : (
                              unreadNotifications.map((notification) => (
                                <button
                                  key={notification.id}
                                  onClick={() => handleNotificationClick(notification)}
                                  className="w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
                                >
                                  <div className="flex items-start space-x-2 sm:space-x-3">
                                    <span className="text-base sm:text-lg flex-shrink-0 mt-0.5">
                                      {getNotificationIcon(notification.type)}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                          {notification.title}
                                        </p>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                          {formatNotificationTime(notification.timestamp)}
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                        {notification.message}
                                      </p>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                          {unreadNotifications.length > 0 && (
                            <div className="p-2 sm:p-3 border-t border-gray-100">
                           <Link href="/notifications" className="block">
                             <button className="w-full text-center text-xs sm:text-sm text-primary hover:text-primary-600 font-medium py-1">
                               View all notifications
                             </button>
                           </Link>
                         </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-neutral hover:text-primary rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center px-3 py-2 text-base font-medium text-neutral hover:text-primary rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-5 w-5 mr-3" />
                    Orders
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 text-base font-medium text-neutral hover:text-primary rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-neutral hover:text-primary rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Login
                  </Button>
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-primary hover:text-primary-600 font-medium text-base transition-colors"
                >
                  Join as Tasker
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;