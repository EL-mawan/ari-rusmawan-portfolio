'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Moon, 
  Sun, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Send,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Code,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface Profile {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  phone: string;
  emailPublic: string;
  cvPath?: string;
  profileImage?: string;
  socialLinks?: any;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  major?: string;
  startYear: number;
  endYear: number;
  description?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  location?: string;
  responsibilities?: string[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  levelPercent: number;
  icon?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  images?: string[];
  techStack?: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const { toast } = useToast();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [profileRes, educationRes, experienceRes, skillsRes, projectsRes] = await Promise.all([
          fetch('/api/profile').then(r => r.json()),
          fetch('/api/education').then(r => r.json()),
          fetch('/api/experience').then(r => r.json()),
          fetch('/api/skills').then(r => r.json()),
          fetch('/api/projects').then(r => r.json()),
        ]);

        // Set profile data
        if (profileRes.success && profileRes.data) {
          const profileData = profileRes.data;
          setProfile({
            fullName: profileData.fullName,
            title: profileData.title,
            bio: profileData.bio,
            location: profileData.location,
            phone: profileData.phone,
            emailPublic: profileData.emailPublic,
            cvPath: profileData.cvPath,
            profileImage: profileData.profileImage,
            socialLinks: profileData.socialLinks ? JSON.parse(profileData.socialLinks) : null
          });
        }

        // Set education data
        if (educationRes.success && educationRes.data) {
          setEducation(educationRes.data);
        }

        // Set experience data
        if (experienceRes.success && experienceRes.data) {
          // API already parses responsibilities
          setExperiences(experienceRes.data);
        }

        // Set skills data
        if (skillsRes.success && skillsRes.data) {
          setSkills(skillsRes.data);
        }

        // Set projects data
        if (projectsRes.success && projectsRes.data) {
          // API already parses techStack and images
          setProjects(projectsRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load portfolio data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique skill categories
  const skillCategories = Array.from(new Set(skills.map(s => s.category)));
  
  // Filter skills by category
  const filteredSkills = selectedSkillCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedSkillCategory);

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary">AR</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors">Beranda</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">Tentang</button>
              <button onClick={() => scrollToSection('education')} className="hover:text-primary transition-colors">Pendidikan</button>
              <button onClick={() => scrollToSection('experience')} className="hover:text-primary transition-colors">Pengalaman</button>
              <button onClick={() => scrollToSection('skills')} className="hover:text-primary transition-colors">Keahlian</button>
              <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">Proyek</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Kontak</button>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-accent transition-colors">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="px-4 py-2 space-y-2">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 hover:text-primary transition-colors">Beranda</button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 hover:text-primary transition-colors">Tentang</button>
              <button onClick={() => scrollToSection('education')} className="block w-full text-left py-2 hover:text-primary transition-colors">Pendidikan</button>
              <button onClick={() => scrollToSection('experience')} className="block w-full text-left py-2 hover:text-primary transition-colors">Pengalaman</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left py-2 hover:text-primary transition-colors">Keahlian</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left py-2 hover:text-primary transition-colors">Proyek</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 hover:text-primary transition-colors">Kontak</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 animate-gradient-shift"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl animate-float-delayed-slow"></div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up px-4">
            Halo, Saya <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-gradient-text">{profile?.fullName || 'Ari Rusmawan'}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-200 px-4">
            {profile?.title || 'Information Technology Education | Programmer | Adm. QA/QC | Project Expeditor'}
          </p>
          <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-300 px-4">
            {profile?.bio || 'Passionate about educational technology, quality software development, and efficient project management. Bridging the gap between education and industry through innovative solutions.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            {profile?.cvPath && (
              <Button size="lg" className="gap-2 hover:scale-105 transition-transform duration-200" asChild>
                <a href={profile.cvPath} download>
                  <Download className="h-4 w-4" />
                  Unduh CV
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => scrollToSection('contact')} className="gap-2 hover:scale-105 transition-transform duration-200">
              <Mail className="h-4 w-4" />
              Hubungi Saya
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tentang Saya</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              {profile?.profileImage ? (
                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={profile.profileImage} 
                    alt={profile.fullName || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-linear-to-br from-primary to-primary/60 rounded-full flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-white">
                    {profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : 'AR'}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">
                {profile?.bio || 'I am a dedicated Information Technology Education professional...'}
              </p>
              
              <div className="space-y-3">
                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.emailPublic && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>{profile.emailPublic}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
              
              {profile?.socialLinks && (
                <div className="flex gap-4">
                  {profile.socialLinks.linkedin && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {profile.socialLinks.github && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {profile.socialLinks.twitter && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 bg-accent/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pendidikan</h2>
          <div className="space-y-8">
            {education.map((edu, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 w-full">
                      <CardTitle className="text-lg sm:text-xl">{edu.degree}</CardTitle>
                      <CardDescription className="text-base sm:text-lg font-medium text-primary">
                        {edu.school}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{edu.startYear} - {edu.endYear}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{edu.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pengalaman</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 w-full">
                      <CardTitle className="text-lg sm:text-xl">{exp.position}</CardTitle>
                      <CardDescription className="text-base sm:text-lg font-medium text-primary">
                        {exp.company}
                      </CardDescription>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exp.responsibilities && exp.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-accent/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Keahlian</h2>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedSkillCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedSkillCategory('all')}
              size="sm"
            >
              Semua Keahlian
            </Button>
            {skillCategories.map((category) => (
              <Button
                key={category}
                variant={selectedSkillCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedSkillCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSkills.map((skill, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm text-muted-foreground">{skill.levelPercent}%</span>
                </div>
                <Progress value={skill.levelPercent} className="h-2" />
                <Badge variant="secondary" className="mt-2 text-xs">
                  {skill.category}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Proyek</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Code className="h-12 w-12 text-primary" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {project.featured && (
                      <Badge variant="default" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack && project.techStack.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" className="gap-1 flex-1" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button variant="outline" size="sm" className="gap-1 flex-1" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-accent/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Hubungi Saya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Mari Terhubung</h3>
              <p className="text-muted-foreground">
                Saya selalu tertarik mendengar tentang peluang baru dan proyek yang menarik. 
                Apakah Anda memiliki pertanyaan atau hanya ingin menyapa, jangan ragu untuk menghubungi!
              </p>
              
              <div className="space-y-4">
                {profile?.emailPublic && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{profile.emailPublic}</p>
                    </div>
                  </div>
                )}
                
                {profile?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-sm text-muted-foreground">{profile.phone}</p>
                    </div>
                  </div>
                )}
                
                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Lokasi</p>
                      <p className="text-sm text-muted-foreground">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini dan saya akan menghubungi Anda sesegera mungkin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subjek</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {profile?.fullName || 'Ari Rusmawan'}. Hak Cipta Dilindungi. Dibuat dengan Next.js dan Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;