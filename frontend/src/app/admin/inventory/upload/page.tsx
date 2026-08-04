"use client";

import { useState } from "react";
import { Upload, FileType, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BulkUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setFiles([]);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Bulk Upload
        </h1>
        <p className="text-sm font-medium uppercase tracking-wide text-(--bg)">
          Upload product data via CSV, followed by image assets. The system will automatically map image filenames to the CSV data.
        </p>
      </div>

      <div className="space-y-8">
        {/* Dropzone */}
        <div 
          className={`border-4 border-dashed p-12 flex flex-col items-center justify-center text-center transition-colors bg-(--accent) text-(--bg) shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
            dragActive ? 'border-(--bg) bg-(--bg)' : 'border-(--accent)'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-(--bg) text-(--bg) flex items-center justify-center rounded-full mb-6">
            <Upload size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Drag & Drop Assets</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-(--bg) mb-6">
            Support for .csv, .jpg, .png up to 50MB
          </p>
          <Button>Browse Files</Button>
        </div>

        {/* File Queue */}
        {files.length > 0 && (
          <div className="bg-(--accent) text-(--bg) border-2 border-(--bg) p-6">
            <h3 className="text-lg font-black uppercase tracking-tighter mb-4 border-b-2 border-(--bg) pb-2">
              Queue ({files.length})
            </h3>
            <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {files.map((file, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium p-2 bg-(--bg)">
                  <FileType size={16} className="text-(--bg)" />
                  <span className="flex-1 truncate">{file.name}</span>
                  <span className="text-xs font-bold uppercase text-(--bg)">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </li>
              ))}
            </ul>

            {uploading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-(--bg)">
                  <div className="h-full bg-(--bg) transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ) : (
              <Button size="lg" className="w-full" onClick={simulateUpload}>
                Process & Upload
              </Button>
            )}
          </div>
        )}

        {/* Success State */}
        {progress === 100 && !uploading && (
          <div className="bg-(--bg) border-2 border-(--accent) p-6 flex items-center gap-4">
            <CheckCircle2 className="text-(--bg)" size={32} />
            <div>
              <h4 className="font-black uppercase tracking-widest text-(--bg)">Upload Complete</h4>
              <p className="text-sm font-medium text-(--bg)">Assets have been successfully processed and mapped to the database.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
