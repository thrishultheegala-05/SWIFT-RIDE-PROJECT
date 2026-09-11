import React from 'react';

interface SwiftRideLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
}

export const SwiftRideLogo: React.FC<SwiftRideLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
  dark = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* App Icon Mark - strictly matching Image 1 & 2 */}
      <div className={`relative shrink-0 rounded-2xl overflow-hidden shadow-sm bg-slate-900 flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 80 80"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Yellow slanted banner */}
          <path
            d="M22 52.5 L46 21 H57 L33 52.5 Z"
            fill="#F5B301"
          />
          {/* White overlapping slanted card */}
          <path
            d="M44 29.5 L60.5 29.5 L48 52.5 L37 52.5 Z"
            fill="#FFFFFF"
          />
          {/* Green accent dot anchored at lower-left */}
          <circle cx="27" cy="52.5" r="5" fill="#10B981" />
        </svg>
      </div>

      {showWordmark && (
        <div className={`font-black tracking-tight flex items-center ${textSizes[size]}`}>
          <span className={dark ? 'text-white' : 'text-slate-900'}>Swift</span>
          <span className="text-amber-500">Ride</span>
        </div>
      )}
    </div>
  );
};
