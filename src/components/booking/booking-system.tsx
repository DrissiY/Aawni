'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  User, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  Home,
  Settings,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Step Components
import { LocationStep } from './steps/location-step';
import { DateTimeStep } from './steps/datetime-step';
import { FreelancerScheduleStep } from './steps/freelancer-schedule-step';
import { CustomerInfoStep } from './steps/customer-info-step';
import { ConfirmationStep } from './steps/confirmation-step';

interface BookingSystemProps {
  selectedServices: string[];
  selectedSubServices: string[];
}

const steps = [
  {
    id: 0,
    name: 'Location',
    icon: MapPin,
    description: 'Where do you need service?'
  },
  {
    id: 1,
    name: 'Schedule',
    icon: Calendar,
    description: 'Choose freelancer & schedule'
  },
  {
    id: 2,
    name: 'Contact',
    icon: Settings,
    description: 'Your contact information'
  },
  {
    id: 3,
    name: 'Confirm',
    icon: CheckCircle,
    description: 'Review and confirm'
  }
];

export function BookingSystem({ selectedServices, selectedSubServices }: BookingSystemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const {
    currentStep,
    offerId,
    setOfferId,
    setSelectedServices,
    nextStep,
    previousStep,
    canProceedToNextStep,
    getCompletionPercentage,
    resetBooking,
    location,
    selectedTechnician,
    dateTime,
    selectedHours,
    customerInfo
  } = useBookingStore();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Initialize booking data from props and URL
  useEffect(() => {
    const offerIdFromUrl = searchParams.get('offer');
    if (offerIdFromUrl) {
      setOfferId(offerIdFromUrl);
    }
    
    if (selectedServices.length > 0 && selectedSubServices.length > 0) {
      setSelectedServices(selectedServices, selectedSubServices);
    }
  }, [selectedServices, selectedSubServices, searchParams, setOfferId, setSelectedServices]);

  const handleNext = () => {
    if (canProceedToNextStep()) {
      nextStep();
      // Update URL with current step
      const url = new URL(window.location.href);
      url.searchParams.set('step', (currentStep + 1).toString());
      if (offerId) {
        url.searchParams.set('offer', offerId);
      }
      router.push(url.pathname + url.search);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      previousStep();
      // Update URL with current step
      const url = new URL(window.location.href);
      url.searchParams.set('step', (currentStep - 1).toString());
      if (offerId) {
        url.searchParams.set('offer', offerId);
      }
      router.push(url.pathname + url.search);
    }
  };

  const handleBackToServices = () => {
    resetBooking();
    router.push('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <LocationStep />;
      case 1:
        return <FreelancerScheduleStep />;
      case 2:
        return <CustomerInfoStep />;
      case 3:
        return <ConfirmationStep />;
      default:
        return <LocationStep />;
    }
  };

  const currentStepData = steps[currentStep];
  const completionPercentage = isHydrated ? getCompletionPercentage() : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, stepIdx) => {
                const isCompleted = stepIdx < currentStep;
                const isCurrent = stepIdx === currentStep;
                const isUpcoming = stepIdx > currentStep;
                
                return (
                  <li key={step.name} className="relative flex-1">
                    {stepIdx !== steps.length - 1 && (
                      <div className="absolute top-4 left-1/2 h-0.5 bg-gray-300 border-b border-gray-400" style={{ width: 'calc(100% - 2rem)', marginLeft: '1rem' }}>
                        <div 
                          className={`h-full transition-all duration-500 border-b ${
                            isCompleted ? 'bg-gray-400 border-gray-500' : 'bg-gray-300 border-gray-400'
                          }`}
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                    
                    <div className="relative flex flex-col items-center group">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                        ${
                          isCompleted 
                            ? 'bg-primary-600 border-primary-600 text-white' 
                            : isCurrent 
                            ? 'bg-white border-primary-600 text-primary-600 ring-4 ring-primary-100'
                            : 'bg-white border-gray-300 text-gray-400'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="mt-2 text-center">
                        <div className={`text-xs font-medium ${
                          isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToServices}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Services</span>
                    </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  {/* Left side: Back to Services button and Step info */}
                  <div className="flex items-center space-x-4">
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <currentStepData.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{currentStepData.name}</CardTitle>
                        <p className="text-gray-600 text-sm">{currentStepData.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side: Navigation buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={!isHydrated || currentStep === 0}
                      className="p-2 h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    {/* Next Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={!isHydrated || !canProceedToNextStep()}
                      className="p-2 h-8 w-8"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            {/* Selected Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedSubServices.map((subService, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{subService}</span>
                      <Badge variant="cyan" className="text-xs">
                        Selected
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completion</span>
                    <span className="text-sm font-medium">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                  
                  <div className="text-xs text-gray-500 mb-4">
                    {currentStep + 1} of {steps.length} steps completed
                  </div>

                  {/* Selected Information */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {/* Location */}
                    {location && (
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-primary-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Location</div>
                          <div className="text-xs text-gray-600">{location.address}</div>
                        </div>
                      </div>
                    )}

                    {/* Freelancer & Schedule */}
                    {selectedTechnician && (
                      <div className="flex items-start space-x-3">
                        <User className="h-4 w-4 text-primary-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Freelancer</div>
                          <div className="text-xs text-gray-600">{selectedTechnician.name}</div>
                          <div className="text-xs text-gray-500">${selectedTechnician.hourlyRate}/hr</div>
                        </div>
                      </div>
                    )}

                    {/* Date & Time */}
                    {dateTime && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-4 w-4 text-primary-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Schedule</div>
                          <div className="text-xs text-gray-600">
                            {new Date(dateTime.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="text-xs text-gray-500">{dateTime.time}</div>
                        </div>
                      </div>
                    )}

                    {/* Hours */}
                    {selectedHours && selectedHours > 0 && (
                      <div className="flex items-start space-x-3">
                        <Clock className="h-4 w-4 text-primary-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Duration</div>
                          <div className="text-xs text-gray-600">{selectedHours} {selectedHours === 1 ? 'hour' : 'hours'}</div>
                          {selectedTechnician && (
                            <div className="text-xs text-gray-500">Est. ${(selectedTechnician.hourlyRate * selectedHours).toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Info */}
                    {customerInfo && customerInfo.name && (
                      <div className="flex items-start space-x-3">
                        <Settings className="h-4 w-4 text-primary-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Contact</div>
                          <div className="text-xs text-gray-600">{customerInfo.name}</div>
                          <div className="text-xs text-gray-500">{customerInfo.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Bottom Sheet */}
        <div className="lg:hidden">
          {/* Bottom Navigation Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div 
              className="px-4 py-3 cursor-pointer"
              onClick={() => setIsBottomSheetOpen(!isBottomSheetOpen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {steps.map((step, index) => {
                      const isCompleted = index < currentStep;
                      const isCurrent = index === currentStep;
                      return (
                        <div
                          key={step.id}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            isCompleted
                              ? 'bg-primary-600'
                              : isCurrent
                              ? 'bg-primary-400'
                              : 'bg-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {completionPercentage}% Complete
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Details</span>
                  {isBottomSheetOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sheet Content */}
          <AnimatePresence>
            {isBottomSheetOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 max-h-[70vh] overflow-y-auto"
              >
                <div className="p-4 space-y-4">
                  {/* Selected Services */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Services</h3>
                    <div className="space-y-2">
                      {selectedSubServices.map((subService, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{subService}</span>
                          <Badge variant="cyan" className="text-xs">
                            Selected
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Progress</h3>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completion</span>
                        <span className="text-sm font-medium">{completionPercentage}%</span>
                      </div>
                      <Progress value={completionPercentage} className="h-2" />
                      
                      <div className="text-xs text-gray-500 mb-4">
                        {currentStep + 1} of {steps.length} steps completed
                      </div>

                      {/* Selected Information */}
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        {/* Location */}
                        {location && (
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-4 w-4 text-primary-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Location</div>
                              <div className="text-xs text-gray-600">{location.address}</div>
                            </div>
                          </div>
                        )}

                        {/* Freelancer & Schedule */}
                        {selectedTechnician && (
                          <div className="flex items-start space-x-3">
                            <User className="h-4 w-4 text-primary-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Freelancer</div>
                              <div className="text-xs text-gray-600">{selectedTechnician.name}</div>
                              <div className="text-xs text-gray-500">${selectedTechnician.hourlyRate}/hr</div>
                            </div>
                          </div>
                        )}

                        {/* Date & Time */}
                        {dateTime && (
                          <div className="flex items-start space-x-3">
                            <Calendar className="h-4 w-4 text-primary-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Schedule</div>
                              <div className="text-xs text-gray-600">
                                {new Date(dateTime.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              <div className="text-xs text-gray-500">{dateTime.time}</div>
                            </div>
                          </div>
                        )}

                        {/* Hours */}
                        {selectedHours && selectedHours > 0 && (
                          <div className="flex items-start space-x-3">
                            <Clock className="h-4 w-4 text-primary-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Duration</div>
                              <div className="text-xs text-gray-600">{selectedHours} {selectedHours === 1 ? 'hour' : 'hours'}</div>
                              {selectedTechnician && (
                                <div className="text-xs text-gray-500">Est. ${(selectedTechnician.hourlyRate * selectedHours).toFixed(2)}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Contact Info */}
                        {customerInfo && customerInfo.name && (
                          <div className="flex items-start space-x-3">
                            <Settings className="h-4 w-4 text-primary-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Contact</div>
                              <div className="text-xs text-gray-600">{customerInfo.name}</div>
                              <div className="text-xs text-gray-500">{customerInfo.email}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}