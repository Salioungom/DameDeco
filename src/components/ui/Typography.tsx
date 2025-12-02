import { Typography as MuiTypography, styled } from '@mui/material';
import { ElementType, forwardRef } from 'react';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'button'
  | 'overline'
  | 'inherit';

type TypographyAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';
type TypographyColor =
  | 'initial'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'textPrimary'
  | 'textSecondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'info';

type TypographyDisplay = 'initial' | 'block' | 'inline';
type TypographyGutterBottom = boolean;
type TypographyNoWrap = boolean;
type TypographyParagraph = boolean;

export interface TypographyProps extends Omit<React.ComponentProps<typeof MuiTypography>, 'variant' | 'color' | 'align' | 'display'> {
  /**
   * The variant of the typography.
   * @default 'body1'
   */
  variant?: TypographyVariant;
  /**
   * The color of the component.
   * @default 'textPrimary'
   */
  color?: TypographyColor;
  /**
   * Set the text-align on the component.
   * @default 'inherit'
   */
  align?: TypographyAlign;
  /**
   * Controls the display type
   * @default 'initial'
   */
  display?: TypographyDisplay;
  /**
   * If `true`, the text will have a bottom margin.
   * @default false
   */
  gutterBottom?: TypographyGutterBottom;
  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   * @default false
   */
  noWrap?: TypographyNoWrap;
  /**
   * If `true`, the text will have a bottom margin.
   * @default false
   */
  paragraph?: TypographyParagraph;
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   */
  component?: ElementType;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: any;
}

const StyledTypography = styled(MuiTypography, {
  shouldForwardProp: (prop: string) =>
    prop !== 'gutterBottom' &&
    prop !== 'noWrap' &&
    prop !== 'paragraph'
})(({ theme, variant = 'body1', gutterBottom = false, noWrap = false, paragraph = false }: any) => {
  const styles: Record<string, any> = {};

  // Apply gutter bottom if needed
  if (gutterBottom || paragraph) {
    styles.marginBottom = theme.spacing(2);
  }

  // Apply noWrap if needed
  if (noWrap) {
    styles.overflow = 'hidden';
    styles.textOverflow = 'ellipsis';
    styles.whiteSpace = 'nowrap';
  }

  // Custom styles for specific variants
  if (variant.startsWith('h')) {
    styles.fontWeight = 600;
    styles.lineHeight = 1.2;
    styles.letterSpacing = '-0.01562em';
  }

  return styles;
});

/**
 * Use typography to present your design and content as clearly and efficiently as possible.
 * 
 * ## Installation
 * 
 * ```
 * import { Typography } from '@/components/ui/Typography';
 * ```
 * 
 * ## Usage
 * 
 * ```tsx
 * <Typography variant="h1">Heading 1</Typography>
 * <Typography variant="body1">Body text</Typography>
 * ```
 * 
 * ## Variants
 * 
 * - `h1` - Heading 1
 * - `h2` - Heading 2
 * - `h3` - Heading 3
 * - `h4` - Heading 4
 * - `h5` - Heading 5
 * - `h6` - Heading 6
 * - `subtitle1` - Subtitle 1
 * - `subtitle2` - Subtitle 2
 * - `body1` - Body 1 (default)
 * - `body2` - Body 2
 * - `caption` - Caption text
 * - `button` - Button text
 * - `overline` - Overline text
 */
const Typography = forwardRef<HTMLElement, TypographyProps>(({
  variant = 'body1',
  color = 'textPrimary',
  align = 'inherit',
  display = 'initial',
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
  component,
  children,
  ...props
}, ref) => {
  // Determine the component to use based on variant and paragraph prop
  let Component: React.ElementType = component || 'span';

  if (!component) {
    if (paragraph) {
      Component = 'p';
    } else if (variant === 'button') {
      Component = 'span';
    } else if (variant && typeof variant === 'string') {
      if (variant === 'inherit') {
        Component = 'p';
      } else if (variant.startsWith('h') && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)) {
        Component = variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      }
    }
  }

  return (
    <StyledTypography
      ref={ref}
      variant={variant}
      color={color}
      align={align}
      display={display}
      gutterBottom={gutterBottom}
      noWrap={noWrap}
      paragraph={paragraph}
      component={Component}
      {...props}
    >
      {children}
    </StyledTypography>
  );
});

Typography.displayName = 'Typography';

export default Typography;
