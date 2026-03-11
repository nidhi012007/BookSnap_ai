'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import mammoth from 'mammoth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download,
  ArrowLeft,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('booksnap_user');
    if (!userData) {
      router.push('/');
    }
  }, [router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target?.result;
      
      try {
        let extractedText = '';

        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          extractedText = await extractTextFromPDF(fileData as ArrayBuffer);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
          extractedText = await extractTextFromDOCX(fileData as ArrayBuffer);
        } else {
          alert('Please upload a PDF or DOCX file');
          return;
        }

        if (extractedText.trim()) {
          await processText(extractedText);
        } else {
          alert('No text found in the document. Please try another file.');
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please try again.');
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsArrayBuffer(file);

    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const extractTextFromPDF = async (fileData: ArrayBuffer): Promise<string> => {
    // Dynamically import pdfjs only in browser
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');
      text += pageText + ' ';
    }

    return text;
  };

  const extractTextFromDOCX = async (fileData: ArrayBuffer): Promise<string> => {
    const result = await mammoth.extractRawText({ arrayBuffer: fileData });
    return result.value;
  };

  const processText = async (text: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      setProcessingProgress(30);

      const extractedText = text.trim();
      
      if (!extractedText) {
        alert('No text found in the document.');
        setIsProcessing(false);
        return;
      }

      setProcessingProgress(70);

      // Generate AI summary, keywords, and concepts from extracted text
      const summary = generateSummary(extractedText);
      const keywords = extractKeywords(extractedText);
      const concepts = extractConcepts(extractedText);

      setProcessingProgress(90);

      const scanResult: ScanResult = {
        id: `scan-${Date.now()}`,
        image: '', // No image for document
        extractedText,
        confidence: 0.95, // High confidence for direct text extraction
        aiSummary: summary,
        keywords,
        concepts
      };

      setScanResults(prev => [scanResult, ...prev]);
      setProcessingProgress(100);
      
      // Reset after completion
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingProgress(0);
      }, 500);

    } catch (error) {
      console.error('Error processing text:', error);
      alert('Failed to process document. Please try again.');
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Generate a concise summary from extracted text
  const generateSummary = (text: string): string => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length === 0) return 'No summary available.';
    
    // Take first 1-2 sentences as summary
    let summary = sentences.slice(0, 2).join(' ').trim();
    
    // If too long, truncate to 200 characters
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }
    
    return summary || 'Text extracted successfully from the image.';
  };

  // Extract meaningful keywords from text
  const extractKeywords = (text: string): string[] => {
    // Simple keyword extraction based on common important words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
      'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
      'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most'
    ]);

    const words = text
      .toLowerCase()
      .match(/\b[a-z]+(?:'[a-z]+)?\b/g) || [];

    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Get top 6 keywords by frequency
    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word]) => word);

    return keywords.length > 0 ? keywords : ['text', 'document', 'content'];
  };

  // Extract concepts/topics from text
  const extractConcepts = (text: string): string[] => {
    const conceptPatterns: { [key: string]: RegExp[] } = {
      'Science & Technology': [
        /\b(science|technology|research|study|data|algorithm|system|computer|digital|network)\b/gi,
      ],
      'Business & Economy': [
        /\b(business|market|economy|finance|investment|company|enterprise|sales|profit)\b/gi,
      ],
      'Education & Learning': [
        /\b(education|learning|study|knowledge|academic|student|teacher|course|training)\b/gi,
      ],
      'Health & Medicine': [
        /\b(health|medical|disease|patient|treatment|doctor|hospital|medicine|therapy)\b/gi,
      ],
      'Environment & Nature': [
        /\b(nature|environment|climate|water|air|forest|animal|plant|ecosystem)\b/gi,
      ],
      'Law & Governance': [
        /\b(law|legal|government|policy|regulation|court|justice|right|constitution)\b/gi,
      ],
      'Arts & Culture': [
        /\b(art|culture|music|literature|history|tradition|creative|design|performance)\b/gi,
      ],
    };

    const foundConcepts = new Set<string>();

    Object.entries(conceptPatterns).forEach(([concept, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(text)) {
          foundConcepts.add(concept);
        }
      });
    });

    // If no concepts found, add generic ones
    if (foundConcepts.size === 0) {
      foundConcepts.add('General Knowledge');
      foundConcepts.add('Information');
    }

    return Array.from(foundConcepts).slice(0, 3);
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
                variant="default"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
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
                  <Upload className="w-5 h-5" />
                  Upload Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="aspect-[4/3] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 mb-2">Click to upload a document</p>
                      <p className="text-sm text-gray-400">Supports PDF and DOCX files</p>
                    </div>
                  </div>
                  
                  <input
                    key={`file-input-${scanResults.length}`}
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
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