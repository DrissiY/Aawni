'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookingStore } from '@/store/booking-store';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Time slots available for booking
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

export function DateTimeStep() {
  const { dateTime, setDateTime } = useBookingStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    dateTime?.date ? new Date(dateTime.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(dateTime?.time || null);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
      
      days.push({
        date,
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        isAvailable: isCurrentMonth && !isPast
      });
    }

    return days;
  };

  // Navigate calendar months
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (date < new Date()) return; // Prevent selecting past dates
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Update booking store when both date and time are selected
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

  // Check if time slot is available (mock logic - in real app, check with backend)
  const isTimeSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const selectedDateTime = new Date(selectedDate);
    const [hours, minutes] = time.split(':').map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);
    
    // Don't allow booking in the past
    if (selectedDateTime <= now) return false;
    
    // Mock: some time slots are "booked" (in real app, check availability)
    const bookedSlots = ['10:00', '14:30', '16:00'];
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    
    // Weekend has limited availability
    if (isWeekend && (hours < 10 || hours > 16)) return false;
    
    return !bookedSlots.includes(time);
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Select Date</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day.isAvailable && handleDateSelect(day.date)}
                disabled={!day.isAvailable}
                className={`
                  h-10 w-10 text-sm rounded-md transition-colors
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                  ${day.isPast ? 'cursor-not-allowed opacity-50' : ''}
                  ${day.isToday ? 'bg-primary-100 text-primary-700 font-semibold' : ''}
                ${day.isSelected ? 'bg-primary-600 text-white font-semibold' : ''}
                  ${day.isAvailable && !day.isSelected && !day.isToday ? 'hover:bg-gray-100' : ''}
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
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
                const isAvailable = isTimeSlotAvailable(time);
                const isSelected = selectedTime === time;
                
                return (
                  <Button
                    key={time}
                    variant={isSelected ? "primary" : "outline"}
                    size="sm"
                    onClick={() => isAvailable && handleTimeSelect(time)}
                    disabled={!isAvailable}
                    className={`
                      ${isSelected ? 'bg-primary-600 hover:bg-primary-700' : ''}
                      ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {time}
                  </Button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary-600 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 border border-gray-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-200 rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected DateTime Summary */}
      {selectedDate && selectedTime && (
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-primary-600">
                <Calendar className="h-5 w-5" />
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-primary-900">Appointment Scheduled</h4>
              <p className="text-sm text-primary-700 mt-1">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {selectedTime}
                </p>
                <Badge variant="secondary" className="mt-2 bg-primary-100 text-primary-700">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}