'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  icon: React.ReactNode;
  description: string;
}

const services: Service[] = [
  {
    id: 'cleaning',
    name: 'House Cleaning',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">🏠</span></div>,
    description: 'Professional home cleaning services'
  },
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">🔧</span></div>,
    description: 'Expert plumbing repairs and installations'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">⚡</span></div>,
    description: 'Safe and reliable electrical work'
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">🎨</span></div>,
    description: 'Interior and exterior painting'
  },
  {
    id: 'handyman',
    name: 'Handyman',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">🔨</span></div>,
    description: 'General home repairs and maintenance'
  },
  {
    id: 'moving',
    name: 'Moving',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">📦</span></div>,
    description: 'Professional moving services'
  },
  {
    id: 'assembly',
    name: 'Assembly',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">🪑</span></div>,
    description: 'Furniture assembly and installation'
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center"><span className="text-cyan-600 text-lg">📱</span></div>,
    description: 'Smart home device setup'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const handleServiceClick = (serviceId: string) => {
    // Immediately redirect to booking page with the selected service
    router.push(`/booking?service=${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Integrated Services */}
      <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-cyan-50/30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              All the help your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-800">
                home needs.
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-5xl mx-auto leading-relaxed font-light">
              Professional home services at your fingertips.
            </p>
          </motion.div>
          
          {/* Integrated Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {services.map((service, index) => {
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:ring-2 hover:ring-cyan-500 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-cyan-100"
                      onClick={() => handleServiceClick(service.id)}
                    >
                      <CardContent className="p-10 text-center">
                        <div className="mb-8 flex justify-center">
                          {service.icon}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-4 text-xl">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                        <div className="mt-4">
                          <ArrowRight className="w-6 h-6 text-cyan-600 mx-auto" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Why choose us?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Trusted Professionals</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Background-checked and verified professionals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Flexible Scheduling</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Book at your convenience, anytime.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Quality Guaranteed</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                100% satisfaction guarantee on all services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 to-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-gray-900 mb-8">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of satisfied customers who trust us with their home services.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
            <ArrowRight className="w-6 h-6 ml-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}