import * as React from "react";
import {
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const Accordion = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAccordion>>((props, ref) => (
  <MuiAccordion
    ref={ref}
    disableGutters
    elevation={0}
    square
    sx={{
      borderBottom: 1,
      borderColor: "divider",
      "&:before": {
        display: "none",
      },
      "&:last-child": {
        borderBottom: 0,
      },
      ...props.sx,
    }}
    {...props}
  />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div ref={ref} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAccordionSummary>>(({ children, sx, ...props }, ref) => (
  <MuiAccordionSummary
    ref={ref}
    expandIcon={<ExpandMore sx={{ fontSize: "1rem", color: "text.secondary" }} />}
    sx={{
      flexDirection: "row-reverse",
      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
      },
      "& .MuiAccordionSummary-content": {
        marginLeft: 1,
      },
      ...sx,
    }}
    {...props}
  >
    <Typography variant="subtitle2" component="span" sx={{ fontWeight: 500 }}>
      {children}
    </Typography>
  </MuiAccordionSummary>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAccordionDetails>>(({ children, sx, ...props }, ref) => (
  <MuiAccordionDetails
    ref={ref}
    sx={{
      padding: 2,
      paddingTop: 0,
      ...sx,
    }}
    {...props}
  >
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  </MuiAccordionDetails>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
