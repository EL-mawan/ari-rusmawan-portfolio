"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Code,
  TrendingUp,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Skill {
  id: string
  name: string
  category: string
  levelPercent: number
  icon?: string
  createdAt: string
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    levelPercent: 50,
    icon: ''
  })
  
  const { toast } = useToast()

  const categories = Array.from(new Set(skills.map(s => s.category)))

  useEffect(() => {
    fetchSkills()
  }, [])

  useEffect(() => {
    let filtered = skills
    if (searchTerm) {
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === selectedCategory)
    }
    setFilteredSkills(filtered)
  }, [skills, searchTerm, selectedCategory])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      if (data.success) {
        setSkills(data.data || [])
      }
    } catch (error) {
      toast({ title: "Error", description: 'Gagal mengambil keahlian', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Keahlian berhasil dibuat' })
        setIsCreateModalOpen(false)
        resetForm()
        fetchSkills()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSkill) return
    try {
      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Keahlian berhasil diperbarui' })
        setIsEditModalOpen(false)
        fetchSkills()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus keahlian ini?')) return
    try {
      const response = await fetch(`/api/skills/${skillId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Keahlian berhasil dihapus' })
        fetchSkills()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      levelPercent: skill.levelPercent,
      icon: skill.icon || ''
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', category: '', levelPercent: 50, icon: '' })
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
          SKILLS PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter">SKILLS ARCHIVE</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">Core Competencies</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">{skills.length}</h2>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-indigo-50 text-indigo-600 h-14 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 px-6">
                <Plus className="w-5 h-5 mr-2" /> CREATE
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Skills Management</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Map out your technical expertise and mastery level.</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] h-14 px-10 shadow-[0_20px_40px_rgba(79,70,229,0.3)] shadow-indigo-100 uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5 mr-3" /> New Skill Entry
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Search & Filter - Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2">
                <CardContent className="p-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input placeholder="Search skills catalog..." className="border-none focus:ring-0 text-sm font-bold h-12 w-full bg-transparent placeholder:text-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </CardContent>
            </Card>
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2 hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="w-12 h-12 rounded-[20px] bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 shadow-inner"><Code className="w-6 h-6" /></div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Filter</span>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48 border-none shadow-none font-black text-slate-500 h-12 rounded-[20px] hover:bg-slate-50 uppercase text-[10px] tracking-widest px-6">
                            <SelectValue placeholder="All Matrix" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[24px] border-none shadow-2xl p-2">
                            <SelectItem value="all" className="rounded-xl font-bold text-xs uppercase tracking-widest">All Categories</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c} className="rounded-xl font-bold text-xs uppercase tracking-widest">{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>

        {/* Skills Grid - Premium Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSkills.map((skill, i) => (
            <Card key={skill.id} className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] bg-white hover:scale-[1.03] active:scale-95 transition-all group overflow-hidden p-2">
               <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="flex items-center gap-5 relative">
                    <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner border border-slate-100">
                        <span className="text-2xl font-black">{skill.name.charAt(0)}</span>
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black text-slate-900 tracking-tight">{skill.name}</CardTitle>
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg px-2 py-0.5 mt-1 border-none">{skill.category}</Badge>
                    </div>
                  </div>
                  <div className="relative text-right bg-white/50 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-50">
                      <span className="text-2xl font-black text-slate-900 tracking-tighter">{skill.levelPercent}%</span>
                  </div>
               </CardHeader>
               
               <CardContent className="px-8 pb-8">
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                        <span>Foundation</span>
                        <span>Mastery</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-linear-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-1500 shadow-lg" style={{width: `${skill.levelPercent}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-10">
                     <div className="flex gap-3">
                        <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 h-12 w-12 transition-all" onClick={() => openEditModal(skill)}>
                            <Edit className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl bg-red-50/50 hover:bg-red-100 text-red-500 h-12 w-12 transition-all" onClick={() => handleDeleteSkill(skill.id)}>
                            <Trash2 className="w-5 h-5" />
                        </Button>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Active Status</span>
                        <div className="flex items-center gap-1.5 mt-1 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100">
                           <TrendingUp className="w-3 h-3" />
                           <span className="text-[9px] font-black uppercase">Verified</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <Code className="w-12 h-12 text-slate-200" />
             </div>
             <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Competency Matrix Empty</p>
          </div>
        )}
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} >
          <DialogContent className="rounded-[40px] border-none shadow-2xl p-10 overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">NEW SKILL ENTRY</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSkill} className="space-y-8 pt-8">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Skill Label</Label>
                        <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Quantitative Analysis" required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expertise Category</Label>
                        <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Backend Engineering" required />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Proficiency Index</Label>
                            <span className="text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl shadow-sm">{formData.levelPercent}%</span>
                        </div>
                        <Input type="range" min="0" max="100" className="h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={formData.levelPercent} onChange={(e) => setFormData({...formData, levelPercent: parseInt(e.target.value)})} />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 text-white">VALIDATE & SAVE</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl h-14 px-10 font-bold border-slate-100 uppercase text-[10px] tracking-widest">DISCARD</Button>
                    </div>
                </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
