'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  BarChart3,
  Trophy,
  Network,
  Gamepad2,
  Clock,
  TrendingUp,
  ArrowRight,
  ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'フレンド分析',
    description: '各フレンドとのゲームセッションの詳細な統計を追跡します。'
  },
  {
    icon: Clock,
    title: 'セッション記録',
    description: 'プレイ時間、ゲーム、メモを含むすべてのゲームセッションを記録します。'
  },
  {
    icon: Trophy,
    title: 'フレンドランキング',
    description: 'プレイ頻度に基づいてトップのゲーム仲間を確認します。'
  },
  {
    icon: Network,
    title: '関係ネットワーク',
    description: '繋がりを可視化し、共通のゲームフレンドを発見します。'
  }
]

const stats = [
  { value: '10K+', label: 'アクティブユーザー' },
  { value: '50K+', label: '記録セッション' },
  { value: '100+', label: '対応ゲーム' },
  { value: '99.9%', label: '稼働率' }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">GameeFriendAnalyzer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-primary border-0">はじめる</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground mb-6">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span>ゲーミングジャーニーを追跡</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
              あなたの{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ゲームフレンドシップ
              </span>
              {' '}を分析
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              セッションを追跡し、ゲーム仲間をランキングし、ソーシャルゲーミングネットワークを可視化。
              誰と一番遊んでいるかを把握し、ゲームフレンドとの繋がりを維持しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gradient-primary border-0 w-full sm:w-auto">
                  無料で始める
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  サインイン
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              ゲームを追跡するために必要なすべて
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              ゲームソーシャルライフを管理し、フレンドとの繋がりを維持するための包括的なツール。
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                パワフルなダッシュボードを手元に
              </h2>
              <p className="text-muted-foreground mb-6 text-pretty">
                ゲームアクティビティの即座のインサイトを取得。トップフレンド、
                最近のセッション、ゲーム統計をすべて一箇所で確認できます。
              </p>
              <ul className="space-y-3">
                {[
                  'リアルタイムフレンドステータス追跡',
                  '詳細なセッション履歴とメモ',
                  'スマートなフレンドレコメンデーション',
                  'いつでもゲームデータをエクスポート'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-block mt-8">
                <Button className="gradient-primary border-0">
                  ダッシュボードを試す
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              {/* Mock Dashboard Preview */}
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Card className="bg-secondary/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-xs text-muted-foreground">総セッション</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">8</div>
                      <div className="text-xs text-muted-foreground">アクティブフレンド</div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-secondary/50 border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">トップフレンド</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['NightWolf_X', 'CyberPhoenix', 'PixelQueen99'].map((name, i) => (
                      <div key={name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                            #{i + 1}
                          </div>
                          <span className="text-sm">{name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{156 - i * 22} ゲーム</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="gradient-primary border-0 overflow-hidden relative">
            <CardContent className="py-12 px-6 md:px-12 text-center relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground text-balance">
                ゲームソーシャルライフをレベルアップする準備はできましたか？
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-pretty">
                すでに何千人ものゲーマーがゲームフレンドシップを追跡しています。
              </p>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  無料アカウントを作成
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">GameeFriendAnalyzer</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">プライバシー</Link>
              <Link href="#" className="hover:text-foreground transition-colors">利用規約</Link>
              <Link href="#" className="hover:text-foreground transition-colors">サポート</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().getFullYear()} GameeFriendAnalyzer
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
