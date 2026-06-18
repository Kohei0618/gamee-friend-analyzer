'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  ArrowLeft,
  Users,
  Gamepad2,
  Clock,
  Calendar,
  MessageSquare,
  Trash2,
} from 'lucide-react'

type Friend = {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  memo: string | null
  created_at: string
  updated_at: string
}

type Session = {
  id: string
  played_at: string
  duration_minutes: number | null
  vc_used: boolean
  memo: string | null
  games: {
    name: string
    genre: string | null
  } | null
}

type GameRanking = {
  name: string
  genre: string | null
  count: number
  minutes: number
}

export default function FriendDetailPage() {
  const params = useParams()
  const router = useRouter()
  const friendId = params.id as string

  const [friend, setFriend] = useState<Friend | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce(
    (sum, session) => sum + (session.duration_minutes || 0),
    0
  )
  const totalHours = Math.round(totalMinutes / 60)

  const latestSession = sessions[0]

  const gameRankingMap = new Map<string, GameRanking>()

  sessions.forEach((session) => {
    const gameName = session.games?.name || '不明なゲーム'
    const genre = session.games?.genre || null
    const current = gameRankingMap.get(gameName)

    if (current) {
      current.count += 1
      current.minutes += session.duration_minutes || 0
    } else {
      gameRankingMap.set(gameName, {
        name: gameName,
        genre,
        count: 1,
        minutes: session.duration_minutes || 0,
      })
    }
  })

  const gameRanking = Array.from(gameRankingMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const mostPlayedGame = gameRanking[0]

  useEffect(() => {
    fetchFriendDetail()
  }, [friendId])

  const fetchFriendDetail = async () => {
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: friendData, error: friendError } = await supabase
      .from('friends')
      .select('*')
      .eq('id', friendId)
      .eq('user_id', user.id)
      .single()

    if (friendError) {
      console.error(friendError)
      setIsLoading(false)
      return
    }

    const { data: sessionData, error: sessionError } = await supabase
      .from('play_sessions')
      .select(`
        id,
        played_at,
        duration_minutes,
        vc_used,
        memo,
        games (
          name,
          genre
        )
      `)
      .eq('friend_id', friendId)
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })

    if (sessionError) {
      console.error(sessionError)
      setIsLoading(false)
      return
    }

    setFriend(friendData)
    setSessions(sessionData || [])
    setIsLoading(false)
  }


  const handleDeleteSession = async (sessionId: string) => {
    const confirmed = window.confirm('このセッション記録を削除しますか？')

    if (!confirmed) return

    const { error } = await supabase
      .from('play_sessions')
      .delete()
      .eq('id', sessionId)

    if (error) {
      console.error(error)
      alert('セッション記録の削除に失敗しました')
      return
    }

    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (!friend) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground">フレンドが見つかりませんでした。</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/friends">フレンド一覧へ戻る</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Button asChild variant="ghost" className="gap-2">
        <Link href="/dashboard/friends">
          <ArrowLeft className="w-4 h-4" />
          フレンド一覧へ戻る
        </Link>
      </Button>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={friend.avatar_url || ''} />
              <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{friend.name}</h1>
              <p className="text-sm text-muted-foreground">
                登録日: {new Date(friend.created_at).toLocaleDateString('ja-JP')}
              </p>

              {friend.memo && (
                <div className="flex gap-2 mt-4 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{friend.memo}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">総セッション</p>
                <p className="text-3xl font-bold">{totalSessions}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">総プレイ時間</p>
                <p className="text-3xl font-bold">{totalHours}</p>
                <p className="text-xs text-muted-foreground">時間</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">最終プレイ日</p>
                <p className="text-lg font-bold">
                  {latestSession
                    ? new Date(latestSession.played_at).toLocaleDateString('ja-JP')
                    : '-'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">よく遊ぶゲーム</p>
                <p className="text-lg font-bold">
                  {mostPlayedGame ? mostPlayedGame.name : '-'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mostPlayedGame ? `${mostPlayedGame.count}回` : ''}
                </p>
              </div>
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            よく遊ぶゲーム
          </CardTitle>
          <CardDescription>
            このフレンドと一緒に遊んだゲームのランキングです
          </CardDescription>
        </CardHeader>

        <CardContent>
          {gameRanking.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              まだゲーム記録がありません。
            </p>
          ) : (
            <div className="space-y-3">
              {gameRanking.map((game, index) => (
                <div
                  key={game.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-medium text-sm">{game.name}</p>
                      {game.genre && (
                        <p className="text-xs text-muted-foreground">
                          {game.genre}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sm">{game.count}回</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(game.minutes / 60)}時間
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            最近のセッション履歴
          </CardTitle>
          <CardDescription>
            このフレンドと遊んだ記録を表示します
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              まだセッション記録がありません。
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-6 h-6 text-primary-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {session.games?.name || '不明なゲーム'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.played_at).toLocaleDateString('ja-JP')}
                    </p>

                    {session.memo && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {session.memo}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 space-y-1">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    {session.duration_minutes && (
                      <Badge variant="outline">
                        {session.duration_minutes}分
                      </Badge>
                    )}

                    {session.vc_used && (
                      <Badge variant="secondary">
                        VCあり
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}