import React, { useCallback, useState } from 'react';
import { Upload, Check, X, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  title: string;
  description: string;
  onFileSelect: (file: File) => void;
  isUploaded: boolean;
  fileName?: string;
}

export function FileUploader({ title, description, onFileSelect, isUploaded, fileName }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.csv')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  return (
    <Card
      className={cn(
        "upload-card cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        isDragOver && "active",
        isUploaded && "completed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isUploaded && document.getElementById(`file-input-${title}`)?.click()}
    >
      <input
        id={`file-input-${title}`}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileInputChange}
      />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
          isUploaded 
            ? "bg-success/10 text-success" 
            : isDragOver 
            ? "bg-primary/20 text-primary glow-primary" 
            : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
        )}>
          {isUploaded ? (
            <Check className="h-8 w-8 animate-bounce-in" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {isUploaded && fileName ? (
            <div className="flex items-center space-x-2 text-sm text-success bg-success/10 px-3 py-1 rounded-full">
              <FileText className="h-4 w-4" />
              <span className="truncate max-w-32">{fileName}</span>
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <p className="text-xs text-primary font-medium">
              {isDragOver ? "Drop CSV file here" : "Click or drag CSV file here"}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}