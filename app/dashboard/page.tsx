'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Camera, 
  Search, 
  BookOpen, 
  Zap, 
  Users, 
  Settings, 
  LogOut,
  Flame,
  Star,
  FileText,
  Eye,
  Download,
  Share,
  MoreVertical,
  Filter,
  Grid,
  List,
  Moon,
  Sun,
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  streak: number;
  totalScans: number;
  joinedDate: string;
}

interface Document {
  id: string;
  title: string;
  pages: number;
  scanDate: string;
  thumbnail: string;
  status: 'processing' | 'ready';
  aiSummary: string;
  tags: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('booksnap_user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Load dummy documents
    const dummyDocs: Document[] = [
      {
        id: '1',
        title: 'The Art of Computer Programming',
        pages: 24,
        scanDate: '2024-01-15',
        thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
        status: 'ready',
        aiSummary: 'Comprehensive guide to fundamental algorithms and data structures',
        tags: ['Computer Science', 'Algorithms', 'Programming']
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        pages: 18,
        scanDate: '2024-01-20',
        thumbnail: 'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg',
        status: 'ready',
        aiSummary: 'Introduction to ML concepts, neural networks, and practical applications',
        tags: ['Machine Learning', 'AI', 'Data Science']
      },
      {
        id: '3',
        title: 'Physics Chapter 5: Quantum Mechanics',
        pages: 12,
        scanDate: '2024-01-22',
        thumbnail: 'https://images.pexels.com/photos/8078384/pexels-photo-8078384.jpeg',
        status: 'processing',
        aiSummary: 'Exploring quantum phenomena and wave-particle duality',
        tags: ['Physics', 'Quantum', 'Science']
      }
    ];
    setDocuments(dummyDocs);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('booksnap_user');
    router.push('/');
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BookSnap
                </h1>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-orange-500">{user.streak}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">day streak</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Scan</h3>
                <Link href="/scan">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Scanning
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Scans</span>
                  <span className="font-semibold">{user.totalScans}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">This Month</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Achievement Level</span>
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    Scholar
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Friends Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alice Chen</p>
                    <p className="text-xs text-gray-500">Scanned 5 pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2" />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bob Smith</p>
                    <p className="text-xs text-gray-500">Achieved 10-day streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search your library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Documents Library */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Library</h2>
              
              {viewMode === 'grid' ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="group hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={doc.thumbnail} 
                            alt={doc.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm leading-tight line-clamp-2">
                              {doc.title}
                            </h3>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {doc.pages} pages
                            </span>
                            <Badge 
                              variant={doc.status === 'ready' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {doc.status}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {doc.aiSummary}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                            <img 
                              src={doc.thumbnail} 
                              alt={doc.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{doc.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                              {doc.aiSummary}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {doc.pages} pages
                              </span>
                              <Badge 
                                variant={doc.status === 'ready' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {doc.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(doc.scanDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}