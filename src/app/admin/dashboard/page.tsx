"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MessageSquare, 
  FolderOpen, 
  Code,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Stats {
  totalMessages: number
  unreadMessages: number
  totalProjects: number
  featuredProjects: number
  totalSkills: number
  totalEducation: number
  totalExperience: number
}

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
              Dasbor
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Selamat datang kembali! Berikut adalah ringkasan portofolio Anda.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesan</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} belum dibaca
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyek</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.featuredProjects} unggulan
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Keahlian</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSkills}</div>
              <p className="text-xs text-muted-foreground">
                Keahlian teknis
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengalaman</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExperience}</div>
              <p className="text-xs text-muted-foreground">
                Posisi pekerjaan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendidikan</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEducation}</div>
              <p className="text-xs text-muted-foreground">
                Riwayat pendidikan
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kelengkapan Portofolio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(((stats.totalProjects > 0 ? 1 : 0) + 
                             (stats.totalSkills > 0 ? 1 : 0) + 
                             (stats.totalEducation > 0 ? 1 : 0) + 
                             (stats.totalExperience > 0 ? 1 : 0)) / 4 * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Kelengkapan keseluruhan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pesan Terbaru</CardTitle>
              <Link 
                href="/admin/messages" 
                className="text-sm text-primary hover:underline"
              >
                Lihat semua
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Belum ada pesan
              </p>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{message.name}</h4>
                        {!message.isRead && (
                          <Badge variant="default" className="text-xs">Baru</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                      <p className="text-sm font-medium mt-1">{message.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Link href="/admin/projects">
            <Card className="cursor-pointer card-hover-glow">
              <CardContent className="p-6 text-center">
                <FolderOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Kelola Proyek</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/skills">
            <Card className="cursor-pointer card-hover-glow">
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Kelola Keahlian</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/profile">
            <Card className="cursor-pointer card-hover-glow">
              <CardContent className="p-6 text-center">
                <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Perbarui Profil</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}