'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Gamepad2, 
  Clock, 
  TrendingUp,
  Trophy,
  Calendar,
  AlertCircle
} from 'lucide-react'
import { 
  stats, 
  getTopFriends, 
  getRecentActivity, 
  getInactiveFriends 
} from '@/lib/mock-data'
import Link from 'next/link'

const topFriends = getTopFriends(5)
const recentActivity = getRecentActivity(5)
const inactiveFriends = getInactiveFriends(14)

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, GamerUser! Here&apos;s your gaming overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Friends</p>
                <p className="text-3xl font-bold">{stats.totalFriends}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-3xl font-bold">{stats.totalHours}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeekSessions}</p>
                <p className="text-xs text-muted-foreground">sessions</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Friend Ranking Card */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Friends
            </CardTitle>
            <Link href="/dashboard/rankings" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topFriends.map((friend, index) => (
              <div key={friend.id} className="flex items-center gap-4">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' : ''}
                  ${index === 1 ? 'bg-gray-400/20 text-gray-400' : ''}
                  ${index === 2 ? 'bg-orange-500/20 text-orange-500' : ''}
                  ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  #{index + 1}
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">{friend.favoriteGame}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{friend.playCount}</p>
                  <p className="text-xs text-muted-foreground">sessions</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Recent Activity
            </CardTitle>
            <Link href="/dashboard/friends" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((session) => (
              <div key={session.id} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    Played with <span className="text-primary">{session.friendName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{session.game}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{session.duration} min</p>
                  <p className="text-xs text-muted-foreground">{session.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inactive Friends */}
        <Card className="bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Inactive Friends
              <Badge variant="secondary" className="ml-2">{inactiveFriends.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inactiveFriends.length > 0 ? (
              <div className="space-y-3">
                {inactiveFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last played: {friend.lastPlayed}
                      </p>
                    </div>
                    <Link 
                      href="/dashboard/add-session" 
                      className="text-sm text-primary hover:underline"
                    >
                      Play now
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                All your friends are active! Great job staying connected.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Favorite Game Stats */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Favorite Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-xl gradient-primary mx-auto flex items-center justify-center mb-3">
                <Gamepad2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-xl font-bold">{stats.favoriteGame}</p>
              <p className="text-sm text-muted-foreground">Most played game</p>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Valorant</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>League of Legends</span>
                  <span className="text-muted-foreground">30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Apex Legends</span>
                  <span className="text-muted-foreground">15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Others</span>
                  <span className="text-muted-foreground">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
