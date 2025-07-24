"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: string | Date;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  className?: string;
  // Allow any other input props to be passed through
  [key: string]: unknown;
}

export function DateInput({
  value,
  onChange,
  name,
  id,
  className,
  ...props
}: DateInputProps) {
  const [error, setError] = React.useState(false);

  // Format the initial value if provided
  const formattedValue = value
    ? typeof value === "string"
      ? value
      : format(value, "yyyy-MM-dd")
    : "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Pass the raw value to parent component
    if (onChange) {
      onChange(inputValue);
    }

    // Validate the date format
    if (inputValue) {
      const parsedDate = parse(inputValue, "yyyy-MM-dd", new Date());
      setError(!isValid(parsedDate));
    } else {
      setError(false);
    }
  };

  return (
    <div className="w-full items-start">
      <div className="flex-1">
        <Input
          type="date"
          id={id}
          name={name}
          value={formattedValue}
          onChange={handleInputChange}
          className={cn(
            "w-full",
            error && "border-red-500 focus-visible:ring-red-500",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">
            Please enter a valid date (YYYY-MM-DD)
          </p>
        )}
      </div>
    </div>
  );
}
