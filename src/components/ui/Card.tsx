import { Card as MuiCard, styled, useTheme } from '@mui/material';
import { forwardRef } from 'react';

export interface CardProps extends Omit<React.ComponentProps<typeof MuiCard>, 'elevation'> {
  /**
   * The variant to use.
   * @default 'elevation'
   */
  variant?: 'elevation' | 'outlined';
  /**
   * Shadow depth, corresponds to `dp` in the spec.
   * It accepts values between 0 and 24 inclusive.
   * @default 1
   */
  elevation?: number;
  /**
   * If `true`, the card will have rounded corners.
   * @default true
   */
  square?: boolean;
  /**
   * The content of the component.
   */
  children: React.ReactNode;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: any;
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component?: React.ElementType;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop: string) => prop !== 'square',
})(({ theme, variant = 'elevation', elevation = 1, square = false }: any) => ({
  borderRadius: square ? 0 : 16, // Using fixed value instead of theme.shape.borderRadius * 2
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(variant === 'elevation' && {
    boxShadow: theme.shadows[elevation > 0 ? elevation : 0],
    '&:hover': {
      ...(elevation > 0 && {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[elevation + 3],
      }),
    },
  }),
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      boxShadow: theme.shadows[2],
    },
  }),
}));

/**
 * Cards are surfaces that display content and actions on a single topic.
 * They should be easy to scan for relevant and actionable information.
 * 
 * ## Installation
 * 
 * ```
 * import { Card } from '@/components/ui/Card';
 * ```
 * 
 * ## Usage
 * 
 * ```tsx
 * <Card>
 *   <CardContent>
 *     <Typography variant="h6">Card Title</Typography>
 *     <Typography>Card content goes here</Typography>
 *   </CardContent>
 * </Card>
 * ```
 * 
 * ## Variants
 * 
 * - `elevation`: Displays a shadow around the card (default)
 * - `outlined`: Displays a border around the card
 * 
 * ## Elevation
 * 
 * The elevation can be adjusted to change the depth of the shadow.
 * The value can be between 0 and 24.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  ...props
}, ref) => {
  return (
    <StyledCard
      ref={ref}
      {...props}
    >
      {children}
    </StyledCard>
  );
});

Card.displayName = 'Card';

export default Card;
