import React, { useState } from 'react';
import { INITIAL_TRIP_HISTORY } from '../data/mockData';
import { TripHistoryItem, ScheduledRide } from '../types';
import { 
  Calendar, 
  MapPin, 
  Download, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  FileText, 
  Clock, 
  CalendarCheck, 
  XCircle, 
  Edit3, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Share2, 
  Check, 
  Navigation,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TripHistoryViewProps {
  scheduledRides?: ScheduledRide[];
  onCancelScheduledRide?: (id: string) => void;
  onRescheduleRide?: (id: string, newDate: string, newTime: string) => void;
  onNavigateToBooking?: () => void;
  initialSubTab?: 'past' | 'scheduled';
}

export const TripHistoryView: React.FC<TripHistoryViewProps> = ({
  scheduledRides = [],
  onCancelScheduledRide,
  onRescheduleRide,
  onNavigateToBooking,
  initialSubTab = 'past',
}) => {
  const [subTab, setSubTab] = useState<'past' | 'scheduled'>(initialSubTab);
  const [pastHistory] = useState<TripHistoryItem[]>(INITIAL_TRIP_HISTORY);
  const [selectedPastTrip, setSelectedPastTrip] = useState<TripHistoryItem | null>(INITIAL_TRIP_HISTORY[0]);
  const [selectedScheduledRideId, setSelectedScheduledRideId] = useState<string | null>(
    scheduledRides.length > 0 ? scheduledRides[0].id : null
  );

  // Reschedule Modal state
  const [rescheduleTargetId, setRescheduleTargetId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // Cancel confirmation state
  const [cancellingRideId, setCancellingRideId] = useState<string | null>(null);

  // Calendar synced feedback state
  const [syncedFeedbackId, setSyncedFeedbackId] = useState<string | null>(null);

  // Active selected scheduled ride object
  const activeScheduledRide = scheduledRides.find((r) => r.id === selectedScheduledRideId) || scheduledRides[0] || null;

  const handleOpenReschedule = (ride: ScheduledRide, e: React.MouseEvent) => {
    e.stopPropagation();
    setRescheduleTargetId(ride.id);
    setRescheduleDate(ride.scheduledDate);
    setRescheduleTime(ride.scheduledTime);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTargetId || !onRescheduleRide) return;
    onRescheduleRide(rescheduleTargetId, rescheduleDate, rescheduleTime);
    setRescheduleTargetId(null);
  };

  const handleCancelClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCancellingRideId(id);
  };

  const handleConfirmCancel = (id: string) => {
    if (onCancelScheduledRide) {
      onCancelScheduledRide(id);
    }
    setCancellingRideId(null);
  };

  const handleAddToCalendar = (ride: ScheduledRide, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncedFeedbackId(ride.id);
    setTimeout(() => setSyncedFeedbackId(null), 2500);

    // Generate .ics calendar download
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SwiftRide//Scheduled Ride//EN
BEGIN:VEVENT
SUMMARY:SwiftRide: ${ride.pickup.name} to ${ride.destination.name}
DESCRIPTION:Scheduled ${ride.category.name} ride. Locked fare: ₹${ride.fare.toFixed(2)}. Driver dispatches ~20m prior.
LOCATION:${ride.pickup.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `swiftride_${ride.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header & Main Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Your Activity</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage upcoming scheduled trips, view past ride receipts, and tax invoices
          </p>
        </div>

        {/* Sub-tab Switcher: Past vs Scheduled */}
        <div className="flex items-center p-1 bg-slate-200/70 rounded-2xl border border-slate-300/60 self-start sm:self-auto">
          <button
            id="tab-past-rides"
            onClick={() => setSubTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              subTab === 'past'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Past Rides</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
              {pastHistory.length}
            </span>
          </button>

          <button
            id="tab-scheduled-rides"
            onClick={() => setSubTab('scheduled')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              subTab === 'scheduled'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Scheduled</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              subTab === 'scheduled' ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-900'
            }`}>
              {scheduledRides.filter((r) => r.status === 'confirmed').length}
            </span>
          </button>
        </div>
      </div>

      {/* ======================= PAST RIDES TAB ======================= */}
      {subTab === 'past' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Past History List */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {pastHistory.map((item) => (
              <div
                key={item.id}
                id={`past-trip-${item.id}`}
                onClick={() => setSelectedPastTrip(item)}
                className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${
                  selectedPastTrip?.id === item.id ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.driverAvatar}
                    alt={item.driverName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{item.destination}</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.date} • {item.driverName} ({item.carDetails})
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Rated {item.rating}.0</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-base text-slate-900">₹{item.fare.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" /> Paid
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Trip Receipt Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex flex-col gap-4 sticky top-24">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Trip Receipt & Tax Invoice</span>
            </div>

            {selectedPastTrip ? (
              <div className="flex flex-col gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="font-bold text-slate-900 text-sm">{selectedPastTrip.destination}</div>
                  <div className="text-slate-500 mt-1">From: {selectedPastTrip.pickup}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{selectedPastTrip.date}</div>
                </div>

                <div className="space-y-1.5 py-2 border-y border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Base fare</span>
                    <span>₹50.00</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Distance & Time</span>
                    <span>₹{(selectedPastTrip.fare - 70).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>City Access Fee</span>
                    <span>₹20.00</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Paid</span>
                    <span>₹{selectedPastTrip.fare.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Receipt #${selectedPastTrip.id} downloaded.`)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download PDF Receipt</span>
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select any trip from your history to view the full receipt breakdown.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= SCHEDULED RIDES TAB ======================= */}
      {subTab === 'scheduled' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Scheduled Bookings List */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {scheduledRides.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No Scheduled Rides</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  You don't have any upcoming reservations. Schedule your ride in advance for early morning flights, important meetings, or event departures.
                </p>
                {onNavigateToBooking && (
                  <button
                    id="btn-schedule-new-ride-empty"
                    onClick={onNavigateToBooking}
                    className="mt-5 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Schedule a Ride Now</span>
                  </button>
                )}
              </div>
            ) : (
              /* List of scheduled rides */
              scheduledRides.map((ride) => {
                const isSelected = activeScheduledRide?.id === ride.id;
                const isCancelled = ride.status === 'cancelled';

                return (
                  <div
                    key={ride.id}
                    id={`scheduled-ride-${ride.id}`}
                    onClick={() => setSelectedScheduledRideId(ride.id)}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col gap-4 relative overflow-hidden ${
                      isSelected ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-100'
                    } ${isCancelled ? 'opacity-65 bg-slate-50/70' : ''}`}
                  >
                    {/* Top status bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full flex items-center gap-1.5 border border-amber-300/60">
                          <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>{ride.scheduledDate}</span>
                          <span className="text-amber-400">•</span>
                          <span>{ride.scheduledTime}</span>
                        </span>

                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                          {ride.category.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCancelled ? (
                          <span className="text-[11px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Cancelled
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" /> Confirmed
                          </span>
                        )}
                        <span className="font-black text-base text-slate-900">₹{ride.fare.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="flex flex-col gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 relative">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Pickup</div>
                          <div className="text-xs font-bold text-slate-800 truncate">{ride.pickup.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pt-1.5 border-t border-slate-200/60">
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                          <MapPin className="w-2.5 h-2.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Destination</div>
                          <div className="text-xs font-bold text-slate-800 truncate">{ride.destination.name}</div>
                        </div>
                      </div>
                    </div>

                    {/* Special Notes & Preferences if present */}
                    {(ride.notes || ride.isQuietRide || ride.pinVerification) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        {ride.notes && (
                          <span className="bg-amber-50/80 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md font-medium truncate max-w-full">
                            Note: {ride.notes}
                          </span>
                        )}
                        {ride.isQuietRide && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            Quiet Ride
                          </span>
                        )}
                        {ride.pinVerification && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> PIN Enabled
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {ride.paymentMethod}
                        </span>
                      </div>
                    )}

                    {/* Action buttons on card */}
                    {!isCancelled && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-reschedule-${ride.id}`}
                            onClick={(e) => handleOpenReschedule(ride, e)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            id={`btn-add-calendar-${ride.id}`}
                            onClick={(e) => handleAddToCalendar(ride, e)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                          >
                            {syncedFeedbackId === ride.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Calendar Synced</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>Add to Calendar</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div>
                          {cancellingRideId === ride.id ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[11px] text-rose-600 font-bold">Confirm cancel?</span>
                              <button
                                onClick={() => handleConfirmCancel(ride.id)}
                                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-black text-xs hover:bg-rose-700"
                              >
                                Yes, Cancel
                              </button>
                              <button
                                onClick={() => setCancellingRideId(null)}
                                className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`btn-cancel-ride-${ride.id}`}
                              onClick={(e) => handleCancelClick(ride.id, e)}
                              className="text-slate-400 hover:text-rose-600 font-bold text-[11px] transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick Action to Schedule another ride */}
            {onNavigateToBooking && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Need another ride scheduled?</h4>
                    <p className="text-[11px] text-slate-500">Book in advance with price protection & guaranteed arrival</p>
                  </div>
                </div>
                <button
                  onClick={onNavigateToBooking}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                >
                  Book New Ride
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Scheduled Ride Assurance & Details Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-md flex flex-col gap-4 sticky top-24">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <CalendarCheck className="w-4 h-4 text-amber-500" />
              <span>Reservation Details</span>
            </div>

            {activeScheduledRide ? (
              <div className="flex flex-col gap-3.5 text-xs">
                {/* Summary banner */}
                <div className="p-3.5 bg-slate-900 text-white rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-amber-400 font-extrabold uppercase tracking-wider">
                      {activeScheduledRide.category.name}
                    </span>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      {activeScheduledRide.status === 'confirmed' ? 'Guaranteed Window' : 'Cancelled'}
                    </span>
                  </div>
                  <div className="text-xl font-black mt-1">{activeScheduledRide.scheduledTime}</div>
                  <div className="text-xs text-slate-300 font-medium">{activeScheduledRide.scheduledDate}</div>
                </div>

                {/* Dispatch Timeline */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Driver Dispatch Timeline
                  </h4>
                  <div className="space-y-2.5 relative pl-4 border-l-2 border-slate-200 text-[11px]">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                      <div className="font-bold text-slate-800">Booking Confirmed</div>
                      <div className="text-slate-400 text-[10px]">Price locked at ₹{activeScheduledRide.fare.toFixed(2)}</div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white"></span>
                      <div className="font-bold text-slate-800">Driver Matching</div>
                      <div className="text-slate-400 text-[10px]">Dispatched 15-20 min before scheduled time</div>
                    </div>

                    <div className="relative">
                      <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></span>
                      <div className="font-bold text-slate-600">Pickup & PIN Verification</div>
                      <div className="text-slate-400 text-[10px]">4-Digit PIN safety code requested upon boarding</div>
                    </div>
                  </div>
                </div>

                {/* Fare & Guarantee */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Guaranteed Fare</span>
                    <span className="font-bold text-slate-900">₹{activeScheduledRide.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method</span>
                    <span className="font-bold text-slate-800">{activeScheduledRide.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Cancellation Policy</span>
                    <span className="text-emerald-700 font-bold">Free up to 60m prior</span>
                  </div>
                </div>

                {/* Reschedule Button */}
                {activeScheduledRide.status === 'confirmed' && (
                  <button
                    onClick={(e) => handleOpenReschedule(activeScheduledRide, e)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Date or Time</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a scheduled trip to review full dispatch details and fare lock guarantee.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTargetId && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Reschedule Your Ride</h3>
                  <p className="text-xs text-slate-500">Pick a new pickup date and time slot</p>
                </div>
              </div>
              <button
                onClick={() => setRescheduleTargetId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">New Date</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['Tomorrow', 'In 2 Days', 'This Weekend'].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setRescheduleDate(label)}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        rescheduleDate === label
                          ? 'bg-slate-900 text-amber-400 border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  placeholder="e.g. Tomorrow, Sep 12"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">New Pickup Time</label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {['08:30 AM', '11:00 AM', '04:30 PM', '07:00 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRescheduleTime(t)}
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        rescheduleTime === t
                          ? 'bg-slate-900 text-amber-400 border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  placeholder="e.g. 09:15 AM"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Your guaranteed price and ride tier will remain locked for the new time window.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleTargetId(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
