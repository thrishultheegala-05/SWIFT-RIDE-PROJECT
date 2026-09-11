import React, { useEffect, useState } from 'react';
import { DriverInfo, RideCategory } from '../types';
import { PRIMARY_DRIVER } from '../data/mockData';
import { Shield, Sparkles, Star, Car } from 'lucide-react';

interface MatchingModalProps {
  category: RideCategory;
  onMatched: (driver: DriverInfo) => void;
  onCancel: () => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  category,
  onMatched,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Progress through matching states
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2400);
    const t3 = setTimeout(() => {
      setStep(3);
      // Automatically finish matching after short celebration
      setTimeout(() => {
        onMatched(PRIMARY_DRIVER);
      }, 1000);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onMatched]);

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Background decorative gradient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Radar Animation Area */}
        <div className="relative w-36 h-36 flex items-center justify-center my-4">
          <div className="absolute w-36 h-36 rounded-full border border-amber-300 animate-radar"></div>
          <div className="absolute w-24 h-24 rounded-full border border-amber-400 animate-ping opacity-30"></div>
          <div className="w-18 h-18 rounded-full bg-slate-900 shadow-xl flex items-center justify-center relative z-10">
            {step < 3 ? (
              <Car className="w-8 h-8 text-amber-400 animate-pulse" />
            ) : (
              <img
                src={PRIMARY_DRIVER.avatarUrl}
                alt={PRIMARY_DRIVER.name}
                className="w-full h-full rounded-full object-cover border-2 border-amber-400"
              />
            )}
          </div>
        </div>

        {/* Status text */}
        {step === 0 && (
          <div>
            <h3 className="text-xl font-black text-slate-900">Connecting to {category.name}</h3>
            <p className="text-sm text-slate-500 mt-1">Locating highest rated drivers nearby...</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-xl font-black text-slate-900">Checking Vehicle Standards</h3>
            <p className="text-sm text-slate-500 mt-1">Verifying safety inspection & clean car score...</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-xl font-black text-slate-900">Connecting with {PRIMARY_DRIVER.name}</h3>
            <p className="text-sm text-slate-500 mt-1">Driver confirming dispatch near Cyber Towers...</p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Match Confirmed!
            </div>
            <h3 className="text-2xl font-black text-slate-900">{PRIMARY_DRIVER.name} is on the way!</h3>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{PRIMARY_DRIVER.rating}</span>
              <span className="text-slate-400">•</span>
              <span>{PRIMARY_DRIVER.carModel} ({PRIMARY_DRIVER.carColor})</span>
            </div>
          </div>
        )}

        {/* Step dots */}
        <div className="flex items-center gap-2 mt-6">
          <span className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 0 ? 'bg-amber-500 scale-110' : 'bg-slate-200'}`} />
          <span className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 1 ? 'bg-amber-500 scale-110' : 'bg-slate-200'}`} />
          <span className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 2 ? 'bg-amber-500 scale-110' : 'bg-slate-200'}`} />
          <span className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 3 ? 'bg-emerald-500 scale-125' : 'bg-slate-200'}`} />
        </div>

        {/* Cancel Button */}
        <button
          id="btn-cancel-matching"
          onClick={onCancel}
          className="mt-6 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors py-2 px-4 rounded-lg"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};
