"use client"

import { useState, useEffect } from 'react'
import { Save, Upload, X, Image as ImageIcon, ArrowLeft, Shield, Settings, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [settings, setSettings] = useState({
    site_title: '',
    site_description: '',
    contact_email: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    phone: '',
    location: '',
    logo_url: '',
    hero_background_url: ''
  })
  
  const { toast } = useToast()

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(prev => ({ ...prev, ...data }))
    } catch (error) {
      toast({ title: "Error", description: 'Gagal mengambil pengaturan', variant: "destructive" })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (response.ok) {
        toast({ title: "Sized", description: 'System configuration synchronized.' })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setIsUploading(true)
    try {
      const uploadFormData = new FormData(); uploadFormData.append('file', file); uploadFormData.append('type', 'logo')
      const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
      const data = await response.json()
      if (response.ok) {
        setSettings(prev => ({ ...prev, logo_url: data.url }))
        await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logo_url: data.url }) })
        toast({ title: "Visual Logic Update", description: "Logo artifact updated." })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsUploading(false)
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
          SETTINGS PREMIUM HEADER
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden relative h-[280px] w-full bg-indigo-600 px-6 pt-10 text-white overflow-hidden shadow-[0_20px_50px_rgba(79,70,229,0.3)] rounded-b-[48px] mb-10">
        <div className="absolute -top-24 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-black/10 rounded-full blur-[100px]"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-2xl bg-white/10 backdrop-blur-md h-12 w-12 border border-white/10" asChild>
            <Link href="/admin/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-black tracking-tighter uppercase">CORE CONFIG</h1>
        </div>

        <div className="mt-10 relative z-10 flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[32px] shadow-2xl">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                <Settings className="w-8 h-8" />
             </div>
             <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none">System State</p>
                <h2 className="text-xl font-black mt-2 tracking-tight">FULLY OPTIMIZED</h2>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-12 mb-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">System Architecture</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Manage your global site configuration and visual assets.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-xl shadow-slate-200/40 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                <Shield className="w-4 h-4 text-green-500" /> Core Security: Enabled
             </div>
             <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white font-black rounded-[24px] h-14 px-12 shadow-[0_20px_40px_rgba(79,70,229,0.3)] uppercase text-xs tracking-widest transition-all cursor-pointer">
                <Save className="w-5 h-5 mr-3" /> Commit Changes
             </Button>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Assets Matrix */}
                <div className="space-y-8">
                    <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-white p-10 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><ImageIcon className="w-40 h-40" /></div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-indigo-600 pl-4">Brand Logo Artifact</h4>
                        <div className="flex flex-col items-center gap-8 py-4">
                            {settings.logo_url ? (
                                <div className="relative group/logo">
                                    <div className="w-48 h-48 rounded-full border-4 border-slate-50 bg-slate-50/30 flex items-center justify-center p-4 transition-all duration-500 group-hover/logo:border-indigo-100 group-hover/logo:shadow-inner relative overflow-hidden">
                                        <img src={settings.logo_url} alt="Logo" className="max-w-full max-h-full object-cover rounded-full drop-shadow-xl" />
                                    </div>
                                    <button onClick={() => setSettings({...settings, logo_url: ''})} className="absolute -top-3 -right-3 w-10 h-10 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer border-4 border-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-48 h-48 rounded-[40px] bg-slate-50 border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-3 text-slate-200">
                                    <ImageIcon className="w-12 h-12" />
                                    <span className="text-[10px] font-black uppercase">Null Data</span>
                                </div>
                            )}
                            <Button type="button" variant="outline" onClick={() => document.getElementById('logo-dt')?.click()} disabled={isUploading} className="rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-widest border-slate-100 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/20 cursor-pointer">
                                <Upload className="w-4 h-4 mr-3" /> {isUploading ? 'TRANSMITTING...' : 'UPDATE IDENTITY'}
                            </Button>
                            <input id="logo-dt" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-[#0e1b52] text-white p-10 overflow-hidden relative">
                         <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent"></div>
                         <h4 className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mb-8 relative">Quick Meta Sync</h4>
                         <div className="space-y-6 relative">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Site Identity Title</Label>
                                <Input className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold text-white focus:ring-white/20 px-6" value={settings.site_title} onChange={(e) => setSettings({...settings, site_title: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] pl-1">Primary Interaction Endpoint</Label>
                                <Input className="bg-white/5 border-white/10 h-14 rounded-2xl font-bold text-white focus:ring-white/20 px-6" value={settings.contact_email} onChange={(e) => setSettings({...settings, contact_email: e.target.value})} />
                            </div>
                         </div>
                         <Button onClick={handleSaveSettings} className="w-full bg-white text-[#0e1b52] hover:bg-slate-50 rounded-2xl h-16 font-black uppercase text-[11px] tracking-[0.2em] mt-10 shadow-2xl relative cursor-pointer active:scale-95 transition-all">GLOBAL PERSISTENCE</Button>
                    </Card>
                </div>

                {/* Narrative & Connection Matrix */}
                <div className="space-y-8">
                     <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-white p-10">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-indigo-600 pl-4">Narrative Layer</h4>
                        <div className="space-y-6">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Global Description (SEO)</Label>
                                <Textarea className="rounded-[32px] border-slate-100 focus:ring-indigo-600 bg-slate-50/30 h-48 p-8 font-medium text-slate-700 leading-relaxed shadow-xs" value={settings.site_description} onChange={(e) => setSettings({...settings, site_description: e.target.value})} placeholder="Define the portal's global narrative..." />
                            </div>
                             <div className="space-y-2.5">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Command Center Location</Label>
                                <Input className="rounded-2xl border-slate-100 h-14 focus:ring-indigo-600 bg-slate-50/30 font-bold text-slate-900 px-6 shadow-xs" value={settings.location} onChange={(e) => setSettings({...settings, location: e.target.value})} />
                            </div>
                        </div>
                     </Card>

                     <Card className="rounded-[40px] border-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] bg-white p-10 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Globe className="w-40 h-40" /></div>
                         <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-l-4 border-indigo-600 pl-4">Network Connectivity</h4>
                         <div className="space-y-5">
                             {[
                                { key: 'github_url', label: 'GitHub Matrix URI', icon: Globe },
                                { key: 'linkedin_url', label: 'LinkedIn Professional Port', icon: Globe },
                                { key: 'twitter_url', label: 'X (Twitter) Broadcast', icon: Globe }
                             ].map((net, i) => (
                                <div key={i} className="space-y-1.5">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{net.label}</Label>
                                    <Input className="rounded-xl border-slate-100 h-12 focus:ring-indigo-600 bg-slate-50/20 font-bold text-slate-600 px-5 shadow-xs" value={(settings as any)[net.key]} onChange={(e) => setSettings({...settings, [net.key]: e.target.value})} />
                                </div>
                             ))}
                         </div>
                     </Card>
                </div>
            </div>
            
            <div className="lg:hidden h-4"></div>
            <Button onClick={handleSaveSettings} disabled={isSaving} className="lg:hidden w-full bg-[#0e1b52] hover:bg-[#13236e] active:scale-95 text-white font-black rounded-[24px] h-20 shadow-[0_30px_60px_rgba(14,27,82,0.3)] uppercase text-xs tracking-[0.2em] transition-all mb-8 cursor-pointer">
                {isSaving ? 'PERSISTING DATA...' : 'SYNCHRONIZE ALL SETTINGS'}
            </Button>
        </form>
      </div>

      <div className="lg:hidden h-24"></div>
    </div>
  )
}
