"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  FolderOpen, 
  Code,
  Briefcase,
  TrendingUp,
  Calendar,
  ChevronDown,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  User,
  LogOut,
  Shield,
  GraduationCap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { cn } from '@/lib/utils'

// Types
interface Message {
  id: string
  name: string
  isRead: boolean
  createdAt: string | Date
}

interface Project {
  id: string
  featured: boolean
}

interface Skill {
  id: string
  name: string
  levelPercent: number
}

interface Profile {
  fullName: string
  profileImage: string | null
  title?: string
}

interface Stats {
  totalMessages: number
  unreadMessages: number
  totalProjects: number
  featuredProjects: number
  totalSkills: number
  totalEducation: number
  totalExperience: number
}

const DEFAULT_PROFILE_IMAGE = '/uploads/profile/1764442818168-WhatsApp Image 2022-06-01 at 17.06.23.PNG'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalProjects: 0,
    featuredProjects: 0,
    totalSkills: 0,
    totalEducation: 0,
    totalExperience: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Helper for safe fetching
      const safeFetch = async (url: string) => {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Status ${res.status}`)
          const json = await res.json()
          return json.success ? json.data : []
        } catch (e) {
          console.warn(`Failed to fetch ${url}`, e)
          return [] // Return empty array on failure
        }
      }
      
      const safeFetchObject = async (url: string) => {
         try {
          const res = await fetch(url)
          const json = await res.json()
          return json.success ? json.data : null
         } catch (e) {
           console.warn(`Failed to fetch ${url}`, e)
           return null
         }
      }

      const [messages, projects, skillsData, education, experience, profileData] = await Promise.all([
        safeFetch('/api/contact'),
        safeFetch('/api/projects'),
        safeFetch('/api/skills'),
        safeFetch('/api/education'),
        safeFetch('/api/experience'),
        safeFetchObject('/api/profile')
      ])

      setStats({
        totalMessages: Array.isArray(messages) ? messages.length : 0,
        unreadMessages: Array.isArray(messages) ? messages.filter((m: any) => !m.isRead).length : 0,
        totalProjects: Array.isArray(projects) ? projects.length : 0,
        featuredProjects: Array.isArray(projects) ? projects.filter((p: any) => p.featured).length : 0,
        totalSkills: Array.isArray(skillsData) ? skillsData.length : 0,
        totalEducation: Array.isArray(education) ? education.length : 0,
        totalExperience: Array.isArray(experience) ? experience.length : 0
      })

      setRecentMessages(Array.isArray(messages) ? messages.slice(0, 5) : [])
      setSkills(Array.isArray(skillsData) ? skillsData : [])
      
      if (profileData && typeof profileData === 'object') {
        setProfile(profileData)
      } else {
        setProfile(null)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    // Return static data initially to avoid hydration mismatch, or only generate on client
    return months.map((month, index) => ({
      name: month,
      messages: 20 + (index * 5), // Deterministic data
      projects: 2 + (index % 3),
    }))
  }, [])

  // Function to safely format dates
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (e) {
      return 'N/A'
    }
  }

  if (isLoading || !mounted) {
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 lg:pb-12">
      {/* 
          PORTFOLIO PREMIUM DASHBOARD
          Mobile Header - Blue "Main Card" 
      */}
      <div className="lg:hidden p-4 bg-[#F8FAFC]">
        <div className="rounded-[48px] bg-[#4f46e5] shadow-[0_30px_70px_-15px_rgba(79,70,229,0.5)] overflow-hidden text-white relative min-h-[480px] flex flex-col p-8 pt-6">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            
            {/* Top Bar: Clean Navigation */}
            <div className="flex items-center justify-between relative z-20 mb-[3.9rem]">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-white rounded-full group-hover:h-8 transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                    <h1 className="text-xl font-black tracking-tighter text-white uppercase opacity-90">My Dashboard</h1>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/10 backdrop-blur-xl rounded-[22px] h-12 w-12 border border-white/10 text-white hover:bg-white/20 transition-all cursor-pointer shadow-2xl active:scale-90"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-logout-confirm'))}
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>

            {/* Main Identity Card (Solid White for seamless blending) */}
            <div className="mt-auto relative bg-white rounded-[56px] p-8 pb-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] flex flex-col">
                {/* Advanced Profile 'Cutout' - Overlapping but Integrated */}
                {/* Centered Circular Profile */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 group cursor-pointer z-30">
                    <div className="relative w-32 h-32 rounded-full border-[6px] border-[#F8FAFC] shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105 bg-white">
                        <img 
                            src={profile?.profileImage || DEFAULT_PROFILE_IMAGE} 
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    {/* Elite Status Badge */}
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-[#10b981] border-4 border-white rounded-full shadow-lg z-40 animate-pulse"></div>
                </div>

                <div className="pt-20 space-y-6">
                    <div className="space-y-1.5 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                            <Shield className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Admin</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter leading-none text-slate-900 drop-shadow-sm">{profile?.fullName || 'Ari Rusmawan'}</h2>
                        
                        <div className="pt-4">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                IT Educator | Web Developer <br/> IT Support | QA/QC | Expeditor
                             </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Desktop Header Navigation */}
        <div className="hidden lg:flex flex-col md:flex-row md:items-center justify-between pt-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">Portfolio Analytics</h1>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-[0.2em]">Real-time performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-xl shadow-slate-200/50 text-sm font-black text-slate-600 group cursor-pointer hover:bg-slate-50 transition-all">
              <Calendar className="w-4 h-4 mr-3 text-indigo-500 font-black" />
              <span>Oct 2024 - Dec 2024</span>
              <ChevronDown className="w-4 h-4 ml-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Mobile "Quick Actions" - Icon Row */}
        <div className="lg:hidden space-y-5 px-2 mt-12">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</h3>
             <span className="text-[10px] font-black text-indigo-600 uppercase">View All</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Add Project', icon: Plus, color: 'bg-indigo-50 text-indigo-600', href: '/admin/projects' },
              { label: 'Update Info', icon: User, color: 'bg-blue-50 text-blue-600', href: '/admin/profile' },
              { label: 'Add Skill', icon: Code, color: 'bg-emerald-50 text-emerald-600', href: '/admin/skills' },
              { label: 'Education', icon: GraduationCap, color: 'bg-orange-50 text-orange-600', href: '/admin/education' },
              { label: 'Experience', icon: Briefcase, color: 'bg-pink-50 text-pink-600', href: '/admin/experience' },
              { label: 'Messages', icon: MessageSquare, color: 'bg-cyan-50 text-cyan-600', href: '/admin/messages' },
              { label: 'Settings', icon: Settings, color: 'bg-slate-50 text-slate-600', href: '/admin/settings' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex flex-col items-center gap-3">
                <div className={cn("w-[72px] h-[72px] rounded-[26px] flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.04)] bg-white active:scale-90 transition-all border border-slate-50", action.color)}>
                  <action.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black text-slate-500 text-center uppercase tracking-tighter leading-tight max-w-[60px]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Cards / Stats Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-[#0e1b52] text-white border-none shadow-[0_30px_60px_rgba(14,27,82,0.2)] rounded-[32px] hidden lg:block overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10"><MessageSquare className="w-20 h-20" /></div>
            <CardContent className="p-8">
              <p className="text-indigo-300 text-xs font-black uppercase tracking-widest">Direct Messages</p>
              <h3 className="text-4xl font-black mt-3 leading-none">{stats.totalMessages}</h3>
              <p className="text-[10px] text-indigo-400 font-bold uppercase mt-4 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% this week</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-[0_25px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Active Projects</p>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><FolderOpen className="w-4 h-4" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalProjects}</h3>
              <div className="mt-4 flex items-center justify-between">
                 <div className="flex items-center -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>)}
                 </div>
                 <Badge className="bg-green-100 text-green-700 font-black text-[9px] rounded-lg">8 NEW</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-[0_25px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:bg-slate-50 transition-colors cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">Skills Mastery</p>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Code className="w-4 h-4" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalSkills}</h3>
              <div className="w-full h-1 bg-slate-50 rounded-full mt-4 overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full" style={{width: '78%'}}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-[0_25px_50px_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:bg-slate-50 transition-colors hidden sm:block lg:block cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">Unread Inbox</p>
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.unreadMessages}</h3>
              <p className="text-[10px] text-red-300 font-bold mt-4 uppercase">Prioritize responding</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-[0_25px_50_rgba(0,0,0,0.04)] rounded-[32px] overflow-hidden group hover:bg-slate-50 transition-colors hidden lg:block cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest">Experience</p>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalExperience}</h3>
              <p className="text-[10px] text-purple-300 font-bold mt-4 uppercase">Growth across years</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Transactions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Chart Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border-none shadow-[0_40px_80px_-10px_rgba(0,0,0,0.06)] rounded-[40px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between px-10 py-8 border-b border-slate-50">
                <div>
                    <CardTitle className="text-xl font-black text-slate-900 tracking-tight">ENGAGEMENT FLOW</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Portfolio Traffic & Inquiries</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button className="px-6 py-2 bg-white rounded-xl shadow-lg text-xs font-black text-indigo-600 transition-all active:scale-95">2024</button>
                  <button className="px-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Daily</button>
                </div>
              </CardHeader>
              <CardContent className="px-6 py-10">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 900}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc', radius: 12}}
                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px -10px rgba(0,0,0,0.2)', padding: '20px'}}
                      />
                      <Bar dataKey="messages" stackId="a" fill="#4f46e5" radius={[12, 12, 12, 12]} barSize={28} />
                      <Bar dataKey="projects" stackId="a" fill="#10b981" radius={[12, 12, 12, 12]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Resume / Skills Progress Comparison */}
            <div className="hidden lg:grid grid-cols-2 gap-8">
               <Card className="rounded-[40px] shadow-xl shadow-slate-200/40 border-none bg-white p-2">
                <CardHeader className="px-8 pt-8 pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Core Skill Matrix</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  {skills.slice(0, 4).map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-700">{skill.name}</span>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{skill.levelPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" style={{width: `${skill.levelPercent}%`}}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
               </Card>
               <Card className="rounded-[40px] shadow-xl shadow-slate-200/40 border-none bg-indigo-600 text-white p-10 flex flex-col justify-between">
                <div>
                   <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white/50">Activity Index</CardTitle>
                   <h3 className="text-4xl font-black mt-6 leading-tight tracking-tighter">Your profile reach is up by 32%</h3>
                   <p className="text-xs font-bold text-white/60 mt-4 leading-relaxed">Keep adding new projects to maintain high engagement with recruiters.</p>
                </div>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 rounded-[24px] h-14 font-black uppercase text-[10px] tracking-widest mt-8 shadow-2xl">Download Detailed Report</Button>
               </Card>
            </div>
          </div>

          {/* High Impact Transaction List Style Messages */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Recent Messages</h3>
              <div className="w-10 h-10 rounded-2xl bg-white shadow-xl shadow-slate-200/40 border border-slate-50 flex items-center justify-center text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors">
                <Settings className="w-5 h-5" />
              </div>
            </div>
            
            <div className="space-y-4">
              {recentMessages.map((msg, i) => (
                <Card key={i} className="rounded-[32px] border-none shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer bg-white group p-1">
                  <CardContent className="p-4 flex items-center gap-5">
                    <div className={cn(
                        "w-14 h-14 rounded-[22px] flex items-center justify-center shrink-0 transition-all duration-300 shadow-inner",
                        msg.isRead ? "bg-slate-50 text-slate-300" : "bg-indigo-50 text-indigo-600"
                    )}>
                      <ArrowDownLeft className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate tracking-tight">{msg.name || 'Anonymous'}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                        {formatDate(msg.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {msg && !msg.isRead ? (
                        <div className="text-green-500 flex flex-col items-end">
                            <span className="text-xs font-black">+1 NEW</span>
                            <span className="text-[10px] font-black uppercase text-slate-300 opacity-50">UNREAD</span>
                        </div>
                      ) : (
                        <div className="text-slate-300 flex flex-col items-end">
                            <span className="text-xs font-black">STABLE</span>
                            <span className="text-[10px] font-black uppercase opacity-50">READ</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recentMessages.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-5 bg-white rounded-[40px] shadow-sm border border-slate-50 p-8">
                   <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                     <MessageSquare className="w-10 h-10 text-slate-200" />
                   </div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No incoming messages</p>
                </div>
              )}
            </div>

            <Button variant="ghost" className="w-full rounded-[24px] h-14 border border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-widest bg-white shadow-xl shadow-slate-200/50 hover:bg-slate-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-3" asChild>
              <Link href="/admin/messages">View Message History <ArrowUpRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer Spacer for Mobile Bottom Nav */}
      <div className="lg:hidden h-24"></div>
    </div>
  )
}