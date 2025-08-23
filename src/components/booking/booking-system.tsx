'use client';

import React, { useEffect } from 'react';
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
  Settings
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
  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToServices}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Services</span>
              </Button>
              
              <div className="h-6 w-px bg-gray-300" />
              
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Book Your Service
                </h1>
                <p className="text-sm text-gray-500">
                  {selectedSubServices.length} service{selectedSubServices.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="w-32">
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b">
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
                      <div className="absolute top-4 left-1/2 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 2rem)', marginLeft: '1rem' }}>
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? 'bg-cyan-600' : 'bg-gray-200'
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
                            ? 'bg-cyan-600 border-cyan-600 text-white' 
                            : isCurrent 
                            ? 'bg-white border-cyan-600 text-cyan-600 ring-4 ring-cyan-100'
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
                          isCurrent ? 'text-cyan-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  {/* Left side: Step info */}
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <currentStepData.icon className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{currentStepData.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{currentStepData.description}</p>
                    </div>
                  </div>
                  
                  {/* Right side: Navigation buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="p-2 h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    {/* Next Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={!canProceedToNextStep()}
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

          {/* Sidebar */}
          <div className="space-y-6">
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
                        <MapPin className="h-4 w-4 text-cyan-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">Location</div>
                          <div className="text-xs text-gray-600">{location.address}</div>
                        </div>
                      </div>
                    )}

                    {/* Freelancer & Schedule */}
                    {selectedTechnician && (
                      <div className="flex items-start space-x-3">
                        <User className="h-4 w-4 text-cyan-600 mt-0.5" />
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
                        <Calendar className="h-4 w-4 text-cyan-600 mt-0.5" />
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
                        <Clock className="h-4 w-4 text-cyan-600 mt-0.5" />
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
                        <Settings className="h-4 w-4 text-cyan-600 mt-0.5" />
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


      </div>
    </div>
  );
}