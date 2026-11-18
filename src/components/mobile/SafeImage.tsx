import React, { useState } from 'react';
import { User } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EEF0F7] text-[#747B91] ${className}`}
        role="img"
        aria-label={alt}
      >
        <User className="w-7 h-7 text-[#6C63FF]/60" />
        {fallbackLabel && (
          <span className="mt-1 text-xs font-medium text-[#747B91] truncate max-w-[90%]">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
