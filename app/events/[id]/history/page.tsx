"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2, History, LinkIcon, Clock, Eye, Copy, Check, Mail, MessageCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow, format } from "date-fns"

export default function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await api.events.getHistory(id)
        setHistory(data)
      } catch (error) {
        console.error("Failed to load history", error)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [id])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-medium">Share History</h2>
        <p className="text-sm text-muted-foreground">Track all shared links and their status.</p>
      </div>

      {history.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No history yet</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              When you share photos or albums, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => {
            const isExpired = new Date(item.expiresAt) < new Date()
            
            return (
              <Card key={item.id}>
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <LinkIcon className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium truncate">
                        {item.type === 'project' ? (item.projectName || 'Project') : 'Photos'}
                      </h3>
                      <StatusBadge status={item.status} isExpired={isExpired} />
                      <span className="text-xs text-muted-foreground ml-auto md:ml-0">
                        Created {formatDistanceToNow(new Date(item.createdAt))} ago
                      </span>
                    </div>
                    
                    {/* Customer Details */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      {item.email && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="font-medium">{item.email}</span>
                        </div>
                      )}
                      {item.method && (
                        <div className="flex items-center gap-1 text-sm">
                          {item.method === 'whatsapp' ? (
                            <MessageCircle className="h-3 w-3 text-green-600" />
                          ) : (
                            <Mail className="h-3 w-3 text-blue-600" />
                          )}
                          <span className="text-muted-foreground capitalize">{item.method}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">{item.details}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {isExpired 
                          ? `Expired on ${format(new Date(item.expiresAt), "MMM d, yyyy")}`
                          : `Expires in ${formatDistanceToNow(new Date(item.expiresAt))}`
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views || 0} views
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-muted rounded-md px-3 py-2 text-xs font-mono text-muted-foreground max-w-[200px] truncate hidden md:block">
                      {item.link}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(item.link, item.id)}
                      title="Copy Link"
                    >
                      {copiedId === item.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status, isExpired }: { status: string, isExpired: boolean }) {
  if (isExpired) {
    return <Badge variant="destructive">Expired</Badge>
  }
  if (status === "active") {
    return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
  }
  return <Badge variant="outline">{status}</Badge>
}
