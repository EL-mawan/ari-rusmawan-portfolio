"use client"

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  FolderOpen, 
  Code,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Calendar,
  MoreVertical,
  ChevronDown,
  Bell,
  Search,
  ExternalLink,
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  User,
  LayoutDashboard
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { cn } from '@/lib/utils'

interface Stats {
  totalMessages: number
  unreadMessages: number
  totalProjects: number
  featuredProjects: number
  totalSkills: number
  totalEducation: number
  totalExperience: number
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function AdminDashboard() {
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
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [messagesRes, projectsRes, skillsRes, educationRes, experienceRes, profileRes] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/education'),
        fetch('/api/experience'),
        fetch('/api/profile')
      ])

      const messagesData = await messagesRes.json()
      const projectsData = await projectsRes.json()
      const skillsData = await skillsRes.json()
      const educationData = await educationRes.json()
      const experienceData = await experienceRes.json()
      const profileData = await profileRes.json()

      const messages = messagesData.success ? messagesData.data : []
      const projects = projectsData.success ? projectsData.data : []
      const skills = skillsData.success ? skillsData.data : []
      const education = educationData.success ? educationData.data : []
      const experience = experienceData.success ? experienceData.data : []

      setStats({
        totalMessages: messages.length,
        unreadMessages: messages.filter((m: any) => !m.isRead).length,
        totalProjects: projects.length,
        featuredProjects: projects.filter((p: any) => p.featured).length,
        totalSkills: skills.length,
        totalEducation: education.length,
        totalExperience: experience.length
      })

      setRecentMessages(messages.slice(0, 5))
      setSkills(skills)
      if (profileData.success) setProfile(profileData.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const chartData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    return months.map(month => ({
      name: month,
      messages: Math.floor(Math.random() * 50) + 10,
      projects: Math.floor(Math.random() * 5) + 2,
    }))
  }, [])

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 lg:pb-12">
      {/* Mobile-Only Header (Banking Style) */}
      <div className="lg:hidden relative h-72 w-full bg-linear-to-br from-[#536dfe] via-[#3d5afe] to-[#304ffe] rounded-b-[40px] px-6 pt-12 text-white overflow-hidden shadow-2xl">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white/30 shadow-md">
              <AvatarImage src={profile?.profileImage || ''} />
              <AvatarFallback className="bg-white/20 text-white font-bold">AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium text-white/70">Good Day!</p>
              <h2 className="text-base font-bold tracking-tight">{profile?.fullName || 'Ari Rusmawan'}</h2>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full bg-white/10 backdrop-blur-sm">
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-2 text-white/80 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest">Profile Performance</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{stats.totalMessages + stats.totalProjects + stats.totalSkills}00</span>
            <span className="text-sm font-bold text-white/60">Points</span>
          </div>
          <p className="text-[10px] font-medium text-white/50 mt-1 uppercase tracking-tighter">Account ID: *** *** {profile?.id?.slice(-4) || '3569'}</p>
        </div>

        <div className="flex gap-3 mt-6 relative z-10">
          <Button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl h-12 font-bold flex items-center justify-center gap-2">
            <ArrowDownLeft className="w-4 h-4" /> Message Logs
          </Button>
          <Button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-2xl h-12 font-bold flex items-center justify-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> View Site
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Desktop Title & Date Bar */}
        <div className="hidden lg:flex flex-col md:flex-row md:items-center justify-between pt-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">Global performance summary of your portfolio.</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm text-sm font-bold text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              <span>Jan 01, 2024 - Dec 31, 2024</span>
              <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
            </div>
            <Button variant="outline" size="icon" className="bg-white rounded-xl shadow-sm border-slate-200">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Banking "Upgrade Account" style banner */}
        <div className="lg:hidden mt-6">
          <Card className="bg-white border-slate-100 shadow-xl shadow-slate-200/50 rounded-[24px] overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black text-slate-900">Optimize Profile</h3>
                <p className="text-[11px] font-bold text-slate-500 leading-tight">Complete your projects and skills for better reach.</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300" />
            </CardContent>
          </Card>
        </div>

        {/* Mobile "Quick Actions" Section */}
        <div className="lg:hidden space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest px-1">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Add Project', icon: Plus, color: 'bg-indigo-50 text-indigo-600', href: '/admin/projects' },
              { label: 'Edit Bio', icon: User, color: 'bg-blue-50 text-blue-600', href: '/admin/profile' },
              { label: 'New Skill', icon: Code, color: 'bg-emerald-50 text-emerald-600', href: '/admin/skills' },
              { label: 'Site', icon: ExternalLink, color: 'bg-purple-50 text-purple-600', href: '/' },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex flex-col items-center gap-2">
                <div className={cn("w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg shadow-slate-200/50", action.color)}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-slate-500 text-center uppercase tracking-tighter leading-tight">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Row (Desktop) & Remaining Stats (Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Main Desktop Stat / Stats Carousel for Mobile could be here */}
          <Card className="bg-[#0e1b52] text-white border-none shadow-2xl rounded-[30px] lg:rounded-2xl hidden lg:block">
            <CardContent className="p-6">
              <p className="text-indigo-200 text-sm font-medium">Total Messages</p>
              <div className="mt-2 flex items-baseline justify-between">
                <h3 className="text-3xl font-bold">{stats.totalMessages}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ecf4ff] border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Projects</p>
                <Badge className="bg-blue-100 text-blue-700">14% growth</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalProjects}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#e6fce9] border-none shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Skill Level</p>
                <Badge className="bg-green-100 text-green-700">Top 5%</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalSkills}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#fff2f2] border-none shadow-sm rounded-2xl hidden sm:block lg:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Unread Inbox</p>
                <Badge className="bg-red-100 text-red-700">{stats.unreadMessages} New</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.unreadMessages}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#f0f0ff] border-none shadow-sm rounded-2xl hidden lg:block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Experience</p>
                <Badge className="bg-indigo-100 text-indigo-700">Senior</Badge>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{stats.totalExperience}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Transactions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-slate-100 shadow-xl shadow-slate-200/50 rounded-[30px] overflow-hidden border-none">
              <CardHeader className="flex flex-row items-center justify-between px-8 py-6 border-b border-slate-50">
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-widest">Interactions</CardTitle>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button className="px-4 py-1.5 bg-white rounded-lg shadow-sm text-xs font-black text-slate-900 transition-all">Year</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Month</button>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '15px'}}
                      />
                      <Bar dataKey="messages" stackId="a" fill="#4f46e5" radius={[20, 20, 20, 20]} barSize={25} />
                      <Bar dataKey="projects" stackId="a" fill="#10b981" radius={[20, 20, 20, 20]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Resume / Skills Progress on Desktop */}
            <div className="hidden lg:grid grid-cols-2 gap-6">
               <Card className="rounded-[30px] shadow-sm border-slate-100">
                <CardHeader className="flex flex-row items-center justify-between px-6 pb-2">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Skill Level</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  {skills.slice(0, 3).map((skill, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className="text-indigo-600">{skill.levelPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{width: `${skill.levelPercent}%`}}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
               </Card>
               <Card className="rounded-[30px] shadow-sm border-slate-100">
                <CardHeader className="pb-2">
                   <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Analytics Source</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-slate-900">{stats.totalEducation}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institutions</div>
                    </div>
                    <div className="w-px h-10 bg-slate-100 mx-2"></div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-slate-900">{stats.totalExperience}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jobs</div>
                    </div>
                  </div>
                </CardContent>
               </Card>
            </div>
          </div>

          {/* Banking Style "Recent Transactions" (Recent Messages) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Recent Messages</h3>
              <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 bg-white shadow-sm border border-slate-100">
                <Settings className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentMessages.map((msg, i) => (
                <Card key={i} className="rounded-[24px] border-none shadow-xl shadow-slate-200/40 hover:scale-[1.02] transition-transform cursor-pointer bg-white">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
                      <ArrowDownLeft className="w-5 h-5 text-slate-900" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-slate-900 truncate">{msg.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-500">+1 Inbox</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Incoming</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {recentMessages.length === 0 && (
                <div className="py-12 text-center flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                     <MessageSquare className="w-8 h-8 text-slate-200" />
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No messages yet</p>
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full rounded-[20px] h-12 border-slate-100 text-slate-500 font-bold bg-white shadow-sm" asChild>
              <Link href="/admin/messages">View Full History</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Spacer for bottom nav on mobile */}
      <div className="lg:hidden h-20"></div>
    </div>
  )
}