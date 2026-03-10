'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Camera, Sparkles, Users, Trophy, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('booksnap_user');
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo user data
    const userData = {
      id: '1',
      name: formData.name || 'Demo User',
      email: formData.email,
      role: formData.role,
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      streak: 7,
      totalScans: 45,
      joinedDate: new Date().toISOString()
    };
    
    localStorage.setItem('booksnap_user', JSON.stringify(userData));
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookSnap
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Transform physical books into intelligent, searchable digital libraries with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Camera className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Smart Scanning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Advanced OCR with real-time text extraction
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Sparkles className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">AI Enhancement</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Summaries, highlights, and concept detection
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Users className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-semibold mb-2">Social Learning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share insights and collaborate with friends
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20">
              <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="font-semibold mb-2">Gamified Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Streaks, achievements, and learning goals
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome to BookSnap</CardTitle>
            <CardDescription>
              Enter your credentials to access your digital library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="demo@booksnap.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select 
                      name="role" 
                      value={formData.role} 
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="user">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <Shield className="w-4 h-4 inline mr-1" />
                Your data is encrypted and secure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}