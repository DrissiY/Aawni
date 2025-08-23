'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { BookingSystem } from '@/components/booking/booking-system';
import { useSearchParams } from 'next/navigation';

function BookingContent() {
  const searchParams = useSearchParams();
  
  // Get selected services from URL parameters
  const servicesParam = searchParams.get('services');
  const subServicesParam = searchParams.get('subServices');
  
  const selectedServices = servicesParam ? servicesParam.split(',') : [];
  const selectedSubServices = subServicesParam ? subServicesParam.split(',') : [];
  
  // Redirect to home if no services selected
  if (selectedServices.length === 0 || selectedSubServices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            No Services Selected
          </h1>
          <p className="text-gray-600 mb-8">
            Please select at least one service to continue with booking.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <BookingSystem 
      selectedServices={selectedServices}
      selectedSubServices={selectedSubServices}
    />
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking system...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}