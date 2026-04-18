import React from "react";
import { Platform } from "react-native";
import NativeDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DateTimePickerProps {
  value: Date;
  mode?: "date" | "time";
  display?: "default" | "spinner" | "calendar" | "clock";
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DateTimePicker(props: DateTimePickerProps) {
  if (Platform.OS === "web") {
    // Basic web implementation using HTML5 inputs
    const type = props.mode === "time" ? "time" : "date";
    
    // Format the value correctly for the input
    const pad = (num: number) => String(num).padStart(2, "0");
    
    let inputValue = "";
    if (type === "date") {
      const d = props.value;
      inputValue = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    } else {
      const d = props.value;
      inputValue = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!val) return;
      
      const newDate = new Date(props.value);
      if (type === "date") {
        const [y, m, d] = val.split("-").map(Number);
        newDate.setFullYear(y, m - 1, d);
      } else {
        const [h, m] = val.split(":").map(Number);
        newDate.setHours(h, m);
      }
      
      // Simulate native event
      props.onChange({ type: "set", nativeEvent: {} } as any, newDate);
    };

    return (
      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        style={{
          backgroundColor: "#1A1A2E",
          color: "#FFFFFF",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: "16px",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "8px",
        }}
        max={props.maximumDate ? props.maximumDate.toISOString().split('T')[0] : undefined}
        min={props.minimumDate ? props.minimumDate.toISOString().split('T')[0] : undefined}
      />
    );
  }

  // Native implementation
  return <NativeDateTimePicker {...props} />;
}
