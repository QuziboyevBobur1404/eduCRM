import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// formatCurrency alias — formatPrice bilan bir xil
export const formatCurrency = formatPrice;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 UZS';
  return new Intl.NumberFormat('uz-UZ').format(num) + ' UZS';
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleDateString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  return new Date(date).toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export const MONTHS_UZ = [
  '', 'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
];

export const DAYS_UZ = [
  'Yakshanba', 'Dushanba', 'Seshanba',
  'Chorshanba', 'Payshanba', 'Juma', 'Shanba',
];
