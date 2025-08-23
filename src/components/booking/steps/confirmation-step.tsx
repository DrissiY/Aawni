'use client';

import React from 'react';
import { CheckCircle, MapPin, Calendar, Clock, User, Phone, Mail, FileText, DollarSign, Star } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function ConfirmationStep() {
  const { 
    location, 
    dateTime, 
    selectedTechnician, 
    customerInfo,
    selectedServices,
    selectedSubServices,
    pricing 
  } = useBookingStore();

  const handleConfirmBooking = () => {
    // In a real app, this would submit the booking to the backend
    console.log('Booking confirmed:', {
      location,
      dateTime,
      selectedTechnician,
      customerInfo,
      selectedServices,
      selectedSubServices,
      pricing
    });
    
    // Redirect to payment or success page
    alert('Booking confirmed! Redirecting to payment...');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Review Your Booking</h2>
        <p className="text-gray-600">
          Please review all details before confirming your service appointment.
        </p>
      </div>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Service Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Services */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Selected Services</h4>
            <div className="flex flex-wrap gap-2">
              {selectedServices.map((service, index) => (
                <Badge key={index} variant="secondary" className="bg-primary-100 text-primary-700">
                  {service}
                </Badge>
              ))}
            </div>
            {selectedSubServices.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Sub-services:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubServices.map((subService, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subService}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>


        </CardContent>
      </Card>

      {/* Location & Schedule */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Service Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {location && (
              <div className="space-y-2">
                <p className="font-medium">{location.address}</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>City: {location.city}</p>
                  {location.postalCode && <p>ZIP: {location.postalCode}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Appointment Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dateTime && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {new Date(dateTime.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{dateTime.time}</span>
                </div>
                <p className="text-sm text-gray-600">{dateTime.timezone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technician */}
      {selectedTechnician && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Assigned Technician</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedTechnician.avatar} alt={selectedTechnician.name} />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-lg font-semibold">
                  {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedTechnician.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedTechnician.rating)}
                  </div>
                  <span className="text-sm font-medium">{selectedTechnician.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTechnician.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">${selectedTechnician.hourlyRate}</div>
                <div className="text-sm text-gray-500">per hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Information */}
      {customerInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customerInfo.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customerInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{customerInfo.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Summary */}
      {pricing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Pricing Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Base Service</span>
                <span>${pricing.basePrice}</span>
              </div>
              {pricing.extraTasksPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Additional Tasks</span>
                  <span>${pricing.extraTasksPrice}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${pricing.totalPrice} {pricing.currency}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleConfirmBooking}
          size="lg"
          className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 text-lg font-semibold"
        >
          Confirm Booking & Proceed to Payment
        </Button>
      </div>

      {/* Terms Notice */}
      <div className="text-center text-xs text-gray-500 max-w-md mx-auto">
        By confirming this booking, you agree to our Terms of Service and Privacy Policy. 
        Payment will be processed securely after confirmation.
      </div>
    </div>
  );
}