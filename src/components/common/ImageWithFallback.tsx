import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  emoji?: string;
  gradient?: string;
  dishName?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  emoji = '🍽️',
  gradient = 'from-[#C8452C] to-[#E8A33D]',
  dishName,
  className = 'w-full h-full object-cover',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (retryCount < 1 && src) {
      // Retry once after 600ms
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setIsLoading(true);
      }, 600);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (!src || hasError) {
    // Rich, warm, intentional illustrated SVG fallback
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 text-white text-center select-none ${className}`}
        aria-label={alt || dishName || 'Plato gastronómico'}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 animate-in fade-in">
          <span className="text-3xl sm:text-4xl filter drop-shadow-md transform hover:scale-110 transition-transform">
            {emoji}
          </span>
          <span className="font-serif font-bold text-xs sm:text-sm text-white/95 line-clamp-1 max-w-[90%] px-1 text-center drop-shadow-sm">
            {dishName || alt}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-white/20 text-white/90 border border-white/30">
            Cocina de Autor
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FBF6EC]">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#E9DFCC]/50 via-[#FBF6EC] to-[#E9DFCC]/50 animate-pulse flex items-center justify-center">
          <Utensils className="w-6 h-6 text-[#7A6E65]/30 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...rest}
      />
    </div>
  );
};
