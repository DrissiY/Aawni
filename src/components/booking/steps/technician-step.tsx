'use client';

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, Award, Filter, Search } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock technician data (in real app, fetch from API)
const MOCK_TECHNICIANS = [
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
    availability: 'Available today',
    verified: true
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
    availability: 'Available tomorrow',
    verified: true
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
    availability: 'Available today',
    verified: true
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
    availability: 'Available now',
    verified: true
  }
];

type SortOption = 'rating' | 'price' | 'distance' | 'experience';

export function TechnicianStep() {
  const { selectedTechnician, setSelectedTechnician } = useBookingStore();
  const [technicians, setTechnicians] = useState(MOCK_TECHNICIANS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort technicians
  useEffect(() => {
    let filtered = MOCK_TECHNICIANS;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(tech => 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialties.some(specialty => 
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

    setTechnicians(filtered);
  }, [searchQuery, sortBy]);

  const handleTechnicianSelect = (technician: typeof MOCK_TECHNICIANS[0]) => {
    setSelectedTechnician({
      id: technician.id,
      name: technician.name,
      rating: technician.rating,
      hourlyRate: technician.hourlyRate,
      avatar: technician.avatar,
      specialties: technician.specialties
    });
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
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Label htmlFor="technician-search">Search Technicians</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="technician-search"
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
          {technicians.length} technician{technicians.length !== 1 ? 's' : ''} available
        </div>
      </div>

      {/* Technicians List */}
      <div className="space-y-4">
        {technicians.map((technician) => {
          const isSelected = selectedTechnician?.id === technician.id;
          
          return (
            <Card 
              key={technician.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-cyan-500 bg-cyan-50' : ''
              }`}
              onClick={() => handleTechnicianSelect(technician)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={technician.avatar} alt={technician.name} />
                    <AvatarFallback className="bg-cyan-100 text-cyan-700 text-lg font-semibold">
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {technician.name}
                          </h3>
                          {technician.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            {renderStars(technician.rating)}
                          </div>
                          <span className="text-sm font-medium">{technician.rating}</span>
                          <span className="text-sm text-gray-500">({technician.reviewCount} reviews)</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ${technician.hourlyRate}
                        </div>
                        <div className="text-sm text-gray-500">per hour</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mt-2 text-sm">
                      {technician.description}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {technician.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{technician.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{technician.responseTime}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{technician.completedJobs}</span> jobs completed
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{technician.experience}</span> experience
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mt-3">
                      <Badge 
                        variant="secondary" 
                        className={`${
                          technician.availability.includes('now') || technician.availability.includes('today')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {technician.availability}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-cyan-200">
                    <div className="flex items-center justify-center space-x-2 text-cyan-700">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                      <span className="text-sm font-medium">Selected Technician</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {technicians.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No technicians found</h3>
              <p className="text-sm">
                Try adjusting your search criteria or check back later for more availability.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Technician Summary */}
      {selectedTechnician && (
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedTechnician.avatar} alt={selectedTechnician.name} />
                <AvatarFallback className="bg-cyan-100 text-cyan-700 font-semibold">
                  {selectedTechnician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-cyan-900">{selectedTechnician.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedTechnician.rating)}
                  </div>
                  <span className="text-sm text-cyan-700">{selectedTechnician.rating}</span>
                  <span className="text-sm text-cyan-600">• ${selectedTechnician.hourlyRate}/hr</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}