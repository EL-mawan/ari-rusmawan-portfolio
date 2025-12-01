"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Manajemen Keahlian</h1>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Keahlian
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Keahlian Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSkill} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Keahlian *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="e.g. Frontend, Backend, Tools"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="levelPercent">Kemahiran ({formData.levelPercent}%)</Label>
                  <Input
                    id="levelPercent"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.levelPercent}
                    onChange={(e) => setFormData({...formData, levelPercent: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Ikon (Nama ikon Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit">Buat Keahlian</Button>
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
                    placeholder="Cari keahlian..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <span className="text-lg font-bold text-primary">
                          {skill.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{skill.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {skill.category}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                    {skill.levelPercent}%
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pemula</span>
                    <span>Ahli</span>
                  </div>
                  <Progress value={skill.levelPercent} className="h-2.5 bg-secondary" />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(skill)}
                    className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="w-full text-destructive hover:bg-destructive hover:text-white transition-all"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tidak ada keahlian ditemukan</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Coba ubah kata kunci pencarian atau filter kategori Anda.' 
                  : 'Mulai tambahkan keahlian teknis Anda untuk ditampilkan di portofolio.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="mt-4"
                >
                  Hapus Filter
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Keahlian</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSkill} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nama Keahlian *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Kategori *</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-levelPercent">Kemahiran ({formData.levelPercent}%)</Label>
                <Input
                  id="edit-levelPercent"
                  type="range"
                  min="0"
                  max="100"
                  value={formData.levelPercent}
                  onChange={(e) => setFormData({...formData, levelPercent: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Ikon (Nama ikon Lucide)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">Perbarui Keahlian</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
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
