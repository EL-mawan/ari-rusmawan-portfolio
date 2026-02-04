"use client"

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Trash2, 
  Download, 
  ArrowLeft,
  ArrowDownLeft,
  MessageSquare,
  Search,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
      toast({ title: "Error", description: 'Gagal mengambil pesan', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      fetchMessages()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return
    try {
      const response = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Pesan berhasil dihapus' })
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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12 text-slate-900">
      {/* 
          MESSAGES PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter uppercase">MESSAGE STREAM</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">New Inquiries</p>
            <h2 className="text-4xl font-black mt-1.5 tracking-tighter">{unreadCount}</h2>
          </div>
          <Button onClick={handleExportCSV} className="bg-white hover:bg-indigo-50 text-indigo-600 h-14 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 px-6">
            <Download className="w-5 h-5 mr-3" /> EXPORT
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Inbox Repository</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Manage interactions from your global visitors.</p>
          </div>
          <Button variant="outline" onClick={handleExportCSV} className="rounded-[24px] h-14 px-10 border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
            <Download className="w-5 h-5" /> Export Data Matrix
          </Button>
        </div>

        {/* Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2">
                <CardContent className="p-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input placeholder="Find messages by keyword or sender identity..." className="border-none focus:ring-0 text-sm font-bold h-12 w-full bg-transparent placeholder:text-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2 hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-4 text-slate-900">
                        <div className="w-12 h-12 rounded-[20px] bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-inner"><Mail className="w-6 h-6" /></div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Filter Status: Unread Only</span>
                    </div>
                    <Button variant={showUnreadOnly ? "default" : "outline"} className={cn("rounded-[20px] h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all", showUnreadOnly ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" : "text-slate-300 border-slate-100")} onClick={() => setShowUnreadOnly(!showUnreadOnly)}>
                        {showUnreadOnly ? 'ACTIVE' : 'INACTIVE'}
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Message Stream */}
        <div className="space-y-6">
          {filteredMessages.map((msg) => (
            <Card 
              key={msg.id} 
              className={cn(
                "rounded-[40px] border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.04)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer bg-white group p-1",
                !msg.isRead && "ring-4 ring-indigo-500/10 shadow-indigo-100/50"
              )}
              onClick={() => {
                setSelectedMessage(msg)
                if (!msg.isRead) handleMarkAsRead(msg.id)
              }}
            >
              <CardContent className="p-6 flex items-center gap-6">
                <div className={cn(
                    "w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 transition-all duration-700 shadow-inner group-hover:scale-110",
                    msg.isRead ? "bg-slate-50 text-slate-300 border border-slate-100" : "bg-indigo-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)]"
                )}>
                  <ArrowDownLeft className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-base font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{msg.name}</h4>
                    {!msg.isRead && <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border-4 border-white shadow-xl"></div>}
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                    {msg.subject || 'Standard Inquiry'} • {new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right hidden sm:block pr-4">
                  <p className={cn("text-xs font-black uppercase tracking-widest", msg.isRead ? "text-slate-300" : "text-green-500")}>{msg.isRead ? 'PROCESSED' : 'INCOMING'}</p>
                  <p className="text-[10px] font-black text-slate-200 mt-1 uppercase tracking-tighter">Reference ID: {msg.id.slice(0, 8)}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <MessageSquare className="w-12 h-12 text-slate-200" />
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Inquiry Stream Empty</p>
          </div>
        )}
      </div>

      {/* Premium Detail Drawer / Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl rounded-[48px] border-none shadow-[0_50px_100px_rgba(0,0,0,0.2)] p-0 overflow-hidden bg-white">
          {selectedMessage && (
            <div className="flex flex-col">
                <div className="bg-slate-50/50 p-10 border-b border-slate-100 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-6 mb-8 relative">
                        <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl overflow-hidden shadow-indigo-200">
                             <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent"></div>
                             <ArrowDownLeft className="w-10 h-10 stroke-[2.5]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedMessage.name}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm inline-block">{selectedMessage.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative">
                        <div className="p-4 bg-white rounded-[24px] border border-slate-50 shadow-xl shadow-slate-200/20">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Subject Intent</p>
                            <p className="text-xs font-black text-slate-700 truncate uppercase tracking-tight">{selectedMessage.subject || 'General Inquiry'}</p>
                        </div>
                        <div className="p-4 bg-white rounded-[24px] border border-slate-50 shadow-xl shadow-slate-200/20">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1.5">Timestamp</p>
                            <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{new Date(selectedMessage.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 space-y-10">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Transmission Data</p>
                            <span className="text-[9px] font-black text-indigo-300 uppercase">Secure Message Vault</span>
                        </div>
                        <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed shadow-inner">
                            {selectedMessage.message}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Craft Reply Statement</Label>
                             <div className="flex items-center gap-2">
                                <Settings className="w-3 h-3 text-slate-300" />
                                <span className="text-[9px] font-black text-slate-300 uppercase">AI Polish: OFF</span>
                             </div>
                        </div>
                        <Textarea placeholder="Type your professional response matrix..." className="rounded-[32px] border-slate-100 focus:ring-indigo-600 h-40 bg-slate-50/30 p-6 font-medium text-slate-700 placeholder:text-slate-300" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white rounded-[24px] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200 transition-all" onClick={handleReply} disabled={!replyText.trim() || isReplying}>
                            {isReplying ? 'Transmitting...' : 'EXECUTE RESPONSE'}
                        </Button>
                        <Button variant="outline" className="rounded-[24px] h-16 px-10 font-black uppercase text-[10px] tracking-widest border-slate-100 hover:bg-slate-50 transition-all text-slate-400" onClick={() => setSelectedMessage(null)}>DISMISS</Button>
                    </div>
                </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}