// src/components/DatePickerWithRange.tsx

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { T } from "@/contexts/LanguageContexts"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

export function DatePickerWithRange({ className, date, setDate }: DatePickerWithRangeProps) {
  // Popover open state
  const [isOpen, setIsOpen] = React.useState(false);
  // Local state to manage selection before applying
  const [localDate, setLocalDate] = React.useState<DateRange | undefined>(date);

  React.useEffect(() => {
    // Sync local state if the parent state changes
    setLocalDate(date);
  }, [date]);

  const handleApply = () => {
    setDate(localDate); // Apply the selected date to the parent
    setIsOpen(false);   // Close the popover
  };

  const handleCancel = () => {
    setLocalDate(date); // Revert to the parent's original date
    setIsOpen(false);  // Close the popover
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full md:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span><T>Pick a date range</T></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={localDate?.from}
            selected={localDate}
            onSelect={setLocalDate} // Update local state only
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 p-2 border-t">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <T>Cancel</T>
            </Button>
            <Button size="sm" onClick={handleApply}>
              <T>Apply</T>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}