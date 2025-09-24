"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getPrayerTimes,
  getUserLocation,
  formatPrayerTime,
  getIslamicEvents,
  type PrayerTimes,
  type LocationInfo
} from '@/services/prayerTimesService';

interface PrayerTimesWidgetProps {
  compact?: boolean;
}

export function PrayerTimesWidget({ compact = false }: PrayerTimesWidgetProps) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    loadPrayerTimes();

    // Update prayer times every hour
    const interval = setInterval(loadPrayerTimes, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadPrayerTimes = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getUserLocation();
      const times = await getPrayerTimes(location);

      setPrayerTimes(times);
      setLocationPermission('granted');
    } catch (err) {
      console.error('Prayer times error:', err);
      setError('Unable to load prayer times');
      setLocationPermission('denied');

      // Load with default location
      try {
        const defaultLocation: LocationInfo = {
          city: 'Mecca',
          country: 'Saudi Arabia',
          latitude: 21.4225,
          longitude: 39.8262,
          timezone: 'Asia/Riyadh'
        };
        const times = await getPrayerTimes(defaultLocation);
        setPrayerTimes(times);
      } catch (fallbackError) {
        console.error('Fallback prayer times failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    setLocationPermission('prompt');
    loadPrayerTimes();
  };

  if (loading) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Loading prayer times...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prayerTimes) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🕌</div>
            <h3 className="text-lg font-semibold text-white mb-2">Prayer Times</h3>
            <p className="text-gray-300 text-sm mb-4">Unable to load prayer times</p>
            <Button
              onClick={requestLocation}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const islamicEvents = getIslamicEvents(prayerTimes.hijriDate);

  if (compact) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Next: {prayerTimes.nextPrayer.name}</p>
              <p className="text-purple-200 text-sm">
                {formatPrayerTime(prayerTimes.nextPrayer.time)} ({prayerTimes.nextPrayer.timeUntil})
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">{prayerTimes.location.city}</p>
              <p className="text-gray-400 text-xs">{prayerTimes.hijriDate.formatted}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🕌</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Prayer Times</h3>
              <p className="text-purple-200 text-sm">{prayerTimes.location.city}, {prayerTimes.location.country}</p>
            </div>
          </div>
          {locationPermission === 'denied' && (
            <Button
              onClick={requestLocation}
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-300 hover:bg-purple-500/20"
            >
              📍 Use My Location
            </Button>
          )}
        </div>

        {/* Islamic Date */}
        <div className="mb-6 text-center">
          <p className="text-white font-medium">{prayerTimes.hijriDate.formatted}</p>
          <p className="text-gray-300 text-sm">
            {prayerTimes.date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Islamic Events */}
        {islamicEvents.length > 0 && (
          <div className="mb-6">
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-300 font-medium text-sm mb-1">Today's Events:</p>
              {islamicEvents.map((event, index) => (
                <p key={index} className="text-green-200 text-sm">{event}</p>
              ))}
            </div>
          </div>
        )}

        {/* Next Prayer Highlight */}
        <div className="mb-6">
          <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-4 text-center">
            <p className="text-purple-200 text-sm mb-1">Next Prayer</p>
            <p className="text-white text-xl font-bold">{prayerTimes.nextPrayer.name}</p>
            <p className="text-purple-200">
              {formatPrayerTime(prayerTimes.nextPrayer.time)}
            </p>
            <p className="text-purple-300 text-sm">in {prayerTimes.nextPrayer.timeUntil}</p>
          </div>
        </div>

        {/* All Prayer Times */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(prayerTimes.prayers).map(([prayer, time]) => {
            const isNext = prayer.toLowerCase() === prayerTimes.nextPrayer.name.toLowerCase();
            const isPassed = time < new Date();

            return (
              <div
                key={prayer}
                className={`p-3 rounded-lg text-center ${
                  isNext
                    ? 'bg-purple-600/40 border border-purple-400/50'
                    : isPassed
                    ? 'bg-gray-600/20 border border-gray-500/30'
                    : 'bg-purple-800/20 border border-purple-600/30'
                }`}
              >
                <p className={`font-medium capitalize ${
                  isNext ? 'text-white' : isPassed ? 'text-gray-400' : 'text-purple-200'
                }`}>
                  {prayer}
                </p>
                <p className={`text-sm ${
                  isNext ? 'text-purple-100' : isPassed ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  {formatPrayerTime(time)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            onClick={loadPrayerTimes}
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white text-xs"
            disabled={loading}
          >
            🔄 Refresh Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Simple prayer time indicator for headers
export function NextPrayerIndicator() {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeUntil: string } | null>(null);

  useEffect(() => {
    const loadNext = async () => {
      try {
        const location = await getUserLocation();
        const times = await getPrayerTimes(location);
        setNextPrayer({
          name: times.nextPrayer.name,
          timeUntil: times.nextPrayer.timeUntil
        });
      } catch (error) {
        console.error('Failed to load next prayer:', error);
      }
    };

    loadNext();
    const interval = setInterval(loadNext, 60 * 1000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (!nextPrayer) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-green-400">🕌</span>
      <span className="text-white">{nextPrayer.name}</span>
      <span className="text-gray-400">in {nextPrayer.timeUntil}</span>
    </div>
  );
}
