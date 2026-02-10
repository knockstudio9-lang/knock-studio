// app/(dashboard)/dashboard/admin/services/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, X, ArrowLeft, Save, Eye } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
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

      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: cleanedFeatures,
        }),
      });

      if (!response.ok) throw new Error("Failed to create service");

      toast.success("Service created successfully");
      router.push("/dashboard/admin/services");
    } catch (error) {
      toast.error("Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/admin/services">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create New Service</h1>
            <p className="text-muted-foreground mt-1">
              Add a new service to your offerings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button
            form="service-form"
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <Card>
          <CardHeader>
            <CardTitle>Service Preview</CardTitle>
            <CardDescription>
              This is how your service will appear to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  {formData.image ? (
                    <Image
                      src={formData.image}
                      alt={formData.title || "Service image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image uploaded</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{formData.title || "Service Title"}</h3>
                  <p className="text-muted-foreground">{formData.duration || "Duration"}</p>
                </div>
                <p>{formData.description || "Service description will appear here."}</p>
                <div>
                  <h4 className="font-semibold mb-2">Best For:</h4>
                  <p>{formData.bestFor || "Target audience will appear here."}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.features.filter(f => f.trim() !== "").length > 0 ? (
                      formData.features.filter(f => f.trim() !== "").map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No features added yet</li>
                    )}
                  </ul>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formData.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Edit Mode
        <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the basic details about your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serviceId">Service ID</Label>
                      <Input
                        id="serviceId"
                        value={formData.serviceId}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceId: e.target.value })
                        }
                        placeholder="e.g., home-renovation"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        placeholder="e.g., 1-4 bulan"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bestFor">Best For</Label>
                    <Textarea
                      id="bestFor"
                      value={formData.bestFor}
                      onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                      rows={2}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>
                    List the key features of this service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                  >
                    Add Feature
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.image ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={formData.image}
                          alt="Service image"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload image
                            </p>
                          </>
                        )}
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Active services will be visible to customers on your website.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}