'use client';

import React, { useState } from 'react';
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


  const handleSignOut = () => {
    setAuthState('unauthenticated');
    setIsUserMenuOpen(false);
  };

  const navigationItems = [
    { name: t('home'), href: '/' },
  ];

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
                {/* Notifications */}
                <button className="p-2 text-neutral hover:text-primary rounded-full transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-neutral hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t('profile')}
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
                  <button className="ml-auto p-2 text-neutral hover:text-primary rounded-full transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
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