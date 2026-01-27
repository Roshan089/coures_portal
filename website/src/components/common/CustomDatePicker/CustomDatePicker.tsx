import React from "react";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface CustomDatePickerProps {
  label: string;
  value: string | null;
  onChange: (date: string | null) => void;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDateTimePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(newValue) => {
          onChange(newValue ? newValue.toISOString() : null);
        }}
        disabled={disabled}
        slotProps={{
          textField: {
            error,
            required,
            fullWidth: true,
            disabled,
          },
        }}
      />
    </LocalizationProvider>
  );
}
