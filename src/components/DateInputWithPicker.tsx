import React from 'react';
import { Calendar } from 'lucide-react';

interface DateInputWithPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const DateInputWithPicker: React.FC<DateInputWithPickerProps> = ({
  value,
  onChange,
  placeholder = "DD-MM-YYYY or manual text",
  required = false,
  className = ""
}) => {
  // Convert current value (e.g. "15-08-2026" or "2026-08-15") to "YYYY-MM-DD" for native picker
  const getIsoDateString = (val: string): string => {
    if (!val) return '';
    const trimmed = val.trim();
    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    // DD-MM-YYYY or DD/MM/YYYY
    const parts = trimmed.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length <= 2 && parts[2].length === 4) {
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2];
        return `${y}-${m}-${d}`;
      }
    }
    return '';
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value; // YYYY-MM-DD
    if (rawVal) {
      const [y, m, d] = rawVal.split('-');
      onChange(`${d}-${m}-${y}`);
    }
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {/* Manual Text Input */}
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-300 dark:border-slate-700 bg-white/5 dark:bg-slate-900/50 rounded-lg p-2.5 pr-10 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium text-xs sm:text-sm"
      />

      {/* Calendar Icon + Native Date Input Overlay Container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors pointer-events-auto overflow-hidden">
        <Calendar className="w-4 h-4 pointer-events-none" />
        
        {/* Invisible Native Date Picker positioned directly over icon */}
        <input
          type="date"
          value={getIsoDateString(value)}
          onChange={handlePickerChange}
          title="Click to select from calendar"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};
