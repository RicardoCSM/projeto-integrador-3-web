/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./input";
import { withMask } from "use-mask-input";

interface DatePickerProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  modal?: boolean;
  disabled?: boolean;
  error?: any;
}

const DatePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  modal = false,
  disabled = false,
  error = false,
}) => {
  const [stringDate, setStringDate] = React.useState<string>(
    date ? format(date, "dd/MM/yyyy") : ""
  );

  React.useEffect(() => {
    setStringDate(date ? format(date, "dd/MM/yyyy") : "");
  }, [date]);

  return (
    <Popover modal={modal}>
      <div className="relative w-full min-w-[200px]">
        <Input
          type="string"
          disabled={disabled}
          value={stringDate}
          ref={withMask("99/99/9999")}
          onChange={(e) => {
            setStringDate(e.target.value);
            const [day, month, year] = e.target.value.split("/").map(Number);
            const parsedDate = new Date(year, month - 1, day);
            if (parsedDate.toString() === "Invalid Date") {
              setDate(undefined);
            } else {
              setDate(parsedDate);
            }
          }}
        />
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"outline"}
            className={cn(
              "font-normal absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none",
              !date && "text-muted-foreground",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          >
            <CalendarIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (!selectedDate) return;
            setDate(selectedDate);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
