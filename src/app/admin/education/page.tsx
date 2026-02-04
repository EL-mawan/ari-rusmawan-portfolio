"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  GraduationCap,
  Calendar,
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

interface Education {
  id: string
  school: string
  degree: string
  major?: string
  startYear: number
  endYear: number
  description?: string
  createdAt: string
}

export default function AdminEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [filteredEducation, setFilteredEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    major: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    description: ''
  })
  
  const { toast } = useToast()

  useEffect(() => { fetchEducation() }, [])

  useEffect(() => {
    let filtered = education
    if (searchTerm) {
      filtered = filtered.filter(edu =>
        edu.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        edu.major?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    setFilteredEducation(filtered)
  }, [education, searchTerm])

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/education')
      const data = await response.json()
      if (data.success) setEducation(data.data || [])
    } catch (error) {
      toast({ title: "Error", description: 'Gagal mengambil riwayat', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil dibuat' })
        setIsCreateModalOpen(false)
        resetForm()
        fetchEducation()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEducation) return
    try {
      const response = await fetch(`/api/education/${editingEducation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil diperbarui' })
        setIsEditModalOpen(false)
        fetchEducation()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteEducation = async (eduId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ini?')) return
    try {
      const response = await fetch(`/api/education/${eduId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Riwayat berhasil dihapus' })
        fetchEducation()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openEditModal = (edu: Education) => {
    setEditingEducation(edu)
    setFormData({
      school: edu.school,
      degree: edu.degree,
      major: edu.major || '',
      startYear: edu.startYear,
      endYear: edu.endYear,
      description: edu.description || ''
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ school: '', degree: '', major: '', startYear: new Date().getFullYear(), endYear: new Date().getFullYear(), description: '' })
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
          EDUCATION PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter uppercase">ACADEMIC LOG</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">Degrees</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">{education.length}</h2>
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
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Education Mapping</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Curate your academic background and certifications.</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] h-14 px-10 shadow-[0_20px_40px_rgba(79,70,229,0.3)] shadow-indigo-100 uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">
                <GraduationCap className="w-5 h-5 mr-3" /> Insert Education Node
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Search & Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2">
                <CardContent className="p-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input placeholder="Query academic matrix..." className="border-none focus:ring-0 text-sm font-bold h-12 w-full bg-transparent placeholder:text-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2 hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-4 text-slate-900">
                        <div className="w-12 h-12 rounded-[20px] bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-inner"><GraduationCap className="w-6 h-6" /></div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Status: Fully Synchronized</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-xl shadow-slate-200/40 border border-slate-50 flex items-center justify-center text-slate-400 cursor-pointer">
                        <Settings className="w-5 h-5" />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Education List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEducation.map((edu) => (
            <Card key={edu.id} className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] hover:scale-[1.02] active:scale-[0.99] transition-all bg-white p-2 group cursor-pointer">
              <CardContent className="p-8 flex flex-col h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                
                <div className="flex items-start gap-6 relative mb-8">
                   <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <GraduationCap className="w-10 h-10" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase truncate leading-none">{edu.degree}</h3>
                      <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mt-3 bg-indigo-50 px-3 py-1 rounded-lg inline-block">{edu.school}</p>
                   </div>
                </div>

                <div className="space-y-2 mb-6 relative">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span> 
                        {edu.major || 'General Studies'}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50/50 px-3 py-1.5 rounded-xl border border-slate-50 w-fit">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{edu.startYear} — {edu.endYear}</span>
                    </div>
                </div>

                {edu.description && (
                    <div className="p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter shadow-inner mb-8 relative">
                        {edu.description}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-auto relative pt-4 border-t border-slate-50">
                    <Button variant="outline" className="rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest border-slate-100 hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openEditModal(edu)}>
                        <Edit className="w-4 h-4 mr-2" /> RECONFIGURE
                    </Button>
                    <Button variant="outline" className="rounded-[20px] h-14 font-black uppercase text-[10px] tracking-widest border-slate-100 text-red-300 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer" onClick={() => handleDeleteEducation(edu.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> DISCARD
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEducation.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <GraduationCap className="w-12 h-12 text-slate-200" />
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Academic Matrix Empty</p>
          </div>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl rounded-[48px] border-none shadow-2xl p-10 overflow-hidden bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">DEPLOY ACADEMIC NODE</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateEducation} className="space-y-6 pt-8">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Institution Label</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Degree Specification</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} required />
                        </div>
                    </div>
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
