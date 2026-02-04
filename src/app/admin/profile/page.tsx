"use client"

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Camera, ExternalLink, ArrowLeft, Shield, Globe, Smartphone, Plus, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from '@/components/ui/badge'
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
          ? (typeof profileData.socialLinks === 'string' ? JSON.parse(profileData.socialLinks) : profileData.socialLinks)
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
        toast({ title: "Success", description: "Identity visual updated." })
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
      const socialLinks = { linkedin: formData.linkedinUrl, github: formData.githubUrl, twitter: formData.twitterUrl }
      const response = await fetch('/api/profile', {
        method: profile ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, socialLinks }),
      })
      if (response.ok) {
        toast({ title: "Updated", description: 'Profile matrix synchronized successfully.' })
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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12 text-slate-900">
      {/* 
          PROFILE PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[360px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter uppercase">IDENTITY PROFILE</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center gap-6 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-2xl">
           <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                <AvatarImage src={formData.profileImage} />
                <AvatarFallback className="bg-white/20 text-white font-black text-2xl">AR</AvatarFallback>
              </Avatar>
              <button onClick={() => document.getElementById('mob-up')?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-2xl border border-white transition-transform active:scale-95">
                  <Camera className="w-5 h-5" />
              </button>
              <input id="mob-up" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
           </div>
           <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black truncate leading-none tracking-tight">{formData.fullName || 'Admin User'}</h2>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mt-3 bg-white/5 px-3 py-1 rounded-lg inline-block">{formData.title || 'Technical Specialist'}</p>
           </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Account Architecture</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Synchronize your professional identity across the matrix.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-xl shadow-slate-200/40 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <Shield className="w-4 h-4 text-green-500" /> Account Level: Elite
             </div>
             <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white font-black rounded-[24px] h-14 px-12 shadow-[0_20px_40px_rgba(79,70,229,0.3)] uppercase text-xs tracking-widest transition-all">
                <Save className="w-5 h-5 mr-3" /> Execute Update
             </Button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side - Visual Control Matrix */}
                <div className="lg:col-span-4 space-y-8">
                     <Card className="rounded-[48px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] bg-white overflow-hidden text-center p-10 group relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
                        <div className="relative inline-block mb-8 group-hover:scale-105 transition-all duration-700">
                            <div className="absolute -inset-4 bg-indigo-50 rounded-[48px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
                            <Avatar className="h-40 w-40 mx-auto border-[6px] border-white shadow-2xl relative cursor-pointer" onClick={() => document.getElementById('dt-up')?.click()}>
                                <AvatarImage src={formData.profileImage} />
                                <AvatarFallback className="bg-slate-50 text-indigo-600 font-black text-4xl">AR</AvatarFallback>
                            </Avatar>
                            <button onClick={(e) => { e.preventDefault(); document.getElementById('dt-up')?.click(); }} className="absolute bottom-1 right-1 w-12 h-12 bg-indigo-600 rounded-[20px] shadow-2xl flex items-center justify-center text-white border-4 border-white hover:bg-indigo-700 transition-colors">
                                <Plus className="w-6 h-6" />
                            </button>
                            <input id="dt-up" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{formData.fullName || 'Admin User'}</h3>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-3">Verified Professional Index</p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-10">
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                <span className="text-[9px] font-black text-indigo-300 uppercase leading-none">Projects</span>
                                <span className="text-xl font-black text-slate-900 mt-2">12</span>
                            </div>
                            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                <span className="text-[9px] font-black text-emerald-300 uppercase leading-none">Score</span>
                                <span className="text-xl font-black text-slate-900 mt-2">840</span>
                            </div>
                        </div>
                     </Card>
                     
                     <Card className="rounded-[40px] border-none shadow-[0_30px_60px_-10px_rgba(0,0,0,0.04)] bg-white p-8 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 pl-1">Global Access Links</h4>
                        <div className="space-y-3">
                            <a href="/" target="_blank" className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl hover:bg-indigo-600 group transition-all duration-300 shadow-inner">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-indigo-600 group-hover:text-white" />
                                    <span className="text-[10px] font-black text-indigo-600 group-hover:text-white uppercase tracking-widest">Public Domain</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-indigo-300 group-hover:text-white" />
                            </a>
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Sync</span>
                                </div>
                                <Badge className="bg-green-100 text-green-600 text-[8px] font-black uppercase tracking-widest border-none px-2 py-0.5 rounded-lg shadow-sm">ACTIVE</Badge>
                            </div>
                        </div>
                     </Card>
                </div>

                {/* Right Side - Data Input Matrix */}
                <div className="lg:col-span-8 space-y-8">
                    <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-white p-10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><User className="w-40 h-40" /></div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-indigo-600 pl-4">Primary Configuration</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Legal Administrative Name</Label>
                                <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 px-6 shadow-xs" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Global Headline Title</Label>
                                <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 px-6 shadow-xs" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Master Tech Consultant" required />
                            </div>
                        </div>
                        <div className="mt-8 space-y-2.5">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Professional Narrative (Bio)</Label>
                            <Textarea className="rounded-[32px] border-slate-100 focus:ring-indigo-600 bg-slate-50/30 h-40 p-8 font-medium text-slate-700 leading-relaxed shadow-xs" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Describe your global career trajectory..." />
                        </div>
                        <div className="mt-8 space-y-2.5">
                             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Curriculum Vitae Source Path</Label>
                             <div className="relative">
                                <ExternalLink className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 pl-16 pr-6 shadow-xs" value={formData.cvPath} onChange={(e) => setFormData({...formData, cvPath: e.target.value})} placeholder="https://storage.provider.com/resume.pdf" />
                             </div>
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-white p-10 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><MapPin className="w-40 h-40" /></div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-indigo-600 pl-4">Connection Endpoints</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Public Communication Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 pl-16 pr-6 shadow-xs" type="email" value={formData.emailPublic} onChange={(e) => setFormData({...formData, emailPublic: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Access Terminal</Label>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 pl-16 pr-6 shadow-xs" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                 <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">LinkedIn Network URI</Label>
                                    <Input className="rounded-xl border-slate-100 h-12 focus:ring-indigo-600 bg-slate-50/20 font-bold text-slate-700 px-5 shadow-xs" value={formData.linkedinUrl} onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} />
                                 </div>
                                 <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">GitHub Matrix Repository</Label>
                                    <Input className="rounded-xl border-slate-100 h-12 focus:ring-indigo-600 bg-slate-50/20 font-bold text-slate-700 px-5 shadow-xs" value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
                                 </div>
                            </div>
                            <div className="space-y-2.5 pt-1">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Geographic Deployment (Location)</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 pl-16 pr-6 shadow-xs" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Global Hub, Earth" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <div className="lg:hidden h-4"></div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="lg:hidden w-full bg-[#0e1b52] hover:bg-[#13236e] active:scale-95 text-white font-black rounded-[24px] h-20 shadow-[0_30px_60px_rgba(14,27,82,0.3)] uppercase text-xs tracking-[0.2em] transition-all mb-8">
                       {isSaving ? 'Processing Update...' : 'SYNCHRONIZE ALL DATA'}
                    </Button>
                </div>
            </div>
        </form>
      </div>
      
      {/* Footer Bottom Nav Spacer */}
      <div className="lg:hidden h-24"></div>
    </div>
  )
}
