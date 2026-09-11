import React, { useState } from 'react';
import { ActiveTrip } from '../types';
import { X, ShieldAlert, PhoneCall, Share2, Check, Lock, AlertTriangle } from 'lucide-react';

interface SafetyModalProps {
  trip: ActiveTrip;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ trip, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://swiftride.live/track/${trip.id}?pin=${trip.pinCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[1150] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">SwiftRide Safety Toolkit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN Security Check */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Boarding PIN</div>
              <div className="text-xs text-slate-600">Check with {trip.driver.name} before starting</div>
            </div>
          </div>
          <div className="font-mono text-xl font-black text-slate-900 tracking-wider bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
            {trip.pinCode}
          </div>
        </div>

        {/* Share Trip Link */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-between shadow transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share Live Trip with Family / Friends</span>
            </div>
            {copied ? (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied link
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">Copy link</span>
            )}
          </button>
        </div>

        {/* Emergency SOS Section */}
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-extrabold text-rose-900">Emergency Assistance</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                If you are in immediate danger, dial 911 or alert emergency responders immediately.
              </p>
            </div>
          </div>

          {sosTriggered ? (
            <div className="p-3 bg-rose-600 text-white rounded-xl text-center font-bold text-xs animate-pulse">
              Dispatching Swift Emergency Protocol & Transmitting Live GPS...
            </div>
          ) : (
            <button
              onClick={() => setSosTriggered(true)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 & Swift Response</span>
            </button>
          )}
        </div>

        <div className="text-center text-xs text-slate-400 font-medium">
          24/7 Swift Safety Center: 1-800-SWIFT-SAFE
        </div>
      </div>
    </div>
  );
};
