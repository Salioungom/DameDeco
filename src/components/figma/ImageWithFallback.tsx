'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box } from '@mui/material';

interface ImageWithFallbackProps extends Omit<ImageProps, 'onError' | 'src' | 'style' | 'width' | 'height'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sx?: any; // Using any for MUI sx prop to avoid type issues
  width?: number | string;
  height?: number | string;
  timeout?: number; // Timeout en millisecondes
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
  timeout = 5000, // 5 secondes timeout par défaut
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTimeout, setHasTimeout] = useState(false);

  // Convert string to number if needed for Next.js Image
  const imgWidth = typeof width === 'string' ? parseInt(width) || 100 : width;
  const imgHeight = typeof height === 'string' ? parseInt(height) || 100 : height;

  // Timeout handling
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasTimeout(true);
        setHasError(true);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasTimeout(false);
  };

  if (hasError || hasTimeout) {
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

  return (
    <Box sx={{ position: 'relative', width, height, ...sx }}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </Box>
  );
}
