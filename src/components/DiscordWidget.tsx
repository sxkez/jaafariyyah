"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDiscordStats, formatActivity, type DiscordServerStats } from '@/services/discordService';

interface DiscordWidgetProps {
  compact?: boolean;
  showActivity?: boolean;
}

export function DiscordWidget({ compact = false, showActivity = true }: DiscordWidgetProps) {
  const [stats, setStats] = useState<DiscordServerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();

    // Update stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDiscordStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load Discord stats');
      console.error('Discord stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDiscord = () => {
    const inviteUrl = stats?.serverInfo.inviteCode
      ? `https://discord.gg/${stats.serverInfo.inviteCode}`
      : 'https://discord.gg/hanafiyya';
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Loading Discord stats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-4xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-white mb-2">Join Our Discord</h3>
            <p className="text-gray-300 text-sm mb-4">Connect with fellow scholars</p>
            <Button
              onClick={handleJoinDiscord}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Join Community
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="bg-purple-900/30 border-purple-600/30 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">☪</span>
              </div>
              <div>
                <p className="text-white font-semibold">{stats.serverInfo.name}</p>
                <p className="text-green-400 text-sm">
                  {stats.onlineCount} online • {stats.memberCount} members
                </p>
              </div>
            </div>
            <Button
              onClick={handleJoinDiscord}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Join
            </Button>
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center border border-purple-300">
              <span className="text-white">☪</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{stats.serverInfo.name}</h3>
              <p className="text-purple-200 text-sm">Discord Community</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">{stats.onlineCount} online</span>
            </div>
            <p className="text-gray-300 text-sm">{stats.memberCount} total members</p>
          </div>
        </div>

        {/* Live Activity */}
        {showActivity && stats.recentActivity.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Live Activity
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stats.recentActivity.slice(0, 4).map((activity) => (
                <div key={activity.id} className="text-gray-300 text-sm bg-purple-800/20 rounded p-2">
                  <p>{formatActivity(activity)}</p>
                  {activity.content && (
                    <p className="text-gray-400 text-xs mt-1 italic">
                      "{activity.content.substring(0, 60)}..."
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Button */}
        <Button
          onClick={handleJoinDiscord}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
        >
          👥 Join Our Discord Community
        </Button>

        {/* Refresh Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={loadStats}
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white text-xs"
            disabled={loading}
          >
            🔄 Refresh Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Discord status indicator for headers/sidebars
export function DiscordStatus() {
  const [stats, setStats] = useState<DiscordServerStats | null>(null);

  useEffect(() => {
    getDiscordStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-green-400">{stats.onlineCount}</span>
      <span className="text-gray-400">online in Discord</span>
    </div>
  );
}
