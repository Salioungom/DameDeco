"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Custom styled day button to match the original design
const StyledDay = styled(PickersDay)(({ theme }: any) => ({
  borderRadius: theme.shape.borderRadius,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  "&.MuiPickersDay-today": {
    borderColor: theme.palette.primary.main,
  },
}));

// Custom Day component
function CustomDay(props: React.ComponentProps<typeof PickersDay>) {
  return <StyledDay {...props} />;
}

export interface CalendarProps {
  className?: string;
  value?: Date;
  onChange?: (date: Date | null) => void;
  showOutsideDays?: boolean;
  mode?: "single" | "range";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  defaultMonth?: Date;
}

function Calendar({
  className,
  value,
  onChange,
  selected,
  onSelect,
  disabled,
  defaultMonth,
  ...props
}: CalendarProps) {
  const handleChange = (newValue: Date | null) => {
    if (onChange) {
      onChange(newValue);
    }
    if (onSelect) {
      onSelect(newValue || undefined);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className={className} sx={{ p: 1.5 }}>
        <DateCalendar
          value={value || selected || null}
          onChange={handleChange}
          shouldDisableDate={disabled}
          referenceDate={defaultMonth}
          slots={{
            day: CustomDay,
          }}
          sx={{
            "& .MuiPickersCalendarHeader-root": {
              paddingTop: 0.5,
            },
            "& .MuiDayCalendar-header": {
              justifyContent: "space-between",
            },
            "& .MuiPickersDay-root": {
              fontSize: "0.875rem",
            },
          }}
          {...props}
        />
      </Box>
    </LocalizationProvider>
  );
}

export { Calendar };
