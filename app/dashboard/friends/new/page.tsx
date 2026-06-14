'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Users,
  Save,
  CheckCircle,
} from 'lucide-react'

export default function NewFriendPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('ログイン情報を取得できませんでした')
      setIsLoading(false)
      return
    }

    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: user.id,
        name,
        memo,
      })

    if (error) {
      console.error(error)

      setError('フレンド登録に失敗しました')
      setIsLoading(false)
      return
    }

    setShowSuccess(true)
    setIsLoading(false)

    setTimeout(() => {
      router.push('/dashboard/friends')
    }, 1500)
  }

  if (showSuccess) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>

            <h2 className="text-xl font-bold mb-2">
              フレンドを登録しました！
            </h2>

            <p className="text-muted-foreground">
              フレンド一覧へ移動します
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          フレンド追加
        </h1>

        <p className="text-muted-foreground">
          新しいゲームフレンドを登録します
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            フレンド情報
          </CardTitle>

          <CardDescription>
            フレンド名とメモを入力してください
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                フレンド名
              </Label>

              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: Taro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memo">
                メモ（任意）
              </Label>

              <Textarea
                id="memo"
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="よく遊ぶゲームや特徴など"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full gradient-primary border-0"
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? (
                '登録中...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  フレンドを登録
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}