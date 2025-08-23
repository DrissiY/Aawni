'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  
  // Mock authentication state for UI development
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('unauthenticated');
  const mockUser = { name: 'John Doe', email: 'john@example.com' };
  
  const isAuthenticated = authState === 'authenticated';
  const isLoading = authState === 'loading';

  const navigationItems = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/services' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const languages = [
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as const, name: 'العربية', flag: '🇲🇦' },
  ];

  const handleSignOut = () => {
    setAuthState('unauthenticated');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={cn('bg-transparent border-b border-gray-200', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors">
                Aawni
              </span>
            </Link>
            {/* Dev toggle for testing auth states */}
            <button 
              onClick={() => setAuthState(prev => 
                prev === 'unauthenticated' ? 'authenticated' : 
                prev === 'authenticated' ? 'loading' : 'unauthenticated'
              )}
              className="ml-4 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border text-gray-600"
              title="Toggle auth state (dev only)"
            >
              {authState}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="hidden md:block">
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === language)?.flag}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Language Dropdown */}
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${
                        language === lang.code ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-full transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {mockUser.name || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('settings')}
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                <Link href="/auth/signin">
                  <Button variant="secondary" size="sm">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    {t('signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-cyan-600 hover:bg-gray-100 transition-colors"
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
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-cyan-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoading ? (
              <div className="flex items-center px-5">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="px-5">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center">
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
                  <button className="ml-auto p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-cyan-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Sign Up
                  </Button>
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