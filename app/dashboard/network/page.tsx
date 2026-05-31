'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Network,
  Users,
  Gamepad2,
  Info
} from 'lucide-react'
import { friends } from '@/lib/mock-data'
import Link from 'next/link'

// Network visualization component
function NetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = rect.width
    const height = rect.height
    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw connections
    const radius = Math.min(width, height) * 0.35
    const nodeRadius = 20
    const numFriends = Math.min(friends.length, 8)

    // Draw center node (user)
    ctx.beginPath()
    ctx.arc(centerX, centerY, nodeRadius + 5, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nodeRadius + 5)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)')
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.6)')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw "You" text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('You', centerX, centerY)

    // Draw friend nodes and connections
    friends.slice(0, numFriends).forEach((friend, index) => {
      const angle = (index / numFriends) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      const lineOpacity = 0.2 + (friend.playCount / 200) * 0.5
      ctx.strokeStyle = `rgba(139, 92, 246, ${lineOpacity})`
      ctx.lineWidth = 1 + (friend.playCount / 50)
      ctx.stroke()

      // Draw friend node
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
      ctx.fillStyle = friend.status === 'online' ? 'rgba(34, 197, 94, 0.8)' : 
                      friend.status === 'in-game' ? 'rgba(139, 92, 246, 0.8)' : 
                      'rgba(100, 116, 139, 0.6)'
      ctx.fill()

      // Draw friend initial
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(friend.name.slice(0, 2).toUpperCase(), x, y)
    })

    // Draw some friend-to-friend connections
    for (let i = 0; i < numFriends; i++) {
      const j = (i + 2) % numFriends
      if (Math.random() > 0.5) {
        const angle1 = (i / numFriends) * Math.PI * 2 - Math.PI / 2
        const angle2 = (j / numFriends) * Math.PI * 2 - Math.PI / 2
        const x1 = centerX + Math.cos(angle1) * radius
        const y1 = centerY + Math.sin(angle1) * radius
        const x2 = centerX + Math.cos(angle2) * radius
        const y2 = centerY + Math.sin(angle2) * radius

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-[400px]"
      style={{ display: 'block' }}
    />
  )
}

export default function NetworkPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Network View</h1>
        <p className="text-muted-foreground">Visualize your gaming friend relationships</p>
      </div>

      {/* Network Visualization */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Friend Network
          </CardTitle>
          <CardDescription>
            The size and opacity of connections represent how often you play together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkVisualization />
        </CardContent>
      </Card>

      {/* Network Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friends.length}</p>
                <p className="text-sm text-muted-foreground">Total Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {friends.filter(f => f.status === 'online' || f.status === 'in-game').length}
                </p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Mutual Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend and Friend List */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Legend */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm">Online</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-sm">In Game</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-muted-foreground" />
              <span className="text-sm">Offline</span>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <div className="w-8 h-1 bg-primary/60 rounded" />
              <span className="text-sm text-muted-foreground">Strong connection</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-primary/30 rounded" />
              <span className="text-sm text-muted-foreground">Weak connection</span>
            </div>
          </CardContent>
        </Card>

        {/* Friend List */}
        <Card className="bg-card/50 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Network Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {friends.map((friend) => (
                <Link
                  key={friend.id}
                  href={`/dashboard/friends/${friend.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card
                      ${friend.status === 'online' ? 'bg-green-500' : ''}
                      ${friend.status === 'in-game' ? 'bg-primary' : ''}
                      ${friend.status === 'offline' ? 'bg-muted-foreground' : ''}
                    `} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.playCount} sessions</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {friend.status === 'online' ? 'Online' : friend.status === 'in-game' ? 'Playing' : 'Offline'}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
