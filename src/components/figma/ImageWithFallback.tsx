'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box } from '@mui/material';

type ObjectFitMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src' | 'width' | 'height'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sx?: any;
  width?: number | string;
  height?: number | string;
  objectFit?: ObjectFitMode;
}

// Simple SVG placeholder component
const PlaceholderImage = ({ width, height }: { width: number; height: number }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" fill="#f3f4f6" />
    <path
      d="M30 40h40v20H30z"
      fill="#d1d5db"
      stroke="#9ca3af"
      strokeWidth="2"
    />
    <circle cx="40" cy="50" r="3" fill="#6b7280" />
    <path
      d="M50 50h15M45 55h10"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  sx,
  width = 100,
  height = 100,
  objectFit = 'cover',
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert string to number if needed for Next.js Image
  const imgWidth = typeof width === 'string' ? parseInt(width) || 100 : width;
  const imgHeight = typeof height === 'string' ? parseInt(height) || 100 : height;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If error or no src, show placeholder
  if (hasError || !src) {
    return (
      <Box sx={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: 1,
        ...sx
      }}>
        <PlaceholderImage width={imgWidth} height={imgHeight} />
      </Box>
    );
  }

  // Try Next.js Image first
  return (
    <Box sx={{ position: 'relative', width, height, ...sx }}>
      <Image
        {...props}
        src={src}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={true} // Disable optimization for external images
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
          ...(props.style as React.CSSProperties),
        }}
      />
    </Box>
  );
}
