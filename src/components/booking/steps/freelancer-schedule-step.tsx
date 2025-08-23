'use client';

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Award, Filter, Search, Calendar, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock freelancer data with availability
const MOCK_FREELANCERS = [
  {
    id: '1',
    name: 'John Smith',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 75,
    avatar: '/avatars/john.jpg',
    specialties: ['Plumbing', 'Electrical', 'General Repair'],
    experience: '8 years',
    distance: '2.3 miles',
    responseTime: '< 1 hour',
    completedJobs: 340,
    description: 'Experienced technician specializing in residential repairs and maintenance.',
    verified: true,
    // Mock availability - in real app, fetch from API
    unavailableDates: ['2024-01-15', '2024-01-20', '2024-01-25']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 80,
    avatar: '/avatars/sarah.jpg',
    specialties: ['HVAC', 'Electrical', 'Smart Home'],
    experience: '6 years',
    distance: '3.1 miles',
    responseTime: '< 2 hours',
    completedJobs: 215,
    description: 'HVAC specialist with expertise in modern smart home systems.',
    verified: true,
    unavailableDates: ['2024-01-18', '2024-01-22', '2024-01-28']
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 70,
    avatar: '/avatars/mike.jpg',
    specialties: ['Carpentry', 'Painting', 'General Repair'],
    experience: '10 years',
    distance: '4.2 miles',
    responseTime: '< 3 hours',
    completedJobs: 428,
    description: 'Skilled carpenter and handyman with a decade of experience.',
    verified: true,
    unavailableDates: ['2024-01-16', '2024-01-21', '2024-01-26']
  },
  {
    id: '4',
    name: 'Lisa Chen',
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 85,
    avatar: '/avatars/lisa.jpg',
    specialties: ['Appliance Repair', 'Electrical', 'Plumbing'],
    experience: '12 years',
    distance: '1.8 miles',
    responseTime: '< 30 min',
    completedJobs: 567,
    description: 'Master technician with extensive experience in appliance repair.',
    verified: true,
    unavailableDates: ['2024-01-17', '2024-01-23', '2024-01-29']
  }
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

type SortOption = 'rating' | 'price' | 'distance' | 'experience';

export function FreelancerScheduleStep() {
  const { 
    selectedTechnician, 
    setSelectedTechnician, 
    dateTime, 
    setDateTime,
    selectedHours,
    setSelectedHours,
    showTechnicianCalendar,
    setShowTechnicianCalendar 
  } = useBookingStore();
  
  const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dateTime?.date ? new Date(dateTime.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(dateTime?.time || null);
  const [hours, setHours] = useState<number>(selectedHours || 1);

  // Filter and sort freelancers
  useEffect(() => {
    let filtered = MOCK_FREELANCERS;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(freelancer => 
        freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        freelancer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.hourlyRate - b.hourlyRate;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        default:
          return 0;
      }
    });

    setFreelancers(filtered);
  }, [searchQuery, sortBy]);

  // Get calendar days for next 15 days
  const getNext15Days = () => {
    const days: Array<{
      date: Date;
      dateString: string;
      isUnavailable: boolean;
      isSelected: boolean;
      isAvailable: boolean;
    }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedFreelancer = MOCK_FREELANCERS.find(f => f.id === selectedTechnician?.id);
    const unavailableDates = selectedFreelancer?.unavailableDates || [];

    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const isUnavailable = unavailableDates.includes(dateString) || 
                           // Make some random days unavailable for testing
                           [2, 5, 8, 11, 13].includes(i);
      const isSelected = selectedDate ? date.getTime() === selectedDate.getTime() : false;
      
      days.push({
        date,
        dateString,
        isUnavailable,
        isSelected,
        isAvailable: !isUnavailable
      });
    }

    return days;
  };

  const handleFreelancerSelect = (freelancer: typeof MOCK_FREELANCERS[0]) => {
    const isCurrentlySelected = selectedTechnician?.id === freelancer.id;
    
    if (isCurrentlySelected) {
      // If clicking the same freelancer, toggle calendar visibility
      setShowTechnicianCalendar(!showTechnicianCalendar);
    } else {
      // If selecting a different freelancer
      setSelectedTechnician({
        id: freelancer.id,
        name: freelancer.name,
        rating: freelancer.rating,
        hourlyRate: freelancer.hourlyRate,
        avatar: freelancer.avatar,
        specialties: freelancer.specialties
      });
      setShowTechnicianCalendar(true);
      // Reset date/time selection when changing freelancer
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleHoursChange = (newHours: number) => {
    setHours(newHours);
    setSelectedHours(newHours);
  };

  const handleBackToFreelancers = () => {
    setShowTechnicianCalendar(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Update booking store when all selections are made
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDateTime({
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        timezone
      });
    }
  }, [selectedDate, selectedTime, setDateTime]);

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

  // Show freelancer calendar if a freelancer is selected
  if (showTechnicianCalendar && selectedTechnician) {
    const next15Days = getNext15Days();
    
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToFreelancers}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Freelancers</span>
          </Button>
          
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedTechnician.avatar} alt={selectedTechnician.name} />
              <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">
                {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedTechnician.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(selectedTechnician.rating)}
                </div>
                <span className="text-sm text-gray-600">{selectedTechnician.rating}</span>
                <span className="text-sm text-gray-600">• ${selectedTechnician.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* 15-day availability calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{selectedTechnician.name}&apos;s Availability</span>
            </CardTitle>
            <p className="text-sm text-gray-600">Next 15 days</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
                         {next15Days.map((day, index) => (
                           <button
                             key={index}
                             onClick={() => day.isAvailable && handleDateSelect(day.date)}
                             disabled={!day.isAvailable}
                             className={`
                               p-3 text-sm rounded-lg border transition-colors text-center
                               ${day.isUnavailable 
                                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300' 
                                 : day.isSelected 
                                 ? 'bg-cyan-600 text-white border-cyan-600' 
                                 : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 cursor-pointer'
                               }
                             `}
                           >
                             <div className="font-medium">{day.date.getDate()}</div>
                             <div className="text-xs">
                               {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                             </div>
                           </button>
                         ))}
                       </div>
            
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
                         <div className="flex items-center space-x-1">
                           <div className="w-3 h-3 bg-cyan-600 rounded"></div>
                           <span>Selected</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                           <span>Available</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <div className="w-3 h-3 bg-gray-200 rounded"></div>
                           <span>Taken</span>
                         </div>
                       </div>
            
            <p className="text-xs text-gray-500 text-center mt-2">
                         Green days are available, gray days are taken by someone else
                       </p>
          </CardContent>
        </Card>

        {/* Time slots */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Select Time</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Available times for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {TIME_SLOTS.map(time => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTimeSelect(time)}
                      className={`
                        ${isSelected ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
                      `}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hours input */}
        {selectedDate && selectedTime && (
          <Card>
            <CardHeader>
              <CardTitle>How many hours do you need?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHoursChange(Math.max(1, hours - 1))}
                  disabled={hours <= 1}
                >
                  -
                </Button>
                <div className="text-2xl font-semibold min-w-[60px] text-center">
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleHoursChange(hours + 1)}
                >
                  +
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-700">Estimated cost:</span>
                  <span className="text-lg font-semibold text-cyan-900">
                    ${(selectedTechnician.hourlyRate * hours).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-cyan-600 mt-1">
                  ${selectedTechnician.hourlyRate}/hour × {hours} {hours === 1 ? 'hour' : 'hours'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {selectedDate && selectedTime && hours > 0 && (
          <Card className="bg-cyan-50 border-cyan-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-cyan-600">
                  <Calendar className="h-5 w-5" />
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-cyan-900">Booking Summary</h4>
                  <p className="text-sm text-cyan-700 mt-1">
                    {selectedTechnician.name} • {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTime} • {hours} {hours === 1 ? 'hour' : 'hours'}
                  </p>
                  <p className="text-lg font-semibold text-cyan-900 mt-2">
                    Total: ${(selectedTechnician.hourlyRate * hours).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Show freelancer list
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Label htmlFor="freelancer-search">Search Freelancers</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="freelancer-search"
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="sm:w-48">
            <Label htmlFor="sort-select">Sort By</Label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="distance">Closest</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Freelancers List */}
      <div className="space-y-4">
        {freelancers.map((freelancer) => {
          const isSelected = selectedTechnician?.id === freelancer.id;
          const next15Days = isSelected ? getNext15Days() : [];
          
          return (
            <div key={freelancer.id} className="space-y-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
                }`}
                onClick={() => handleFreelancerSelect(freelancer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    {/* Left side - Avatar and Name */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                        <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">
                          {freelancer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {freelancer.name}
                          </h3>
                          {freelancer.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1 py-0">
                              <Award className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="flex items-center">
                            {renderStars(freelancer.rating)}
                          </div>
                          <span className="text-sm font-medium">{freelancer.rating}</span>
                          <span className="text-sm text-gray-500">({freelancer.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Price */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${freelancer.hourlyRate}
                      </div>
                      <div className="text-sm text-cyan-600 font-medium">per hour</div>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{freelancer.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{freelancer.responseTime}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{freelancer.completedJobs}</div>
                      <div className="text-xs text-gray-500">jobs completed</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{freelancer.experience}</div>
                      <div className="text-xs text-gray-500">experience</div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-cyan-200">
                      <div className="flex items-center justify-center space-x-2 text-cyan-700">
                        <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                        <span className="text-xs font-medium">Click to view availability</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Show calendar directly under selected freelancer */}
              {isSelected && showTechnicianCalendar && (
                <div className="space-y-6">
                  {/* 15-day availability calendar */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5" />
                        <span>{freelancer.name}&apos;s Availability</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600">Next 15 days</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2">
                        {next15Days.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => day.isAvailable && handleDateSelect(day.date)}
                            disabled={!day.isAvailable}
                            className={`
                              p-3 text-sm rounded-lg border transition-colors text-center
                              ${day.isUnavailable 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                                : day.isSelected 
                                ? 'bg-cyan-600 text-white border-cyan-600' 
                                : 'bg-white text-gray-900 border-gray-200 hover:bg-cyan-50 hover:border-cyan-300'
                              }
                            `}
                          >
                            <div className="font-medium">{day.date.getDate()}</div>
                            <div className="text-xs">
                              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-cyan-600 rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-gray-100 rounded"></div>
                          <span>Unavailable</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Gray days means the freelancer is taken by someone else
                      </p>
                    </CardContent>
                  </Card>

                  {/* Time slots */}
                  {selectedDate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5" />
                          <span>Select Time</span>
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Available times for {selectedDate.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {TIME_SLOTS.map(time => {
                            const isTimeSelected = selectedTime === time;
                            
                            return (
                              <Button
                                key={time}
                                variant={isTimeSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTimeSelect(time)}
                                className={`
                                  ${isTimeSelected ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
                                `}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hours input */}
                  {selectedDate && selectedTime && (
                    <Card>
                      <CardHeader>
                        <CardTitle>How many hours do you need?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHoursChange(Math.max(1, hours - 1))}
                            disabled={hours <= 1}
                          >
                            -
                          </Button>
                          <div className="text-2xl font-semibold min-w-[60px] text-center">
                            {hours} {hours === 1 ? 'hour' : 'hours'}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleHoursChange(hours + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-cyan-700">Estimated cost:</span>
                            <span className="text-lg font-semibold text-cyan-900">
                              ${(freelancer.hourlyRate * hours).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-cyan-600 mt-1">
                            ${freelancer.hourlyRate}/hour × {hours} {hours === 1 ? 'hour' : 'hours'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Summary */}
                  {selectedDate && selectedTime && hours > 0 && (
                    <Card className="bg-cyan-50 border-cyan-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-cyan-600">
                            <Calendar className="h-5 w-5" />
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-cyan-900">Booking Summary</h4>
                            <p className="text-sm text-cyan-700 mt-1">
                              {freelancer.name} • {selectedDate.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })} at {selectedTime} • {hours} {hours === 1 ? 'hour' : 'hours'}
                            </p>
                            <p className="text-lg font-semibold text-cyan-900 mt-2">
                              Total: ${(freelancer.hourlyRate * hours).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {freelancers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No freelancers found</h3>
              <p className="text-sm">
                Try adjusting your search criteria or check back later for more availability.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}