import React from 'react';
import { ActiveTrip, TripPhase } from '../types';
import { 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Share2, 
  Star, 
  Award, 
  CheckCircle2, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw,
  Sparkles,
  Car
} from 'lucide-react';

interface ActiveTripCardProps {
  trip: ActiveTrip;
  simPlaying: boolean;
  simSpeed: number;
  onTogglePlay: () => void;
  onCycleSpeed: () => void;
  onSkipNextPhase: () => void;
  onResetTrip: () => void;
  onOpenChat: () => void;
  onOpenCall: () => void;
  onOpenSafety: () => void;
  onShareTrip: () => void;
  onCancelTrip: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  simPlaying,
  simSpeed,
  onTogglePlay,
  onCycleSpeed,
  onSkipNextPhase,
  onResetTrip,
  onOpenChat,
  onOpenCall,
  onOpenSafety,
  onShareTrip,
  onCancelTrip,
}) => {
  const { driver, category, phase, etaMinutes, pinCode, pickup, destination } = trip;

  const phaseDetails = {
    idle: { title: 'No active trip', subtitle: '', color: 'bg-slate-100 text-slate-700' },
    matching: { title: 'Dispatching driver...', subtitle: 'Scanning nearby network', color: 'bg-amber-100 text-amber-800' },
    driver_en_route: { 
      title: `${driver.name} is on the way`, 
      subtitle: `Arriving in ~${Math.max(1, etaMinutes)} mins at ${pickup.name}`, 
      badge: 'Driver En Route',
      color: 'bg-amber-500 text-slate-950' 
    },
    driver_arrived: { 
      title: `${driver.name} is waiting outside!`, 
      subtitle: `Look for ${driver.carColor} ${driver.carModel} with hazard lights on`, 
      badge: 'Driver Arrived',
      color: 'bg-emerald-500 text-white' 
    },
    in_progress: { 
      title: `On trip to ${destination.name}`, 
      subtitle: `Estimated dropoff in ~${Math.max(1, etaMinutes)} mins`, 
      badge: 'Trip in Progress',
      color: 'bg-blue-600 text-white' 
    },
    completed: { 
      title: 'Trip Completed', 
      subtitle: `Arrived safely at ${destination.name}`, 
      badge: 'Finished',
      color: 'bg-emerald-600 text-white' 
    },
  }[phase];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-4">
      {/* Dynamic Status Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 ${phaseDetails.color}`}>
            {phaseDetails.badge || 'Active Trip'}
          </span>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            {phaseDetails.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{phaseDetails.subtitle}</p>
        </div>

        {/* PIN Verification Badge */}
        <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl px-3 py-1.5 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-amber-800">Ride PIN</div>
          <div className="font-mono text-lg font-black tracking-widest text-slate-900">
            {pinCode}
          </div>
        </div>
      </div>

      {/* Driver & Vehicle Profile Showcase (Featuring Rajan V.) */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          {/* Driver Portrait Image */}
          <div className="relative shrink-0">
            <img
              src={driver.avatarUrl}
              alt={driver.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Driver details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-slate-900 truncate">{driver.name}</span>
              <span className="text-[10px] bg-slate-900 text-amber-400 font-extrabold px-1.5 py-0.5 rounded">
                GOLD
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{driver.rating}</span>
              <span className="text-slate-300">•</span>
              <span>{driver.totalTrips.toLocaleString()} rides</span>
              <span className="text-slate-300">•</span>
              <span>{driver.yearsActive} yrs pro</span>
            </div>

            <div className="text-xs font-bold text-slate-700 mt-1 truncate">
              {driver.carColor} {driver.carModel}
            </div>
          </div>

          {/* Car Plate badge */}
          <div className="text-right shrink-0">
            <div className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-center shadow-sm">
              <div className="text-[8px] tracking-wider text-slate-400 font-bold uppercase">CALIFORNIA</div>
              <div className="font-mono text-sm font-black text-slate-900">{driver.carPlate}</div>
            </div>
          </div>
        </div>

        {/* Driver verified badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
            <CheckCircle2 className="w-3 h-3" /> RideCheck Verified
          </span>
          <span className="flex items-center gap-1 text-slate-700 bg-slate-200/70 px-2 py-0.5 rounded-md font-medium">
            English & Hindi
          </span>
          <span className="flex items-center gap-1 text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md font-medium">
            ★ Top Complimented
          </span>
        </div>
      </div>

      {/* Communication & Safety Controls */}
      <div className="grid grid-cols-4 gap-2">
        <button
          id="btn-chat-driver"
          onClick={onOpenChat}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <MessageSquare className="w-4 h-4 text-slate-700" />
          <span>Chat</span>
        </button>

        <button
          id="btn-call-driver"
          onClick={onOpenCall}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Call</span>
        </button>

        <button
          id="btn-share-trip"
          onClick={onShareTrip}
          className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4 text-blue-600" />
          <span>Share</span>
        </button>

        <button
          id="btn-safety-center"
          onClick={onOpenSafety}
          className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border border-rose-200"
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Safety</span>
        </button>
      </div>

      {/* Live Simulation Control Dashboard */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 flex flex-col gap-2 shadow-inner">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Car className="w-3 h-3" /> Live Trip Simulator
          </span>
          <span className="text-slate-400">
            Speed: <span className="text-white font-bold">{simSpeed}x</span>
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTogglePlay}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title={simPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {simPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={onCycleSpeed}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition-colors"
              title="Change Speed"
            >
              {simSpeed}x
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onSkipNextPhase}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1"
            >
              <span>Next Phase</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onResetTrip}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Trip"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Trip */}
      {phase !== 'in_progress' && phase !== 'completed' && (
        <button
          id="btn-cancel-trip"
          onClick={onCancelTrip}
          className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
        >
          Cancel Ride (Free cancellation within 2 mins)
        </button>
      )}
    </div>
  );
};
