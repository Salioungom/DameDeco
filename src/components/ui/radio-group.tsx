import * as React from "react";
import { RadioGroup as MuiRadioGroup, Radio, Box } from "@mui/material";
import { Circle as CircleIcon } from "@mui/icons-material";

function RadioGroup({ className, sx, ...props }: React.ComponentProps<typeof MuiRadioGroup> & { sx?: any }) {
  return (
    <MuiRadioGroup
      sx={{
        display: "grid",
        gap: 1.5, // gap-3 is 12px, 1.5 * 8 = 12px
        ...sx,
      }}
      {...props}
    />
  );
}

function RadioGroupItem({ className, sx, ...props }: React.ComponentProps<typeof Radio> & { sx?: any }) {
  return (
    <Radio
      icon={
        <Box
          sx={{
            height: 20,
            width: 20,
            borderRadius: "50%",
            border: 1,
            borderColor: "divider",
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            height: 20,
            width: 20,
            borderRadius: "50%",
            border: 1,
            borderColor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircleIcon sx={{ fontSize: 12.5, color: "primary.main" }} />
        </Box>
      }
      sx={{
        p: 0,
        width: 20,
        height: 20,
        "&:hover": {
          bgcolor: "transparent",
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem };
