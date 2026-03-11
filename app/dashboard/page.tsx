'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
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
  Bell,
  X,
  CheckCircle
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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: string; message: string; timestamp: string}>>([]);

  useEffect(() => {
    const userData = localStorage.getItem('booksnap_user');
    if (!userData) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Load theme preference
    const savedTheme = localStorage.getItem('booksnap_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Add some demo notifications
    setNotifications([
      { id: '1', message: 'Machine Learning PDF uploaded successfully', timestamp: '2 hours ago' },
      { id: '2', message: 'New book "Quantum Physics Guide" added', timestamp: '1 day ago' }
    ]);

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

  const handleThemeToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('booksnap_theme', newIsDark ? 'dark' : 'light');
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddNotification = (message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      timestamp: 'just now'
    };
    setNotifications([newNotification, ...notifications]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('booksnap_user');
    router.push('/');
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const handleReadDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsReadingMode(true);
  };

  const handleDownload = (doc: Document) => {
    const content = getBookContent(doc.id);
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${doc.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const handleShare = (doc: Document) => {
    if (navigator.share) {
      navigator.share({
        title: doc.title,
        text: doc.aiSummary,
        url: window.location.href,
      }).catch((err) => console.log('Error sharing:', err));
    } else {
      const shareText = `Check out "${doc.title}" on BookSnap AI: ${doc.aiSummary}`;
      alert(`Share this link:\n\n${shareText}`);
    }
  };

  const getBookContent = (bookId: string): string => {
    const bookContents: { [key: string]: string } = {
      '1': `CHAPTER 1: FUNDAMENTAL DATA STRUCTURES

1.1 Arrays and Lists
Arrays are the most basic data structure, allowing efficient access to elements by index. An array is a collection of elements of the same type stored in contiguous memory locations.

Example:
int arr[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

1.2 Linked Lists
Unlike arrays, linked lists use pointers to connect nodes. Each node contains data and a reference to the next node. This structure provides efficient insertion and deletion operations.

1.3 Stacks and Queues
Stacks follow the Last-In-First-Out (LIFO) principle, while queues follow the First-In-First-Out (FIFO) principle. Both are essential for many algorithms.

1.4 Trees and Graphs
Trees are hierarchical data structures with a root node and child nodes. Graphs are more general structures that can have cycles and multiple connections between nodes.

1.5 Hash Tables
Hash tables provide fast lookup, insertion, and deletion operations by using a hash function to map keys to indices. They are fundamental to many efficient algorithms.

CHAPTER 2: SORTING ALGORITHMS

2.1 Bubble Sort
Bubble sort is a simple algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.

Time Complexity: O(n²)
Space Complexity: O(1)

2.2 Quick Sort
Quick sort is a divide-and-conquer algorithm that selects a pivot element and partitions the array around it.

Time Complexity: O(n log n) average, O(n²) worst case
Space Complexity: O(log n)

2.3 Merge Sort
Merge sort divides the array into halves, recursively sorts them, and merges them back together.

Time Complexity: O(n log n)
Space Complexity: O(n)

CHAPTER 3: SEARCHING ALGORITHMS

3.1 Linear Search
Linear search checks each element sequentially until the target is found.

Time Complexity: O(n)

3.2 Binary Search
Binary search works on sorted arrays by repeatedly dividing the search space in half.

Time Complexity: O(log n)

CHAPTER 4: GRAPH ALGORITHMS

4.1 Breadth-First Search (BFS)
BFS explores nodes level by level using a queue data structure.

4.2 Depth-First Search (DFS)
DFS explores as far as possible along each branch before backtracking, using a stack.

4.3 Dijkstra's Algorithm
Dijkstra's algorithm finds the shortest path between nodes in a weighted graph.`,

      '2': `CHAPTER 1: INTRODUCTION TO MACHINE LEARNING

1.1 What is Machine Learning?
Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. ML algorithms identify patterns in data and make predictions based on those patterns.

1.2 Types of Machine Learning

Supervised Learning:
- Regression: Predicting continuous values
- Classification: Predicting categories
- Examples: Linear Regression, Logistic Regression, Decision Trees

Unsupervised Learning:
- Clustering: Grouping similar data points
- Dimensionality Reduction: Reducing feature space
- Examples: K-Means, Hierarchical Clustering, PCA

Reinforcement Learning:
- Learning through interaction with an environment
- Example: Q-Learning, Policy Gradient

1.3 The Machine Learning Workflow
1. Data Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Selection
5. Training
6. Evaluation
7. Deployment

CHAPTER 2: NEURAL NETWORKS

2.1 Basics of Neural Networks
Neural networks are inspired by biological neurons. They consist of interconnected nodes (neurons) organized in layers.

Components:
- Input Layer: Receives input features
- Hidden Layers: Process information
- Output Layer: Produces predictions
- Weights and Biases: Parameters that are learned
- Activation Functions: Introduce non-linearity

2.2 Forward Propagation
Forward propagation is the process of feeding data through the network to generate predictions.

2.3 Backpropagation
Backpropagation is the algorithm used to train neural networks by calculating gradients and updating weights.

CHAPTER 3: DEEP LEARNING

3.1 Convolutional Neural Networks (CNN)
CNNs are particularly effective for image processing tasks. They use convolutional layers to extract features from images.

3.2 Recurrent Neural Networks (RNN)
RNNs are designed for sequential data like text and time series. They maintain hidden states to capture temporal information.

3.3 Popular Architectures
- LeNet: Early CNN for digit recognition
- AlexNet: Breakthrough in image classification
- ResNet: Deep residual networks
- Transformer: State-of-the-art for NLP

CHAPTER 4: PRACTICAL APPLICATIONS

4.1 Image Classification
Identifying objects in images using CNNs.

4.2 Natural Language Processing
Processing and understanding text data using RNNs and Transformers.

4.3 Recommendation Systems
Predicting user preferences using collaborative filtering and neural networks.

4.4 Time Series Forecasting
Predicting future values using LSTMs and other RNN variants.`,

      '3': `CHAPTER 5: QUANTUM MECHANICS

5.1 Introduction to Quantum Mechanics
Quantum mechanics describes the behavior of matter and energy at the atomic and subatomic scales. It introduces concepts that differ fundamentally from classical physics.

5.2 Wave-Particle Duality
Quantum objects exhibit properties of both waves and particles. This duality is central to understanding quantum mechanics.

Key Concepts:
- Photons: Quanta of light
- De Broglie Wavelength: λ = h/p
- Double-Slit Experiment: Demonstrates wave-particle duality

5.3 The Schrödinger Equation
The time-dependent Schrödinger equation describes how the quantum state of a physical system changes over time:

iℏ ∂ψ/∂t = Ĥψ

where:
- ψ is the wave function
- Ĥ is the Hamiltonian operator
- ℏ is the reduced Planck constant

5.4 Quantum Superposition and Entanglement
Superposition: A quantum system can exist in multiple states simultaneously until measured.

Entanglement: Two or more quantum systems can become correlated such that the state of one instantly influences the other.

5.5 Quantum Numbers and Orbitals
Quantum numbers describe the properties of electrons in atoms:
- Principal quantum number (n): Energy level
- Angular momentum quantum number (l): Orbital shape
- Magnetic quantum number (ml): Orbital orientation
- Spin quantum number (ms): Electron spin

5.6 Atomic Structure
Electrons occupy orbitals according to the Pauli Exclusion Principle, which states that no two electrons can have the same set of quantum numbers.

5.7 Perturbation Theory
Perturbation theory is used to find approximate solutions to the Schrödinger equation when exact solutions are unavailable. It treats small deviations from a known system as perturbations.

5.8 Quantum Tunneling
Quantum tunneling occurs when a particle passes through a potential barrier that would be impossible to overcome in classical mechanics. This is fundamental to phenomena like radioactive decay and nuclear fusion.

5.9 Quantum Measurement
The measurement problem: The act of measurement affects the quantum system, collapsing the wave function to a definite state. This is described by the Copenhagen interpretation.

5.10 Applications of Quantum Mechanics
- Semiconductors and diodes: Based on band theory
- Lasers: Coherent light generation
- Nuclear power: Based on nuclear reactions
- Quantum computing: Using qubits for computation`
    };

    return bookContents[bookId] || 'Content not available for this book.';
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
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className="p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.timestamp}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
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
                            <Button size="sm" className="flex-1" onClick={() => handleViewDocument(doc)}>
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
                            <Button size="sm" onClick={() => handleViewDocument(doc)}>
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

      {/* Document Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl">{selectedDocument?.title}</DialogTitle>
              </div>
              <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-6">
              {/* Book Thumbnail */}
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={selectedDocument.thumbnail} 
                  alt={selectedDocument.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Document Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pages</p>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {selectedDocument.pages}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <Badge 
                      variant={selectedDocument.status === 'ready' ? 'secondary' : 'outline'}
                      className="text-sm mt-1"
                    >
                      {selectedDocument.status === 'ready' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Ready
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Processing
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scan Date</p>
                  <p className="font-medium">
                    {new Date(selectedDocument.scanDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">AI Summary</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedDocument.aiSummary}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Topics & Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" variant="default" onClick={() => {
                  setIsModalOpen(false);
                  handleReadDocument(selectedDocument!);
                }}>
                  <Eye className="w-4 h-4 mr-2" />
                  Read Full Document
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedDocument!)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handleShare(selectedDocument!)}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reading Mode Dialog */}
      <Dialog open={isReadingMode} onOpenChange={setIsReadingMode}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{selectedDocument?.title}</DialogTitle>
              <DialogClose>
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogHeader>

          {selectedDocument && (
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                <div className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                  {getBookContent(selectedDocument.id)}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsReadingMode(false)}>
              Close
            </Button>
            <Button variant="outline" className="ml-auto" onClick={() => handleDownload(selectedDocument!)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}