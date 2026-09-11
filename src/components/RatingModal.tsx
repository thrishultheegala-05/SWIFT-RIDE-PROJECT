import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ActiveTrip } from '../types';
import { Star, Heart, Check, Sparkles, DollarSign, Award } from 'lucide-react';

interface RatingModalProps {
  trip: ActiveTrip;
  onSubmit: (ratingData: { rating: number; compliments: string[]; tip: number }) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ trip, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>([
    'Smooth driving',
    'Clean car',
  ]);
  const [selectedTip, setSelectedTip] = useState<number>(30);
  const [customTip, setCustomTip] = useState<string>('');

  useEffect(() => {
    // Trigger celebratory confetti on trip completion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#111827', '#FBBF24'],
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  const complimentOptions = [
    'Smooth driving',
    'Clean car',
    'Great conversation',
    'Awesome playlist',
    'Expert navigation',
    'Polite & helpful',
  ];

  const tipOptions = [0, 20, 50, 100];

  const toggleCompliment = (comp: string) => {
    if (selectedCompliments.includes(comp)) {
      setSelectedCompliments(selectedCompliments.filter((c) => c !== comp));
    } else {
      setSelectedCompliments([...selectedCompliments, comp]);
    }
  };

  const finalTip = customTip ? parseFloat(customTip) || 0 : selectedTip;
  const totalCharged = (trip.fare + finalTip).toFixed(2);

  const handleSubmit = () => {
    onSubmit({
      rating,
      compliments: selectedCompliments,
      tip: finalTip,
    });
  };

  return (
    <div className="fixed inset-0 z-[1250] bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center text-center my-8 animate-in zoom-in-95 duration-200">
        {/* Celebration Header */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
          <Sparkles className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-slate-900">You've Arrived!</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Hope you enjoyed your ride with {trip.driver.name}
        </p>

        {/* Driver Snapshot */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 w-full mt-4 text-left">
          <img
            src={trip.driver.avatarUrl}
            alt={trip.driver.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-sm text-slate-900">{trip.driver.name}</div>
            <div className="text-xs text-slate-500">{trip.driver.carModel} • {trip.driver.carPlate}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Fare</div>
            <div className="font-black text-base text-slate-900">₹{trip.fare.toFixed(2)}</div>
          </div>
        </div>

        {/* 5-Star Rating Selector */}
        <div className="my-5 flex flex-col items-center gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rate your experience
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1.5 focus:outline-none transform transition-transform hover:scale-125"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            {rating === 5 ? 'Exceptional 5-Star Ride!' : rating === 4 ? 'Good Ride' : 'Could be better'}
          </div>
        </div>

        {/* Compliment Badges */}
        <div className="w-full text-left mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Give {trip.driver.name} a compliment
          </div>
          <div className="flex flex-wrap gap-2">
            {complimentOptions.map((comp) => {
              const isSelected = selectedCompliments.includes(comp);
              return (
                <button
                  key={comp}
                  onClick={() => toggleCompliment(comp)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Driver Tip */}
        <div className="w-full text-left mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Add a tip for {trip.driver.name} (100% goes to driver)
          </div>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {tipOptions.map((tip) => (
              <button
                key={tip}
                onClick={() => {
                  setSelectedTip(tip);
                  setCustomTip('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTip === tip && !customTip
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tip === 0 ? 'No tip' : `₹${tip}`}
              </button>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="w-full p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-5 text-sm">
          <span className="text-slate-600 font-medium">Final Payment ({trip.paymentMethod.split(' ')[0]})</span>
          <span className="text-lg font-black text-slate-900">₹{totalCharged}</span>
        </div>

        {/* Submit Button */}
        <button
          id="btn-submit-trip-rating"
          onClick={handleSubmit}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg transition-all text-base"
        >
          Submit & Done
        </button>
      </div>
    </div>
  );
};
