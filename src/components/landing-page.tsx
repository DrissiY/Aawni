'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowRight,
  Users,
  Calendar,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { useLanguage } from '@/contexts/language-context';

interface Service {
  id: string;
  name: string;
  image: string;
  subservices: string[];
}

const services: Service[] = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    image: '/servies/cleaning.png',
    subservices: ['Express Cleaning', 'Deep Cleaning', 'Villa cleaning', 'Office Cleaning']
  },
  {
    id: 'electricity',
    name: 'Electricity',
    image: '/servies/Electricity.png',
    subservices: ['Wiring Installation', 'Outlet Repair', 'Light Fixture', 'Circuit Breaker']
  },
  {
    id: 'moving',
    name: 'Moving',
    image: '/servies/moving.png',
    subservices: ['Local Moving', 'Long Distance', 'Packing Service', 'Storage']
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    image: '/servies/plumbery.png',
    subservices: ['Pipe Repair', 'Drain Cleaning', 'Faucet Installation', 'Water Heater']
  },
  {
    id: 'outdoor',
    name: 'Outdoor Help',
    image: '/servies/outdoor.png',
    subservices: ['Lawn Care', 'Garden Maintenance', 'Tree Trimming', 'Landscaping']
  },
  {
    id: 'painting',
    name: 'Painting',
    image: '/servies/painting.png',
    subservices: ['Interior Painting', 'Exterior Painting', 'Wall Preparation', 'Color Consultation']
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [backgroundVisible, setBackgroundVisible] = useState(true);

  const handleServiceClick = (serviceId: string) => {
    if (selectedService === serviceId) {
      setSelectedService(null);
    } else {
      setSelectedService(serviceId);
    }
  };

  const handleSubserviceClick = (serviceId: string, subservice: string) => {
    // Pass services and subServices as comma-separated arrays to match booking system expectations
    router.push(`/booking?services=${serviceId}&subServices=${encodeURIComponent(subservice)}`);
  };

  return (
    <div className="relative">
      {/* Wave Background Image - Fixed at top of page */}
      <div 
        className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0 transition-all duration-300 ease-out block"
      >
        <Image
          src="/servies/bg-waves.png"
          alt="Wave background"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* All content above background */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />
        
        {/* Hero Section */}
        <section className=" flex items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-16">
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-2">
              Book trusted help
              <span className="block text-gray-900">
                for home tasks
              </span>
            </h1>
          </motion.div>
          
          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {services.map((service, index) => {
                const isSelected = selectedService === service.id;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={`cursor-pointer transition-all duration-300 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 w-full bg-white ${
                        isSelected 
                          ? 'border-primary bg-primary-50' 
                          : 'border-gray-200 hover:border-primary hover:shadow-md'
                      }`}
                      onClick={() => handleServiceClick(service.id)}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 relative">
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center leading-tight">
                        {service.name}
                      </h3>
                    </div>

                  </motion.div>
                );
              })}
            </div>
            
            {/* Subservices */}
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 sm:p-6 border-t border-gray-300"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {services.find(s => s.id === selectedService)?.subservices.map((subservice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className=" bg-white h-auto py-3 px-4 text-left justify-start hover:bg-primary-50 hover:border-primary transition-colors text-sm"
                      onClick={() => handleSubserviceClick(selectedService, subservice)}
                    >
                      {subservice}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Rest of the landing page content would go here */}
      
      </div>
    </div>
  );
}