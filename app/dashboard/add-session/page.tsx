'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Gamepad2, 
  Calendar, 
  Clock,
  Mic,
  Save,
  CheckCircle
} from 'lucide-react'

export default function AddSessionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [formData, setFormData] = useState({
    friendId: '',
    gameId: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    voiceChat: false,
    notes: ''
  })

useEffect(() => {
  fetchMasterData()
}, [])

const fetchMasterData = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: friendsData } = await supabase
    .from('friends')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  const { data: gamesData } = await supabase
    .from('games')
    .select('*')
    .order('name')

  setFriends(friendsData || [])
  setGames(gamesData || [])
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  setIsLoading(true)

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    setIsLoading(false)
    return
  }

  const { error } = await supabase
    .from('play_sessions')
    .insert({
      user_id: user.id,
      friend_id: formData.friendId,
      game_id: formData.gameId,
      played_at: formData.date,
      duration_minutes: Number(formData.duration),
      vc_used: formData.voiceChat,
      memo: formData.notes,
    })

  if (error) {
    console.error(error)
    setIsLoading(false)
    return
  }

  setIsLoading(false)
  setShowSuccess(true)

  setTimeout(() => {
    router.push('/dashboard')
  }, 1500)
}

  if (showSuccess) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="bg-card/50 border-border/50 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">セッションを保存しました！</h2>
            <p className="text-muted-foreground">ゲームセッションが正常に記録されました。</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">プレイ記録追加</h1>
        <p className="text-muted-foreground">フレンドとの新しいゲームセッションを記録</p>
      </div>

      <Card className="bg-card/50 border-border/50 max-w-2xl">
        <CardHeader>
          <CardTitle>セッション詳細</CardTitle>
          <CardDescription>ゲームセッションの詳細を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Friend Selection */}
            <div className="space-y-2">
              <Label htmlFor="friend" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                フレンド
              </Label>
              <Select 
                value={formData.friendId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, friendId: value }))}
              >
                <SelectTrigger id="friend">
                  <SelectValue placeholder="フレンドを選択" />
                </SelectTrigger>
                <SelectContent>
                  {friends.map((friend) => (
                    <SelectItem key={friend.id} value={friend.id}>
                      {friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Selection */}
            <div className="space-y-2">
              <Label htmlFor="game" className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                ゲーム
              </Label>
              <Select 
                value={formData.gameId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, gameId: value }))}
              >
                <SelectTrigger id="game">
                  <SelectValue placeholder="ゲームを選択" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem
                      key={game.id}
                      value={game.id}
                    >
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Duration */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  日付
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  プレイ時間（分）
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="例: 120"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            {/* Voice Chat Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="voiceChat" className="cursor-pointer">ボイスチャット使用</Label>
                  <p className="text-xs text-muted-foreground">このセッションでボイスチャットを使用しましたか？</p>
                </div>
              </div>
              <Switch
                id="voiceChat"
                checked={formData.voiceChat}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, voiceChat: checked }))}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">メモ（任意）</Label>
              <Textarea
                id="notes"
                placeholder="このセッションで印象的だった瞬間やメモ..."
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full gradient-primary border-0"
              disabled={isLoading || !formData.friendId || !formData.gameId || !formData.duration}
            >
              {isLoading ? (
                '保存中...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  セッションを保存
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
