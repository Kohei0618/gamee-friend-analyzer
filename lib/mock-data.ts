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
