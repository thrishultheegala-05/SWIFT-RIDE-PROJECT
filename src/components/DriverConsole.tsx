import React, { useState, useEffect } from 'react';
import { PRIMARY_DRIVER } from '../data/mockData';
import { 
  Power, 
  DollarSign, 
  Navigation, 
  Clock, 
  Star, 
  CheckCircle, 
  X, 
  Phone, 
  MessageSquare, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  Fuel,
  Volume2
} from 'lucide-react';

export const DriverConsole: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(2450.00);
  const [completedTrips, setCompletedTrips] = useState(8);
  const [hasIncomingRequest, setHasIncomingRequest] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const [activeDriverJob, setActiveDriverJob] = useState<null | {
    passengerName: string;
    pickup: string;
    destination: string;
    fare: number;
    distance: string;
    pin: string;
  }>(null);

  // Periodic simulated incoming ride request for Rajan
  useEffect(() => {
    if (!isOnline || activeDriverJob) return;

    const timer = setTimeout(() => {
      setHasIncomingRequest(true);
      setTimerSeconds(15);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOnline, activeDriverJob]);

  // Request countdown timer
  useEffect(() => {
    if (!hasIncomingRequest) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setHasIncomingRequest(false);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasIncomingRequest]);

  const handleAcceptJob = () => {
    setHasIncomingRequest(false);
    setActiveDriverJob({
      passengerName: 'Ananya S.',
      pickup: 'Cyber Towers, HITEC City',
      destination: 'Inorbit Mall & Durgam Cheruvu',
      fare: 285.00,
      distance: '1.2 km away (4 mins)',
      pin: '4821',
    });
  };

  const handleCompleteJob = () => {
    if (activeDriverJob) {
      setEarnings((prev) => prev + activeDriverJob.fare);
      setCompletedTrips((prev) => prev + 1);
      setActiveDriverJob(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Driver Cockpit Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={PRIMARY_DRIVER.avatarUrl}
                alt={PRIMARY_DRIVER.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <span className={`w-4 h-4 rounded-full absolute -bottom-1 -right-1 border-2 border-slate-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-500'
              }`}></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black">{PRIMARY_DRIVER.name}</h2>
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
                  GOLD ELITE
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {PRIMARY_DRIVER.carModel} • {PRIMARY_DRIVER.carColor} • Plate: {PRIMARY_DRIVER.carPlate}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold mt-2">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {PRIMARY_DRIVER.rating}
                </span>
                <span>•</span>
                <span>{PRIMARY_DRIVER.totalTrips + completedTrips} Total Trips</span>
                <span>•</span>
                <span className="text-emerald-400">99% Acceptance</span>
              </div>
            </div>
          </div>

          {/* Online Toggle Button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2.5 transition-all shadow-lg active:scale-95 ${
              isOnline
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Power className="w-5 h-5" />
            <span>{isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}</span>
          </button>
        </div>

        {/* Daily Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 uppercase font-bold">Today's Payout</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">₹{earnings.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 uppercase font-bold">Trips Done</div>
            <div className="text-xl font-black text-white mt-0.5">{completedTrips}</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 uppercase font-bold">Time Online</div>
            <div className="text-xl font-black text-white mt-0.5">5h 12m</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="text-[11px] text-slate-400 uppercase font-bold">Battery / Fuel</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-center gap-1">
              <Fuel className="w-4 h-4" /> 86%
            </div>
          </div>
        </div>
      </div>

      {/* Incoming Job Dispatch Popup Alert */}
      {hasIncomingRequest && (
        <div className="bg-amber-500 text-slate-950 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-amber-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-950 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider">New Ride Request Available!</span>
            </div>
            <div className="font-mono text-lg font-black bg-slate-950 text-amber-400 px-3 py-1 rounded-xl">
              {timerSeconds}s
            </div>
          </div>

          <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-black">₹285.00</div>
              <div className="text-xs font-bold text-slate-900/80 mt-0.5">Includes ₹40.00 surge bonus • Swift Comfort</div>
            </div>

            <div className="bg-slate-950/10 p-3 rounded-2xl text-xs font-bold space-y-1">
              <div>📍 Pickup: Cyber Towers (1.2 km away)</div>
              <div>🏁 Drop-off: Inorbit Mall & Durgam Cheruvu</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAcceptJob}
              className="flex-1 py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-2xl text-base shadow-xl transition-all active:scale-95"
            >
              ACCEPT RIDE REQUEST
            </button>
            <button
              onClick={() => setHasIncomingRequest(false)}
              className="px-6 py-4 bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 font-bold rounded-2xl text-sm transition-all"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Active Driver Navigation HUD */}
      {activeDriverJob ? (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col gap-5">
          {/* Turn-by-Turn GPS Banner */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Navigation className="w-6 h-6 transform rotate-45" />
              </div>
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase">GPS Navigation</div>
                <div className="text-base font-black">In 350m, turn towards Mindspace & Cable Bridge</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-amber-400">4 min</div>
              <div className="text-[11px] text-slate-400">1.2 km</div>
            </div>
          </div>

          {/* Passenger & Job Info */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Passenger</div>
              <div className="text-lg font-black text-slate-900">{activeDriverJob.passengerName}</div>
              <div className="text-xs text-slate-600 mt-0.5">Pickup: {activeDriverJob.pickup}</div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">Boarding PIN:</span>
              <span className="font-mono text-base font-black text-slate-900">{activeDriverJob.pin}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCompleteJob}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-base shadow-lg transition-all active:scale-95"
            >
              Complete Trip & Collect ₹{activeDriverJob.fare.toFixed(2)}
            </button>
            <button
              onClick={() => setActiveDriverJob(null)}
              className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Navigation className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {isOnline ? 'Scanning for Trip Requests...' : 'You are currently offline'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {isOnline
              ? 'Stay parked in high-demand zones around HITEC City & Gachibowli to receive instant dispatches.'
              : 'Toggle online above when ready to start accepting passenger rides.'}
          </p>
        </div>
      )}
    </div>
  );
};
