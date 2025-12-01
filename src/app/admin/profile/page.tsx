"use client"

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Upload, X, Image as ImageIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface Profile {
  id: string
  fullName: string
  title: string
  bio?: string
  location?: string
  phone?: string
  emailPublic?: string
  cvPath?: string
  profileImage?: string
  socialLinks?: any
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    location: '',
    phone: '',
    emailPublic: '',
    profileImage: '',
    linkedinUrl: '',
    githubUrl: '',
    twitterUrl: '',
    cvPath: ''
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      const data = await response.json()
      
      if (data.success && data.data) {
        const profileData = data.data
        setProfile(profileData)
        
        const socialLinks = profileData.socialLinks 
          ? (typeof profileData.socialLinks === 'string' 
              ? JSON.parse(profileData.socialLinks) 
              : profileData.socialLinks)
          : {}
        
        setFormData({
          fullName: profileData.fullName || '',
          title: profileData.title || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          phone: profileData.phone || '',
          emailPublic: profileData.emailPublic || '',
          profileImage: profileData.profileImage || '',
          linkedinUrl: socialLinks.linkedin || '',
          githubUrl: socialLinks.github || '',
          twitterUrl: socialLinks.twitter || '',
          cvPath: profileData.cvPath || ''
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Gagal memuat profil',
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
    uploadFormData.append('type', 'profile')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          profileImage: data.url
        }))
        toast({
          title: "Berhasil",
          description: "Foto profil berhasil diunggah",
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
      e.target.value = ''
    }
  }

  const removeProfileImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const socialLinks = {
        linkedin: formData.linkedinUrl,
        github: formData.githubUrl,
        twitter: formData.twitterUrl
      }

      const response = await fetch('/api/profile', {
        method: profile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          title: formData.title,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          emailPublic: formData.emailPublic,
          cvPath: formData.cvPath,
          profileImage: formData.profileImage,
          socialLinks
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Berhasil",
          description: 'Profil berhasil diperbarui',
        })
        fetchProfile()
      } else {
        toast({
          title: "Error",
          description: data.error || 'Gagal menyimpan profil',
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Terjadi kesalahan yang tidak terduga',
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Profil Saya</h1>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card className="animate-slide-up hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
              <CardDescription>
                Unggah foto profil Anda untuk ditampilkan di website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {formData.profileImage ? (
                  <div className="relative group">
                    <img 
                      src={formData.profileImage} 
                      alt="Profil" 
                      className="w-50 h-50 rounded-full object-cover border-4 border-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40"
                    />
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-50 h-50 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 animate-pulse-slow">
                    <ImageIcon className="w-16 h-16 text-primary/40" />
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('profile-image-upload')?.click()}
                    disabled={isUploading}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Mengunggah...' : 'Unggah Foto'}
                  </Button>
                  <Input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Rekomendasi: Gambar persegi, minimal 1200x1200px
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up animation-delay-100 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>
                Perbarui informasi pribadi Anda dan bagaimana Anda muncul di website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Jabatan Profesional *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="contoh: Full Stack Developer | Manajer Proyek"
                  className="transition-all duration-200 focus:scale-[1.01]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biografi</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Ceritakan tentang diri Anda..."
                  rows={4}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvPath">Link CV / Resume</Label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cvPath"
                    value={formData.cvPath}
                    onChange={(e) => setFormData({...formData, cvPath: e.target.value})}
                    placeholder="https://docs.google.com/..."
                    className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Masukkan link ke CV Anda (Google Drive, LinkedIn, atau file yang diupload)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up animation-delay-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>
                Detail kontak Anda yang ditampilkan di website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailPublic">Email Publik</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emailPublic"
                      type="email"
                      value={formData.emailPublic}
                      onChange={(e) => setFormData({...formData, emailPublic: e.target.value})}
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      placeholder="email@anda.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                      placeholder="+62 xxx-xxxx-xxxx"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="pl-10 transition-all duration-200 focus:scale-[1.01]"
                    placeholder="Kota, Negara"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up animation-delay-300 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Profil Media Sosial</CardTitle>
              <CardDescription>
                Tautan ke profil media sosial Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">URL LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                  placeholder="https://linkedin.com/in/username"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubUrl">URL GitHub</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  placeholder="https://github.com/username"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">URL Twitter</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({...formData, twitterUrl: e.target.value})}
                  placeholder="https://twitter.com/username"
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end animate-slide-up animation-delay-400">
            <Button 
              type="submit" 
              disabled={isSaving} 
              className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
