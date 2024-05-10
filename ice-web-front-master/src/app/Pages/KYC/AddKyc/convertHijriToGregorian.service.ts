import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateConversionService {
  convertHijriToGregorian(hijriDate: string): string {
    const [day, month, year] = hijriDate.split('-').map(Number);

    // Constants for Umm al-Qura calendar
    const hijriEpoch = 1948440.5; // Julian Day of Hijri epoch (16th July 622 CE)
    const gregorianEpoch = 2451545.0; // Julian Day of Gregorian epoch (1st January 4713 BCE)
    const averageYearLength = 365.2425; // Average length of the Gregorian year (days)

    // Calculate Julian Day of the given Hijri date
    const hijriYearDays = 354.367 * (year - 1); // Days from complete Hijri years
    const hijriMonthDays = Math.ceil(29.5 * (month - 1)); // Days from complete Hijri months
    const julianDay = hijriEpoch + hijriYearDays + hijriMonthDays + day;

    // Convert Julian Day to Gregorian date
    const daysSinceEpoch = julianDay - gregorianEpoch;
    const gregorianYear = Math.floor((daysSinceEpoch / averageYearLength) + 0.5);
    const gregorianDayOfYear = Math.floor(daysSinceEpoch - Math.floor(averageYearLength * (gregorianYear - 1)) + 0.5);
    const isLeapYear = ((gregorianYear % 4 == 0) && (gregorianYear % 100 != 0)) || (gregorianYear % 400 == 0);
    let monthIndex = 0;
    let daysLeft = gregorianDayOfYear;

    while (daysLeft > 0) {
      monthIndex++;
      if (monthIndex === 2 && isLeapYear) {
        daysLeft -= 29;
      } else {
        daysLeft -= [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex - 1];
      }
    }

    const gregorianMonth = monthIndex;
    const gregorianDay = daysLeft + ([31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][monthIndex - 1]);

    return `${gregorianYear}-${gregorianMonth.toString().padStart(2, '0')}-${gregorianDay.toString().padStart(2, '0')}`;
  }
}
