'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Search,
  Eye,
  Trash2,
  Plus,
  MessageSquare,
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

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setIsLoading(false)
      return
    }

    setFriends(data || [])
    setIsLoading(false)
  }

  const handleDelete = async (friendId: string) => {
    const confirmed = window.confirm('このフレンドを削除しますか？\n関連するセッション履歴も削除されます。')

    if (!confirmed) return

    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', friendId)

    if (error) {
      console.error(error)
      return
    }

    setFriends((prev) => prev.filter((friend) => friend.id !== friendId))
  }

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">フレンド一覧</h1>
          <p className="text-muted-foreground">ゲームフレンドを管理する</p>
        </div>

        <Button asChild className="gradient-primary border-0">
          <Link href="/dashboard/friends/new">
            <Plus className="w-4 h-4 mr-2" />
            フレンド追加
          </Link>
        </Button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="フレンドを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={friend.avatar_url || ''} />
                      <AvatarFallback>
                        {friend.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {friend.name}
                      </h3>

                      <p className="text-xs text-muted-foreground mt-1">
                        登録日: {new Date(friend.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>

                  {friend.memo && (
                    <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">{friend.memo}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/dashboard/friends/${friend.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        詳細
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(friend.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFriends.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                条件に一致するフレンドが見つかりませんでした。
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}