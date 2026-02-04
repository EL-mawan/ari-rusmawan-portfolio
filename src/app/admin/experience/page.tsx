"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  location?: string
  responsibilities?: string[]
  createdAt: string
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    location: '',
    responsibilities: ''
  })
  
  const { toast } = useToast()

  useEffect(() => { fetchExperiences() }, [])

  useEffect(() => {
    let filtered = experiences
    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredExperiences(filtered)
  }, [experiences, searchTerm])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience')
      const data = await response.json()
      if (data.success) setExperiences(data.data || [])
    } catch (error) {
      toast({ title: "Error", description: 'Gagal mengambil riwayat', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const responsibilities = formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, responsibilities }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil dibuat' })
        setIsCreateModalOpen(false)
        resetForm()
        fetchExperiences()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExperience) return
    try {
      const responsibilities = formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
      const response = await fetch(`/api/experience/${editingExperience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, responsibilities }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil diperbarui' })
        setIsEditModalOpen(false)
        fetchExperiences()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteExperience = async (expId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ini?')) return
    try {
      const response = await fetch(`/api/experience/${expId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil dihapus' })
        fetchExperiences()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp)
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate.split('T')[0],
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      location: exp.location || '',
      responsibilities: exp.responsibilities?.join('\n') || ''
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ company: '', position: '', startDate: '', endDate: '', location: '', responsibilities: '' })
  }

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
          EXPERIENCE PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter uppercase">CAREER LOG</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">Milestones</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">{experiences.length}</h2>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-indigo-50 text-indigo-600 h-14 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 px-6">
                <Plus className="w-5 h-5 mr-3" /> ADD NEW
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Experience Mapping</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Maintain your professional journey and achievements.</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] h-14 px-10 shadow-[0_20px_40px_rgba(79,70,229,0.3)] shadow-indigo-100 uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">
                <Briefcase className="w-5 h-5 mr-3" /> Insert Career Milestone
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Search & Meta - Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2">
                <CardContent className="p-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input placeholder="Query experience matrix..." className="border-none focus:ring-0 text-sm font-bold h-12 w-full bg-transparent placeholder:text-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2 hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="w-12 h-12 rounded-[20px] bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 shadow-inner"><TrendingUp className="w-6 h-6" /></div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Career Velocity: Stable</span>
                    </div>
                    <div className="flex -space-x-3 pr-4">
                        {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow-sm"></div>)}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Experience Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredExperiences.map((exp) => (
            <Card key={exp.id} className="rounded-[48px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] bg-white hover:scale-[1.02] active:scale-[0.99] transition-all group overflow-hidden p-2 cursor-pointer">
              <CardContent className="p-10 flex flex-col h-full relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="flex items-start gap-6 relative mb-10">
                   <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <Briefcase className="w-10 h-10" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase truncate leading-none">{exp.position}</h3>
                      <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mt-3 bg-indigo-50 px-3 py-1 rounded-lg inline-block">{exp.company}</p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-50 pb-8 relative">
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl shadow-xs">
                        <Calendar className="w-4 h-4 text-indigo-300" />
                        <span>{new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'PRESENT'}</span>
                    </div>
                    {exp.location && (
                        <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl shadow-xs">
                            <MapPin className="w-4 h-4 text-indigo-300" />
                            <span>{exp.location}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4 mb-10 relative">
                   {exp.responsibilities && exp.responsibilities.length > 0 ? (
                      <ul className="space-y-4">
                        {exp.responsibilities.slice(0, 3).map((resp, idx) => (
                           <li key={idx} className="flex items-start gap-4 text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span className="line-clamp-2">{resp}</span>
                           </li>
                        ))}
                      </ul>
                   ) : (
                      <p className="text-xs font-bold text-slate-300 italic uppercase">No detailed narrative provided.</p>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto relative pt-4 border-t border-slate-50">
                    <Button variant="outline" className="rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest border-slate-100 hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openEditModal(exp)}>
                        <Edit className="w-4 h-4 mr-2" /> RECONFIGURE
                    </Button>
                    <Button variant="outline" className="rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest border-slate-100 text-red-300 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer" onClick={() => handleDeleteExperience(exp.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> DISCARD
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <Briefcase className="w-12 h-12 text-slate-200" />
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Milestone Archive Empty</p>
          </div>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl rounded-[48px] border-none shadow-2xl p-10 overflow-hidden bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">DEPLOY CAREER NODE</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateExperience} className="space-y-6 pt-8">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Organization Identity</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Title Designation</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
                        </div>
                    </div>
                    {/* ... more fields ... */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-16 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 text-white cursor-pointer active:scale-95 transition-all">INITIALIZE NODE</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl h-16 px-10 font-bold border-slate-100 uppercase text-[10px] tracking-widest cursor-pointer hover:bg-slate-50 transition-all">DISMISS</Button>
                    </div>
                </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
