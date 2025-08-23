import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookingLocation {
  address: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  houseNumber?: string;
  apartment?: string;
  additionalNotes?: string;
}

export interface BookingDetails {
  homeSize?: 'small' | 'medium' | 'large';
  extraTasks?: string[];
  duration?: number; // in hours
  specialInstructions?: string;
  description?: string;
  requirements?: string[];
  notes?: string;
}

export interface BookingDateTime {
  date: string;
  time: string;
  timezone: string;
}

export interface SelectedTechnician {
  id: string;
  name: string;
  rating: number;
  hourlyRate: number;
  avatar?: string;
  specialties: string[];
}

export interface BookingState {
  // Booking flow data
  offerId?: string;
  selectedServices: string[];
  selectedSubServices: string[];
  location?: BookingLocation;
  details?: BookingDetails;
  dateTime?: BookingDateTime;
  selectedTechnician?: SelectedTechnician;
  selectedHours?: number; // Hours for the job
  
  // User information
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  
  // Pricing
  pricing?: {
    basePrice: number;
    extraTasksPrice: number;
    totalPrice: number;
    currency: string;
  };
  
  // Flow control
  currentStep: number;
  isLoading: boolean;
  error?: string;
  
  // Scheduling flow state
  showTechnicianCalendar: boolean;
}

export interface BookingActions {
  // Step navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Data setters
  setOfferId: (offerId: string) => void;
  setSelectedServices: (services: string[], subServices: string[]) => void;
  setLocation: (location: BookingLocation) => void;
  setDetails: (details: BookingDetails) => void;
  setDateTime: (dateTime: BookingDateTime) => void;
  setSelectedTechnician: (technician: SelectedTechnician) => void;
  setSelectedHours: (hours: number) => void;
  setCustomerInfo: (info: { name: string; email: string; phone: string }) => void;
  setPricing: (pricing: { basePrice: number; extraTasksPrice: number; totalPrice: number; currency: string }) => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | undefined) => void;
  resetBooking: () => void;
  
  // Scheduling flow
  setShowTechnicianCalendar: (show: boolean) => void;
  
  // Validation
  canProceedToNextStep: () => boolean;
  getCompletionPercentage: () => number;
}

const initialState: BookingState = {
  currentStep: 0,
  selectedServices: [],
  selectedSubServices: [],
  isLoading: false,
  showTechnicianCalendar: false,
};

export const useBookingStore = create<BookingState & BookingActions>()(persist(
  (set, get) => ({
    ...initialState,
    
    // Step navigation
    setCurrentStep: (step: number) => set({ currentStep: step }),
    nextStep: () => {
      const { currentStep, canProceedToNextStep } = get();
      if (canProceedToNextStep()) {
        set({ currentStep: currentStep + 1 });
      }
    },
    previousStep: () => {
      const { currentStep } = get();
      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 });
      }
    },
    
    // Data setters
    setOfferId: (offerId: string) => set({ offerId }),
    setSelectedServices: (services: string[], subServices: string[]) => 
      set({ selectedServices: services, selectedSubServices: subServices }),
    setLocation: (location: BookingLocation) => set({ location }),
    setDetails: (details: BookingDetails) => set({ details }),
    setDateTime: (dateTime: BookingDateTime) => set({ dateTime }),
    setSelectedTechnician: (technician: SelectedTechnician) => set({ selectedTechnician: technician }),
    setSelectedHours: (selectedHours: number) => set({ selectedHours }),
    setCustomerInfo: (customerInfo: { name: string; email: string; phone: string }) => set({ customerInfo }),
    setPricing: (pricing: { basePrice: number; extraTasksPrice: number; totalPrice: number; currency: string }) => set({ pricing }),
    
    // Utility actions
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | undefined) => set({ error }),
    resetBooking: () => set(initialState),
    
    // Scheduling flow
    setShowTechnicianCalendar: (showTechnicianCalendar: boolean) => set({ showTechnicianCalendar }),
    
    // Validation
    canProceedToNextStep: () => {
      const state = get();
      switch (state.currentStep) {
        case 0: // Location step
          return !!state.location;
        case 1: // Combined Technician & Scheduling step
          return !!state.selectedTechnician && !!state.dateTime && !!state.selectedHours;
        case 2: // Customer info step
          return !!state.customerInfo;
        default:
          return true;
      }
    },
    
    getCompletionPercentage: () => {
      const state = get();
      const totalSteps = 3;
      let completedSteps = 0;
      
      if (state.location) completedSteps++;
      if (state.selectedTechnician && state.dateTime && state.selectedHours) completedSteps++;
      if (state.customerInfo) completedSteps++;
      
      return Math.round((completedSteps / totalSteps) * 100);
    },
  }),
  {
    name: 'booking-storage',
    partialize: (state) => ({
      offerId: state.offerId,
      selectedServices: state.selectedServices,
      selectedSubServices: state.selectedSubServices,
      location: state.location,
      details: state.details,
      dateTime: state.dateTime,
      selectedTechnician: state.selectedTechnician,
      customerInfo: state.customerInfo,
      pricing: state.pricing,
      currentStep: state.currentStep,
    }),
  }
));