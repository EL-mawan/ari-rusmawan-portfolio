"use client"

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    site_title: '',
    site_description: '',
    contact_email: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    phone: '',
    location: ''
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      
      setSettings(prev => ({
        ...prev,
        ...data
      }))
    } catch (error) {
      toast({
        title: "Error",
        description: 'Gagal mengambil pengaturan',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: 'Pengaturan berhasil disimpan',
        })
      } else {
        toast({
          title: "Error",
          description: 'Gagal menyimpan pengaturan',
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Pengaturan Situs</h1>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>
                Konfigurasikan informasi utama untuk situs web portofolio Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_title">Judul Situs</Label>
                <Input
                  id="site_title"
                  value={settings.site_title}
                  onChange={(e) => setSettings({...settings, site_title: e.target.value})}
                  placeholder="Ari Rusmawan Portfolio"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_description">Deskripsi Situs</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                  placeholder="Professional portfolio of Ari Rusmawan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
              <CardDescription>
                Detail kontak Anda yang ditampilkan di situs web.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Alamat Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                    placeholder="ari.rusmawan@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Lokasi</Label>
                <Input
                  id="location"
                  value={settings.location}
                  onChange={(e) => setSettings({...settings, location: e.target.value})}
                  placeholder="Jakarta, Indonesia"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profil Sosial</CardTitle>
              <CardDescription>
                Tautan ke profil media sosial Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github_url">URL GitHub</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={settings.github_url}
                  onChange={(e) => setSettings({...settings, github_url: e.target.value})}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">URL LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={settings.linkedin_url}
                  onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter_url">URL Twitter</Label>
                <Input
                  id="twitter_url"
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => setSettings({...settings, twitter_url: e.target.value})}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
