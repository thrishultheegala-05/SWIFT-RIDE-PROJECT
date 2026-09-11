import React, { useState } from 'react';
import { LocationPoint, RideCategory } from '../types';
import { PRESET_LOCATIONS, RIDE_CATEGORIES } from '../data/mockData';
import { 
  MapPin, 
  Navigation, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  ChevronRight, 
  Check, 
  Zap, 
  Tag, 
  Calendar,
  Clock,
  CalendarCheck,
  AlertCircle,
  FileEdit,
  ArrowRight
} from 'lucide-react';

interface BookingCardProps {
  pickup: LocationPoint;
  destination: LocationPoint | null;
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDestination: (loc: LocationPoint) => void;
  selectedCategory: RideCategory;
  onSelectCategory: (cat: RideCategory) => void;
  onRequestRide: (options: {
    category: RideCategory;
    isQuietRide: boolean;
    temperature: string;
    paymentMethod: string;
    pinVerification: boolean;
    promoApplied: boolean;
    totalFare: number;
  }) => void;
  onScheduleRide?: (options: {
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
  }) => void;
  onViewScheduledRides?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  pickup,
  destination,
  onSelectPickup,
  onSelectDestination,
  selectedCategory,
  onSelectCategory,
  onRequestRide,
  onScheduleRide,
  onViewScheduledRides,
}) => {
  // Mode: Ride Now vs Schedule Ride
  const [isScheduleMode, setIsScheduleMode] = useState(false);

  // Scheduling states
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDateLabel = (d: Date, prefix?: string) => {
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    return prefix ? `${prefix}, ${month} ${day}` : `${weekday}, ${month} ${day}`;
  };

  const [selectedDatePreset, setSelectedDatePreset] = useState<'tomorrow' | 'dayAfter' | 'custom'>('tomorrow');
  const [customDate, setCustomDate] = useState(tomorrow.toISOString().split('T')[0]);
  const [selectedTimePreset, setSelectedTimePreset] = useState<string>('08:30 AM');
  const [customTime, setCustomTime] = useState('08:30');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  const [lastScheduledSummary, setLastScheduledSummary] = useState<{ date: string; time: string } | null>(null);

  // Preference states
  const [isQuietRide, setIsQuietRide] = useState(false);
  const [temperature, setTemperature] = useState<'normal' | 'cool' | 'warm'>('cool');
  const [pinVerification, setPinVerification] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'apple_pay' | 'visa'>('wallet');
  const [promoCode] = useState('SWIFTFIRST');
  const [isPromoApplied] = useState(true);

  // Approximate distance calculation for fare estimate
  const distanceMiles = destination ? 5.2 : 4.0;
  const rawFare = selectedCategory.basePrice + (distanceMiles * selectedCategory.perMile);
  const discount = isPromoApplied ? 50.00 : 0.00;
  const calculatedFare = Math.max(80.00, Number((rawFare - discount).toFixed(2)));

  // Computed display date & time
  const getEffectiveDateString = () => {
    if (selectedDatePreset === 'tomorrow') return formatDateLabel(tomorrow, 'Tomorrow');
    if (selectedDatePreset === 'dayAfter') return formatDateLabel(dayAfter);
    
    // Parse custom date
    try {
      const parts = customDate.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return formatDateLabel(d);
      }
    } catch {
      // fallback
    }
    return customDate;
  };

  const getEffectiveTimeString = () => {
    if (selectedTimePreset !== 'custom') {
      return selectedTimePreset;
    }
    // Convert 24hr customTime HH:mm to 12hr AM/PM
    const [hh, mm] = customTime.split(':');
    if (!hh || !mm) return customTime;
    const h = parseInt(hh, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12.toString().padStart(2, '0')}:${mm} ${ampm}`;
  };

  const handleRideNowConfirm = () => {
    if (!destination) {
      const defaultDest = PRESET_LOCATIONS.find((l) => l.id === 'loc_ferry') || PRESET_LOCATIONS[1];
      onSelectDestination(defaultDest);
    }

    onRequestRide({
      category: selectedCategory,
      isQuietRide,
      temperature: temperature === 'cool' ? 'Cool (22°C)' : temperature === 'warm' ? 'Warm (25°C)' : 'Standard',
      paymentMethod: paymentMethod === 'wallet' ? 'Swift Wallet (₹850.00)' : paymentMethod === 'apple_pay' ? 'UPI / GPay' : 'Visa •••• 4242',
      pinVerification,
      promoApplied: isPromoApplied,
      totalFare: calculatedFare,
    });
  };

  const handleScheduleConfirm = () => {
    const dest = destination || PRESET_LOCATIONS.find((l) => l.id === 'loc_ferry') || PRESET_LOCATIONS[1];
    const schedDate = getEffectiveDateString();
    const schedTime = getEffectiveTimeString();

    if (onScheduleRide) {
      onScheduleRide({
        pickup,
        destination: dest,
        category: selectedCategory,
        scheduledDate: schedDate,
        scheduledTime: schedTime,
        fare: calculatedFare,
        paymentMethod: paymentMethod === 'wallet' ? 'Swift Wallet (₹850.00)' : paymentMethod === 'apple_pay' ? 'UPI / GPay' : 'Visa •••• 4242',
        isQuietRide,
        temperature: temperature === 'cool' ? 'Cool (22°C)' : temperature === 'warm' ? 'Warm (25°C)' : 'Standard',
        pinVerification,
        notes: scheduleNotes.trim(),
      });
    }

    setLastScheduledSummary({ date: schedDate, time: schedTime });
    setShowScheduleSuccess(true);
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
      {/* Schedule Success Overlay Modal */}
      {showScheduleSuccess && lastScheduledSummary && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-2">
            Booking Reserved
          </span>
          <h3 className="text-xl font-black text-slate-900">Ride Scheduled!</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Your <span className="font-bold text-slate-800">{selectedCategory.name}</span> is reserved for{' '}
            <span className="font-bold text-slate-800">{lastScheduledSummary.date}</span> at{' '}
            <span className="font-bold text-slate-800">{lastScheduledSummary.time}</span>.
          </p>

          <div className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 my-4 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span>Pickup:</span>
              <span className="font-bold text-slate-800 truncate max-w-[180px]">{pickup.name}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Destination:</span>
              <span className="font-bold text-slate-800 truncate max-w-[180px]">{destination?.name || 'Inorbit Mall & Durgam Cheruvu'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 pt-1.5 border-t border-slate-200/60">
              <span>Locked Fare:</span>
              <span className="font-black text-slate-900 text-sm">₹{calculatedFare.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            {onViewScheduledRides && (
              <button
                id="btn-view-scheduled-rides"
                onClick={() => {
                  setShowScheduleSuccess(false);
                  onViewScheduledRides();
                }}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>View in Scheduled Tab</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            )}
            <button
              onClick={() => {
                setShowScheduleSuccess(false);
                setIsScheduleMode(false);
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Done / Book Another
            </button>
          </div>
        </div>
      )}

      {/* Top Toggle: Ride Now vs Schedule Ride */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/70">
        <button
          type="button"
          id="toggle-mode-ride-now"
          onClick={() => setIsScheduleMode(false)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            !isScheduleMode
              ? 'bg-white text-slate-950 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${!isScheduleMode ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
          <span>Ride Now</span>
        </button>

        <button
          type="button"
          id="toggle-mode-schedule-ride"
          onClick={() => setIsScheduleMode(true)}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            isScheduleMode
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule Ride</span>
        </button>
      </div>

      {/* Location Selector Bar */}
      <div className="relative flex flex-col gap-2.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        {/* Connection line */}
        <div className="absolute left-[29px] top-[26px] bottom-[26px] w-0.5 bg-slate-300"></div>

        {/* Pickup point */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pickup Location</div>
            <select
              id="select-pickup-location"
              value={pickup.id}
              onChange={(e) => {
                const found = PRESET_LOCATIONS.find((p) => p.id === e.target.value);
                if (found) onSelectPickup(found);
              }}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none truncate cursor-pointer py-0.5"
            >
              {PRESET_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.address}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropoff point */}
        <div className="flex items-center gap-3 relative z-10 pt-1 border-t border-slate-200/60">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Where to?</div>
            <select
              id="select-destination-location"
              value={destination?.id || 'loc_ferry'}
              onChange={(e) => {
                const found = PRESET_LOCATIONS.find((p) => p.id === e.target.value);
                if (found) onSelectDestination(found);
              }}
              className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none truncate cursor-pointer py-0.5"
            >
              {PRESET_LOCATIONS.filter((l) => l.id !== pickup.id).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.address}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Popular Destination Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 font-medium">Quick pick:</span>
        {PRESET_LOCATIONS.filter((l) => l.id !== pickup.id).slice(0, 3).map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelectDestination(loc)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
              destination?.id === loc.id
                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* SCHEDULE RIDE CONTROLS: Shown when in Schedule Mode */}
      {isScheduleMode && (
        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col gap-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">Choose Date & Time</h4>
                <p className="text-[11px] text-slate-500">Pick any upcoming slot up to 30 days ahead</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300/60">
              Price Protected
            </span>
          </div>

          {/* Date Selector Presets */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Date</span>
              <span className="text-amber-800 font-extrabold">{getEffectiveDateString()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedDatePreset('tomorrow')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedDatePreset === 'tomorrow'
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setSelectedDatePreset('dayAfter')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  selectedDatePreset === 'dayAfter'
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                In 2 Days
              </button>
              <button
                type="button"
                onClick={() => setSelectedDatePreset('custom')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1 ${
                  selectedDatePreset === 'custom'
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
            </div>

            {selectedDatePreset === 'custom' && (
              <div className="mt-2">
                <input
                  type="date"
                  min={today.toISOString().split('T')[0]}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            )}
          </div>

          {/* Time Selector */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
              <span>Pickup Time</span>
              <span className="text-amber-800 font-extrabold">{getEffectiveTimeString()}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {['08:30 AM', '12:00 PM', '05:30 PM', '08:00 PM'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTimePreset(t)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedTimePreset === t
                      ? 'bg-slate-900 text-amber-400 border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Custom time picker toggle */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] text-slate-500 shrink-0 font-medium">Or exact time:</span>
              <input
                type="time"
                value={customTime}
                onChange={(e) => {
                  setCustomTime(e.target.value);
                  setSelectedTimePreset('custom');
                }}
                className={`bg-white border rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  selectedTimePreset === 'custom' ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-300'
                }`}
              />
            </div>
          </div>

          {/* Optional Driver Note / Flight details */}
          <div>
            <label htmlFor="input-schedule-notes" className="text-[11px] font-bold text-slate-600 mb-1 block">
              Driver Instructions / Flight Info (Optional)
            </label>
            <input
              id="input-schedule-notes"
              type="text"
              value={scheduleNotes}
              onChange={(e) => setScheduleNotes(e.target.value)}
              placeholder="e.g. RGIA Airport Terminal 1, wait near Pillar 6, 2 bags"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Policy & Guarantee Box */}
          <div className="flex items-start gap-2 p-2.5 bg-white/80 rounded-xl border border-amber-200/60 text-[11px] text-slate-600">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold text-slate-900">Swift Guaranteed Dispatch:</span> Your driver will be matched 15-20 minutes before pickup time. Free cancellation up to 60 minutes prior.
            </div>
          </div>
        </div>
      )}

      {/* Ride Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose Ride Tier</h3>
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-600" /> High driver availability
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {RIDE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            const price = Math.max(80.00, Number((cat.basePrice + (distanceMiles * cat.perMile) - discount).toFixed(2)));

            return (
              <div
                key={cat.id}
                id={`ride-tier-${cat.id}`}
                onClick={() => onSelectCategory(cat)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/50 shadow-md'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cat.iconType === 'green' ? (
                      <span className="font-black text-xs text-emerald-700">EV ⚡</span>
                    ) : cat.iconType === 'xl' ? (
                      <span className="font-black text-xs">6 SEAT</span>
                    ) : cat.iconType === 'black' ? (
                      <span className="font-black text-xs text-amber-300 bg-slate-950 px-1 py-0.5 rounded">VIP</span>
                    ) : (
                      <Navigation className="w-5 h-5 transform -rotate-45" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{cat.name}</span>
                      <span className="flex items-center text-xs text-slate-500 font-medium">
                        <Users className="w-3 h-3 mr-0.5" /> {cat.capacity}
                      </span>
                      {cat.badge && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          cat.badge === 'Popular' 
                            ? 'bg-amber-100 text-amber-800' 
                            : cat.badge === 'Eco' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isScheduleMode ? 'Guaranteed price' : `${cat.etaMinutes} min arrival`} • {cat.tagline}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-base text-slate-900">₹{price.toFixed(2)}</div>
                  {isPromoApplied && (
                    <span className="text-[10px] text-emerald-600 font-semibold line-through">
                      ₹{(price + discount).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety & Preferences Strip */}
      <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700 font-medium">RideCheck PIN Verification</span>
        </div>
        <button
          onClick={() => setPinVerification(!pinVerification)}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            pinVerification ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
              pinVerification ? 'translate-x-4' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Payment & Promo Bar */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" />
          <select
            id="select-payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="wallet">Swift Wallet (₹850.00)</option>
            <option value="apple_pay">UPI / GPay</option>
            <option value="visa">Visa •••• 4242</option>
          </select>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-bold">
          <Tag className="w-3 h-3" />
          <span>PROMO: -₹50.00</span>
        </div>
      </div>

      {/* Action Button: Changes dynamically between Request Now and Schedule */}
      {isScheduleMode ? (
        <button
          id="btn-schedule-swift-ride"
          onClick={handleScheduleConfirm}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base group"
        >
          <CalendarCheck className="w-5 h-5 text-amber-400" />
          <span>Schedule {selectedCategory.name}</span>
          <span className="text-amber-400">•</span>
          <span className="text-amber-400">₹{calculatedFare.toFixed(2)}</span>
          <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          id="btn-confirm-swift-ride"
          onClick={handleRideNowConfirm}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base group"
        >
          <span>Request {selectedCategory.name}</span>
          <span className="text-amber-400">•</span>
          <span className="text-amber-400">₹{calculatedFare.toFixed(2)}</span>
          <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};
