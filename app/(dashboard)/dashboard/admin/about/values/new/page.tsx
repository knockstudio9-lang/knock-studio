// app/(dashboard)/dashboard/admin/about/values/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewAboutValuePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    description: "",
    order: 0,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
    toast.info(`Value will be ${checked ? "active" : "inactive"}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.icon.trim()) {
      toast.error("Icon is required");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsSubmitting(true);
    const creatingToast = toast.loading("Creating value...");

    try {
      const response = await fetch("/api/admin/about/values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create value");
      }

      toast.success("Value created successfully! Redirecting...", { 
        id: creatingToast 
      });
      
      // Small delay to show the success message before navigation
      setTimeout(() => {
        router.push("/dashboard/admin/about");
      }, 500);
    } catch (error) {
      console.error("Create error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create value", { 
        id: creatingToast 
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.icon || formData.title || formData.description) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        toast.info("Changes discarded");
        router.push("/dashboard/admin/about");
      }
    } else {
      router.push("/dashboard/admin/about");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/about">
          <Button variant="outline" size="icon" title="Back to About Page">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Value</h1>
          <p className="text-muted-foreground mt-1">
            Add a new value to your about page
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Value Details</CardTitle>
          <CardDescription>
            Fill in the details for the new value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="icon">
                  Icon Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g., Heart, Shield, Zap"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use a valid Lucide React icon name
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Quality, Innovation, Trust"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe this value..."
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active Status
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Value
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}