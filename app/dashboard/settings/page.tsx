'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Camera
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    friendOnline: true,
    sessionReminders: true,
    weeklyReport: false,
    inactiveAlerts: true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-muted-foreground">アカウントと設定を管理</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Settings */}
        <Card className="bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              プロフィール設定
            </CardTitle>
            <CardDescription>個人情報を更新</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=user" />
                  <AvatarFallback>GU</AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold">プロフィール画像</h3>
                <p className="text-sm text-muted-foreground">JPG、PNGまたはGIF。最大2MB。</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nickname">ニックネーム</Label>
                <Input id="nickname" defaultValue="ゲーマーユーザー" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" defaultValue="gamer@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Input id="bio" placeholder="あなたについて教えてください..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favoriteGame">お気に入りゲーム</Label>
              <Select defaultValue="valorant">
                <SelectTrigger id="favoriteGame">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valorant">Valorant</SelectItem>
                  <SelectItem value="lol">League of Legends</SelectItem>
                  <SelectItem value="apex">Apex Legends</SelectItem>
                  <SelectItem value="fortnite">Fortnite</SelectItem>
                  <SelectItem value="minecraft">Minecraft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="gradient-primary border-0">
              <Save className="w-4 h-4 mr-2" />
              変更を保存
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              外観
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>テーマ</Label>
              <Select defaultValue="dark">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">ダーク</SelectItem>
                  <SelectItem value="light">ライト</SelectItem>
                  <SelectItem value="system">システム</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>アクセントカラー</Label>
              <div className="flex gap-2">
                {['bg-purple-500', 'bg-blue-500', 'bg-cyan-500', 'bg-green-500', 'bg-pink-500'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full ${color} ring-2 ring-offset-2 ring-offset-background ${color === 'bg-purple-500' ? 'ring-primary' : 'ring-transparent'} hover:ring-primary transition-all`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              通知
            </CardTitle>
            <CardDescription>通知の受信方法を設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">フレンドオンライン通知</p>
                <p className="text-sm text-muted-foreground">フレンドがオンラインになったときに通知</p>
              </div>
              <Switch 
                checked={notifications.friendOnline}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, friendOnline: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">セッションリマインダー</p>
                <p className="text-sm text-muted-foreground">ゲーム後にセッションを記録するようリマインド</p>
              </div>
              <Switch 
                checked={notifications.sessionReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sessionReminders: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">週間レポート</p>
                <p className="text-sm text-muted-foreground">週間ゲームアクティビティサマリーを受信</p>
              </div>
              <Switch 
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div>
                <p className="font-medium">非アクティブフレンド通知</p>
                <p className="text-sm text-muted-foreground">フレンドが非アクティブのときに通知</p>
              </div>
              <Switch 
                checked={notifications.inactiveAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, inactiveAlerts: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              セキュリティ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              パスワード変更
            </Button>
            <Button variant="outline" className="w-full justify-start">
              二要素認証
            </Button>
            <Button variant="outline" className="w-full justify-start">
              連携アカウント
            </Button>
            <div className="pt-4 border-t border-border">
              <Button variant="destructive" className="w-full">
                アカウント削除
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
