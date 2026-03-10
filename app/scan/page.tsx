'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Square, 
  FlipHorizontal, 
  Download,
  ArrowLeft,
  Zap,
  FileText,
  Eye,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Upload
} from 'lucide-react';
import Link from 'next/link';

interface ScanResult {
  id: string;
  image: string;
  extractedText: string;
  confidence: number;
  aiSummary: string;
  keywords: string[];
  concepts: string[];
}

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('booksnap_user');
    if (!userData) {
      router.push('/');
      return;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [router, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    await processImage(imageData);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await processImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate OCR processing with progress
    const progressSteps = [
      { step: 'Analyzing image...', progress: 20 },
      { step: 'Extracting text...', progress: 40 },
      { step: 'Processing with AI...', progress: 60 },
      { step: 'Generating insights...', progress: 80 },
      { step: 'Finalizing results...', progress: 100 }
    ];

    for (const { progress } of progressSteps) {
      setProcessingProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Simulate extracted text and AI analysis
    const dummyTexts = [
      "Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models that computer systems use to perform specific tasks without explicit instructions.",
      "The quantum theory of light describes electromagnetic radiation as discrete packets of energy called photons. This revolutionary concept bridged classical and modern physics.",
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen, forming the foundation of most food chains on Earth.",
      "Object-oriented programming organizes code into classes and objects, promoting code reusability, modularity, and maintainability in software development."
    ];

    const dummyKeywords = [
      ['machine learning', 'AI', 'algorithms', 'statistical models'],
      ['quantum theory', 'photons', 'electromagnetic', 'physics'],
      ['photosynthesis', 'glucose', 'oxygen', 'food chains'],
      ['OOP', 'classes', 'objects', 'programming']
    ];

    const dummyConcepts = [
      ['Artificial Intelligence', 'Computer Science', 'Data Processing'],
      ['Quantum Physics', 'Light Theory', 'Modern Physics'],
      ['Biology', 'Plant Science', 'Ecosystems'],
      ['Software Engineering', 'Programming Paradigms', 'Code Structure']
    ];

    const dummySummaries = [
      'This text introduces machine learning as a key branch of AI, emphasizing its algorithmic approach to task completion.',
      'An explanation of quantum light theory, highlighting the photon concept and its significance in physics.',
      'Description of photosynthesis process and its crucial role in Earth\'s ecological systems.',
      'Overview of object-oriented programming principles and their benefits in software development.'
    ];

    const randomIndex = Math.floor(Math.random() * dummyTexts.length);

    const result: ScanResult = {
      id: `scan-${Date.now()}`,
      image: imageData,
      extractedText: dummyTexts[randomIndex],
      confidence: 0.92 + Math.random() * 0.07,
      aiSummary: dummySummaries[randomIndex],
      keywords: dummyKeywords[randomIndex],
      concepts: dummyConcepts[randomIndex]
    };

    setScanResults(prev => [result, ...prev]);
    setIsProcessing(false);
    setProcessingProgress(0);

    // Stop camera after successful scan
    if (scanMode === 'camera') {
      stopCamera();
    }
  };

  const downloadPDF = (result: ScanResult) => {
    // Simulate PDF generation
    const pdfContent = `
BookSnap Scan Result
==================

Extracted Text:
${result.extractedText}

AI Summary:
${result.aiSummary}

Keywords: ${result.keywords.join(', ')}
Concepts: ${result.concepts.join(', ')}
Confidence: ${(result.confidence * 100).toFixed(1)}%
Scan Date: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booksnap-scan-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Smart Scanner</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={scanMode === 'camera' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScanMode('camera')}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
              <Button
                variant={scanMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScanMode('upload')}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Interface */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {scanMode === 'camera' ? (
                    <>
                      <Camera className="w-5 h-5" />
                      Camera Scanner
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      File Upload
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scanMode === 'camera' ? (
                  <div className="space-y-4">
                    <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden relative">
                      {isScanning ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <div className="text-center">
                            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Camera preview will appear here</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay guide */}
                      {isScanning && (
                        <div className="absolute inset-4 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <Square className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Align text within this frame</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!isScanning ? (
                        <Button onClick={startCamera} className="flex-1">
                          <Camera className="w-4 h-4 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <>
                          <Button onClick={captureImage} className="flex-1">
                            <Zap className="w-4 h-4 mr-2" />
                            Capture & Scan
                          </Button>
                          <Button variant="outline" onClick={stopCamera}>
                            Stop
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div 
                      className="aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-2">Click to upload an image</p>
                        <p className="text-sm text-gray-400">Supports JPG, PNG, HEIC</p>
                      </div>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
                
                {/* Processing Progress */}
                {isProcessing && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Processing with AI...
                      </span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      {processingProgress}% complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scanning Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Ensure good lighting and hold the camera steady</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Keep text aligned within the scanning frame</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Clean, high-contrast text works best</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Avoid shadows and glare on the page</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scan Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                {scanResults.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No scans yet. Start scanning to see results here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scanResults.map((result) => (
                      <Card key={result.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                Confidence: {(result.confidence * 100).toFixed(1)}%
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            
                            {/* Extracted Text Preview */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Extracted Text:</h4>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 p-3 rounded">
                                {result.extractedText}
                              </p>
                            </div>
                            
                            {/* AI Summary */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                AI Summary:
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {result.aiSummary}
                              </p>
                            </div>
                            
                            {/* Keywords & Concepts */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Keywords & Concepts:</h4>
                              <div className="flex flex-wrap gap-1">
                                {result.keywords.map((keyword) => (
                                  <Badge key={keyword} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                                {result.concepts.map((concept) => (
                                  <Badge key={concept} variant="secondary" className="text-xs">
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                View Full
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => downloadPDF(result)}>
                                <Download className="w-3 h-3 mr-1" />
                                Export PDF
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}