import React, { useState, useEffect, useRef } from 'react';
import { 
  ActiveTrip, 
  DriverInfo, 
  LocationPoint, 
  NavigationTab, 
  RideCategory, 
  TripPhase,
  ScheduledRide
} from './types';
import { 
  NEARBY_DRIVERS, 
  PRESET_LOCATIONS, 
  PRIMARY_DRIVER, 
  RIDE_CATEGORIES, 
  SIMULATED_PICKUP_WAYPOINTS, 
  SIMULATED_TRIP_WAYPOINTS,
  INITIAL_SCHEDULED_RIDES
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { MapView } from './components/MapView';
import { BookingCard } from './components/BookingCard';
import { MatchingModal } from './components/MatchingModal';
import { ActiveTripCard } from './components/ActiveTripCard';
import { ChatModal } from './components/ChatModal';
import { CallModal } from './components/CallModal';
import { SafetyModal } from './components/SafetyModal';
import { RatingModal } from './components/RatingModal';
import { DriverConsole } from './components/DriverConsole';
import { TripHistoryView } from './components/TripHistoryView';
import { WalletView } from './components/WalletView';
import { ShieldCheck, Info, Check, Bell } from 'lucide-react';

export default function App() {
  // Navigation & Screen States
  const [currentTab, setCurrentTab] = useState<NavigationTab>('ride');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Locations & Vehicle Selection
  const [pickup, setPickup] = useState<LocationPoint>(PRESET_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationPoint | null>(PRESET_LOCATIONS[1]);
  const [selectedCategory, setSelectedCategory] = useState<RideCategory>(RIDE_CATEGORIES[0]);

  // Trip & Modal States
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Scheduled Rides State
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>(INITIAL_SCHEDULED_RIDES);
  const [activityInitialSubTab, setActivityInitialSubTab] = useState<'past' | 'scheduled'>('past');

  // Simulation Engine States
  const [simPlaying, setSimPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [driverPos, setDriverPos] = useState<[number, number]>(SIMULATED_PICKUP_WAYPOINTS[0]);
  const [progressIndex, setProgressIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to interpolate between two GPS points
  const interpolateCoords = (
    p1: [number, number], 
    p2: [number, number], 
    factor: number
  ): [number, number] => {
    return [
      p1[0] + (p2[0] - p1[0]) * factor,
      p1[1] + (p2[1] - p1[1]) * factor,
    ];
  };

  // Active Trip Simulation Loop
  useEffect(() => {
    if (!activeTrip || !simPlaying || activeTrip.phase === 'idle' || activeTrip.phase === 'completed') {
      return;
    }

    const waypoints = activeTrip.phase === 'driver_en_route' 
      ? SIMULATED_PICKUP_WAYPOINTS 
      : SIMULATED_TRIP_WAYPOINTS;

    const intervalTime = Math.max(100, 1000 / simSpeed);

    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        const nextIndex = prev + 1;
        const totalSteps = (waypoints.length - 1) * 10;

        if (nextIndex >= totalSteps) {
          // Reached waypoint target
          if (activeTrip.phase === 'driver_en_route') {
            setActiveTrip((prevTrip) => prevTrip ? { ...prevTrip, phase: 'driver_arrived', etaMinutes: 0 } : null);
            showToast(`${activeTrip.driver.name} has arrived at ${pickup.name}!`);
            return 0;
          } else if (activeTrip.phase === 'in_progress') {
            setActiveTrip((prevTrip) => prevTrip ? { ...prevTrip, phase: 'completed', etaMinutes: 0 } : null);
            setIsRatingOpen(true);
            return 0;
          }
          return totalSteps;
        }

        // Calculate segment and sub-factor
        const segment = Math.floor(nextIndex / 10);
        const subFactor = (nextIndex % 10) / 10;
        const p1 = waypoints[segment];
        const p2 = waypoints[Math.min(segment + 1, waypoints.length - 1)];
        const currentCoord = interpolateCoords(p1, p2, subFactor);

        setDriverPos(currentCoord);

        // Update ETA estimate
        const remainingSteps = totalSteps - nextIndex;
        const estimatedMinutes = Math.ceil(remainingSteps / 12);
        setActiveTrip((prevTrip) => prevTrip ? { ...prevTrip, etaMinutes: estimatedMinutes } : null);

        return nextIndex;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeTrip?.phase, simPlaying, simSpeed]);

  // Request Ride Handler
  const handleRequestRide = (options: {
    category: RideCategory;
    isQuietRide: boolean;
    temperature: string;
    paymentMethod: string;
    pinVerification: boolean;
    promoApplied: boolean;
    totalFare: number;
  }) => {
    setIsMatching(true);
  };

  // Schedule Ride Handler
  const handleScheduleRide = (options: {
    pickup: LocationPoint;
    destination: LocationPoint;
    category: RideCategory;
    scheduledDate: string;
    scheduledTime: string;
    fare: number;
    paymentMethod: string;
    isQuietRide: boolean;
    temperature: string;
    pinVerification: boolean;
    notes: string;
  }) => {
    const newScheduled: ScheduledRide = {
      id: `sched_${Date.now()}`,
      pickup: options.pickup,
      destination: options.destination,
      category: options.category,
      scheduledDate: options.scheduledDate,
      scheduledTime: options.scheduledTime,
      fare: options.fare,
      paymentMethod: options.paymentMethod,
      isQuietRide: options.isQuietRide,
      temperature: options.temperature,
      pinVerification: options.pinVerification,
      notes: options.notes,
      status: 'confirmed',
      createdAt: 'Just now',
    };

    setScheduledRides((prev) => [newScheduled, ...prev]);
    showToast(`Ride scheduled for ${options.scheduledDate} at ${options.scheduledTime}!`);
  };

  const handleCancelScheduledRide = (id: string) => {
    setScheduledRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );
    showToast('Scheduled ride cancelled without fee.');
  };

  const handleRescheduleRide = (id: string, newDate: string, newTime: string) => {
    setScheduledRides((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, scheduledDate: newDate, scheduledTime: newTime } : r
      )
    );
    showToast(`Booking updated to ${newDate} at ${newTime}!`);
  };

  // Dispatch Confirmation Handler
  const handleMatchedDriver = (driver: DriverInfo) => {
    setIsMatching(false);
    const newTrip: ActiveTrip = {
      id: `trip_${Date.now()}`,
      driver: PRIMARY_DRIVER,
      category: selectedCategory,
      pickup,
      destination: destination || PRESET_LOCATIONS[1],
      phase: 'driver_en_route',
      etaMinutes: 3,
      pinCode: '4821',
      fare: Math.max(100.00, selectedCategory.basePrice + (4.5 * selectedCategory.perMile)),
      progressRatio: 0,
      paymentMethod: 'Swift Wallet (₹850.00)',
      isQuietRide: false,
      temperature: 'Cool (22°C)',
    };

    setActiveTrip(newTrip);
    setProgressIndex(0);
    setDriverPos(SIMULATED_PICKUP_WAYPOINTS[0]);
    showToast(`Matched with ${driver.name} (${driver.carModel})!`);
  };

  // Next Phase Shortcut
  const handleSkipNextPhase = () => {
    if (!activeTrip) return;
    if (activeTrip.phase === 'driver_en_route') {
      setActiveTrip({ ...activeTrip, phase: 'driver_arrived', etaMinutes: 0 });
      setDriverPos(SIMULATED_PICKUP_WAYPOINTS[SIMULATED_PICKUP_WAYPOINTS.length - 1]);
      showToast(`${activeTrip.driver.name} has arrived at ${pickup.name}!`);
    } else if (activeTrip.phase === 'driver_arrived') {
      setActiveTrip({ ...activeTrip, phase: 'in_progress', etaMinutes: 6 });
      setProgressIndex(0);
      setDriverPos(SIMULATED_TRIP_WAYPOINTS[0]);
      showToast(`Trip in progress to ${activeTrip.destination.name}!`);
    } else if (activeTrip.phase === 'in_progress') {
      setActiveTrip({ ...activeTrip, phase: 'completed', etaMinutes: 0 });
      setDriverPos(SIMULATED_TRIP_WAYPOINTS[SIMULATED_TRIP_WAYPOINTS.length - 1]);
      setIsRatingOpen(true);
    }
  };

  const handleResetTrip = () => {
    setActiveTrip(null);
    setProgressIndex(0);
    setDriverPos(SIMULATED_PICKUP_WAYPOINTS[0]);
    showToast('Trip ended and reset to new booking.');
  };

  const handleRatingSubmit = () => {
    setIsRatingOpen(false);
    setActiveTrip(null);
    setProgressIndex(0);
    showToast('Thank you! Your receipt and rating have been recorded.');
  };

  const currentRouteCoords = activeTrip 
    ? (activeTrip.phase === 'driver_en_route' ? SIMULATED_PICKUP_WAYPOINTS : SIMULATED_TRIP_WAYPOINTS)
    : (destination ? [[pickup.lat, pickup.lng], [destination.lat, destination.lng]] as [number, number][] : []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveTrip={!!activeTrip && activeTrip.phase !== 'completed'}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        scheduledCount={scheduledRides.filter((r) => r.status === 'confirmed').length}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[1300] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center p-3 sm:p-6 pb-24 md:pb-8">
        <div className={`w-full transition-all duration-300 ${
          isMobileFrame 
            ? 'max-w-[420px] rounded-[42px] border-[10px] border-slate-900 shadow-2xl bg-slate-50 overflow-hidden min-h-[780px] my-4' 
            : 'max-w-7xl'
        }`}>
          {/* Rider Tab */}
          {currentTab === 'ride' && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Map */}
              <div className={`w-full ${isMobileFrame ? 'h-[360px]' : 'lg:col-span-7 h-[580px]'}`}>
                <MapView
                  pickup={pickup}
                  destination={destination}
                  drivers={NEARBY_DRIVERS}
                  activeDriver={activeTrip?.driver || PRIMARY_DRIVER}
                  activeDriverPosition={activeTrip ? driverPos : null}
                  tripPhase={activeTrip ? activeTrip.phase : 'idle'}
                  routeCoordinates={currentRouteCoords}
                  onSelectDestination={setDestination}
                />
              </div>

              {/* Right Column: Dynamic Booking or Active Trip Dashboard */}
              <div className={`w-full ${isMobileFrame ? 'p-3' : 'lg:col-span-5'}`}>
                {activeTrip ? (
                  <ActiveTripCard
                    trip={activeTrip}
                    simPlaying={simPlaying}
                    simSpeed={simSpeed}
                    onTogglePlay={() => setSimPlaying(!simPlaying)}
                    onCycleSpeed={() => setSimSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
                    onSkipNextPhase={handleSkipNextPhase}
                    onResetTrip={handleResetTrip}
                    onOpenChat={() => setIsChatOpen(true)}
                    onOpenCall={() => setIsCallOpen(true)}
                    onOpenSafety={() => setIsSafetyOpen(true)}
                    onShareTrip={() => {
                      navigator.clipboard.writeText(`https://swiftride.live/track/${activeTrip.id}`);
                      showToast('Live tracking link copied to clipboard!');
                    }}
                    onCancelTrip={handleResetTrip}
                  />
                ) : (
                  <BookingCard
                    pickup={pickup}
                    destination={destination}
                    onSelectPickup={setPickup}
                    onSelectDestination={setDestination}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onRequestRide={handleRequestRide}
                    onScheduleRide={handleScheduleRide}
                    onViewScheduledRides={() => {
                      setActivityInitialSubTab('scheduled');
                      setCurrentTab('activity');
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Driver Cockpit Mode */}
          {currentTab === 'driver' && (
            <div className={isMobileFrame ? 'p-3' : ''}>
              <DriverConsole />
            </div>
          )}

          {/* Activity / Trip History */}
          {currentTab === 'activity' && (
            <div className={isMobileFrame ? 'p-3' : ''}>
              <TripHistoryView 
                scheduledRides={scheduledRides}
                onCancelScheduledRide={handleCancelScheduledRide}
                onRescheduleRide={handleRescheduleRide}
                onNavigateToBooking={() => setCurrentTab('ride')}
                initialSubTab={activityInitialSubTab}
              />
            </div>
          )}

          {/* Swift Wallet */}
          {currentTab === 'wallet' && (
            <div className={isMobileFrame ? 'p-3' : ''}>
              <WalletView />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {isMatching && (
        <MatchingModal
          category={selectedCategory}
          onMatched={handleMatchedDriver}
          onCancel={() => setIsMatching(false)}
        />
      )}

      {isChatOpen && activeTrip && (
        <ChatModal
          driver={activeTrip.driver}
          onClose={() => setIsChatOpen(false)}
          onOpenCall={() => {
            setIsChatOpen(false);
            setIsCallOpen(true);
          }}
        />
      )}

      {isCallOpen && activeTrip && (
        <CallModal
          driver={activeTrip.driver}
          onEndCall={() => setIsCallOpen(false)}
        />
      )}

      {isSafetyOpen && activeTrip && (
        <SafetyModal
          trip={activeTrip}
          onClose={() => setIsSafetyOpen(false)}
        />
      )}

      {isRatingOpen && activeTrip && (
        <RatingModal
          trip={activeTrip}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
