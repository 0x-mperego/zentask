'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DurationPickerProps {
  value?: string; // Format: "HH:MM"
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function DurationPicker({
  value = '',
  onChange,
  className,
  disabled = false,
}: DurationPickerProps) {
  const [hours, setHours] = React.useState('');
  const [minutes, setMinutes] = React.useState('');

  React.useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(':');
      const hNum = Number.parseInt(h, 10);
      const mNum = Number.parseInt(m, 10);
      setHours(isNaN(hNum) ? '' : String(hNum));
      setMinutes(isNaN(mNum) ? '' : String(mNum));
    } else {
      setHours('');
      setMinutes('');
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setHours(val);
    updateValue(val, minutes);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (Number.parseInt(val, 10) > 59) val = '59';
    setMinutes(val);
    updateValue(hours, val);
  };

  const updateValue = (h: string, m: string) => {
    if (h || m) {
      const formattedHours = (h || '0').padStart(2, '0');
      const formattedMinutes = (m || '0').padStart(2, '0');
      onChange?.(`${formattedHours}:${formattedMinutes}`);
    } else {
      onChange?.('');
    }
  };

  const commonInputClassName =
    'w-16 text-center text-lg font-semibold tabular-nums focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex flex-col gap-1 text-center">
        <label className="text-xs" htmlFor="hours">
          Ore
        </label>
        <Input
          className={commonInputClassName}
          disabled={disabled}
          id="hours"
          maxLength={2}
          onChange={handleHoursChange}
          placeholder="0"
          type="text"
          value={hours}
        />
      </div>
      <div className="flex flex-col gap-1 text-center">
        <label className="text-xs" htmlFor="minutes">
          Minuti
        </label>
        <Input
          className={commonInputClassName}
          disabled={disabled}
          id="minutes"
          maxLength={2}
          onChange={handleMinutesChange}
          placeholder="0"
          type="text"
          value={minutes}
        />
      </div>
    </div>
  );
}
