'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Home, Building } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Map, Marker } from 'mapbox-gl';

// Mapbox types
interface MapboxGeocodeFeature {
  place_name: string;
  center: [number, number];
  properties: {
    address?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface MapboxGeocodeResponse {
  features: MapboxGeocodeFeature[];
}

export function LocationStep() {
  const { location, setLocation } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState(location?.address || '');
  const [suggestions, setSuggestions] = useState<MapboxGeocodeFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [geolocationStatus, setGeolocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [houseNumber, setHouseNumber] = useState(location?.houseNumber || '');
  const [apartment, setApartment] = useState(location?.apartment || '');
  const [additionalNotes, setAdditionalNotes] = useState(location?.additionalNotes || '');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Dynamically import mapbox-gl to avoid SSR issues
        const mapboxgl = (await import('mapbox-gl')).default;
        
        // Set access token (you'll need to add this to your env)
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoieW91bmVzZHJpc3NpIiwiYSI6ImNtNjBxdGZxZzBhcmkyanM5ZGNhZGNxZjMifQ.example';
        
        if (mapRef.current && !mapInstanceRef.current) {
          const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: location?.coordinates ? [location.coordinates.lng, location.coordinates.lat] : [-6.8498, 33.9716], // Default to Rabat, Morocco
            zoom: location?.coordinates ? 15 : 6,
            maxBounds: [[-17.0204, 21.4207], [1.2676, 35.9224]] // Morocco bounds
          });

          // Add navigation controls
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
          
          // Add marker if location exists
          if (location?.coordinates) {
            markerRef.current = new mapboxgl.Marker({
              color: '#5551EC', // primary-600
              draggable: true
            })
            .setLngLat([location.coordinates.lng, location.coordinates.lat])
            .addTo(map);
            
            // Handle marker drag
            markerRef.current.on('dragend', () => {
              if (markerRef.current) {
                const lngLat = markerRef.current.getLngLat();
                reverseGeocode(lngLat.lat, lngLat.lng);
              }
            });
          }

          // Add click event listener to place marker on map click
          map.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            console.log('Map clicked at:', { lng, lat });
            
            // If marker exists, just update its position
            if (markerRef.current) {
              markerRef.current.setLngLat([lng, lat]);
            } else {
              // Create custom marker element with SVG only once
              const markerElement = document.createElement('div');
              markerElement.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C11.0294 2 7 6.02944 7 11C7 18.25 16 30 16 30S25 18.25 25 11C25 6.02944 20.9706 2 16 2Z" fill="#DC2626" stroke="#B91C1C" stroke-width="2"/>
                  <circle cx="16" cy="11" r="4" fill="white"/>
                  <circle cx="16" cy="11" r="2" fill="#DC2626"/>
                </svg>
              `;
              markerElement.style.cursor = 'pointer';
              
              // Create new marker at clicked location with custom SVG
              markerRef.current = new mapboxgl.Marker({
                element: markerElement,
                draggable: true
              })
              .setLngLat([lng, lat])
              .addTo(map);
              
              // Handle marker drag for the new marker
              markerRef.current.on('dragend', () => {
                if (markerRef.current) {
                  const lngLat = markerRef.current.getLngLat();
                  reverseGeocode(lngLat.lat, lngLat.lng);
                }
              });
            }
            
            // Reverse geocode the clicked location
            reverseGeocode(lat, lng);
          });

          mapInstanceRef.current = map;
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location]);

  // Initialize location state from stored data
  useEffect(() => {
    if (location?.houseNumber) setHouseNumber(location.houseNumber);
    if (location?.apartment) setApartment(location.apartment);
    if (location?.additionalNotes) setAdditionalNotes(location.additionalNotes);
  }, [location]);

  // Geocoding search
  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoieW91bmVzZHJpc3NpIiwiYSI6ImNtNjBxdGZxZzBhcmkyanM5ZGNhZGNxZjMifQ.example'}&country=MA&types=address,poi&limit=5&bbox=-17.0204,21.4207,1.2676,35.9224`
      );
      
      if (response.ok) {
        const data: MapboxGeocodeResponse = await response.json();
        setSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = async (feature: MapboxGeocodeFeature) => {
    const [lng, lat] = feature.center;
    
    // Extract address components
    const addressParts = feature.place_name.split(', ');
    const address = addressParts[0];
    const city = feature.context?.find(c => c.id.includes('place'))?.text || addressParts[1] || '';
    const postalCode = feature.context?.find(c => c.id.includes('postcode'))?.text || '';
    
    const locationData = {
      address: feature.place_name,
      city,
      postalCode,
      coordinates: { lat, lng },
      houseNumber,
      apartment,
      additionalNotes
    };
    
    setLocation(locationData);
    setSearchQuery(feature.place_name);
    setShowSuggestions(false);
    
    // Update map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter([lng, lat]);
        mapInstanceRef.current.setZoom(15);
        
        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }
        
        // Add new marker
        const mapboxgl = (await import('mapbox-gl')).default;
        markerRef.current = new mapboxgl.Marker({
          color: '#0891b2',
          draggable: true
        })
        .setLngLat([lng, lat])
        .addTo(mapInstanceRef.current);
        
        // Handle marker drag
        markerRef.current.on('dragend', () => {
          if (markerRef.current) {
            const lngLat = markerRef.current.getLngLat();
            reverseGeocode(lngLat.lat, lngLat.lng);
          }
        });
      }
  };

  // Request geolocation permission and get current location
  const handleRequestGeolocation = () => {
    console.log('Requesting geolocation...');
    
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      alert('Geolocation is not supported by this browser.');
      setGeolocationStatus('denied');
      return;
    }

    console.log('Setting status to requesting...');
    setGeolocationStatus('requesting');
    
    console.log('Calling getCurrentPosition...');
    // Directly request current position - this will trigger the browser permission prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position);
        const { latitude, longitude } = position.coords;
        
        // Check if location is within Morocco bounds
        if (latitude < 21.4207 || latitude > 35.9224 || longitude < -17.0204 || longitude > 1.2676) {
          console.warn('Location outside Morocco bounds:', { latitude, longitude });
          alert('This service is currently only available in Morocco.');
          setGeolocationStatus('denied');
          return;
        }
        
        console.log('Location within Morocco bounds, proceeding...');
        setUserLocation({ lat: latitude, lng: longitude });
        setGeolocationStatus('granted');
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage += 'Please allow location access and try again.';
            setGeolocationStatus('denied');
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage += 'Location information is unavailable.';
            setGeolocationStatus('denied');
            break;
          case 3: // TIMEOUT
            errorMessage += 'Location request timed out. Please try again.';
            setGeolocationStatus('idle');
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            setGeolocationStatus('idle');
            break;
        }
        
        alert(errorMessage);
      },
      {
        enableHighAccuracy: false, // Try with less accuracy first
        timeout: 10000, // Shorter timeout
        maximumAge: 60000 // 1 minute
      }
    );
  };

  // Use current location (for when geolocation is already granted)
  const handleUseCurrentLocation = () => {
    if (userLocation) {
      reverseGeocode(userLocation.lat, userLocation.lng);
    } else {
      handleRequestGeolocation();
    }
  };

  // Update location data when additional details change
  const updateLocationDetails = () => {
    if (location) {
      setLocation({
        ...location,
        houseNumber,
        apartment,
        additionalNotes
      });
    }
  };

  // Update location when additional details change
  useEffect(() => {
    if (location) {
      updateLocationDetails();
    }
  }, [houseNumber, apartment, additionalNotes]);

  // Reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoieW91bmVzZHJpc3NpIiwiYSI6ImNtNjBxdGZxZzBhcmkyanM5ZGNhZGNxZjMifQ.example'}&country=MA`
      );
      
      if (response.ok) {
        const data: MapboxGeocodeResponse = await response.json();
        if (data.features.length > 0) {
          handleLocationSelect(data.features[0]);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="location-search">Service Address</Label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location-search"
              type="text"
              placeholder="Enter your address..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start space-x-3"
                  >
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{suggestion.place_name}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Geolocation Section */}
      <div className="space-y-3">
        {geolocationStatus === 'idle' && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Quick Location Access</p>
                <p className="text-xs text-blue-700 mt-1">Allow location access to automatically fill your address</p>
              </div>
              <Button
                type="button"
                onClick={(e) => {
                  console.log('Button clicked!', e);
                  e.preventDefault();
                  e.stopPropagation();
                  handleRequestGeolocation();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Allow Location
              </Button>
            </div>
          </Card>
        )}
        
        {geolocationStatus === 'requesting' && (
          <Alert className="bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            <AlertDescription className="text-blue-700">
              <strong>Requesting location permission...</strong>
              <br />
              <span className="text-xs">Please allow location access in your browser when prompted.</span>
            </AlertDescription>
          </Alert>
        )}
        
        {geolocationStatus === 'granted' && userLocation && (
          <Alert className="bg-green-50 border-green-200">
            <MapPin className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong>Location access granted!</strong> Your current location has been detected.
            </AlertDescription>
          </Alert>
        )}
        
        {geolocationStatus === 'denied' && (
          <Alert className="bg-amber-50 border-amber-200">
            <MapPin className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <strong>Location access denied.</strong>
              <br />
              <span className="text-xs">Please enter your address manually above, or enable location permissions in your browser settings and refresh the page.</span>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Map */}
      <div className="space-y-2">
        <Label>Location on Map</Label>
        <p className="text-sm text-gray-600">Click anywhere on the map to select your location</p>
        <Card className="overflow-hidden">
          <div 
            ref={mapRef} 
            className="w-full h-64 relative bg-gray-50"
            style={{ minHeight: '256px' }}
          >
            {/* Loading overlay */}
            {!mapInstanceRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-500">Loading interactive map...</p>
                </div>
              </div>
            )}
          </div>
          {location && (
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{location.address}</p>
                  {location.city && <p className="text-gray-500">{location.city}{location.postalCode && `, ${location.postalCode}`}</p>}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 Tip: Click anywhere on the map to place a marker, or drag the existing marker to adjust the location</p>
            </div>
          )}
        </Card>
      </div>

      {/* Additional Address Details */}
      {location && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="house-number" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>House/Building Number</span>
              </Label>
              <Input
                id="house-number"
                type="text"
                placeholder="e.g., 123, 45A"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apartment" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Apartment/Unit (Optional)</span>
              </Label>
              <Input
                id="apartment"
                type="text"
                placeholder="e.g., Apt 4B, Unit 12"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additional-notes">
              Additional Instructions (Optional)
            </Label>
            <Input
              id="additional-notes"
              type="text"
              placeholder="e.g., Ring doorbell twice, Use side entrance"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Selected Location Display */}
      {location && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-primary-900">Selected Location</h4>
              <p className="text-sm text-primary-700 mt-1">{location.address}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-primary-600">
                  <span>City: {location.city}</span>
                  {location.postalCode && <span>ZIP: {location.postalCode}</span>}
                </div>
                {(houseNumber || apartment || additionalNotes) && (
                  <div className="mt-3 pt-3 border-t border-primary-200">
              <h5 className="font-medium text-primary-900 text-xs mb-2">Additional Details:</h5>
              <div className="space-y-1 text-xs text-primary-700">
                      {houseNumber && <div>House/Building: {houseNumber}</div>}
                      {apartment && <div>Apartment/Unit: {apartment}</div>}
                      {additionalNotes && <div>Instructions: {additionalNotes}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}