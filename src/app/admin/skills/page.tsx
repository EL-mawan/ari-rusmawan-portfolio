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
          <h1 className="text-3xl font-bold">Manajemen Keahlian</h1>
          
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{skill.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {skill.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(skill)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Kemahiran</span>
                    <span>{skill.levelPercent}%</span>
                  </div>
                  <Progress value={skill.levelPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tidak ada keahlian yang cocok dengan kriteria Anda' 
                  : 'Belum ada keahlian. Tambahkan keahlian pertama Anda!'}
              </p>
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
