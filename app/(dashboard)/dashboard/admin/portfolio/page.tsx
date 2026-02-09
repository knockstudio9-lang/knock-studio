// app/(dashboard)/dashboard/portfolio/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Plus, Image as ImageIcon, GripVertical } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  completion: string;
  description: string;
  beforeImage?: string;
  beforeImagePublicId?: string;
  afterImage: string;
  afterImagePublicId?: string;
  galleryImages: string[];
  galleryImagePublicIds: string[];
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  featured: boolean;
  order: number;
  client?: string;
  scope?: string;
  budget?: string;
  team?: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [dragOverProject, setDragOverProject] = useState<Project | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      // Explicitly sort by order field to ensure correct display order
      const sortedProjects = data.sort((a: Project, b: Project) => a.order - b.order);
      setProjects(sortedProjects);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? All associated images will also be deleted.`)) return;
    
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, project: Project) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverProject(project);
  };

  const handleDragLeave = () => {
    setDragOverProject(null);
  };

  const handleDrop = async (e: React.DragEvent, targetProject: Project) => {
    e.preventDefault();
    
    if (!draggedProject || draggedProject.id === targetProject.id) {
      setDraggedProject(null);
      setDragOverProject(null);
      return;
    }

    // Create a new array with reordered projects
    const draggedIndex = projects.findIndex(p => p.id === draggedProject.id);
    const targetIndex = projects.findIndex(p => p.id === targetProject.id);
    
    const newProjects = [...projects];
    newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, draggedProject);
    
    // Update order values based on new positions
    const reorderedProjects = newProjects.map((project, index) => ({
      ...project,
      order: index
    }));
    
    setProjects(reorderedProjects);
    setDraggedProject(null);
    setDragOverProject(null);
    
    // Save the new order to the database
    await saveProjectOrder(reorderedProjects);
  };

  const saveProjectOrder = async (reorderedProjects: Project[]) => {
    setIsReordering(true);
    
    try {
      const projectOrders = reorderedProjects.map(project => ({
        id: project.id,
        order: project.order
      }));
      
      const response = await fetch('/api/portfolio/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectOrders }),
      });
      
      if (response.ok) {
        toast.success('Project order updated successfully');
      } else {
        throw new Error('Failed to update project order');
      }
    } catch (error) {
      toast.error('Failed to update project order');
      // Re-fetch projects to restore correct order
      fetchProjects();
    } finally {
      setIsReordering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Management</h1>
          <p className="text-muted-foreground mt-1">Manage your architectural projects</p>
        </div>
        <Link href="/dashboard/portfolio/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {isReordering && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
          Updating project order...
        </div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first portfolio project to get started</p>
          <Link href="/dashboard/portfolio/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                dragOverProject?.id === project.id ? 'ring-2 ring-primary' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, project)}
              onDragOver={(e) => handleDragOver(e, project)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, project)}
            >
              <div className="relative h-48">
                <div className="absolute top-2 left-2 z-10 bg-white/80 rounded p-1 cursor-move">
                  <GripVertical className="w-4 h-4 text-gray-600" />
                </div>
                <Image
                  src={project.afterImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {project.featured && (
                    <Badge variant="secondary" className="bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  )}
                  <Badge variant={
                    project.status === 'published' ? 'default' : 
                    project.status === 'draft' ? 'secondary' : 
                    'outline'
                  }>
                    {project.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{project.location} • {project.year}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{project.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{project.area}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <Link href={`/dashboard/portfolio/edit/${project.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleDelete(project.id, project.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}