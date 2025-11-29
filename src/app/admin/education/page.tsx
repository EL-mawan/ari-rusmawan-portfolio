"use client"

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  GraduationCap,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

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

  useEffect(() => {
    fetchEducation()
  }, [])

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
      
      if (data.success) {
        setEducation(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Gagal mengambil riwayat pendidikan',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pendidikan berhasil dibuat',
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchEducation()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal membuat riwayat pendidikan',
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

  const handleUpdateEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEducation) return

    try {
      const response = await fetch(`/api/education/${editingEducation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pendidikan berhasil diperbarui',
        })
        setIsEditModalOpen(false)
        setEditingEducation(null)
        resetForm()
        fetchEducation()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal memperbarui riwayat pendidikan',
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

  const handleDeleteEducation = async (eduId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat pendidikan ini?')) return

    try {
      const response = await fetch(`/api/education/${eduId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pendidikan berhasil dihapus',
        })
        fetchEducation()
      } else {
        toast({
          title: "Error",
          description: 'Gagal menghapus riwayat pendidikan',
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
    setFormData({
      school: '',
      degree: '',
      major: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      description: ''
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
          <h1 className="text-3xl font-bold">Manajemen Pendidikan</h1>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pendidikan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Riwayat Pendidikan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEducation} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">Sekolah/Institusi *</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Gelar *</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({...formData, degree: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="major">Jurusan/Bidang Studi</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => setFormData({...formData, major: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startYear">Tahun Mulai *</Label>
                    <Input
                      id="startYear"
                      type="number"
                      min="1900"
                      max="2100"
                      value={formData.startYear}
                      onChange={(e) => setFormData({...formData, startYear: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endYear">Tahun Selesai *</Label>
                    <Input
                      id="endYear"
                      type="number"
                      min="1900"
                      max="2100"
                      value={formData.endYear}
                      onChange={(e) => setFormData({...formData, endYear: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit">Buat Riwayat Pendidikan</Button>
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

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari riwayat pendidikan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Education List */}
        <div className="grid gap-4">
          {filteredEducation.map((edu) => (
            <Card key={edu.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <p className="text-primary font-medium">{edu.school}</p>
                      </div>
                    </div>
                    
                    {edu.major && (
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Jurusan:</strong> {edu.major}
                      </p>
                    )}
                    
                    {edu.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {edu.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{edu.startYear} - {edu.endYear}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(edu)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEducation.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Tidak ada riwayat pendidikan yang cocok dengan pencarian Anda' 
                  : 'Belum ada riwayat pendidikan. Tambahkan yang pertama!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Riwayat Pendidikan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateEducation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-school">Sekolah/Institusi *</Label>
                  <Input
                    id="edit-school"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-degree">Gelar *</Label>
                  <Input
                    id="edit-degree"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-major">Jurusan/Bidang Studi</Label>
                <Input
                  id="edit-major"
                  value={formData.major}
                  onChange={(e) => setFormData({...formData, major: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startYear">Tahun Mulai *</Label>
                  <Input
                    id="edit-startYear"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.startYear}
                    onChange={(e) => setFormData({...formData, startYear: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endYear">Tahun Selesai *</Label>
                  <Input
                    id="edit-endYear"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.endYear}
                    onChange={(e) => setFormData({...formData, endYear: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">Perbarui Riwayat Pendidikan</Button>
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
