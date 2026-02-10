// app/(dashboard)/dashboard/admin/about/team/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  imagePublicId: string | null;
  bio: string | null;
  isFounder: boolean;
  order: number;
  isActive: boolean;
}

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: "",
    imagePublicId: "",
    bio: "",
    isFounder: false,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchTeamMember();
  }, [id]);

  const fetchTeamMember = async () => {
    try {
      const response = await fetch("/api/admin/about/team");
      
      if (!response.ok) throw new Error("Failed to fetch team members");

      const data = await response.json();
      const member = data.data.find((m: TeamMember) => m.id === parseInt(id));

      if (!member) {
        toast.error("Team member not found");
        router.push("/dashboard/admin/about");
        return;
      }

      setFormData({
        name: member.name,
        position: member.position,
        image: member.image,
        imagePublicId: member.imagePublicId || "",
        bio: member.bio || "",
        isFounder: member.isFounder,
        order: member.order,
        isActive: member.isActive,
      });
      setImagePreview(member.image);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch team member");
      router.push("/dashboard/admin/about");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload this file to your storage service
      // For now, we'll just create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // In a real implementation, you would set the image URL and publicId after upload
        setFormData((prev) => ({ 
          ...prev, 
          image: reader.result as string,
          imagePublicId: `temp_${Date.now()}`
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/about/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update team member");
      }

      toast.success("Team member updated successfully");
      router.push("/dashboard/admin/about");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/about">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Team Member</h1>
          <p className="text-muted-foreground mt-1">
            Update the details for this team member
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Team Member Details</CardTitle>
          <CardDescription>
            Edit the details for the team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Job title or position"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Profile Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <Upload className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a new profile image (recommended: 400x400px)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief biography..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isFounder"
                  checked={formData.isFounder}
                  onCheckedChange={(checked) => handleSwitchChange(checked, "isFounder")}
                />
                <Label htmlFor="isFounder">Founder</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange(checked, "isActive")}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Link href="/dashboard/admin/about">
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Team Member
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