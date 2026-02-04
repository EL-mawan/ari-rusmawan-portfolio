"use client"

import { useState, useEffect } from 'react'
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Reply,
  Search,
  Download,
  Calendar,
  ArrowLeft,
  ChevronDown,
  ArrowDownLeft,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
        fetchMessages()
      }
    } catch (error) {
      console.error(error)
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
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return
    setIsReplying(true)
    try {
      const response = await fetch(`/api/messages/${selectedMessage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true, answeredBy: 'admin' }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Balasan berhasil dikirim' })
        setReplyText('')
        setSelectedMessage(null)
        fetchMessages()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsReplying(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'],
      ...filteredMessages.map(msg => [msg.name, msg.email, msg.subject || '', msg.message.replace(/"/g, '""'), new Date(msg.createdAt).toLocaleDateString(), msg.isRead ? 'Read' : 'Unread'])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'messages.csv'; a.click();
    window.URL.revokeObjectURL(url)
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 lg:pb-12">
      {/* Premium Header (Mobile Only) */}
      <div className="lg:hidden relative h-48 w-full bg-linear-to-br from-[#536dfe] via-[#3d5afe] to-[#304ffe] rounded-b-[40px] px-6 pt-10 text-white overflow-hidden shadow-2xl mb-6">
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl bg-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Inbox Messages</h1>
        </div>
        <div className="mt-6 relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest leading-none">Unread</p>
            <h2 className="text-3xl font-black mt-1">{unreadCount}</h2>
          </div>
          <Button onClick={handleExportCSV} className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl h-11 px-5 shadow-lg">
            <Download className="w-5 h-5 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pesan Pengunjung</h1>
            <p className="text-slate-500 mt-1">Interaksi langsung dari portofolio Anda.</p>
          </div>
          <Button variant="outline" onClick={handleExportCSV} className="rounded-xl h-12 px-6 font-bold border-slate-100 bg-white shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Ekspor CSV
          </Button>
        </div>

        {/* Filter Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="rounded-[24px] border-none shadow-xl shadow-slate-200/40 bg-white">
                <CardContent className="p-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <Input placeholder="Search messages or senders..." className="border-none focus:ring-0 text-sm font-medium h-10 w-full bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>
            <Card className="rounded-[24px] border-none shadow-xl shadow-slate-200/40 bg-white hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600"><Mail className="w-5 h-5" /></div>
                        <span className="text-sm font-bold">Unread Only</span>
                    </div>
                    <Button variant={showUnreadOnly ? "default" : "outline"} className={cn("rounded-xl h-10 px-4 font-bold border-slate-100", showUnreadOnly ? "bg-indigo-600 text-white" : "text-slate-400")} onClick={() => setShowUnreadOnly(!showUnreadOnly)}>
                        {showUnreadOnly ? 'ON' : 'OFF'}
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Messages List - Banking Style (Recent Transactions style) */}
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <Card 
              key={msg.id} 
              className={cn(
                "rounded-[28px] border-none shadow-xl shadow-slate-200/40 hover:scale-[1.01] transition-all cursor-pointer bg-white group",
                !msg.isRead && "ring-2 ring-indigo-500/20"
              )}
              onClick={() => {
                setSelectedMessage(msg)
                if (!msg.isRead) handleMarkAsRead(msg.id)
              }}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                    msg.isRead ? "bg-slate-50 text-slate-400" : "bg-indigo-50 text-indigo-600"
                )}>
                  <ArrowDownLeft className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900 truncate">{msg.name}</h4>
                    {!msg.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {msg.subject || 'No Subject'} • {new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className={cn("text-xs font-black", msg.isRead ? "text-slate-400" : "text-green-500")}>{msg.isRead ? 'READ' : '+1 NEW'}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase">Incoming</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-200 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                 <MessageSquare className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No messages found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white">
          {selectedMessage && (
            <div className="flex flex-col">
                <div className="bg-slate-50 p-8 border-b border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white"><ArrowDownLeft className="w-6 h-6" /></div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 leading-none">{selectedMessage.name}</h2>
                            <p className="text-xs font-bold text-slate-400 mt-1">{selectedMessage.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-300 uppercase">Subject</p>
                            <p className="text-xs font-bold text-slate-700 truncate">{selectedMessage.subject || 'N/A'}</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-300 uppercase">Received</p>
                            <p className="text-xs font-bold text-slate-700">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Message Content</p>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed font-medium">
                            {selectedMessage.message}
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        <Label className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-1">Reply Message</Label>
                        <Textarea placeholder="Write your reply..." className="rounded-2xl border-slate-100 focus:ring-indigo-500 h-32 bg-slate-50/50" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-indigo-600 rounded-2xl h-12 font-bold shadow-lg shadow-indigo-100" onClick={handleReply} disabled={!replyText.trim() || isReplying}>
                            {isReplying ? 'Sending...' : 'Send Reply'}
                        </Button>
                        <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold border-slate-100" onClick={() => setSelectedMessage(null)}>Close</Button>
                    </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}