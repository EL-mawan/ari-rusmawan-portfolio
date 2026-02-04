"use client"

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Upload, X, Image as ImageIcon, ExternalLink, ArrowLeft, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { cn } from '@/lib/utils'

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
      toast({ title: "Error", description: 'Gagal memuat profil', variant: "destructive" })
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
      const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      const data = await response.json()
      if (response.ok) {
        setFormData(prev => ({ ...prev, profileImage: data.url }))
        toast({ title: "Berhasil", description: "Foto profil berhasil diunggah" })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, socialLinks }),
      })
      if (response.ok) {
        toast({ title: "Berhasil", description: 'Profil berhasil diperbarui' })
        fetchProfile()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 lg:pb-12 text-slate-900">
      {/* Premium Header (Mobile Only) */}
      <div className="lg:hidden relative h-64 w-full bg-linear-to-br from-[#536dfe] via-[#3d5afe] to-[#304ffe] rounded-b-[40px] px-6 pt-10 text-white overflow-hidden shadow-2xl mb-6">
        <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl bg-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Edit Bio Profile</h1>
        </div>
        <div className="mt-8 relative z-10 flex items-center gap-5">
           <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                <AvatarImage src={formData.profileImage} />
                <AvatarFallback className="bg-white/20 text-white font-black text-xl">AR</AvatarFallback>
              </Avatar>
              <button onClick={() => document.getElementById('profile-image-upload-mobile')?.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-lg border border-slate-50">
                  <Camera className="w-3.5 h-3.5" />
              </button>
              <input id="profile-image-upload-mobile" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
           </div>
           <div>
              <h2 className="text-xl font-black">{formData.fullName || 'User Name'}</h2>
              <p className="text-xs font-bold text-white/60 tracking-wider uppercase mt-0.5">{formData.title || 'Professional Title'}</p>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Personal Account</h1>
            <p className="text-slate-500 mt-1">Update your professional information and appearance.</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl h-12 px-8 shadow-indigo-100 shadow-xl">
             <Save className="w-5 h-5 mr-2" /> Save Profile
          </Button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Desktop Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                     <Card className="rounded-[32px] border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden text-center p-8">
                        <div className="relative inline-block group mb-4">
                            <Avatar className="h-28 w-28 mx-auto border-4 border-slate-50 group-hover:scale-105 transition-all duration-500 cursor-pointer shadow-lg" onClick={() => document.getElementById('p-up')?.click()}>
                                <AvatarImage src={formData.profileImage} />
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-2xl">AR</AvatarFallback>
                            </Avatar>
                            <input id="p-up" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">{formData.fullName || 'Professional'}</h3>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 mb-6">Account Status: Admin</p>
                        <Button variant="outline" className="w-full rounded-2xl border-slate-100 font-bold h-10" onClick={() => document.getElementById('p-up')?.click()}>
                            {isUploading ? 'Uploading...' : 'Change Photo'}
                        </Button>
                     </Card>
                     
                     <Card className="rounded-[32px] border-none shadow-2xl shadow-slate-200/50 bg-white p-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Links</h4>
                        <div className="space-y-3">
                            <a href="/" target="_blank" className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 group transition-colors">
                                <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">View Public Site</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400" />
                            </a>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                <span className="text-xs font-bold text-slate-600">Resume Link</span>
                                <div className={cn("w-2 h-2 rounded-full", formData.cvPath ? "bg-green-500" : "bg-amber-400")}></div>
                            </div>
                        </div>
                     </Card>
                </div>

                {/* Right Column - Forms */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[32px] border-none shadow-2xl shadow-slate-200/50 bg-white p-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">General Information</h4>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Identity Name</Label>
                                <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Professional Headline</Label>
                                <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Software Architect" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Complete Biography</Label>
                                <Textarea className="rounded-2xl border-slate-100 focus:ring-indigo-600 h-32" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Describe your career journey..." />
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none shadow-2xl shadow-slate-200/50 bg-white p-8">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Contact & Socials</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Public Email</Label>
                                <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" type="email" value={formData.emailPublic} onChange={(e) => setFormData({...formData, emailPublic: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</Label>
                                <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="relative group">
                                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block">LinkedIn Personal URL</Label>
                                 <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" value={formData.linkedinUrl} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} />
                            </div>
                            <div className="relative group">
                                 <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Github Repository URL</Label>
                                 <Input className="rounded-2xl border-slate-100 h-12 focus:ring-indigo-600" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
                            </div>
                        </div>
                    </Card>
                    
                    <div className="lg:hidden h-4"></div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="lg:hidden w-full bg-[#0e1b52] hover:bg-[#13236e] text-white font-black rounded-2xl h-14 shadow-2xl mb-8">
                       {isSaving ? 'Saving...' : 'UPDATE PROFILE'}
                    </Button>
                </div>
            </div>
        </form>
      </div>
    </div>
  )
}
