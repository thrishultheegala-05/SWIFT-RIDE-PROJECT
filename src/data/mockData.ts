import { DriverInfo, LocationPoint, RideCategory, TripHistoryItem, ScheduledRide } from '../types';

export const PRESET_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc_cyber_towers',
    name: 'Cyber Towers, HITEC City',
    address: 'Hitech City Main Rd, Patrika Nagar, Madhapur, Hyderabad, TS 500081',
    lat: 17.4504,
    lng: 78.3808,
  },
  {
    id: 'loc_inorbit_durgam',
    name: 'Inorbit Mall & Durgam Cheruvu',
    address: 'Inorbit Mall Rd, Mindspace, Madhapur, Hyderabad, TS 500081',
    lat: 17.4344,
    lng: 78.3867,
  },
  {
    id: 'loc_jubilee_hills',
    name: 'Jubilee Hills Road No. 36',
    address: 'Rd Number 36, CBI Colony, Jubilee Hills, Hyderabad, TS 500033',
    lat: 17.4319,
    lng: 78.4073,
  },
  {
    id: 'loc_airport',
    name: 'Rajiv Gandhi Int Airport (RGIA)',
    address: 'Shamshabad, Hyderabad, Telangana 500409',
    lat: 17.2403,
    lng: 78.4294,
  },
  {
    id: 'loc_gachibowli',
    name: 'Gachibowli Financial District',
    address: 'Financial District, Nanakramguda, Hyderabad, TS 500032',
    lat: 17.4156,
    lng: 78.3425,
  },
  {
    id: 'loc_banjara_hills',
    name: 'Banjara Hills Road No. 1',
    address: 'Road No. 1, Mithila Nagar, Banjara Hills, Hyderabad, TS 500034',
    lat: 17.4165,
    lng: 78.4482,
  },
  {
    id: 'loc_charminar',
    name: 'Charminar Heritage Plaza',
    address: 'Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad, TS 500002',
    lat: 17.3616,
    lng: 78.4747,
  },
  {
    id: 'loc_secunderabad',
    name: 'Secunderabad Junction Station',
    address: 'Station Rd, Regimental Bazaar, Secunderabad, TS 500003',
    lat: 17.4344,
    lng: 78.5017,
  },
];

export const PRIMARY_DRIVER: DriverInfo = {
  id: 'driver_rajan',
  name: 'Rajan Varma',
  title: 'Top Rated Gold Elite Captain',
  avatarUrl: '/assets/driver_rajan.jpg',
  carModel: 'Hyundai Creta SX',
  carColor: 'Titan Grey',
  carPlate: 'TS 09 UB 4821',
  rating: 4.98,
  totalTrips: 3420,
  yearsActive: 5,
  phone: '+91 98490 82194',
  verifiedBadges: ['Gold Elite', 'RideCheck PIN Enabled', 'Clean Car Certified', 'Telugu • Hindi • English'],
  currentLocation: {
    lat: 17.4420,
    lng: 78.3820,
    bearing: 345,
  },
};

export const NEARBY_DRIVERS: DriverInfo[] = [
  PRIMARY_DRIVER,
  {
    id: 'driver_pooja',
    name: 'Pooja Sharma',
    title: 'Swift Green EV Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    carModel: 'Tata Nexon EV Max',
    carColor: 'Pristine White',
    carPlate: 'TS 07 EV 9021',
    rating: 4.96,
    totalTrips: 1890,
    yearsActive: 3,
    phone: '+91 98851 55018',
    verifiedBadges: ['EV Specialist', 'Top Rated Captain'],
    currentLocation: {
      lat: 17.4480,
      lng: 78.3750,
      bearing: 60,
    },
  },
  {
    id: 'driver_vikram',
    name: 'Vikram Singh',
    title: 'Swift XL Fleet Captain',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    carModel: 'Toyota Innova Crysta',
    carColor: 'Super White',
    carPlate: 'TS 08 MN 7812',
    rating: 4.93,
    totalTrips: 4210,
    yearsActive: 6,
    phone: '+91 98482 55099',
    verifiedBadges: ['XL Verified', 'Extra Luggage Ready'],
    currentLocation: {
      lat: 17.4550,
      lng: 78.3840,
      bearing: 200,
    },
  },
  {
    id: 'driver_aarav',
    name: 'Aarav Sen',
    title: 'Swift Premier Chauffeur',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    carModel: 'Toyota Camry Hybrid',
    carColor: 'Attitude Black',
    carPlate: 'TS 09 VIP 007',
    rating: 4.99,
    totalTrips: 2950,
    yearsActive: 4,
    phone: '+91 99082 55214',
    verifiedBadges: ['VIP Certified', 'Quiet Ride Expert'],
    currentLocation: {
      lat: 17.4380,
      lng: 78.3890,
      bearing: 315,
    },
  },
];

export const RIDE_CATEGORIES: RideCategory[] = [
  {
    id: 'swift_economy',
    name: 'Swift Economy',
    tagline: 'Affordable, fast, everyday rides',
    basePrice: 50.0,
    perMile: 15.0,
    perMinute: 2.0,
    capacity: 4,
    etaMinutes: 3,
    badge: 'Popular',
    iconType: 'standard',
  },
  {
    id: 'swift_comfort',
    name: 'Swift Comfort',
    tagline: 'Newer cars with extra legroom',
    basePrice: 75.0,
    perMile: 19.0,
    perMinute: 2.5,
    capacity: 4,
    etaMinutes: 4,
    badge: 'Top Pick',
    iconType: 'comfort',
  },
  {
    id: 'swift_green',
    name: 'Swift Green',
    tagline: 'Zero-emission 100% electric rides',
    basePrice: 65.0,
    perMile: 17.0,
    perMinute: 2.2,
    capacity: 4,
    etaMinutes: 5,
    badge: 'Eco',
    iconType: 'green',
  },
  {
    id: 'swift_xl',
    name: 'Swift XL',
    tagline: 'Spacious 6-seaters for extra luggage',
    basePrice: 120.0,
    perMile: 25.0,
    perMinute: 3.0,
    capacity: 6,
    etaMinutes: 6,
    iconType: 'xl',
  },
  {
    id: 'swift_black',
    name: 'Swift Black',
    tagline: 'Premium luxury vehicles & pro drivers',
    basePrice: 220.0,
    perMile: 38.0,
    perMinute: 4.5,
    capacity: 4,
    etaMinutes: 7,
    badge: 'Luxury',
    iconType: 'black',
  },
];

// Simulated road waypoints connecting pickup (Cyber Towers) to driver initial spot and destination
export const SIMULATED_PICKUP_WAYPOINTS: [number, number][] = [
  [17.4420, 78.3820], // Start: Rajan near Raheja Mindspace Circle
  [17.4450, 78.3815], // Along HITEC City Main Rd
  [17.4480, 78.3810], // Cyber Gateway Junction
  [17.4504, 78.3808], // Pickup: Cyber Towers, HITEC City
];

export const SIMULATED_TRIP_WAYPOINTS: [number, number][] = [
  [17.4504, 78.3808], // Pickup: Cyber Towers
  [17.4470, 78.3812], // Cyber Gateway
  [17.4430, 78.3818], // Raheja Mindspace Circle
  [17.4385, 78.3840], // Mindspace Inorbit Approach Road
  [17.4360, 78.3855], // Durgam Cheruvu Lake View Drive
  [17.4344, 78.3867], // Destination: Inorbit Mall & Durgam Cheruvu
];

export const INITIAL_TRIP_HISTORY: TripHistoryItem[] = [
  {
    id: 'trip_101',
    date: 'Yesterday, 6:42 PM',
    pickup: 'Cyber Towers, HITEC City',
    destination: 'Inorbit Mall & Durgam Cheruvu',
    driverName: 'Rajan Varma',
    driverAvatar: '/assets/driver_rajan.jpg',
    carDetails: 'Hyundai Creta • TS 09 UB 4821',
    category: 'Swift Comfort',
    fare: 185.00,
    rating: 5,
    status: 'completed',
  },
  {
    id: 'trip_102',
    date: 'Sep 8, 2:15 PM',
    pickup: 'Gachibowli Financial District',
    destination: 'Rajiv Gandhi Int Airport (RGIA)',
    driverName: 'Vikram Singh',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    carDetails: 'Toyota Innova • TS 08 MN 7812',
    category: 'Swift XL',
    fare: 890.00,
    rating: 5,
    status: 'completed',
  },
  {
    id: 'trip_103',
    date: 'Sep 5, 9:10 AM',
    pickup: 'Jubilee Hills Road No. 36',
    destination: 'Banjara Hills Road No. 1',
    driverName: 'Pooja Sharma',
    driverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    carDetails: 'Tata Nexon EV • TS 07 EV 9021',
    category: 'Swift Green',
    fare: 220.00,
    rating: 5,
    status: 'completed',
  },
];

export const INITIAL_SCHEDULED_RIDES: ScheduledRide[] = [
  {
    id: 'sched_201',
    pickup: PRESET_LOCATIONS[0], // Cyber Towers, HITEC City
    destination: PRESET_LOCATIONS[3], // RGIA Airport
    category: RIDE_CATEGORIES[2], // Swift Green EV
    scheduledDate: 'Tomorrow, Sep 12',
    scheduledTime: '08:30 AM',
    fare: 920.00,
    paymentMethod: 'Swift Wallet (₹850.00)',
    isQuietRide: true,
    temperature: 'Cool (22°C)',
    pinVerification: true,
    notes: 'RGIA Airport flight departure. Driver dispatch 25 mins prior via ORR.',
    status: 'confirmed',
    createdAt: 'Sep 10, 10:15 PM',
  },
  {
    id: 'sched_202',
    pickup: PRESET_LOCATIONS[1], // Inorbit Mall & Durgam Cheruvu
    destination: PRESET_LOCATIONS[2], // Jubilee Hills Road No. 36
    category: RIDE_CATEGORIES[1], // Swift Comfort
    scheduledDate: 'Sat, Sep 13',
    scheduledTime: '06:15 PM',
    fare: 210.00,
    paymentMethod: 'UPI / GPay',
    isQuietRide: false,
    temperature: 'Standard',
    pinVerification: true,
    notes: 'Dinner reservation at Jubilee Hills via Cable Bridge',
    status: 'confirmed',
    createdAt: 'Sep 9, 3:40 PM',
  },
];
