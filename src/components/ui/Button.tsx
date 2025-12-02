import { Button as MuiButton, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { forwardRef } from 'react';

type ButtonVariant = 'text' | 'contained' | 'outlined';
type ButtonColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<React.ComponentProps<typeof MuiButton>, 'color' | 'variant' | 'size'> {
  /**
   * The variant to use.
   * @default 'contained'
   */
  variant?: ButtonVariant;
  /**
   * The color of the component.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will show a loading indicator.
   * @default false
   */
  loading?: boolean;
  /**
   * The type of button.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * The URL to link to when the button is clicked.
   * If provided, the button will be rendered as an anchor element.
   */
  href?: string;
  /**
   * The target attribute for the link.
   * Only used when `href` is provided.
   */
  target?: string;
  /**
   * The rel attribute for the link.
   * Only used when `href` is provided.
   */
  rel?: string;
  /**
   * The callback fired when the button is clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The content of the button.
   */
  children: React.ReactNode;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop: string) => prop !== 'loading',
})(({ theme, fullWidth, size = 'medium', variant = 'contained' }: any) => ({
  textTransform: 'none',
  borderRadius: 8,
  fontWeight: 600,
  ...(size === 'small' && {
    padding: theme.spacing(0.5, 2),
    fontSize: '0.875rem',
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1, 3),
    fontSize: '0.9375rem',
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.25, 4),
    fontSize: '1rem',
  }),
  ...(variant === 'contained' && {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  }),
  ...(variant === 'outlined' && {
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
    },
  }),
  ...(fullWidth && {
    width: '100%',
  }),
}));

const StyledLoadingButton = styled(LoadingButton, {
  shouldForwardProp: (prop: string) => prop !== 'loading',
})(({ theme, loading }: any) => ({
  '&.MuiLoadingButton-loading': {
    '& .MuiLoadingButton-loadingIndicator': {
      color: 'inherit',
    },
  },
}));

/**
 * Buttons allow users to take actions, and make choices, with a single tap.
 * 
 * ## Installation
 * 
 * ```
 * import { Button } from '@/components/ui/Button';
 * ```
 * 
 * ## Usage
 * 
 * ```tsx
 * <Button variant="contained" color="primary">
 *   Click me
 * </Button>
 * ```
 * 
 * ## Variants
 * 
 * - `text`: Text buttons are typically used for less-pronounced actions, including those located in dialogs and cards.
 * - `outlined`: Outlined buttons are medium-emphasis buttons. They contain actions that are important but aren't the primary action in an app.
 * - `contained`: Contained buttons are high-emphasis, distinguished by their use of elevation and fill.
 * 
 * ## Sizes
 * 
 * - `small`: Small button
 * - `medium`: Medium button (default)
 * - `large`: Large button
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  if (loading) {
    return (
      <StyledLoadingButton
        ref={ref}
        loading={loading}
        disabled={disabled || loading}
        {...props}
      >
        {children}
      </StyledLoadingButton>
    );
  }

  return (
    <StyledButton
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
