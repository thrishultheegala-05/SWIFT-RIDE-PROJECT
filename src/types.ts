export type AppMode = 'rider' | 'driver';

export type RiderScreen = 'booking' | 'matching' | 'active_trip' | 'completed';

export type NavigationTab = 'ride' | 'driver' | 'activity' | 'wallet';

export type TripPhase = 
  | 'idle' 
  | 'matching' 
  | 'driver_en_route' 
  | 'driver_arrived' 
  | 'in_progress' 
  | 'completed';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface RideCategory {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  perMile: number;
  perMinute: number;
  capacity: number;
  etaMinutes: number;
  badge?: string;
  iconType: 'standard' | 'comfort' | 'xl' | 'green' | 'black';
}

export interface DriverInfo {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  carModel: string;
  carColor: string;
  carPlate: string;
  rating: number;
  totalTrips: number;
  yearsActive: number;
  phone: string;
  verifiedBadges: string[];
  currentLocation: {
    lat: number;
    lng: number;
    bearing: number;
  };
}

export interface ActiveTrip {
  id: string;
  driver: DriverInfo;
  category: RideCategory;
  pickup: LocationPoint;
  destination: LocationPoint;
  phase: TripPhase;
  etaMinutes: number;
  pinCode: string;
  fare: number;
  progressRatio: number; // 0 to 1 along the route
  paymentMethod: string;
  isQuietRide: boolean;
  temperature: string;
}

export interface ChatMessage {
  id: string;
  sender: 'rider' | 'driver' | 'system';
  text: string;
  timestamp: string;
}

export interface TripHistoryItem {
  id: string;
  date: string;
  pickup: string;
  destination: string;
  driverName: string;
  driverAvatar: string;
  carDetails: string;
  category: string;
  fare: number;
  rating: number;
  status: 'completed' | 'cancelled';
}

export interface ScheduledRide {
  id: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  category: RideCategory;
  scheduledDate: string; // e.g. "2026-09-12" or "Tomorrow, Sep 12"
  scheduledTime: string; // e.g. "08:30 AM"
  fare: number;
  paymentMethod: string;
  isQuietRide: boolean;
  temperature: string;
  pinVerification: boolean;
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}
