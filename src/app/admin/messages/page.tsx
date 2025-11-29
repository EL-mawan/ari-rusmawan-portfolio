"use client"

import { useState, useEffect } from 'react'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Reply,
  Search,
  Filter,
  Download,
  Calendar,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  answeredBy?: string
  createdAt: string
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (showUnreadOnly) {
      filtered = filtered.filter(message => !message.isRead)
    }

    setFilteredMessages(filtered)
  }, [messages, searchTerm, showUnreadOnly])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact')
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Gagal mengambil pesan',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Pesan ditandai sebagai dibaca',
        })
        fetchMessages()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal memperbarui pesan',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'An unexpected error occurred',
        variant: "destructive"
      })
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Pesan berhasil dihapus',
        })
        fetchMessages()
        setSelectedMessage(null)
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal menghapus pesan',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'An unexpected error occurred',
        variant: "destructive"
      })
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    setIsReplying(true)

    try {
      // In a real implementation, you would send an email here
      // For now, we'll just mark the message as answered
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isRead: true,
          answeredBy: 'admin' // In real app, use actual admin ID
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Balasan berhasil dikirim',
        })
        setReplyText('')
        setSelectedMessage(null)
        fetchMessages()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal mengirim balasan',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Terjadi kesalahan yang tidak terduga',
        variant: "destructive"
      })
    } finally {
      setIsReplying(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'],
      ...filteredMessages.map(msg => [
        msg.name,
        msg.email,
        msg.subject || '',
        msg.message.replace(/"/g, '""'), // Escape quotes
        new Date(msg.createdAt).toLocaleDateString(),
        msg.isRead ? 'Read' : 'Unread'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Berhasil",
      description: 'Pesan berhasil diekspor',
    })
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Pesan</h1>
            <p className="text-muted-foreground">
              {unreadCount} pesan belum dibaca
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Ekspor CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari pesan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showUnreadOnly ? "default" : "outline"}
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Hanya Belum Dibaca
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="grid gap-4">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                !message.isRead ? 'border-primary' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message)
                if (!message.isRead) {
                  handleMarkAsRead(message.id)
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold truncate">{message.name}</h3>
                      {!message.isRead && (
                        <Badge variant="default" className="text-xs">Baru</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                    
                    {message.subject && (
                      <p className="text-sm font-medium mb-2">{message.subject}</p>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                      {message.answeredBy && (
                        <div className="flex items-center gap-1">
                          <Reply className="w-3 h-3" />
                          Dijawab
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMessage(message.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || showUnreadOnly 
                  ? 'Tidak ada pesan yang cocok dengan kriteria Anda' 
                  : 'Belum ada pesan'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Message Detail Modal */}
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedMessage && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Detail Pesan
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Message Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Dari</p>
                      <p className="text-sm">{selectedMessage.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedMessage.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tanggal</p>
                      <p className="text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMessage.isRead ? 'Dibaca' : 'Belum Dibaca'}
                      </p>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div>
                      <p className="text-sm font-medium mb-2">Subjek</p>
                      <p className="text-sm">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Pesan</p>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div>
                    <p className="text-sm font-medium mb-2">Balas</p>
                    <Textarea
                      placeholder="Ketik balasan Anda di sini..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={handleReply}
                        disabled={!replyText.trim() || isReplying}
                      >
                        {isReplying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Reply className="w-4 h-4 mr-2" />
                            Kirim Balasan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}