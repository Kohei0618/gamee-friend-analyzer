'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

import { 
  Trophy,
  Medal,
  Crown,
  Star,
  Clock,
  Gamepad2
} from 'lucide-react'
import { friends } from '@/lib/mock-data'
import Link from 'next/link'

const rankedFriends = [...friends].sort((a, b) => b.playCount - a.playCount)
const maxPlayCount = rankedFriends[0]?.playCount || 1

export default function RankingsPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />
      default:
        return <Star className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-yellow-500/50 bg-yellow-500/5'
      case 2:
        return 'border-gray-400/50 bg-gray-400/5'
      case 3:
        return 'border-orange-500/50 bg-orange-500/5'
      default:
        return 'border-border/50 bg-card/50'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">フレンドランキング</h1>
        <p className="text-muted-foreground">最も一緒にプレイしているフレンドを確認</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3">
        {rankedFriends.slice(0, 3).map((friend, index) => {
          const rank = index + 1
          return (
            <Card 
              key={friend.id} 
              className={`${getRankStyle(rank)} ${rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3'}`}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {getRankIcon(rank)}
                </div>
                <Avatar className={`mx-auto ${rank === 1 ? 'w-20 h-20' : 'w-16 h-16'}`}>
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold mt-3 truncate">{friend.name}</h3>
                <Badge 
                  variant="secondary" 
                  className={`mt-2 ${
                    rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                    rank === 2 ? 'bg-gray-400/20 text-gray-400' : 
                    'bg-orange-500/20 text-orange-500'
                  }`}
                >
                  #{rank} ランク
                </Badge>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Gamepad2 className="w-4 h-4" />
                    <span>{friend.playCount} セッション</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{friend.totalHours} 時間</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Full Rankings List */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            全ランキング
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rankedFriends.map((friend, index) => {
            const rank = index + 1
            const progressPercent = (friend.playCount / maxPlayCount) * 100
            return (
              <Link 
                key={friend.id} 
                href={`/dashboard/friends/${friend.id}`}
                className="block"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : ''}
                    ${rank === 2 ? 'bg-gray-400/20 text-gray-400' : ''}
                    ${rank === 3 ? 'bg-orange-500/20 text-orange-500' : ''}
                    ${rank > 3 ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    #{rank}
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{friend.name}</h4>
                      <span className="text-sm font-semibold">{friend.playCount} セッション</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>{friend.favoriteGame}</span>
                      <span>{friend.totalHours} 時間</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
