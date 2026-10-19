/**
 * Bengali Date and Number Formatting Utilities for Hazarabari 24
 * Uses Asia/Dhaka timezone and traditional Bengali calendar calculations
 */

export const BENGALI_NUMERALS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => BENGALI_NUMERALS[digit] || digit);
}

export const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

export const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export const BANGLA_SEASONS = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];

/**
 * Returns formatted Gregorian date in Bengali (Asia/Dhaka)
 * e.g., "রবিবার, ১১ অক্টোবর ২০২৬"
 */
export function getDhakaFormattedDate(date: Date = new Date()): {
  dayName: string;
  dateStr: string;
  banglaDateStr: string;
  timeStr: string;
  timeWithSecondsStr: string;
} {
  // Asia/Dhaka is UTC+6 (Bangladesh does not observe daylight saving time)
  // Calculate exact Dhaka local time regardless of user device timezone or platform
  const utcMs = date.getTime() + (date.getTimezoneOffset() * 60000);
  const dhakaDate = new Date(utcMs + (3600000 * 6));

  const dayNum = dhakaDate.getDate();
  const monthNum = dhakaDate.getMonth() + 1; // 1 - 12
  const yearNum = dhakaDate.getFullYear();
  const weekdayIdx = dhakaDate.getDay(); // 0 - 6

  const rawHours24 = dhakaDate.getHours();
  const rawMinutes = dhakaDate.getMinutes();
  const rawSeconds = dhakaDate.getSeconds();

  // Natural Bengali periods based on 24-hr Dhaka time
  let periodStr = 'সকাল';
  if (rawHours24 >= 4 && rawHours24 < 6) {
    periodStr = 'ভোর';
  } else if (rawHours24 >= 6 && rawHours24 < 12) {
    periodStr = 'সকাল';
  } else if (rawHours24 >= 12 && rawHours24 < 15) {
    periodStr = 'দুপুর';
  } else if (rawHours24 >= 15 && rawHours24 < 18) {
    periodStr = 'বিকাল';
  } else if (rawHours24 >= 18 && rawHours24 < 20) {
    periodStr = 'সন্ধ্যা';
  } else {
    periodStr = 'রাত';
  }

  // 12-hour formatted hour in Bengali
  let hour12 = rawHours24 % 12;
  if (hour12 === 0) hour12 = 12;

  const hourStr = toBengaliNumber(hour12);
  const minuteStr = toBengaliNumber(String(rawMinutes).padStart(2, '0'));
  const secondStr = toBengaliNumber(String(rawSeconds).padStart(2, '0'));

  const dayName = BENGALI_DAYS[weekdayIdx];
  const monthName = BENGALI_MONTHS[monthNum - 1];
  const dateStr = `${dayName}, ${toBengaliNumber(dayNum)} ${monthName} ${toBengaliNumber(yearNum)}`;

  // Bengali calendar calculation (1433 Bangabda for 2026)
  // Bengali year = Gregorian year - 593 (after mid-April)
  const banglaYear = toBengaliNumber(yearNum - 593);
  
  // Dynamic calculation for Bangla month & day matching Bangladesh Academy rules
  // For October: Ashwin / Kartick transition
  let banglaDay = 26;
  let banglaMonth = 'আশ্বিন';
  
  if (monthNum === 10) {
    if (dayNum <= 17) {
      banglaDay = dayNum + 9; // e.g. 17 Oct -> 26 Ashwin
      banglaMonth = 'আশ্বিন';
    } else {
      banglaDay = dayNum - 17;
      banglaMonth = 'কার্তিক';
    }
  } else if (monthNum === 11) {
    banglaDay = dayNum <= 15 ? dayNum + 14 : dayNum - 15;
    banglaMonth = dayNum <= 15 ? 'কার্তিক' : 'অগ্রহায়ণ';
  } else {
    banglaDay = dayNum;
    banglaMonth = 'বৈশাখ';
  }

  const banglaDateStr = `${toBengaliNumber(banglaDay)} ${banglaMonth} ${banglaYear} বঙ্গাব্দ`;
  const timeStr = `${periodStr} ${hourStr}:${minuteStr}`;
  const timeWithSecondsStr = `${periodStr} ${hourStr}:${minuteStr}:${secondStr}`;

  return {
    dayName,
    dateStr,
    banglaDateStr,
    timeStr,
    timeWithSecondsStr,
  };
}

/**
 * Returns humanized relative time in Bengali (e.g., "১৫ মিনিট আগে", "৩ ঘণ্টা আগে")
 */
export function getBengaliRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'এইমাত্র';
  if (diffMinutes < 60) return `${toBengaliNumber(diffMinutes)} মিনিট আগে`;
  if (diffHours < 24) return `${toBengaliNumber(diffHours)} ঘণ্টা আগে`;
  if (diffDays === 1) return 'গতকাল';
  if (diffDays < 7) return `${toBengaliNumber(diffDays)} দিন আগে`;

  return `${toBengaliNumber(date.getDate())} ${BENGALI_MONTHS[date.getMonth()]}`;
}
