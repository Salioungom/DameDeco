import * as React from "react";
import { Tooltip as MuiTooltip, Box, Zoom } from "@mui/material";

/* Simple wrapper around MUI Tooltip to preserve API compatibility */

function TooltipProvider({ children }: { children: React.ReactNode; delayDuration?: number }) {
  return <>{children}</>;
}

function Tooltip({ children, delayDuration = 0 }: { children: React.ReactNode; delayDuration?: number }) {
  // We need to separate the trigger and the content from children
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray.find((child) => React.isValidElement(child) && child.type === TooltipTrigger) as React.ReactElement<any> | undefined;
  const content = childrenArray.find((child) => React.isValidElement(child) && child.type === TooltipContent) as React.ReactElement<any> | undefined;

  if (!trigger) return null;

  const contentElement = content ? content.props.children : null;
  const contentProps = content ? content.props : {};

  return (
    <MuiTooltip
      title={
        <Box sx={{ p: 0.5, fontSize: "0.75rem", ...contentProps.sx }}>
          {contentElement}
        </Box>
      }
      enterDelay={delayDuration}
      TransitionComponent={Zoom}
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
          }
        }
      }}
    >
      {/* MuiTooltip needs a single child that can hold a ref. TooltipTrigger wraps the actual element. */}
      {/* We clone the trigger's child to pass the ref */}
      {React.isValidElement(trigger.props.children) ? trigger.props.children : <span />}
    </MuiTooltip>
  );
}

function TooltipTrigger({ children, ...props }: React.ComponentProps<"div">) {
  // This component is just a marker and wrapper.
  // In the implementation above, we extract its children.
  return <>{children}</>;
}

function TooltipContent({ children, className, sideOffset = 4, sx, ...props }: React.ComponentProps<"div"> & { sideOffset?: number; sx?: any }) {
  // This component is just a marker.
  return <>{children}</>;
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
