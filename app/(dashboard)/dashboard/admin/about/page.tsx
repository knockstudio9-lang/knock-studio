// app/(dashboard)/dashboard/admin/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Users, Heart } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface AboutValue {
  id: number;
  icon: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  createdAt: Date;
  updatedAt: Date;
}

export default function AboutPage() {
  const [aboutValues, setAboutValues] = useState<AboutValue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [valuesResponse, teamResponse] = await Promise.all([
        fetch("/api/admin/about/values"),
        fetch("/api/admin/about/team")
      ]);

      if (!valuesResponse.ok) throw new Error("Failed to fetch about values");
      if (!teamResponse.ok) throw new Error("Failed to fetch team members");

      const valuesData = await valuesResponse.json();
      const teamData = await teamResponse.json();

      setAboutValues(valuesData.data || []);
      setTeamMembers(teamData.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteValue = async (id: number) => {
    if (!confirm("Are you sure you want to delete this value?")) return;

    try {
      const response = await fetch(`/api/admin/about/values/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete value");
      }

      toast.success("Value deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete value");
    }
  };

  const handleToggleValueActive = async (value: AboutValue) => {
    try {
      const response = await fetch(`/api/admin/about/values/${value.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !value.isActive }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update value");
      }

      toast.success(`Value ${!value.isActive ? "activated" : "deactivated"}`);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update value");
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`/api/admin/about/team/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete team member");
      }

      toast.success("Team member deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete team member");
    }
  };

  const handleToggleTeamMemberActive = async (member: TeamMember) => {
    try {
      const response = await fetch(`/api/admin/about/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !member.isActive }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to update team member");
      }

      toast.success(`Team member ${!member.isActive ? "activated" : "deactivated"}`);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update team member");
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">About Page Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your about page content, values, and team members
          </p>
        </div>
      </div>

      {/* Tabs for Values and Team Members */}
      <Tabs defaultValue="values" className="space-y-4">
        <TabsList>
          <TabsTrigger value="values" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            About Values
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Members
          </TabsTrigger>
        </TabsList>

        {/* About Values Tab */}
        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>About Values</CardTitle>
                  <CardDescription>Manage the core values of your company</CardDescription>
                </div>
                <Link href="/dashboard/admin/about/values/new">
                  <Button className="text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Value
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aboutValues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No values found. Create your first value.
                      </TableCell>
                    </TableRow>
                  ) : (
                    aboutValues.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell>
                          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10">
                            <span className="text-secondary">{value.icon}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{value.title}</TableCell>
                        <TableCell>{value.order}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              value.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {value.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleValueActive(value)}
                            >
                              {value.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Link href={`/dashboard/admin/about/values/${value.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteValue(value.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your team members</CardDescription>
                </div>
                <Link href="/dashboard/admin/about/team/new">
                  <Button className="text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No team members found. Add your first team member.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        {/* --- THIS IS THE FIXED PART --- */}
                        <TableCell>
                          {member.image && (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                              <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </TableCell>
                        {/* --- END OF FIXED PART --- */}
                        <TableCell className="font-medium">
                          {member.name}
                          {member.isFounder && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Founder
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.order}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleTeamMemberActive(member)}
                            >
                              {member.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Link href={`/dashboard/admin/about/team/${member.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTeamMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}