"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Github,
  Star,
  StarOff,
  Search,
  Filter,
  Upload,
  X,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

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
      toast({
        title: "Error",
        description: 'Gagal mengambil proyek',
        variant: "destructive"
      })
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
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, data.url]
        }))
        toast({
          title: "Berhasil",
          description: "Gambar berhasil diunggah",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Gagal mengunggah gambar",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengunggah",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Proyek berhasil dibuat',
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchProjects()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal membuat proyek',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Terjadi kesalahan yang tidak terduga',
        variant: "destructive"
      })
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Proyek berhasil dihapus',
        })
        fetchProjects()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal menghapus proyek',
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

  const handleToggleFeatured = async (project: Project) => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...project,
          featured: !project.featured
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: `Status unggulan proyek berhasil diperbarui`,
        })
        fetchProjects()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal memperbarui proyek',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Proyek berhasil diperbarui',
        })
        setIsEditModalOpen(false)
        setEditingProject(null)
        resetForm()
        fetchProjects()
      } else {
        toast({
          title: "Error",
          description: data.message || 'Gagal memperbarui proyek',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Terjadi kesalahan yang tidak terduga',
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      techStack: '',
      liveUrl: '',
      repoUrl: '',
      featured: false,
      images: []
    })
  }

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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Manajemen Proyek</h1>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Proyek
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Buat Proyek Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="title">Judul *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="techStack">Tech Stack (pisahkan dengan koma)</Label>
                  <Input
                    id="techStack"
                    value={formData.techStack}
                    onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                    placeholder="React.js, Node.js, MongoDB"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="liveUrl">Link Demo (URL Langsung)</Label>
                    <Input
                      id="liveUrl"
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="repoUrl">URL Repositori</Label>
                    <Input
                      id="repoUrl"
                      type="url"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Gambar Proyek</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Mengunggah...' : 'Unggah Gambar'}
                    </Button>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 group">
                          <img 
                            src={img} 
                            alt={`Project ${idx + 1}`} 
                            className="w-full h-full object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Proyek Unggulan</Label>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit">Buat Proyek</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari proyek..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={showFeaturedOnly ? "default" : "outline"}
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Hanya Unggulan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Project Image */}
              {project.images && project.images.length > 0 ? (
                <div className="aspect-video overflow-hidden relative group">
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {project.images.length > 1 && (
                    <Badge variant="secondary" className="absolute bottom-2 right-2">
                      +{project.images.length - 1} foto
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Code className="h-12 w-12 text-primary" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  {project.featured && (
                    <Badge variant="default" className="text-xs shrink-0">
                      <Star className="w-3 h-3 mr-1" />
                      Unggulan
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.techStack.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Meta Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  {project.profile && (
                    <>
                      <span>•</span>
                      <span>{project.profile.fullName}</span>
                    </>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t">
                  {/* Primary Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(project)}
                      className="w-full"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={project.featured ? "default" : "outline"}
                      onClick={() => handleToggleFeatured(project)}
                      className="w-full"
                    >
                      {project.featured ? (
                        <><StarOff className="w-3 h-3 mr-1" />Batal</>
                      ) : (
                        <><Star className="w-3 h-3 mr-1" />Unggulan</>
                      )}
                    </Button>
                  </div>
                  
                  {/* Links */}
                  {(project.liveUrl || project.repoUrl) && (
                    <div className="grid grid-cols-2 gap-2">
                      {project.liveUrl && (
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                      {project.repoUrl && (
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-3 h-3 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProject(project.id)}
                    className="w-full text-destructive hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Hapus Proyek
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || showFeaturedOnly 
                  ? 'Tidak ada proyek yang cocok dengan kriteria Anda' 
                  : 'Belum ada proyek. Buat proyek pertama Anda!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Proyek</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="edit-title">Judul *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-slug">Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="edit-techStack">Tech Stack (pisahkan dengan koma)</Label>
                <Input
                  id="edit-techStack"
                  value={formData.techStack}
                  onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                  placeholder="React.js, Node.js, MongoDB"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="edit-liveUrl">Link Demo (URL Langsung)</Label>
                  <Input
                    id="edit-liveUrl"
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-repoUrl">URL Repositori</Label>
                  <Input
                    id="edit-repoUrl"
                    type="url"
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({...formData, repoUrl: e.target.value})}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Gambar Proyek</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('edit-image-upload')?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Mengunggah...' : 'Unggah Gambar'}
                  </Button>
                  <Input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
                
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 group">
                        <img 
                          src={img} 
                          alt={`Project ${idx + 1}`} 
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="edit-featured">Proyek Unggulan</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">Perbarui Proyek</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingProject(null)
                    resetForm()
                  }}
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}