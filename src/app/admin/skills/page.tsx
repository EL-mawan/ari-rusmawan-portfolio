"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ChevronDown,
  ArrowLeft,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
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
      toast({
        title: "Error",
        description: 'Gagal mengambil keahlian',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Keahlian berhasil dibuat',
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchSkills()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal membuat keahlian',
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

  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSkill) return

    try {
      const response = await fetch(`/api/skills/${editingSkill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Keahlian berhasil diperbarui',
        })
        setIsEditModalOpen(false)
        setEditingSkill(null)
        resetForm()
        fetchSkills()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal memperbarui keahlian',
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

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus keahlian ini?')) return

    try {
      const response = await fetch(`/api/skills/${skillId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Keahlian berhasil dihapus',
        })
        fetchSkills()
      } else {
        toast({
          title: "Error",
          description: 'Gagal menghapus keahlian',
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
    setFormData({
      name: '',
      category: '',
      levelPercent: 50,
      icon: ''
    })
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 lg:pb-12">
      {/* Premium Header (Mobile Only) */}
      <div className="lg:hidden relative h-48 w-full bg-linear-to-br from-[#536dfe] via-[#3d5afe] to-[#304ffe] rounded-b-[40px] px-6 pt-10 text-white overflow-hidden shadow-2xl mb-6">
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl bg-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Skills Mastery</h1>
        </div>

        <div className="mt-6 relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-widest leading-none">Total Skills</p>
            <h2 className="text-3xl font-black mt-1">{skills.length}</h2>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl h-11 px-5 shadow-lg">
                <Plus className="w-5 h-5 mr-2" /> New Skill
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Keahlian</h1>
            <p className="text-slate-500 mt-1">Organisir kemampuan teknis Anda dengan rapi.</p>
          </div>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 px-6 shadow-indigo-100 shadow-xl">
                <Plus className="w-5 h-5 mr-2" /> Tambah Keahlian
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[32px] border-none shadow-2xl overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Buat Keahlian Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateSkill} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Keahlian</Label>
                        <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Kategori</Label>
                        <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-500" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Frontend, Backend, etc." required />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Kemahiran</Label>
                            <span className="text-sm font-black text-indigo-600">{formData.levelPercent}%</span>
                        </div>
                        <Input type="range" min="0" max="100" className="h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={formData.levelPercent} onChange={(e) => setFormData({...formData, levelPercent: parseInt(e.target.value)})} />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-12 font-bold shadow-lg shadow-indigo-100">Buat Keahlian</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl h-12 px-8 font-bold border-slate-100">Batal</Button>
                    </div>
                </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filter - Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="rounded-[24px] border-none shadow-xl shadow-slate-200/40 bg-white">
                <CardContent className="p-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                        <Search className="w-5 h-5 text-slate-400" />
                    </div>
                    <Input 
                        placeholder="Search skills..." 
                        className="border-none focus:ring-0 text-sm font-medium h-10 w-full bg-transparent" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CardContent>
            </Card>
            <Card className="rounded-[24px] border-none shadow-xl shadow-slate-200/40 bg-white hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600">
                            <Code className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Filter Category</span>
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-40 border-none shadow-none font-bold text-slate-400 h-10 rounded-xl hover:bg-slate-50">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, i) => (
            <Card key={skill.id} className="rounded-[32px] border-none shadow-2xl shadow-slate-200/50 bg-white hover:scale-[1.02] transition-all group overflow-hidden">
               <CardHeader className="px-7 pt-7 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <span className="text-lg font-black">{skill.name.charAt(0)}</span>
                    </div>
                    <div>
                        <CardTitle className="text-base font-black text-slate-900">{skill.name}</CardTitle>
                        <Badge variant="secondary" className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-tighter rounded-lg px-2 mt-1">{skill.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                      <span className="text-xl font-black text-indigo-600">{skill.levelPercent}%</span>
                  </div>
               </CardHeader>
               
               <CardContent className="px-7 pb-7">
                  <div className="mt-4 space-y-2">
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{width: `${skill.levelPercent}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                     <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 h-9 px-3" onClick={() => openEditModal(skill)}>
                            <Edit className="w-4 h-4 mr-2" /> <span className="text-[11px] font-bold">Edit</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl bg-red-50 hover:bg-red-100 text-red-500 h-9 px-3" onClick={() => handleDeleteSkill(skill.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> <span className="text-[11px] font-bold">Delete</span>
                        </Button>
                     </div>
                     <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(skill.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center gap-4">
             <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                 <Code className="w-10 h-10 text-slate-200" />
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No skills found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="rounded-[32px] border-none shadow-2xl overflow-hidden">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Edit Skill</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSkill} className="space-y-6 pt-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Keahlian</Label>
                    <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Kategori</Label>
                    <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-500" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Kemahiran</Label>
                        <span className="text-sm font-black text-indigo-600">{formData.levelPercent}%</span>
                    </div>
                    <Input type="range" min="0" max="100" className="h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={formData.levelPercent} onChange={(e) => setFormData({...formData, levelPercent: parseInt(e.target.value)})} />
                </div>
                <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-12 font-bold shadow-lg shadow-indigo-100">Update Skill</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-2xl h-12 px-8 font-bold border-slate-100">Batal</Button>
                </div>
            </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}
