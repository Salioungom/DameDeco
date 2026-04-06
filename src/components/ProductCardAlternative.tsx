import React from 'react';
import { Avatar, Box, Typography, Chip } from '@mui/material';
import { Product } from '../types/product';
import { Inventory as Package } from '@mui/icons-material';

interface ProductCardAlternativeProps {
  product: Product;
}

export function ProductCardAlternative({ product }: ProductCardAlternativeProps) {
  return (
    <Box sx={{ position: 'relative', pt: '100%', bgcolor: 'action.hover' }}>
      {/* Utiliser Avatar comme les catégories - APPROCHE FONCTIONNELLE */}
      <Avatar
        src={product.cover_image_url || undefined}
        alt={product.name}
        variant="rounded"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: product.cover_image_url ? 'none' : `2px dashed rgba(0,0,0,0.2)`,
          '& .MuiAvatar-img': {
            objectFit: 'cover',
          },
        }}
      >
        {!product.cover_image_url && (
          <Package sx={{ fontSize: 40, color: 'text.secondary' }} />
        )}
      </Avatar>
      
      {/* Overlay avec prix */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        p: 2,
      }}>
        <Typography variant="h6" color="white" fontWeight="bold">
          {product.price.toLocaleString()} XOF
        </Typography>
      </Box>
    </Box>
  );
}
