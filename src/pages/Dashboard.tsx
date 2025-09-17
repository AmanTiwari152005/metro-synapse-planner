import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/FileUploader';
import { ResultsTable } from '@/components/ResultsTable';
import { ChartsSection } from '@/components/ChartsSection';
import { AlertsPanel } from '@/components/AlertsPanel';
import { Train, Zap, Brain } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface UploadedFiles {
  fitness: File | null;
  jobCards: File | null;
  branding: File | null;
  mileage: File | null;
  cleaning: File | null;
  stabling: File | null;
}

// Mock data for demonstration - All 25 trains
const mockResults = [
  { trainId: 'T001', status: 'inducted' as const, reason: 'All systems operational', score: 95 },
  { trainId: 'T002', status: 'hold' as const, reason: 'Awaiting cleaning slot', score: 82 },
  { trainId: 'T003', status: 'maintenance' as const, reason: 'Job card open - Brake System', score: 45 },
  { trainId: 'T004', status: 'inducted' as const, reason: 'Ready for service', score: 91 },
  { trainId: 'T005', status: 'hold' as const, reason: 'Fitness certificate expires in 3 days', score: 75 },
  { trainId: 'T006', status: 'inducted' as const, reason: 'All checks passed', score: 88 },
  { trainId: 'T007', status: 'inducted' as const, reason: 'All systems operational', score: 93 },
  { trainId: 'T008', status: 'maintenance' as const, reason: 'Job card open - Door System', score: 42 },
  { trainId: 'T009', status: 'hold' as const, reason: 'Cleaning slot unavailable', score: 78 },
  { trainId: 'T010', status: 'inducted' as const, reason: 'Ready for service', score: 89 },
  { trainId: 'T011', status: 'maintenance' as const, reason: 'Job card open - AC System', score: 38 },
  { trainId: 'T012', status: 'inducted' as const, reason: 'All checks passed', score: 92 },
  { trainId: 'T013', status: 'hold' as const, reason: 'Awaiting fitness verification', score: 73 },
  { trainId: 'T014', status: 'inducted' as const, reason: 'All systems operational', score: 87 },
  { trainId: 'T015', status: 'maintenance' as const, reason: 'Job card open - Traction Motor', score: 35 },
  { trainId: 'T016', status: 'inducted' as const, reason: 'Ready for service', score: 90 },
  { trainId: 'T017', status: 'hold' as const, reason: 'Branding work pending', score: 76 },
  { trainId: 'T018', status: 'inducted' as const, reason: 'All checks passed', score: 94 },
  { trainId: 'T019', status: 'maintenance' as const, reason: 'Job card open - Pantograph', score: 41 },
  { trainId: 'T020', status: 'inducted' as const, reason: 'All systems operational', score: 86 },
  { trainId: 'T021', status: 'hold' as const, reason: 'Mileage inspection due', score: 79 },
  { trainId: 'T022', status: 'inducted' as const, reason: 'Ready for service', score: 85 },
  { trainId: 'T023', status: 'maintenance' as const, reason: 'Job card open - Compressor', score: 39 },
  { trainId: 'T024', status: 'hold' as const, reason: 'Awaiting stabling position', score: 77 },
  { trainId: 'T025', status: 'inducted' as const, reason: 'All checks passed', score: 96 },
];

const mockChartData = {
  trainScores: mockResults.map(train => ({ trainId: train.trainId, score: train.score })),
  statusBreakdown: [
    { status: 'Inducted', count: mockResults.filter(t => t.status === 'inducted').length, color: 'hsl(var(--success))' },
    { status: 'Hold', count: mockResults.filter(t => t.status === 'hold').length, color: 'hsl(var(--warning))' },
    { status: 'Maintenance', count: mockResults.filter(t => t.status === 'maintenance').length, color: 'hsl(var(--destructive))' },
  ],
  brandingProgress: [
    { trainId: 'T001', completion: 100 },
    { trainId: 'T002', completion: 85 },
    { trainId: 'T003', completion: 30 },
    { trainId: 'T004', completion: 95 },
    { trainId: 'T005', completion: 70 },
    { trainId: 'T006', completion: 90 },
  ],
};

const mockAlerts = [
  { id: '1', type: 'warning' as const, message: 'Train T05 excluded – Fitness certificate expires in 3 days', trainId: 'T05' },
  { id: '2', type: 'error' as const, message: 'Train T09 cannot be inducted – Cleaning slot unavailable', trainId: 'T09' },
  { id: '3', type: 'warning' as const, message: 'Train T03 requires maintenance – Brake system inspection due', trainId: 'T03' },
];

const fileConfigs = [
  { key: 'fitness' as keyof UploadedFiles, title: 'Fitness Certificates', description: 'Train safety certifications' },
  { key: 'jobCards' as keyof UploadedFiles, title: 'Job Cards', description: 'Maintenance work orders' },
  { key: 'branding' as keyof UploadedFiles, title: 'Branding Priorities', description: 'Train branding schedules' },
  { key: 'mileage' as keyof UploadedFiles, title: 'Mileage Data', description: 'Train operational mileage' },
  { key: 'cleaning' as keyof UploadedFiles, title: 'Cleaning Slots', description: 'Cleaning facility availability' },
  { key: 'stabling' as keyof UploadedFiles, title: 'Stabling Layout', description: 'Depot stabling positions' },
];

export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    fitness: null,
    jobCards: null,
    branding: null,
    mileage: null,
    cleaning: null,
    stabling: null,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (key: keyof UploadedFiles, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [key]: file }));
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const allFilesUploaded = Object.values(uploadedFiles).every(file => file !== null);

  const handleProcessInduction = async () => {
    if (!allFilesUploaded) return;

    setIsProcessing(true);
    
    try {
      // Simulate API call
      const formData = new FormData();
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      // In a real app, you would make this API call:
      // const response = await axios.post('/api/process/', formData);
      
      // For demo, simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResults(mockResults);
      toast({
        title: "Processing Complete",
        description: "Train induction plan has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process induction plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary-glow to-success text-white shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Train className="h-12 w-12" />
            <div>
              <h1 className="text-4xl font-bold">🚇 MetroSynapse</h1>
              <p className="text-xl opacity-90">Kochi Metro Train Induction Planner</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <Brain className="h-6 w-6" />
            <span>AI + Rule Engine for Smarter Train Scheduling</span>
            <Zap className="h-5 w-5 ml-2" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* File Upload Section */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📁</span>
              <span>Upload Required Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fileConfigs.map((config, index) => (
                <div key={config.key} style={{ animationDelay: `${index * 100}ms` }}>
                  <FileUploader
                    title={config.title}
                    description={config.description}
                    onFileSelect={(file) => handleFileSelect(config.key, file)}
                    isUploaded={uploadedFiles[config.key] !== null}
                    fileName={uploadedFiles[config.key]?.name}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Process Button */}
        <div className="flex justify-center">
          <Button
            variant="metro"
            size="lg"
            disabled={!allFilesUploaded || isProcessing}
            onClick={handleProcessInduction}
            className="text-xl px-12 py-6 animate-fade-in"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2" />
                Processing Induction Plan...
              </>
            ) : (
              'Process Induction Plan'
            )}
          </Button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            <ResultsTable results={results} />
            
            <ChartsSection {...mockChartData} />
            
            <AlertsPanel alerts={mockAlerts} />
          </div>
        )}
      </main>
    </div>
  );
}