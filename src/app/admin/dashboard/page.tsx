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
  Plus
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
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface Stats {
  totalMessages: number
  unreadMessages: number
  totalProjects: number
  featuredProjects: number
  totalSkills: number
  totalEducation: number
  totalExperience: number
}

// Chart color palettes
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
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [messagesRes, projectsRes, skillsRes, educationRes, experienceRes] = await Promise.all([
        fetch('/api/contact'),
        fetch('/api/projects'),
        fetch('/api/skills'),
        fetch('/api/education'),
        fetch('/api/experience')
      ])

      const messagesData = await messagesRes.json()
      const projectsData = await projectsRes.json()
      const skillsData = await skillsRes.json()
      const educationData = await educationRes.json()
      const experienceData = await experienceRes.json()

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
      setProjects(projects)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Memoized data for charts
  const shipmentData = useMemo(() => {
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    return months.map(month => ({
      name: month,
      messages: Math.floor(Math.random() * 100) + 50,
      projects: Math.floor(Math.random() * 20) + 10,
      skills: Math.floor(Math.random() * 15) + 5,
    }))
  }, [])

  const salesData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1)
    return days.map(day => ({
      name: `Jan ${day}`,
      value: Math.floor(Math.random() * 2000) + 3000,
    }))
  }, [])

  const skillCategoriesData = useMemo(() => {
    const categories: Record<string, number> = {}
    skills.forEach(skill => {
      categories[skill.category] = (categories[skill.category] || 0) + 1
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [skills])

  const projectStatusData = useMemo(() => {
    return [
      { name: 'Featured', value: stats.featuredProjects },
      { name: 'Standard', value: stats.totalProjects - stats.featuredProjects },
    ]
  }, [stats])

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12">
      {/* Top Utility Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Monitor your portfolio performance and interactions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm text-sm font-medium">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span>Jan 01, 2024 - Dec 31, 2024</span>
            <ChevronDown className="w-4 h-4 ml-2 text-slate-400" />
          </div>
          <Button variant="outline" size="icon" className="bg-white">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-[#0e1b52] text-white border-none shadow-xl">
            <CardContent className="p-6">
              <p className="text-indigo-200 text-sm font-medium">Total Messages</p>
              <div className="mt-2 flex items-baseline justify-between">
                <h3 className="text-3xl font-bold">{stats.totalMessages}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ecf4ff] border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-medium">Active Projects</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">14% of total</Badge>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalProjects}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#e6fce9] border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-medium">Completed Skills</p>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">81% of total</Badge>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalSkills}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#fff2f2] border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-medium">Unread Inbox</p>
                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">5% of total</Badge>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.unreadMessages}</h3>
            </CardContent>
          </Card>

          <Card className="bg-[#f0f0ff] border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 text-sm font-medium">Experience Items</p>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">14% growth</Badge>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{stats.totalExperience}</h3>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Interactions Analytics</CardTitle>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button className="px-3 py-1 bg-white rounded-md shadow-sm">Year</button>
                <button className="px-3 py-1 text-slate-500">Month</button>
                <button className="px-3 py-1 text-slate-500">Week</button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-10">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shipmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="messages" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={40} />
                    <Bar dataKey="projects" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={40} />
                    <Bar dataKey="skills" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-6">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div><span className="text-xs text-slate-500 font-medium">Messages</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div><span className="text-xs text-slate-500 font-medium">Projects</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div><span className="text-xs text-slate-500 font-medium">Skills</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Engagement Growth</CardTitle>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button className="px-3 py-1 bg-white rounded-md shadow-sm">Year</button>
                <button className="px-3 py-1 text-slate-500">Month</button>
                <button className="px-3 py-1 text-slate-500">Week</button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-10">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} hide />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-2 mt-6">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 border-indigo-200 bg-indigo-50">Overall Trends</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Skill Categories</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" asChild>
                <Link href="/admin/skills">See All <ExternalLink className="w-3 h-3 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skillCategoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {skillCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{stats.totalSkills}</span>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Av. Skill Level</CardTitle>
              <Badge variant="outline" className="text-slate-500">Top Skills</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                {skills.slice(0, 5).map((skill, i) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                      <span className="text-sm font-bold text-slate-900">{skill.levelPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${skill.levelPercent}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                {skills.length === 0 && (
                  <div className="py-12 text-center text-slate-400 italic">No skills data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
              <CardTitle className="text-lg font-bold">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" asChild>
                <Link href="/admin/messages">See All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{msg.name}</p>
                      <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      {!msg.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm"></div>}
                    </div>
                  </div>
                ))}
                {recentMessages.length === 0 && (
                  <div className="py-20 text-center text-slate-400 italic">No messages yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions / Shortcut Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Add Project', icon: Plus, href: '/admin/projects', color: 'bg-indigo-100 text-indigo-600' },
            { label: 'Messages', icon: MessageSquare, href: '/admin/messages', color: 'bg-blue-100 text-blue-600' },
            { label: 'Edit Profile', icon: Briefcase, href: '/admin/profile', color: 'bg-emerald-100 text-emerald-600' },
            { label: 'Settings', icon: GraduationCap, href: '/admin/settings', color: 'bg-purple-100 text-purple-600' },
            { label: 'Add Skill', icon: Code, href: '/admin/skills', color: 'bg-amber-100 text-amber-600' },
            { label: 'Public Site', icon: ExternalLink, href: '/', color: 'bg-slate-100 text-slate-600' },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <Card className="hover:border-indigo-200 hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}