import React, { useState, useEffect } from 'react';
import { DriverInfo } from '../types';
import { PhoneOff, Mic, MicOff, Volume2, Shield } from 'lucide-react';

interface CallModalProps {
  driver: DriverInfo;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ driver, onEndCall }) => {
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  useEffect(() => {
    // Simulate connection after 2 seconds
    const timer = setTimeout(() => {
      setCallStatus('connected');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-900 text-white rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border border-slate-800 relative">
        {/* Safety banner */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full mb-6">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>SwiftRide Protected Call</span>
        </div>

        {/* Driver Photo with glowing pulse */}
        <div className="relative mb-4">
          {callStatus === 'calling' && (
            <div className="absolute -inset-3 rounded-full bg-amber-400/20 animate-ping"></div>
          )}
          <img
            src={driver.avatarUrl}
            alt={driver.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 relative z-10 shadow-xl"
          />
        </div>

        {/* Driver Name & Status */}
        <h3 className="text-2xl font-black">{driver.name}</h3>
        <p className="text-xs text-slate-400 mt-1">{driver.carModel} • {driver.carPlate}</p>

        <div className="mt-4 text-sm font-semibold">
          {callStatus === 'calling' ? (
            <span className="text-amber-400 animate-pulse">Calling driver...</span>
          ) : (
            <span className="text-emerald-400 font-mono tracking-wider">{formatTimer(seconds)}</span>
          )}
        </div>

        {/* Call Controls */}
        <div className="grid grid-cols-3 gap-4 w-full mt-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
              isMuted ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => setSpeakerOn(!speakerOn)}
            className={`p-4 rounded-2xl flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
              speakerOn ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Volume2 className="w-6 h-6" />
            <span>Speaker</span>
          </button>

          <button
            id="btn-hang-up-call"
            onClick={onEndCall}
            className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex flex-col items-center gap-1 text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            <PhoneOff className="w-6 h-6" />
            <span>End</span>
          </button>
        </div>
      </div>
    </div>
  );
};
