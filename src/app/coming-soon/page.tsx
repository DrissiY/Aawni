'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';

export default function ComingSoonPage() {
  const handleSignUp = () => {
    window.open('tel:703719535', '_self');
  };

  return (
    <div className="relative bg-[#F7D511]">
      {/* Wave Background Image - Fixed at top of page */}
      <div 
        className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0 transition-all duration-300 ease-out block"
      >
     
      </div>

      {/* All content above background */}
      <div className="relative z-10">
        {/* Navbar */}
        
        {/* Coming Soon Section */}
        <section className="min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-16">
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo and Coming Soon */}
              <div className="mb-8 sm:mb-12">
                <Image
                  src="/logo-blue.svg"
                  alt="Aawni Logo"
                  width={160}
                  height={160}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto mb-6 sm:mb-8"
                />
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary mb-4">
                  Coming Soon!
                </h1>
              </div>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-12 sm:mb-16 max-w-2xl mx-auto leading-relaxed"
              >
                We&apos;re working hard to bring you the best home service platform. 
                Get ready for trusted help at your fingertips!
              </motion.p>
              
              {/* Sign Up Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={handleSignUp}
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up Now
                </Button>
              
              </motion.div>
              
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}