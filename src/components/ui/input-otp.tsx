"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Remove as MinusIcon } from "@mui/icons-material";

// Context to manage OTP state
type OTPContextValue = {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
};

const OTPContext = React.createContext<OTPContextValue | null>(null);

function InputOTP({
  className,
  containerClassName,
  maxLength = 6,
  value: externalValue,
  onChange: externalOnChange,
  disabled,
  children,
  sx,
  ...props
}: {
  className?: string;
  containerClassName?: string;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  sx?: any;
}) {
  const [internalValue, setInternalValue] = React.useState("");
  const value = externalValue ?? internalValue;
  const onChange = externalOnChange ?? setInternalValue;

  return (
    <OTPContext.Provider value={{ value, onChange, maxLength }}>
      <Box
        data-slot="input-otp"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto",
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </OTPContext.Provider>
  );
}

function InputOTPGroup({ className, sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      data-slot="input-otp-group"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        ...sx,
      }}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  sx,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
  sx?: any;
}) {
  const context = React.useContext(OTPContext);
  const inputRef = React.useRef<HTMLInputElement>(null);

  if (!context) {
    throw new Error("InputOTPSlot must be used within InputOTP");
  }

  const { value, onChange, maxLength } = context;
  const char = value[index] || "";
  const isActive = value.length === index;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChar = e.target.value.slice(-1); // Get only the last character
    if (/^[0-9]?$/.test(newChar)) {
      const newValue = value.split("");
      newValue[index] = newChar;
      onChange(newValue.join("").slice(0, maxLength));

      // Auto-focus next input
      if (newChar && index < maxLength - 1) {
        const nextInput = inputRef.current?.parentElement?.nextElementSibling
          ?.querySelector("input");
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !char && index > 0) {
      // Focus previous input on backspace if current is empty
      const prevInput = inputRef.current?.parentElement?.previousElementSibling
        ?.querySelector("input");
      prevInput?.focus();
    }
  };

  return (
    <Box
      data-slot="input-otp-slot"
      data-active={isActive}
      sx={{
        position: "relative",
        display: "flex",
        height: 36,
        width: 36,
        alignItems: "center",
        justifyContent: "center",
        border: 1,
        borderColor: "divider", // Default border
        borderRadius: 1,
        fontSize: "0.875rem",
        bgcolor: "background.paper",
        transition: "all 0.2s",
        outline: "none",
        ...(isActive && {
          borderColor: "primary.main",
          boxShadow: (theme: any) => `0 0 0 3px ${theme.palette.primary.main}20`, // Ring effect
          zIndex: 10,
        }),
        ...sx,
      }}
      {...props}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={char}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 w-full h-full bg-transparent text-center outline-none border-none"
        style={{ caretColor: "transparent", opacity: 0, cursor: "default" }} // Hide native cursor/input
      />
      <Typography variant="body2" component="span">
        {char}
      </Typography>
      {isActive && (
        <Box
          sx={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              height: 16,
              width: "1px",
              bgcolor: "text.primary",
              animation: "blink 1s infinite",
              "@keyframes blink": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0 },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

function InputOTPSeparator({ sx, ...props }: React.ComponentProps<"div"> & { sx?: any }) {
  return (
    <Box
      data-slot="input-otp-separator"
      role="separator"
      sx={{ ...sx }}
      {...props}
    >
      <MinusIcon />
    </Box>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
