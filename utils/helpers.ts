/**
 * VIRTUWEAR AI — Utility Helpers
 * Pure utility functions used across the application
 */

import Colors from '@/constants/Colors';

// ─── Price Formatting ──────────────────────────────────────

/**
 * Format a numeric amount as a currency string.
 * Defaults to ₹ (INR). Handles decimals for non-INR currencies.
 *
 * @example formatPrice(1299)       → "₹1,299"
 * @example formatPrice(49.99, '$') → "$49.99"
 */
export function formatPrice(amount: number, currency: string = '₹'): string {
  if (currency === '₹') {
    // Indian numbering: 1,23,456
    const intPart = Math.floor(amount);
    const str = intPart.toString();
    let formatted: string;

    if (str.length > 3) {
      const last3 = str.slice(-3);
      const rest = str.slice(0, -3);
      // Insert commas every 2 digits in the remaining part
      formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    } else {
      formatted = str;
    }

    return `₹${formatted}`;
  }

  // Non-INR: standard formatting with 2 decimal places
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${formatted}`;
}

// ─── Date Formatting ───────────────────────────────────────

/**
 * Return a human-readable relative time string.
 *
 * @example formatDate(twoHoursAgo) → "2h ago"
 * @example formatDate(yesterday)   → "Yesterday"
 */
export function formatDate(date: string | Date): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;

  return then.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── String Utilities ──────────────────────────────────────

/**
 * Extract initials from a full name (up to 2 characters).
 *
 * @example getInitials("Aarav Mehta") → "AM"
 * @example getInitials("Priya")       → "P"
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '?';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Truncate text to a maximum length, appending "…" if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

// ─── Category → Icon ──────────────────────────────────────

/**
 * Map a wardrobe category string to an Ionicons icon name.
 */
export function getCategoryIcon(
  category: string,
): React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'] {
  const map: Record<string, string> = {
    tops: 'shirt-outline',
    bottoms: 'walk-outline',
    dresses: 'body-outline',
    jackets: 'cloud-outline',
    footwear: 'footsteps-outline',
    accessories: 'watch-outline',
  };

  return (map[category.toLowerCase()] ?? 'cube-outline') as any;
}

// ─── Status → Color ───────────────────────────────────────

/**
 * Return a theme color for a given job status.
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    queued: Colors.textMuted,
    validating: Colors.warning,
    processing: Colors.lavender,
    completed: Colors.success,
    failed: Colors.danger,
    active: Colors.success,
    past_due: Colors.warning,
    cancelled: Colors.danger,
    trialing: Colors.info,
    expired: Colors.textMuted,
  };

  return map[status.toLowerCase()] ?? Colors.textSecondary;
}

// ─── ID Generation ─────────────────────────────────────────

/**
 * Generate a simple pseudo-unique ID (not cryptographically secure).
 * Format: `prefix_timestamp_random`
 */
export function generateId(prefix: string = 'vw'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ─── Async Helpers ─────────────────────────────────────────

/**
 * Promise-based delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Math Helpers ──────────────────────────────────────────

/**
 * Clamp a value between a minimum and maximum.
 */
export function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

// ─── Misc ──────────────────────────────────────────────────

/**
 * Return a greeting string based on the current hour.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Pluralise a word based on count.
 *
 * @example pluralize(3, 'item') → "3 items"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Convert a hex colour to rgba.
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
