'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MapPin, Clock, User, Star, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockOrders } from '@/data/mock-orders';
import { Order } from '@/types/order';
import { useState } from 'react';

const reviewAdjectives = [
  { id: 'excellent', label: 'Excellent', emoji: '🌟' },
  { id: 'professional', label: 'Professional', emoji: '👔' },
  { id: 'punctual', label: 'Punctual', emoji: '⏰' },
  { id: 'friendly', label: 'Friendly', emoji: '😊' },
  { id: 'efficient', label: 'Efficient', emoji: '⚡' },
  { id: 'clean', label: 'Clean Work', emoji: '✨' },
  { id: 'knowledgeable', label: 'Knowledgeable', emoji: '🧠' },
  { id: 'courteous', label: 'Courteous', emoji: '🤝' }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in_progress':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [selectedAdjectives, setSelectedAdjectives] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Find the order by ID
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const toggleAdjective = (adjectiveId: string) => {
    setSelectedAdjectives(prev => 
      prev.includes(adjectiveId)
        ? prev.filter(id => id !== adjectiveId)
        : [...prev, adjectiveId]
    );
  };

  const submitReview = () => {
    if (rating > 0) {
      setReviewSubmitted(true);
      // Here you would typically send the review to your backend
      console.log('Review submitted:', { rating, adjectives: selectedAdjectives });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.id}</p>
            </div>
            <Badge className={`px-3 py-1 text-sm font-medium border ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.serviceType} - {order.subService}</h3>
                  <p className="text-gray-600 mt-1">{order.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(order.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{formatTime(order.scheduledTime)} ({order.estimatedDuration}h)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.location.address}, {order.location.city}</span>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Technician Information */}
            {order.technicianName && (
              <Card>
                <CardHeader>
                  <CardTitle>Technician Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{order.technicianName}</h3>
                      <p className="text-gray-600">{order.technicianPhone}</p>
                      {order.rating && (
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{order.rating}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Review Section for Completed Orders */}
            {order.status === 'completed' && !reviewSubmitted && (
              <Card>
                <CardHeader>
                  <CardTitle>Rate Your Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Star Rating */}
                  <div>
                    <p className="font-medium mb-3">Overall Rating</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Adjectives */}
                  <div>
                    <p className="font-medium mb-3">What made this service great? (Select all that apply)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {reviewAdjectives.map((adjective) => (
                        <button
                          key={adjective.id}
                          onClick={() => toggleAdjective(adjective.id)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedAdjectives.includes(adjective.id)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-lg mb-1">{adjective.emoji}</div>
                          {adjective.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={submitReview}
                    disabled={rating === 0}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Review Submitted */}
            {reviewSubmitted && (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your review has been submitted successfully.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${order.price}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.status !== 'pending' && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Technician Assigned</p>
                        <p className="text-sm text-gray-600">{order.technicianName}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'in_progress' && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Service In Progress</p>
                        <p className="text-sm text-gray-600">Technician is on the way</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'completed' && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">Service Completed</p>
                        <p className="text-sm text-gray-600">Ready for review</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <Button variant="destructive" className="w-full">
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}