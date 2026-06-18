'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Gamepad2, 
  Clock, 
  TrendingUp,
  Trophy,
  Plus,
  UserPlus,
  BarChart3,
  ArrowUpRight,
  Flame,
  Target,
  Zap,
  Heart,
  Moon,
  Star,
  RefreshCw
} from 'lucide-react'
import { 
  getTopFriends, 
  monthlySessionData,
  gamesPlayedData,
  activityHeatmapData,
  activityTimeline,
  weeklyStats
} from '@/lib/mock-data'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const getTimelineIcon = (iconName: string) => {
  switch (iconName) {
    case 'trophy': return <Trophy className="w-4 h-4" />
    case 'heart': return <Heart className="w-4 h-4" />
    case 'moon': return <Moon className="w-4 h-4" />
    case 'clock': return <Clock className="w-4 h-4" />
    case 'star': return <Star className="w-4 h-4" />
    case 'refresh': return <RefreshCw className="w-4 h-4" />
    default: return <Zap className="w-4 h-4" />
  }
}

const getTimelineColor = (type: string) => {
  switch (type) {
    case 'session': return 'bg-primary/20 text-primary'
    case 'friend': return 'bg-pink-500/20 text-pink-500'
    case 'achievement': return 'bg-amber-500/20 text-amber-500'
    case 'milestone': return 'bg-accent/20 text-accent'
    default: return 'bg-muted text-muted-foreground'
  }
}

const DAYS = ['月', '火', '水', '木', '金', '土', '日']

// Japanese timeline data
const activityTimelineJa = [
  { id: 1, type: 'session', title: 'Valorant大勝利', description: 'NightWolf_Xとランクマッチで勝利', time: '2時間前', icon: 'trophy' },
  { id: 2, type: 'friend', title: '親友達成', description: 'CyberPhoenixとのセッションが100回を突破', time: '5時間前', icon: 'heart' },
  { id: 3, type: 'achievement', title: '夜更かしゲーマー', description: '今週深夜に5セッションプレイ', time: '1日前', icon: 'moon' },
  { id: 4, type: 'session', title: 'マラソンセッション', description: 'ShadowBladeと4時間以上プレイ', time: '2日前', icon: 'clock' },
  { id: 5, type: 'milestone', title: '1000時間達成', description: '総プレイ時間が1000時間に到達！', time: '3日前', icon: 'star' },
  { id: 6, type: 'friend', title: '再会', description: '2週間ぶりにIceStorm42とプレイ', time: '4日前', icon: 'refresh' },
]

// Japanese month labels
const monthlySessionDataJa = [
  { month: '8月', sessions: 18, hours: 42 },
  { month: '9月', sessions: 24, hours: 58 },
  { month: '10月', sessions: 31, hours: 76 },
  { month: '11月', sessions: 28, hours: 65 },
  { month: '12月', sessions: 35, hours: 89 },
  { month: '1月', sessions: 42, hours: 98 },
]

type RecentSession = {
  id: string
  friendName: string
  game: string
  duration: number | null
  date: string
}

export default function DashboardPage() {
  type TopFriend = {
    id: string
    name: string
    avatar_url: string | null
    playCount: number
  }

  const [topFriends, setTopFriends] = useState<TopFriend[]>([])

  const [recentActivity, setRecentActivity] = useState<RecentSession[]>([])

  const [gamesPlayedData, setGamesPlayedData] = useState<any[]>([])

  const [stats, setStats] = useState({
    totalFriends: 0,
    totalSessions: 0,
    totalHours: 0,
    thisWeekSessions: 0,
  })

  const fetchDashboardStats = async () => {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  // フレンド数
  const { count: totalFriends } = await supabase
    .from('friends')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // セッション数
  const { count: totalSessions } = await supabase
    .from('play_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // プレイ時間
  const { data: sessions } = await supabase
    .from('play_sessions')
    .select('duration_minutes')
    .eq('user_id', user.id)

  const totalHours =
    (sessions || []).reduce(
      (sum, session) =>
        sum + (session.duration_minutes || 0),
      0
    ) / 60

  // 今週のセッション
  const startOfWeek = new Date()
  startOfWeek.setDate(
    startOfWeek.getDate() - startOfWeek.getDay()
  )

  const { count: thisWeekSessions } = await supabase
    .from('play_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte(
      'played_at',
      startOfWeek.toISOString().split('T')[0]
    )

  setStats({
    totalFriends: totalFriends || 0,
    totalSessions: totalSessions || 0,
    totalHours: Math.round(totalHours),
    thisWeekSessions: thisWeekSessions || 0,
  })
}

const fetchRecentActivity = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from('play_sessions')
    .select(`
      id,
      played_at,
      duration_minutes,
      friends (
        name
      ),
      games (
        name
      )
    `)
    .eq('user_id', user.id)
    .order('played_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error(error)
    return
  }

  const formatted = (data || []).map((session: any) => ({
    id: session.id,
    friendName: session.friends?.name || '不明なフレンド',
    game: session.games?.name || '不明なゲーム',
    duration: session.duration_minutes,
    date: session.played_at,
  }))

  setRecentActivity(formatted)
}

const fetchTopFriends = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from('play_sessions')
    .select(`
      friend_id,
      friends (
        id,
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return
  }

  const rankingMap = new Map<string, TopFriend>()

  ;(data || []).forEach((session: any) => {
    const friend = session.friends

    if (!friend) return

    const current = rankingMap.get(friend.id)

    if (current) {
      current.playCount += 1
    } else {
      rankingMap.set(friend.id, {
        id: friend.id,
        name: friend.name,
        avatar_url: friend.avatar_url,
        playCount: 1,
      })
    }
  })

  const ranking = Array.from(rankingMap.values())
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 5)

  setTopFriends(ranking)
}

const fetchGameRanking = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from('play_sessions')
    .select(`
      duration_minutes,
      games (
        id,
        name
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return
  }

  const gameMap = new Map()

  ;(data || []).forEach((session: any) => {
    const game = session.games

    if (!game) return

    const current = gameMap.get(game.id)

    if (current) {
      current.hours += session.duration_minutes
    } else {
      gameMap.set(game.id, {
        name: game.name,
        hours: session.duration_minutes,
      })
    }
  })

  const ranking = Array.from(gameMap.values())
    .map((game: any) => ({
      ...game,
      hours: Math.round(game.hours / 60)
    }))
    .sort((a: any, b: any) => b.hours - a.hours)
    .slice(0, 5)

  setGamesPlayedData(ranking)
}

useEffect(() => {
  fetchDashboardStats()
  fetchRecentActivity()
  fetchTopFriends()
  fetchGameRanking()
}, [])

return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">ダッシュボード</h1>
          <p className="text-muted-foreground">おかえりなさい、ゲーマーユーザー！こちらがあなたのゲーム分析です。</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/friends/new">
              <UserPlus className="w-4 h-4" />
              フレンド追加
            </Link>
          </Button>
          <Button asChild className="gap-2 gradient-primary border-0">
            <Link href="/dashboard/add-session">
              <Plus className="w-4 h-4" />
              セッション記録
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid with Gaming Theme */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">総フレンド数</p>
                <p className="text-3xl font-bold mt-1">{stats.totalFriends}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">今週+{weeklyStats.friendsPlayedChange}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-accent/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">総セッション</p>
                <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">先週比+{weeklyStats.sessionsChange}%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-chart-3/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">総プレイ時間</p>
                <p className="text-3xl font-bold mt-1">{stats.totalHours.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500">先週比+{weeklyStats.hoursChange}%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-chart-4/50 transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">今週</p>
                <p className="text-3xl font-bold mt-1">{stats.thisWeekSessions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-500">絶好調！</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Monthly Play Sessions Chart - Larger */}
        <Card className="lg:col-span-4 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  月間アクティビティ
                </CardTitle>
                <CardDescription>過去6ヶ月のセッション数と時間</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySessionDataJa}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.2 270)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.65 0.2 270)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="oklch(0.65 0 0)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="oklch(0.65 0 0)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.16 0.01 280)', 
                      border: '1px solid oklch(0.28 0.02 280)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="oklch(0.65 0.2 270)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSessions)" 
                    name="セッション"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="oklch(0.75 0.15 195)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                    name="時間"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Most Played Games Chart */}
        <Card className="lg:col-span-3 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-accent" />
                  よくプレイするゲーム
                </CardTitle>
                <CardDescription>プレイ時間別トップゲーム</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gamesPlayedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" horizontal={false} />
                  <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="oklch(0.65 0 0)" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.16 0.01 280)', 
                      border: '1px solid oklch(0.28 0.02 280)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)'
                    }}
                    formatter={(value: number) => [`${value}時間`, 'プレイ時間']}
                  />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {gamesPlayedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`oklch(${0.65 + index * 0.02} ${0.2 - index * 0.02} ${270 + index * 20})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {gamesPlayedData.slice(0, 3).map((game, index) => (
                <Badge key={game.name} variant="secondary" className="text-xs">
                  #{index + 1} {game.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Row - Leaderboard, Timeline, Heatmap */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Friend Ranking Leaderboard */}
        <Card className="lg:col-span-4 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-yellow-500" />
                フレンドランキング
              </CardTitle>
              <Link href="/dashboard/rankings" className="text-xs text-primary hover:underline">
                すべて見る
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topFriends.map((friend, index) => (
              <Link 
                key={friend.id} 
                href={`/dashboard/friends/${friend.id}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : ''}
                  ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : ''}
                  ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-black' : ''}
                  ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  {index + 1}
                </div>
                <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                  <AvatarImage src={friend.avatar_url || ''} />
                  <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{friend.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    一緒に遊んだ回数
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">{friend.playCount}</p>
                  <p className="text-[10px] text-muted-foreground">セッション</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card className="lg:col-span-4 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-amber-500" />
              アクティビティ履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityTimelineJa.slice(0, 5).map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getTimelineColor(event.type)}`}>
                      {getTimelineIcon(event.icon)}
                    </div>
                    {index < activityTimelineJa.slice(0, 5).length - 1 && (
                      <div className="w-px h-full bg-border absolute top-8 left-1/2 -translate-x-1/2" />
                    )}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.description}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card className="lg:col-span-4 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="w-5 h-5 text-orange-500" />
                アクティビティヒートマップ
              </CardTitle>
              <span className="text-xs text-muted-foreground">過去12週間</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-2">
              <div className="w-6" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-5 text-center text-[9px] text-muted-foreground">
                  {i + 1}
                </div>
              ))}
            </div>
            {DAYS.map((day, dayIndex) => (
              <div key={dayIndex} className="flex gap-1 mb-1">
                <div className="w-6 text-[10px] text-muted-foreground flex items-center">{day}</div>
                {Array.from({ length: 12 }).map((_, weekIndex) => {
                  const data = activityHeatmapData.find(d => d.week === weekIndex && d.day === dayIndex)
                  const sessions = data?.sessions || 0
                  const opacity = sessions === 0 ? 0.1 : Math.min(0.2 + sessions * 0.12, 1)
                  return (
                    <div
                      key={weekIndex}
                      className="w-5 h-5 rounded-sm transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer"
                      style={{ 
                        backgroundColor: sessions === 0 
                          ? 'oklch(0.22 0.01 280)' 
                          : `oklch(0.65 0.2 270 / ${opacity})`
                      }}
                      title={`${weekIndex + 1}週目 ${['月', '火', '水', '木', '金', '土', '日'][dayIndex]}曜日: ${sessions}セッション`}
                    />
                  )
                })}
              </div>
            ))}
            <div className="flex items-center justify-end gap-2 mt-3">
              <span className="text-[10px] text-muted-foreground">少ない</span>
              {[0.1, 0.3, 0.5, 0.7, 1].map((opacity, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: `oklch(0.65 0.2 270 / ${opacity})` }}
                />
              ))}
              <span className="text-[10px] text-muted-foreground">多い</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Recent Sessions & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Sessions */}
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gamepad2 className="w-5 h-5 text-accent" />
                最近のセッション
              </CardTitle>
              <Link href="/dashboard/friends" className="text-xs text-primary hover:underline">
                すべて見る
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((session) => (
                <div 
                  key={session.id} 
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      <span className="text-primary">{session.game}</span>をプレイ
                    </p>
                    <p className="text-xs text-muted-foreground">{session.friendName}と</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {session.duration}分
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(session.date).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              クイックアクション
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 hover:border-primary/50 hover:bg-primary/5">
              <Link href="/dashboard/add-session">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">新規セッション記録</p>
                  <p className="text-[10px] text-muted-foreground">ゲーム時間を記録</p>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 hover:border-accent/50 hover:bg-accent/5">
              <Link href="/dashboard/friends">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">新規フレンド追加</p>
                  <p className="text-[10px] text-muted-foreground">ネットワークを拡大</p>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 hover:border-yellow-500/50 hover:bg-yellow-500/5">
              <Link href="/dashboard/rankings">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">ランキング表示</p>
                  <p className="text-[10px] text-muted-foreground">最も遊ぶフレンドを確認</p>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start gap-3 h-12 hover:border-chart-3/50 hover:bg-chart-3/5">
              <Link href="/dashboard/network">
                <div className="w-8 h-8 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-chart-3" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">関係図表示</p>
                  <p className="text-[10px] text-muted-foreground">繋がりを可視化</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
