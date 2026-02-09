// app/dashboard/admin/services/page.tsx
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
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { ServiceDialog } from "@/components/dashboard/ServiceDialog";
import { ComparisonDialog } from "@/components/dashboard/ComparisonDialog";
import { toast } from "sonner"; // Import from sonner instead of useToast
import Image from "next/image";

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
  createdAt: Date;
  updatedAt: Date;
}

interface ComparisonFeature {
  id: number;
  feature: string;
  renovation: boolean;
  visualization: boolean;
  consultation: boolean;
  estimation: boolean;
  execution: boolean;
  order: number;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [comparisonFeatures, setComparisonFeatures] = useState<ComparisonFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonFeature | null>(null);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchComparisonFeatures();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComparisonFeatures = async () => {
    try {
      const response = await fetch("/api/admin/services/comparison");
      if (!response.ok) throw new Error("Failed to fetch comparison features");
      const data = await response.json();
      setComparisonFeatures(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch comparison features");
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete service");

      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update service");

      toast.success(`Service ${!service.isActive ? "activated" : "deactivated"}`);
      fetchServices();
    } catch (error) {
      toast.error("Failed to update service");
    }
  };

  const handleDeleteComparison = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comparison feature?")) return;

    try {
      const response = await fetch(`/api/admin/services/comparison/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comparison feature");

      toast.success("Comparison feature deleted successfully");
      fetchComparisonFeatures();
    } catch (error) {
      toast.error("Failed to delete comparison feature");
    }
  };

  const handleServiceSuccess = () => {
    fetchServices();
    setIsServiceDialogOpen(false);
    setSelectedService(null);
  };

  const handleComparisonSuccess = () => {
    fetchComparisonFeatures();
    setIsComparisonDialogOpen(false);
    setSelectedComparison(null);
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
          <h1 className="text-3xl font-bold text-foreground">Services Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your services and comparison features
          </p>
        </div>
      </div>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>Manage your service offerings</CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedService(null);
                setIsServiceDialogOpen(true);
              }}
              className="text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No services found. Create your first service.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{service.duration}</TableCell>
                    <TableCell>{service.order}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(service)}
                        >
                          {service.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedService(service);
                            setIsServiceDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
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

      {/* Comparison Features Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Comparison Features</CardTitle>
              <CardDescription>Manage service comparison matrix</CardDescription>
            </div>
            <Button
              onClick={() => {
                setSelectedComparison(null);
                setIsComparisonDialogOpen(true);
              }}
              className="text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Renovation</TableHead>
                <TableHead className="text-center">Visualization</TableHead>
                <TableHead className="text-center">Consultation</TableHead>
                <TableHead className="text-center">Estimation</TableHead>
                <TableHead className="text-center">Execution</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFeatures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No comparison features found.
                  </TableCell>
                </TableRow>
              ) : (
                comparisonFeatures.map((feature) => (
                  <TableRow key={feature.id}>
                    <TableCell className="font-medium">{feature.feature}</TableCell>
                    <TableCell className="text-center">
                      {feature.renovation ? "✓" : "✗"}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.visualization ? "✓" : "✗"}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.consultation ? "✓" : "✗"}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.estimation ? "✓" : "✗"}
                    </TableCell>
                    <TableCell className="text-center">
                      {feature.execution ? "✓" : "✗"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedComparison(feature);
                            setIsComparisonDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComparison(feature.id)}
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

      {/* Dialogs */}
      <ServiceDialog
        open={isServiceDialogOpen}
        onOpenChange={setIsServiceDialogOpen}
        service={selectedService}
        onSuccess={handleServiceSuccess}
      />

      <ComparisonDialog
        open={isComparisonDialogOpen}
        onOpenChange={setIsComparisonDialogOpen}
        feature={selectedComparison}
        onSuccess={handleComparisonSuccess}
      />
    </div>
  );
}