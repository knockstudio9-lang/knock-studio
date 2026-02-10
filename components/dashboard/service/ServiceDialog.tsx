// components/dashboard/service/ServiceDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Service {
  id: number;
  serviceId: string;
  icon: string;
  title: string;
  description: string;
  duration: string;
  features: string[];
  bestFor: string;
  image: string;
  imagePublicId: string | null;
  order: number;
  isActive: boolean;
}

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSuccess: () => void;
}

const ICON_OPTIONS = [
  "Home",
  "Eye",
  "MessageSquare",
  "Calculator",
  "Wrench",
  "Hammer",
  "Paintbrush",
  "Ruler",
  "Settings",
];

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    serviceId: "",
    icon: "Home",
    title: "",
    description: "",
    duration: "",
    features: [""],
    bestFor: "",
    image: "",
    imagePublicId: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        serviceId: service.serviceId,
        icon: service.icon,
        title: service.title,
        description: service.description,
        duration: service.duration,
        features: service.features,
        bestFor: service.bestFor,
        image: service.image,
        imagePublicId: service.imagePublicId || "",
        order: service.order,
        isActive: service.isActive,
      });
    } else {
      setFormData({
        serviceId: "",
        icon: "Home",
        title: "",
        description: "",
        duration: "",
        features: [""],
        bestFor: "",
        image: "",
        imagePublicId: "",
        order: 0,
        isActive: true,
      });
    }
  }, [service, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", "services");

    try {
      const response = await fetch("/api/upload-service", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.url,
        imagePublicId: data.publicId,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.imagePublicId) {
      try {
        await fetch("/api/upload-service", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: formData.imagePublicId }),
        });
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      image: "",
      imagePublicId: "",
    }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    if (formData.features.length > 1) {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty features
      const cleanedFeatures = formData.features.filter((f) => f.trim() !== "");

      const url = service
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";
      const method = service ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: cleanedFeatures,
        }),
      });

      if (!response.ok) throw new Error("Failed to save service");

      toast.success(`Service ${service ? "updated" : "created"} successfully`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${service ? "update" : "create"} service`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="serviceId" className="text-sm font-medium">Service ID</Label>
              <Input
                id="serviceId"
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: e.target.value })
                }
                placeholder="e.g., home-renovation"
                required
                disabled={!!service}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon" className="text-sm font-medium">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
                className="bg-background resize-none"
              />
            </div>
          </div>

          {/* Duration and Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 1-4 bulan"
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order" className="text-sm font-medium">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                required
                className="bg-background"
              />
            </div>
          </div>

          {/* Best For */}
          <div className="space-y-2">
            <Label htmlFor="bestFor" className="text-sm font-medium">Best For</Label>
            <Textarea
              id="bestFor"
              value={formData.bestFor}
              onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
              rows={2}
              required
              className="bg-background resize-none"
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFeature}
                className="h-8"
              >
                Add Feature
              </Button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="bg-background"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Service Image</Label>
            {formData.image ? (
              <div className="relative group">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={formData.image}
                    alt="Service image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveImage}
                      className="shadow-lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </Label>
              </div>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base font-medium">Active Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.isActive ? "Service is visible to customers" : "Service is hidden"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[120px]">
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {service ? "Update" : "Create"} Service
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}