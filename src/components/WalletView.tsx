import React, { useState } from 'react';
import { CreditCard, Wallet, Plus, ShieldCheck, Gift, ArrowUpRight, Check, Zap } from 'lucide-react';

export const WalletView: React.FC = () => {
  const [balance, setBalance] = useState(850.00);
  const [autoReload, setAutoReload] = useState(true);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('SWIFTFIRST (₹50.00 Credit)');
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const handleAddFunds = (amount: number) => {
    setBalance((prev) => prev + amount);
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2000);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setAppliedPromo(`${promoInput.trim().toUpperCase()} (₹50.00 Credit)`);
    setPromoInput('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Swift Wallet & Payments</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage balances, payment methods, and promo credits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-56">
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-wide">Swift Cash</span>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="relative z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Balance</div>
            <div className="text-4xl font-black text-white mt-1">
              ₹{balance.toFixed(2)}
            </div>
            {showAddSuccess && (
              <span className="text-xs text-emerald-400 font-bold animate-pulse mt-1 inline-block">
                Funds added successfully!
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 relative z-10 pt-3 border-t border-slate-800">
            <span>Swift Rewards: 1,420 pts</span>
            <span className="text-amber-400 font-bold">Earn 3% cash back</span>
          </div>
        </div>

        {/* Quick Top-Up */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm mb-1">Add Swift Cash</h3>
            <p className="text-xs text-slate-500 mb-4">Instant deposit with your default payment card</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddFunds(amt)}
                  className="py-3 bg-slate-50 hover:bg-amber-50 hover:border-amber-400 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-800 transition-all active:scale-95"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-800">Auto-Reload ₹500</div>
              <div className="text-[11px] text-slate-400">When balance drops below ₹150</div>
            </div>
            <button
              onClick={() => setAutoReload(!autoReload)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                autoReload ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                  autoReload ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Promo Codes & Coupons */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-amber-500" />
              <h3 className="font-black text-slate-900 text-sm">Promos & Rewards</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Apply discount vouchers to your next trip</p>

            <form onSubmit={handleApplyPromo} className="flex gap-2 mb-4">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{appliedPromo}</span>
                </div>
                <button
                  onClick={() => setAppliedPromo(null)}
                  className="text-[11px] text-emerald-600 hover:text-rose-600 font-bold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Next ride qualifies for 20% promotional discount.
          </div>
        </div>
      </div>
    </div>
  );
};
