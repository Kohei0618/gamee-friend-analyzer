'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import {
  Gamepad2,
  Clock,
  Calendar,
  User,
  Plus,
} from 'lucide-react'

type Session = {
  id: string
  played_at: string
  duration_minutes: number | null
  vc_used: boolean
  memo: string | null
  friends: {
    id: string
    name: string
  } | null
  games: {
    id: string
    name: string
    genre: string | null
  } | null
}

export default function SessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSessions = async () => {
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/login')
      return
    }

    const { data, error } = await supabase
      .from('play_sessions')
      .select(`
        id,
        played_at,
        duration_minutes,
        vc_used,
        memo,
        friends (
          id,
          name
        ),
        games (
          id,
          name,
          genre
        )
      `)
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })

    if (error) {
      console.error(error)
      setIsLoading(false)
      return
    }

    setSessions((data || []) as Session[])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">セッション一覧</h1>
          <p className="text-muted-foreground">
            これまでに記録したプレイ履歴を確認できます。
          </p>
        </div>

        <Button asChild className="gap-2 gradient-primary border-0">
          <Link href="/dashboard/add-session">
            <Plus className="w-4 h-4" />
            セッション記録
          </Link>
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              まだセッション記録がありません。
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gamepad2 className="w-5 h-5 text-primary" />
                      {session.games?.name || '不明なゲーム'}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {session.friends ? (
                        <Link
                          href={`/dashboard/friends/${session.friends.id}`}
                          className="text-primary hover:underline"
                        >
                          {session.friends.name}
                        </Link>
                      ) : (
                        '不明なフレンド'
                      )}
                      とプレイ
                    </CardDescription>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {session.duration_minutes !== null && (
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
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(session.played_at).toLocaleDateString('ja-JP')}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {session.duration_minutes ?? 0}分
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {session.friends?.name || '不明なフレンド'}
                  </div>
                </div>

                {session.memo && (
                  <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                    {session.memo}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}