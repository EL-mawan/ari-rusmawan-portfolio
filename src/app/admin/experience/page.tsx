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
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

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

  useEffect(() => {
    fetchExperiences()
  }, [])

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
      
      if (data.success) {
        setExperiences(data.data || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Gagal mengambil riwayat pengalaman',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const responsibilities = formData.responsibilities
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean)

      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          responsibilities
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pengalaman berhasil dibuat',
        })
        setIsCreateModalOpen(false)
        resetForm()
        fetchExperiences()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal membuat riwayat pengalaman',
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

  const handleUpdateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExperience) return

    try {
      const responsibilities = formData.responsibilities
        .split('\n')
        .map(r => r.trim())
        .filter(Boolean)

      const response = await fetch(`/api/experience/${editingExperience.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          responsibilities
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pengalaman berhasil diperbarui',
        })
        setIsEditModalOpen(false)
        setEditingExperience(null)
        resetForm()
        fetchExperiences()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal memperbarui riwayat pengalaman',
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

  const handleDeleteExperience = async (expId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat pengalaman ini?')) return

    try {
      const response = await fetch(`/api/experience/${expId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Riwayat pengalaman berhasil dihapus',
        })
        fetchExperiences()
      } else {
        toast({
          title: "Error",
          description: 'Gagal menghapus riwayat pengalaman',
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
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      responsibilities: ''
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Manajemen Pengalaman</h1>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Pengalaman
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah Pengalaman Kerja</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateExperience} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="company">Perusahaan *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="position">Posisi *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="location">Lokasi</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Country"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="startDate">Tanggal Mulai *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="endDate">Tanggal Selesai (kosongkan jika saat ini)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="responsibilities">Tanggung Jawab (satu per baris)</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                    rows={5}
                    placeholder="Manage team of 5 developers&#10;Lead sprint planning meetings&#10;Review code and mentor junior developers"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit">Buat Pengalaman</Button>
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
                placeholder="Cari pengalaman..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Experience List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredExperiences.map((exp) => (
            <Card key={exp.id} className="hover:shadow-lg transition-all duration-300 group flex flex-col">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shrink-0">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate">{exp.position}</h3>
                    <p className="text-primary font-medium truncate">{exp.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {new Date(exp.startDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'Saat Ini'}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{exp.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 mb-6">
                  {exp.responsibilities && exp.responsibilities.length > 0 ? (
                    <ul className="space-y-3">
                      {exp.responsibilities.slice(0, 4).map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{resp}</span>
                        </li>
                      ))}
                      {exp.responsibilities.length > 4 && (
                        <li className="text-xs text-primary font-medium pl-7 pt-1">
                          +{exp.responsibilities.length - 4} tanggung jawab lainnya...
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Tidak ada deskripsi tanggung jawab.</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditModal(exp)}
                    className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive hover:text-white transition-all"
                    onClick={() => handleDeleteExperience(exp.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperiences.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? 'Tidak ada riwayat pengalaman yang cocok dengan pencarian Anda' 
                  : 'Belum ada riwayat pengalaman. Tambahkan yang pertama!'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Pengalaman Kerja</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="edit-company">Perusahaan *</Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-position">Posisi *</Label>
                  <Input
                    id="edit-position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="edit-location">Lokasi</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="edit-startDate">Tanggal Mulai *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-endDate">Tanggal Selesai</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="edit-responsibilities">Tanggung Jawab (satu per baris)</Label>
                <Textarea
                  id="edit-responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                  rows={5}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit">Perbarui Pengalaman</Button>
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
