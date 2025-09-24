// Discord API service for Al Hanafiyya community integration
export interface DiscordServerStats {
  memberCount: number;
  onlineCount: number;
  recentActivity: DiscordActivity[];
  serverInfo: {
    name: string;
    icon: string;
    inviteCode: string;
  };
}

export interface DiscordActivity {
  id: string;
  type: 'message' | 'member_join' | 'voice_activity';
  user: string;
  channel: string;
  timestamp: Date;
  content?: string;
}

// Mock Discord data - replace with real Discord API calls
const mockDiscordStats: DiscordServerStats = {
  memberCount: 1247,
  onlineCount: 156,
  recentActivity: [
    {
      id: '1',
      type: 'message',
      user: 'Abdullah_Scholar',
      channel: 'hanafi-fiqh',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      content: 'Great discussion on the principles of istihsan today!'
    },
    {
      id: '2',
      type: 'member_join',
      user: 'Seekerof_Knowledge',
      channel: 'general',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '3',
      type: 'message',
      user: 'ImamStudent',
      channel: 'aqidah-discussions',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      content: 'Just finished reading Al-Tahawiyya. Such clarity!'
    },
    {
      id: '4',
      type: 'voice_activity',
      user: 'YasirAlHanafi',
      channel: 'Study Circle',
      timestamp: new Date(Date.now() - 1000 * 60 * 12)
    },
    {
      id: '5',
      type: 'message',
      user: 'FiqhStudent',
      channel: 'book-discussions',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      content: 'Can someone explain the difference between qiyas and istihsan?'
    }
  ],
  serverInfo: {
    name: 'Al Hanafiyya',
    icon: 'https://cdn.discordapp.com/icons/123456789/example.png',
    inviteCode: 'hanafiyya'
  }
};

/**
 * Fetches live Discord server statistics
 * In production, this would call the Discord API with proper authentication
 */
export async function getDiscordStats(): Promise<DiscordServerStats> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, you would:
    // 1. Set up a Discord bot with proper permissions
    // 2. Use Discord.js or Discord API to fetch real data
    // 3. Implement proper authentication and rate limiting

    // For now, we'll use mock data with some randomization
    const variance = Math.floor(Math.random() * 20) - 10;
    const onlineVariance = Math.floor(Math.random() * 30) - 15;

    return {
      ...mockDiscordStats,
      memberCount: mockDiscordStats.memberCount + variance,
      onlineCount: Math.max(0, mockDiscordStats.onlineCount + onlineVariance),
      recentActivity: mockDiscordStats.recentActivity.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp.getTime() + Math.random() * 60000)
      }))
    };
  } catch (error) {
    console.error('Failed to fetch Discord stats:', error);
    // Return fallback data
    return mockDiscordStats;
  }
}

/**
 * Formats Discord activity for display
 */
export function formatActivity(activity: DiscordActivity): string {
  const timeAgo = getTimeAgo(activity.timestamp);

  switch (activity.type) {
    case 'message':
      return `${activity.user} posted in #${activity.channel} ${timeAgo}`;
    case 'member_join':
      return `${activity.user} joined the server ${timeAgo}`;
    case 'voice_activity':
      return `${activity.user} joined voice channel "${activity.channel}" ${timeAgo}`;
    default:
      return `${activity.user} was active ${timeAgo}`;
  }
}

/**
 * Converts timestamp to "time ago" format
 */
function getTimeAgo(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

/**
 * Real Discord API integration setup guide:
 *
 * 1. Create a Discord Bot:
 *    - Go to https://discord.com/developers/applications
 *    - Create new application and bot
 *    - Get bot token and guild ID
 *
 * 2. Set up permissions:
 *    - Read Message History
 *    - View Channels
 *    - Read Messages/View Channels
 *
 * 3. Environment variables needed:
 *    - DISCORD_BOT_TOKEN
 *    - DISCORD_GUILD_ID
 *    - DISCORD_CLIENT_ID
 *
 * 4. Implementation would use Discord.js:
 *    ```typescript
 *    import { Client, GatewayIntentBits } from 'discord.js';
 *
 *    const client = new Client({
 *      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
 *    });
 *
 *    // Fetch real guild data
 *    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
 *    const memberCount = guild?.memberCount || 0;
 *    ```
 */
