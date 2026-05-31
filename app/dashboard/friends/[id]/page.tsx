'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  ArrowLeft,
  Gamepad2,
  Clock,
  Calendar,
  Mic,
  MicOff,
  Network,
  Users,
  TrendingUp
} from 'lucide-react'
import { getFriendById, getSessionsByFriendId, friends, type Friend } from '@/lib/mock-data'

export default function FriendDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  const friend = getFriendById(id)
  const sessions = getSessionsByFriendId(id)
  
  if (!friend) {
    notFound()
  }

  const getStatusColor = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'in-game':
        return 'bg-primary'
      case 'offline':
        return 'bg-muted-foreground'
      default:
        return 'bg-muted-foreground'
    }
  }

  const getStatusLabel = (status: Friend['status']) => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'in-game':
        return 'In Game'
      case 'offline':
        return 'Offline'
      default:
        return status
    }
  }

  // Get some random mutual friends for demo
  const mutualFriends = friends.filter(f => f.id !== id).slice(0, 3)

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Link 
        href="/dashboard/friends" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Friends</span>
      </Link>

      {/* Friend Profile Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="text-2xl">{friend.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card ${getStatusColor(friend.status)}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{friend.name}</h1>
                <Badge variant="secondary">{getStatusLabel(friend.status)}</Badge>
              </div>
              <p className="text-muted-foreground mt-1">Favorite game: {friend.favoriteGame}</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button asChild className="gradient-primary border-0">
                  <Link href="/dashboard/add-session">
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Log Session
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/network">
                    <Network className="w-4 h-4 mr-2" />
                    View Network
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friend.playCount}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friend.totalHours}</p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friend.lastPlayed}</p>
                <p className="text-sm text-muted-foreground">Last Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Play History */}
        <Card className="bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Play History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Voice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.game}</TableCell>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>{session.duration} min</TableCell>
                      <TableCell>
                        {session.voiceChat ? (
                          <Mic className="w-4 h-4 text-green-500" />
                        ) : (
                          <MicOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No sessions recorded yet. Start playing together!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mutual Friends */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Mutual Friends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mutualFriends.map((mutualFriend) => (
              <Link 
                key={mutualFriend.id} 
                href={`/dashboard/friends/${mutualFriend.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={mutualFriend.avatar} />
                  <AvatarFallback>{mutualFriend.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{mutualFriend.name}</p>
                  <p className="text-xs text-muted-foreground">{mutualFriend.playCount} sessions</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
