"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github,
  Star,
  StarOff,
  Search,
  Upload,
  X,
  Code,
  ArrowLeft,
  ChevronDown,
  FolderOpen
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

interface Project {
  id: string
  title: string
  slug: string
  description?: string
  images?: string[]
  techStack?: string[]
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  createdAt: string
  profile?: {
    fullName: string
  }
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    techStack: '',
    liveUrl: '',
    repoUrl: '',
    featured: false,
    images: [] as string[]
  })
  
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = projects
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    if (showFeaturedOnly) {
      filtered = filtered.filter(project => project.featured)
    }
    setFilteredProjects(filtered)
  }, [projects, searchTerm, showFeaturedOnly])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.data || [])
      }
    } catch (error) {
      toast({ title: "Error", description: 'Gagal mengambil proyek', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('type', 'project')
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      const data = await response.json()
      if (response.ok) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
        toast({ title: "Berhasil", description: "Gambar berhasil diunggah" })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }))
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean) }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast({ title: "Berhasil", description: 'Proyek berhasil dibuat' })
        setIsCreateModalOpen(false)
        resetForm()
        fetchProjects()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Proyek berhasil dihapus' })
        fetchProjects()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, featured: !project.featured }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: `Status unggulan diperbarui` })
        fetchProjects()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      techStack: project.techStack?.join(', ') || '',
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      featured: project.featured,
      images: project.images || []
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean) }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Proyek berhasil diperbarui' })
        setIsEditModalOpen(false)
        fetchProjects()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', slug: '', description: '', techStack: '', liveUrl: '', repoUrl: '', featured: false, images: [] })
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
          PROJECTS PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter">PROJECT MATRIX</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div>
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">Global Repository</p>
            <h2 className="text-4xl font-black mt-2 tracking-tighter">{projects.length}</h2>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white hover:bg-indigo-50 text-indigo-600 h-14 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 px-6">
                <Plus className="w-5 h-5 mr-2" /> CREATE
              </Button>
            </DialogTrigger>
            {/* Modal applied premium styling */}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">DEPLOY NEW PROJECT</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProject} className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Project Identifier</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Fintech Ecosystem" required />
                        </div>
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Endpoint Slug</Label>
                             <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="fintech-ecosystem" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Project Narrative</Label>
                        <Textarea className="rounded-2xl border-slate-100 focus:ring-indigo-600 min-h-[120px] p-5" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    {/* ... other form fields with same style ... */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 text-white">INITIALIZE PROJECT</Button>
                        <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="rounded-2xl h-14 px-10 font-bold border-slate-100 uppercase text-[10px] tracking-widest">CANCEL</Button>
                    </div>
                </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Project Management</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Curate and manage your development portfolio.</p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] h-14 px-10 shadow-[0_20px_40px_rgba(79,70,229,0.3)] shadow-indigo-100 uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5 mr-3" /> Create New Project
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Global Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2">
                <CardContent className="p-2 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                        <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <Input 
                        placeholder="Search matrix by name or tech stack..." 
                        className="border-none focus:ring-0 text-sm font-bold h-12 w-full bg-transparent placeholder:text-slate-300" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CardContent>
            </Card>
            <Card className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] bg-white p-2 hidden sm:block">
                <CardContent className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4 pl-4">
                        <div className="w-12 h-12 rounded-[20px] bg-amber-50 flex items-center justify-center shrink-0 text-amber-500 shadow-inner">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Featured Focus</span>
                    </div>
                    <Button 
                        variant={showFeaturedOnly ? "default" : "outline"} 
                        className={cn("rounded-[20px] h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all", showFeaturedOnly ? "bg-amber-500 text-white shadow-xl shadow-amber-100 border-none" : "text-slate-300 border-slate-100")}
                        onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                    >
                        {showFeaturedOnly ? 'ENABLED' : 'DISABLED'}
                    </Button>
                </CardContent>
            </Card>
        </div>

        {/* Projects Grid - Redesigned Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="rounded-[48px] overflow-hidden border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all group bg-white p-3 cursor-pointer">
              <div className="aspect-video overflow-hidden relative rounded-[36px] shadow-inner">
                {project.images && project.images.length > 0 ? (
                  <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1500" />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center"><FolderOpen className="w-16 h-16 text-slate-200" /></div>
                )}
                <div className="absolute top-6 right-6 flex gap-2">
                    {project.featured && (
                        <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-2xl backdrop-blur-md bg-opacity-90"><Star className="w-5 h-5 fill-current" /></div>
                    )}
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <CardHeader className="px-8 pt-8 pb-3">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl font-black text-slate-900 leading-tight truncate tracking-tight">{project.title}</CardTitle>
                </div>
                <p className="text-[11px] font-bold text-slate-400 line-clamp-2 mt-2 leading-relaxed uppercase tracking-tighter">{project.description}</p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  {project.techStack?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-tighter border-none px-3 py-1.5 rounded-xl">{tech}</Badge>
                  ))}
                  {project.techStack && project.techStack.length > 3 && (
                    <Badge variant="secondary" className="bg-slate-50 text-slate-300 text-[9px] font-black rounded-xl">+{project.techStack.length - 3}</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 h-12 w-12 transition-all active:scale-95" onClick={() => openEditModal(project)}>
                        <Edit className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className={cn("rounded-2xl bg-slate-50 h-12 w-12 transition-all active:scale-95", project.featured ? "text-amber-500 bg-amber-50 shadow-inner" : "text-slate-400")} onClick={() => handleToggleFeatured(project)}>
                        <Star className={cn("w-5 h-5", project.featured && "fill-current")} />
                    </Button>
                    <div className="flex-1"></div>
                    <Button variant="ghost" size="icon" className="rounded-2xl bg-red-50/50 hover:bg-red-100 text-red-500 h-12 w-12 transition-all active:scale-95" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-5 h-5" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {project.liveUrl && (
                        <Button variant="outline" className="rounded-[20px] border-slate-100 text-[10px] font-black h-12 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-none transition-all shadow-sm" asChild>
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2 stroke-3" /> Demo</a>
                        </Button>
                    )}
                    {project.repoUrl && (
                        <Button variant="outline" className="rounded-[20px] border-slate-100 text-[10px] font-black h-12 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm" asChild>
                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-2 stroke-3" /> Code</a>
                        </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-24 h-24 rounded-[40px] bg-slate-50 flex items-center justify-center shadow-inner border border-slate-100">
                 <FolderOpen className="w-12 h-12 text-slate-200" />
             </div>
             <div className="space-y-2">
                <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Project Matrix Empty</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initialize your first project to begin tracking.</p>
             </div>
          </div>
        )}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-8">
            <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">RECONFIGURE PROJECT</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProject} className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Project Name</Label>
                        <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 font-bold" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                </div>
                <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1 bg-indigo-600 rounded-2xl h-14 font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 text-white">UPDATE CONFIGURATION</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="rounded-2xl h-14 px-10 font-bold border-slate-100 uppercase text-[10px] tracking-widest">DISCARD</Button>
                </div>
            </form>
          </DialogContent>
      </Dialog>
    </div>
  )
}