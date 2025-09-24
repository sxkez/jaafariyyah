import { format, addDays } from 'date-fns';

export interface PrayerTimes {
  date: Date;
  hijriDate: HijriDate;
  location: LocationInfo;
  prayers: {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  };
  nextPrayer: {
    name: string;
    time: Date;
    timeUntil: string;
  };
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  formatted: string;
}

export interface LocationInfo {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const hijriMonths = [
  'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
  'Ramadan', 'Shawwal', 'Dhul Qi\'dah', 'Dhul Hijjah'
];

/**
 * Gets user's current location using browser geolocation API
 */
export async function getUserLocation(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get city name
          const { latitude, longitude } = position.coords;
          const locationInfo = await reverseGeocode(latitude, longitude);
          resolve(locationInfo);
        } catch (error) {
          // Fallback to default location if reverse geocoding fails
          resolve({
            city: 'Unknown Location',
            country: 'Unknown',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }
      },
      (error) => {
        // Fallback to default location
        resolve({
          city: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'Europe/London'
        });
      }
    );
  });
}

/**
 * Reverse geocoding to get location name from coordinates
 */
async function reverseGeocode(lat: number, lon: number): Promise<LocationInfo> {
  try {
    // Using a free geocoding service - in production, use a proper API key
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();

    return {
      city: data.city || data.locality || 'Unknown',
      country: data.countryName || 'Unknown',
      latitude: lat,
      longitude: lon,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    throw new Error('Failed to get location name');
  }
}

/**
 * Fetches prayer times for a given location and date
 */
export async function getPrayerTimes(location: LocationInfo, date: Date = new Date()): Promise<PrayerTimes> {
  try {
    // Using Aladhan API for prayer times
    const dateStr = format(date, 'dd-MM-yyyy');
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${location.latitude}&longitude=${location.longitude}&method=2&school=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 200) {
      throw new Error('Failed to fetch prayer times');
    }

    const timings = data.data.timings;
    const hijri = data.data.date.hijri;

    // Parse prayer times
    const prayers = {
      fajr: parseTime(timings.Fajr, date),
      sunrise: parseTime(timings.Sunrise, date),
      dhuhr: parseTime(timings.Dhuhr, date),
      asr: parseTime(timings.Asr, date),
      maghrib: parseTime(timings.Maghrib, date),
      isha: parseTime(timings.Isha, date)
    };

    const hijriDate: HijriDate = {
      day: parseInt(hijri.day),
      month: parseInt(hijri.month.number),
      year: parseInt(hijri.year),
      monthName: hijri.month.en,
      formatted: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`
    };

    const nextPrayer = getNextPrayer(prayers);

    return {
      date,
      hijriDate,
      location,
      prayers,
      nextPrayer
    };
  } catch (error) {
    console.error('Failed to fetch prayer times:', error);
    // Return mock data as fallback
    return getMockPrayerTimes(location, date);
  }
}

/**
 * Parses time string from API response
 */
function parseTime(timeString: string, baseDate: Date): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Determines the next prayer time
 */
function getNextPrayer(prayers: PrayerTimes['prayers']): PrayerTimes['nextPrayer'] {
  const now = new Date();
  const prayerArray = [
    { name: 'Fajr', time: prayers.fajr },
    { name: 'Sunrise', time: prayers.sunrise },
    { name: 'Dhuhr', time: prayers.dhuhr },
    { name: 'Asr', time: prayers.asr },
    { name: 'Maghrib', time: prayers.maghrib },
    { name: 'Isha', time: prayers.isha }
  ];

  // Find next prayer today
  for (const prayer of prayerArray) {
    if (prayer.time > now) {
      return {
        name: prayer.name,
        time: prayer.time,
        timeUntil: getTimeUntil(prayer.time)
      };
    }
  }

  // If no prayer left today, return Fajr tomorrow
  const tomorrow = addDays(now, 1);
  const fajrTomorrow = new Date(tomorrow);
  fajrTomorrow.setHours(prayers.fajr.getHours(), prayers.fajr.getMinutes(), 0, 0);

  return {
    name: 'Fajr',
    time: fajrTomorrow,
    timeUntil: getTimeUntil(fajrTomorrow)
  };
}

/**
 * Calculates time until a given date
 */
function getTimeUntil(targetTime: Date): string {
  const now = new Date();
  const diffMs = targetTime.getTime() - now.getTime();

  if (diffMs <= 0) return 'Now';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

/**
 * Mock prayer times as fallback
 */
function getMockPrayerTimes(location: LocationInfo, date: Date): PrayerTimes {
  const prayers = {
    fajr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 30),
    sunrise: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 0),
    dhuhr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 30),
    asr: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 45),
    maghrib: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 30),
    isha: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 0)
  };

  // Mock Hijri date (approximate)
  const hijriDate: HijriDate = {
    day: 15,
    month: 3,
    year: 1446,
    monthName: 'Rabi\' al-Awwal',
    formatted: '15 Rabi\' al-Awwal 1446 AH'
  };

  return {
    date,
    hijriDate,
    location,
    prayers,
    nextPrayer: getNextPrayer(prayers)
  };
}

/**
 * Formats prayer time for display
 */
export function formatPrayerTime(time: Date): string {
  return format(time, 'h:mm a');
}

/**
 * Gets Islamic calendar events for a given date
 */
export function getIslamicEvents(hijriDate: HijriDate): string[] {
  const events: string[] = [];

  // Add some common Islamic dates
  if (hijriDate.month === 1 && hijriDate.day === 1) {
    events.push('Islamic New Year');
  }
  if (hijriDate.month === 1 && hijriDate.day === 10) {
    events.push('Day of Ashura');
  }
  if (hijriDate.month === 3 && hijriDate.day === 12) {
    events.push('Mawlid an-Nabi (Birth of Prophet ﷺ)');
  }
  if (hijriDate.month === 7 && hijriDate.day === 27) {
    events.push('Isra and Mi\'raj');
  }
  if (hijriDate.month === 8 && hijriDate.day >= 15) {
    events.push('Sha\'ban - Preparation for Ramadan');
  }
  if (hijriDate.month === 9) {
    events.push('Ramadan - Month of Fasting');
    if (hijriDate.day >= 21) {
      events.push('Laylat al-Qadr likely');
    }
  }
  if (hijriDate.month === 10 && hijriDate.day === 1) {
    events.push('Eid al-Fitr');
  }
  if (hijriDate.month === 12 && hijriDate.day === 10) {
    events.push('Eid al-Adha');
  }

  return events;
}
