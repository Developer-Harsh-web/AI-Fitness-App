import { format, parseISO } from 'date-fns';

// Format a date into a readable string
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

// Format a time into a readable string
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
}

// Format a date and time together
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

// Format weight based on measurement system
export function formatWeight(weight: number, system: 'metric' | 'imperial' = 'metric'): string {
  if (system === 'metric') {
    return `${weight.toFixed(1)} kg`;
  } else {
    // Convert kg to lb (1 kg = 2.20462 lb)
    const lb = weight * 2.20462;
    return `${lb.toFixed(1)} lb`;
  }
}

// Format height based on measurement system
export function formatHeight(height: number, system: 'metric' | 'imperial' = 'metric'): string {
  if (system === 'metric') {
    return `${height} cm`;
  } else {
    // Convert cm to feet and inches
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  }
}

// Format duration in minutes to hours and minutes
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

// Format a number with thousand separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Format calories
export function formatCalories(calories: number): string {
  return `${formatNumber(calories)} kcal`;
} 