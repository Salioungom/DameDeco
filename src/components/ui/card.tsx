import * as React from "react";
import {
  Card as MuiCard,
  CardHeader as MuiCardHeader,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  Typography,
  Box,
} from "@mui/material";

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCard>>((props, ref) => (
  <MuiCard
    ref={ref}
    variant="outlined"
    sx={{
      borderRadius: 2,
      ...props.sx,
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardHeader>>((props, ref) => (
  <MuiCardHeader
    ref={ref}
    sx={{
      p: 3,
      ...props.sx,
    }}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.ComponentProps<typeof Typography>>((props, ref) => (
  <Typography
    ref={ref}
    variant="h5"
    component="div"
    sx={{
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.025em",
      ...props.sx,
    }}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<typeof Typography>>((props, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    sx={{
      mt: 0.5,
      ...props.sx,
    }}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardContent>>((props, ref) => (
  <MuiCardContent
    ref={ref}
    sx={{
      p: 3,
      pt: 0,
      ...props.sx,
    }}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiCardActions>>((props, ref) => (
  <MuiCardActions
    ref={ref}
    sx={{
      p: 3,
      pt: 0,
      display: "flex",
      alignItems: "center",
      ...props.sx,
    }}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// CardAction is not a standard MUI component, implementing as a Box
const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Box>>((props, ref) => (
  <Box
    ref={ref}
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      ...props.sx,
    }}
    {...props}
  />
));
CardAction.displayName = "CardAction";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
};
