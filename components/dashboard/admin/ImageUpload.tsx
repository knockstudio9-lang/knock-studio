/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/admin/ImageUpload.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface ImageUploadProps {
  onImageUpload: (url: string, publicId: string) => void;
  currentImage?: string;
  label?: string;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  aspectRatio?: string;
  showRemoveButton?: boolean;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  label = "Upload Image",
  folder = "portfolio",
  multiple = false,
  maxFiles = 1,
  aspectRatio = "video",
  showRemoveButton = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with currentImage prop
  useEffect(() => {
    if (currentImage && currentImage !== preview) {
      setPreview(currentImage);
      setError(null);
      setUploadSuccess(false);
    }
  }, [currentImage]);

  const validateFile = (file: File): string | null => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return `Invalid file type. Please upload: ${validTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of 10MB`;
    }

    // Validate file name
    if (file.name.length > 200) {
      return "File name is too long (max 200 characters)";
    }

    return null;
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Reset states
    setError(null);
    setUploadSuccess(false);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setUploading(true);

    try {
      // Create preview immediately for better UX
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Server returned invalid response. Please try again.");
      }

      if (!response.ok) {
        // Handle different HTTP status codes
        let errorMessage = "Upload failed";
        
        if (response.status === 413) {
          errorMessage = "File is too large. Maximum size is 10MB.";
        } else if (response.status === 415) {
          errorMessage = "Unsupported file type. Please upload a valid image.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again or contact support.";
        } else if (response.status === 429) {
          errorMessage = "Too many upload requests. Please wait a moment and try again.";
        } else if (data?.error) {
          errorMessage = data.error;
        }

        throw new Error(errorMessage);
      }

      if (data.success && data.url && data.publicId) {
        setUploadProgress(100);
        setPreview(data.url);
        setUploadSuccess(true);
        onImageUpload(data.url, data.publicId);
        toast.success("Image uploaded successfully!");
        
        // Reset success state after 2 seconds
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        throw new Error(data.error || "Upload failed - invalid response from server");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      const errorMessage = error.message || "Failed to upload image. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Reset preview on error
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, [folder]);

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent component
    onImageUpload("", "");
    toast.info("Image removed");
  };

  const handleRetry = () => {
    setError(null);
    setUploadSuccess(false);
    fileInputRef.current?.click();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "video":
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {!preview ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all cursor-pointer",
            getAspectRatioClass(),
            "flex items-center justify-center",
            dragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-gray-300 hover:border-primary/50 hover:bg-gray-50/50",
            uploading && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-3 p-6">
            {uploading ? (
              <>
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium text-gray-700">Uploading...</p>
                  <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={cn(
                  "p-4 rounded-full transition-colors",
                  dragActive ? "bg-primary/10" : "bg-gray-100"
                )}>
                  <Upload className={cn(
                    "h-8 w-8 transition-colors",
                    dragActive ? "text-primary" : "text-gray-400"
                  )} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {label}
                  </p>
                  <p className="text-xs text-gray-500">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports: JPG, PNG, WEBP, GIF (max 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div 
            className={cn(
              "relative w-full overflow-hidden rounded-lg border-2 transition-all",
              getAspectRatioClass(),
              uploading 
                ? "border-primary cursor-wait" 
                : "border-gray-200 cursor-pointer hover:border-primary/50",
              uploadSuccess && "border-green-500"
            )}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <Image
              src={preview}
              alt="Preview"
              fill
              className={cn(
                "object-cover transition-all",
                uploading && "opacity-50 blur-sm"
              )}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin text-white mx-auto" />
                  <div className="space-y-1">
                    <p className="text-white text-sm font-medium">Uploading...</p>
                    <div className="w-48 h-2 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success indicator */}
            {uploadSuccess && (
              <div className="absolute top-2 left-2">
                <div className="bg-green-500 text-white rounded-full p-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!uploading && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="h-9 w-9 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Replace image"
              >
                <Upload className="h-4 w-4" />
              </Button>
              {showRemoveButton && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Hover instruction */}
          {!uploading && (
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <p className="font-medium">Click to replace • Drag to upload new</p>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription className="flex items-start justify-between gap-2">
            <span className="text-sm">{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="shrink-0 h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {uploadSuccess && !error && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Image uploaded successfully!</span>
        </div>
      )}
    </div>
  );
}