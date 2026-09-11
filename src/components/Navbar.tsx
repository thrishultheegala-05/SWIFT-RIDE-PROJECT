import React from 'react';
import { SwiftRideLogo } from './SwiftRideLogo';
import { NavigationTab } from '../types';
import { 
  Car, 
  Compass, 
  Clock, 
  Wallet, 
  Smartphone, 
  Maximize2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  hasActiveTrip: boolean;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenSafety?: () => void;
  scheduledCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  hasActiveTrip,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenSafety,
  scheduledCount = 0,
}) => {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-[500] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo matching Image 1 & 2 */}
        <div className="flex items-center gap-6">
          <div 
            onClick={() => onSelectTab('ride')}
            className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-98"
          >
            <SwiftRideLogo size="md" />
          </div>

          {/* Navigation links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="tab-book-ride"
              onClick={() => onSelectTab('ride')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currentTab === 'ride'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Book Ride</span>
              {hasActiveTrip && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>

            <button
              id="tab-driver-console"
              onClick={() => onSelectTab('driver')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currentTab === 'driver'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Driver Console</span>
            </button>

            <button
              id="tab-activity-history"
              onClick={() => onSelectTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currentTab === 'activity'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Activity</span>
              {scheduledCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-extrabold">
                  {scheduledCount}
                </span>
              )}
            </button>

            <button
              id="tab-swift-wallet"
              onClick={() => onSelectTab('wallet')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                currentTab === 'wallet'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Wallet</span>
            </button>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Mobile phone frame toggle */}
          <button
            id="btn-toggle-device-frame"
            onClick={onToggleMobileFrame}
            className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isMobileFrame
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Smartphone App View vs Expanded View"
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span>{isMobileFrame ? 'Expand View' : 'Phone View'}</span>
          </button>

          {/* Safety Shield Button */}
          {onOpenSafety && (
            <button
              id="btn-nav-safety"
              onClick={onOpenSafety}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="SwiftRide Safety Shield"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Safety</span>
            </button>
          )}

          {/* Rider Avatar profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xs border border-slate-800 shadow-sm">
              JD
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar for phone screen sizes */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-2 bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-[500] shadow-lg">
        <button
          onClick={() => onSelectTab('ride')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-black ${
            currentTab === 'ride' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Ride</span>
        </button>

        <button
          onClick={() => onSelectTab('driver')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-black ${
            currentTab === 'driver' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <Car className="w-5 h-5" />
          <span>Driver</span>
        </button>

        <button
          onClick={() => onSelectTab('activity')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-black relative ${
            currentTab === 'activity' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <div className="relative">
            <Clock className="w-5 h-5" />
            {scheduledCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {scheduledCount}
              </span>
            )}
          </div>
          <span>Activity</span>
        </button>

        <button
          onClick={() => onSelectTab('wallet')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-black ${
            currentTab === 'wallet' ? 'text-amber-600' : 'text-slate-500'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Wallet</span>
        </button>
      </div>
    </header>
  );
};
