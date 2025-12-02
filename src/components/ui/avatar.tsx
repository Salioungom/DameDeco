import * as React from "react";
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Box } from "@mui/material";

const Avatar = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAvatar>>(({ className, sx, ...props }, ref) => (
  <MuiAvatar
    ref={ref}
    sx={{
      width: 40,
      height: 40,
      ...sx,
    }}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(({ className, src, alt, ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt}
    style={{ width: "100%", height: "100%", objectFit: "cover" }}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, children, style, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: "flex",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "action.hover",
      color: "text.secondary",
      fontSize: "0.875rem",
      ...style,
    }}
    {...props}
  >
    {children}
  </Box>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
