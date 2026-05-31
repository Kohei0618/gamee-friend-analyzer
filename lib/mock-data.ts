// Mock data for Gamee Friend Analyzer

export interface Friend {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'in-game'
  playCount: number
  lastPlayed: string
  favoriteGame: string
  totalHours: number
}

export interface PlaySession {
  id: string
  friendId: string
  friendName: string
  game: string
  date: string
  duration: number
  voiceChat: boolean
  notes?: string
}

export interface GameStats {
  totalFriends: number
  totalSessions: number
  favoriteGame: string
  totalHours: number
  thisWeekSessions: number
}

export const friends: Friend[] = [
  {
    id: '1',
    name: 'NightWolf_X',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nightwolf',
    status: 'online',
    playCount: 156,
    lastPlayed: '2024-01-15',
    favoriteGame: 'Valorant',
    totalHours: 342
  },
  {
    id: '2',
    name: 'CyberPhoenix',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=phoenix',
    status: 'in-game',
    playCount: 134,
    lastPlayed: '2024-01-14',
    favoriteGame: 'League of Legends',
    totalHours: 289
  },
  {
    id: '3',
    name: 'PixelQueen99',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pixel',
    status: 'offline',
    playCount: 98,
    lastPlayed: '2024-01-10',
    favoriteGame: 'Minecraft',
    totalHours: 156
  },
  {
    id: '4',
    name: 'ShadowBlade',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=shadow',
    status: 'online',
    playCount: 87,
    lastPlayed: '2024-01-15',
    favoriteGame: 'Apex Legends',
    totalHours: 198
  },
  {
    id: '5',
    name: 'TurboGamer',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=turbo',
    status: 'offline',
    playCount: 72,
    lastPlayed: '2024-01-08',
    favoriteGame: 'Fortnite',
    totalHours: 134
  },
  {
    id: '6',
    name: 'NeonDrifter',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=neon',
    status: 'in-game',
    playCount: 65,
    lastPlayed: '2024-01-14',
    favoriteGame: 'Rocket League',
    totalHours: 112
  },
  {
    id: '7',
    name: 'IceStorm42',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ice',
    status: 'offline',
    playCount: 45,
    lastPlayed: '2023-12-20',
    favoriteGame: 'CS2',
    totalHours: 89
  },
  {
    id: '8',
    name: 'VoidWalker',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=void',
    status: 'online',
    playCount: 38,
    lastPlayed: '2024-01-13',
    favoriteGame: 'Overwatch 2',
    totalHours: 67
  }
]

export const playSessions: PlaySession[] = [
  {
    id: '1',
    friendId: '1',
    friendName: 'NightWolf_X',
    game: 'Valorant',
    date: '2024-01-15',
    duration: 120,
    voiceChat: true,
    notes: 'Ranked session, reached Diamond!'
  },
  {
    id: '2',
    friendId: '2',
    friendName: 'CyberPhoenix',
    game: 'League of Legends',
    date: '2024-01-14',
    duration: 180,
    voiceChat: true
  },
  {
    id: '3',
    friendId: '4',
    friendName: 'ShadowBlade',
    game: 'Apex Legends',
    date: '2024-01-15',
    duration: 90,
    voiceChat: true,
    notes: 'Won 3 games in a row!'
  },
  {
    id: '4',
    friendId: '6',
    friendName: 'NeonDrifter',
    game: 'Rocket League',
    date: '2024-01-14',
    duration: 60,
    voiceChat: false
  },
  {
    id: '5',
    friendId: '1',
    friendName: 'NightWolf_X',
    game: 'CS2',
    date: '2024-01-13',
    duration: 150,
    voiceChat: true
  },
  {
    id: '6',
    friendId: '8',
    friendName: 'VoidWalker',
    game: 'Overwatch 2',
    date: '2024-01-13',
    duration: 75,
    voiceChat: true
  }
]

export const games = [
  'Valorant',
  'League of Legends',
  'Minecraft',
  'Apex Legends',
  'Fortnite',
  'Rocket League',
  'CS2',
  'Overwatch 2',
  'Call of Duty: Warzone',
  'PUBG',
  'Destiny 2',
  'Elden Ring'
]

export const stats: GameStats = {
  totalFriends: 8,
  totalSessions: 156,
  favoriteGame: 'Valorant',
  totalHours: 1387,
  thisWeekSessions: 12
}

export function getFriendById(id: string): Friend | undefined {
  return friends.find(f => f.id === id)
}

export function getSessionsByFriendId(friendId: string): PlaySession[] {
  return playSessions.filter(s => s.friendId === friendId)
}

export function getTopFriends(limit: number = 5): Friend[] {
  return [...friends].sort((a, b) => b.playCount - a.playCount).slice(0, limit)
}

export function getRecentActivity(limit: number = 5): PlaySession[] {
  return [...playSessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getInactiveFriends(daysSinceLastPlay: number = 14): Friend[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastPlay)
  return friends.filter(f => new Date(f.lastPlayed) < cutoffDate)
}

// Monthly play session data for charts
export const monthlySessionData = [
  { month: 'Aug', sessions: 18, hours: 42 },
  { month: 'Sep', sessions: 24, hours: 58 },
  { month: 'Oct', sessions: 31, hours: 76 },
  { month: 'Nov', sessions: 28, hours: 65 },
  { month: 'Dec', sessions: 35, hours: 89 },
  { month: 'Jan', sessions: 42, hours: 98 },
]

// Most played games data
export const gamesPlayedData = [
  { name: 'Valorant', hours: 342, sessions: 89, color: 'hsl(var(--chart-1))' },
  { name: 'League of Legends', hours: 289, sessions: 72, color: 'hsl(var(--chart-2))' },
  { name: 'Apex Legends', hours: 198, sessions: 54, color: 'hsl(var(--chart-3))' },
  { name: 'CS2', hours: 156, sessions: 41, color: 'hsl(var(--chart-4))' },
  { name: 'Rocket League', hours: 112, sessions: 32, color: 'hsl(var(--chart-5))' },
]

// Activity heatmap data (last 12 weeks)
export const activityHeatmapData = [
  // Week 1-12, Mon-Sun
  { week: 0, day: 0, sessions: 2 }, { week: 0, day: 1, sessions: 0 }, { week: 0, day: 2, sessions: 3 }, 
  { week: 0, day: 3, sessions: 1 }, { week: 0, day: 4, sessions: 4 }, { week: 0, day: 5, sessions: 5 }, { week: 0, day: 6, sessions: 3 },
  { week: 1, day: 0, sessions: 1 }, { week: 1, day: 1, sessions: 2 }, { week: 1, day: 2, sessions: 0 }, 
  { week: 1, day: 3, sessions: 3 }, { week: 1, day: 4, sessions: 2 }, { week: 1, day: 5, sessions: 6 }, { week: 1, day: 6, sessions: 4 },
  { week: 2, day: 0, sessions: 0 }, { week: 2, day: 1, sessions: 1 }, { week: 2, day: 2, sessions: 2 }, 
  { week: 2, day: 3, sessions: 0 }, { week: 2, day: 4, sessions: 3 }, { week: 2, day: 5, sessions: 5 }, { week: 2, day: 6, sessions: 2 },
  { week: 3, day: 0, sessions: 2 }, { week: 3, day: 1, sessions: 3 }, { week: 3, day: 2, sessions: 1 }, 
  { week: 3, day: 3, sessions: 4 }, { week: 3, day: 4, sessions: 2 }, { week: 3, day: 5, sessions: 7 }, { week: 3, day: 6, sessions: 5 },
  { week: 4, day: 0, sessions: 1 }, { week: 4, day: 1, sessions: 0 }, { week: 4, day: 2, sessions: 2 }, 
  { week: 4, day: 3, sessions: 1 }, { week: 4, day: 4, sessions: 3 }, { week: 4, day: 5, sessions: 4 }, { week: 4, day: 6, sessions: 3 },
  { week: 5, day: 0, sessions: 3 }, { week: 5, day: 1, sessions: 2 }, { week: 5, day: 2, sessions: 4 }, 
  { week: 5, day: 3, sessions: 2 }, { week: 5, day: 4, sessions: 5 }, { week: 5, day: 5, sessions: 8 }, { week: 5, day: 6, sessions: 6 },
  { week: 6, day: 0, sessions: 2 }, { week: 6, day: 1, sessions: 1 }, { week: 6, day: 2, sessions: 0 }, 
  { week: 6, day: 3, sessions: 3 }, { week: 6, day: 4, sessions: 4 }, { week: 6, day: 5, sessions: 6 }, { week: 6, day: 6, sessions: 4 },
  { week: 7, day: 0, sessions: 1 }, { week: 7, day: 1, sessions: 2 }, { week: 7, day: 2, sessions: 3 }, 
  { week: 7, day: 3, sessions: 1 }, { week: 7, day: 4, sessions: 2 }, { week: 7, day: 5, sessions: 5 }, { week: 7, day: 6, sessions: 3 },
  { week: 8, day: 0, sessions: 0 }, { week: 8, day: 1, sessions: 1 }, { week: 8, day: 2, sessions: 2 }, 
  { week: 8, day: 3, sessions: 4 }, { week: 8, day: 4, sessions: 3 }, { week: 8, day: 5, sessions: 7 }, { week: 8, day: 6, sessions: 5 },
  { week: 9, day: 0, sessions: 2 }, { week: 9, day: 1, sessions: 0 }, { week: 9, day: 2, sessions: 1 }, 
  { week: 9, day: 3, sessions: 2 }, { week: 9, day: 4, sessions: 4 }, { week: 9, day: 5, sessions: 6 }, { week: 9, day: 6, sessions: 4 },
  { week: 10, day: 0, sessions: 3 }, { week: 10, day: 1, sessions: 2 }, { week: 10, day: 2, sessions: 3 }, 
  { week: 10, day: 3, sessions: 5 }, { week: 10, day: 4, sessions: 4 }, { week: 10, day: 5, sessions: 8 }, { week: 10, day: 6, sessions: 6 },
  { week: 11, day: 0, sessions: 2 }, { week: 11, day: 1, sessions: 3 }, { week: 11, day: 2, sessions: 4 }, 
  { week: 11, day: 3, sessions: 3 }, { week: 11, day: 4, sessions: 5 }, { week: 11, day: 5, sessions: 9 }, { week: 11, day: 6, sessions: 7 },
]

// Activity timeline events
export const activityTimeline = [
  { id: 1, type: 'session', title: 'Epic Valorant Win', description: 'Won ranked match with NightWolf_X', time: '2 hours ago', icon: 'trophy' },
  { id: 2, type: 'friend', title: 'New Best Friend', description: 'CyberPhoenix reached 100+ sessions with you', time: '5 hours ago', icon: 'heart' },
  { id: 3, type: 'achievement', title: 'Night Owl', description: 'Played 5 sessions after midnight this week', time: '1 day ago', icon: 'moon' },
  { id: 4, type: 'session', title: 'Marathon Session', description: '4+ hours gaming with ShadowBlade', time: '2 days ago', icon: 'clock' },
  { id: 5, type: 'milestone', title: '1000 Hours', description: 'You reached 1000 total gaming hours!', time: '3 days ago', icon: 'star' },
  { id: 6, type: 'friend', title: 'Reconnected', description: 'Played with IceStorm42 after 2 weeks', time: '4 days ago', icon: 'refresh' },
]

// Weekly comparison stats
export const weeklyStats = {
  sessionsChange: 23,
  hoursChange: 15,
  friendsPlayedChange: 2,
  newGamesPlayed: 1,
}
