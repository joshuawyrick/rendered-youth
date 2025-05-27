
import React from 'react';
import { cn } from "@/lib/utils";

interface AgeFilterChipsProps {
  selectedAge?: string;
  onAgeChange: (age: string | undefined) => void;
  className?: string;
}

const ageRanges = [
  { value: '4-7', label: 'Ages 4-7' },
  { value: '8-10', label: 'Ages 8-10' },
  { value: '11-13', label: 'Ages 11-13' },
  { value: '14-17', label: 'Ages 14-17' }
];

const AgeFilterChips = ({ selectedAge, onAgeChange, className }: AgeFilterChipsProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {ageRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onAgeChange(selectedAge === range.value ? undefined : range.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border border-ry-black hover:shadow-md",
            selectedAge === range.value
              ? "bg-ry-yellow text-ry-black"
              : "bg-ry-white text-ry-black hover:bg-gray-50"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export { AgeFilterChips };
