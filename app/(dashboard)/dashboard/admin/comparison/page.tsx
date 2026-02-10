// app/(dashboard)/dashboard/admin/comparison/page.tsx
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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { ComparisonDialog } from "@/components/dashboard/service/ComparisonDialog";
import { toast } from "sonner";

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

export default function ComparisonPage() {
  const [comparisonFeatures, setComparisonFeatures] = useState<ComparisonFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonFeature | null>(null);
  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  useEffect(() => {
    fetchComparisonFeatures();
  }, []);

  const fetchComparisonFeatures = async () => {
    try {
      const response = await fetch("/api/admin/services/comparison");
      if (!response.ok) throw new Error("Failed to fetch comparison features");
      const data = await response.json();
      setComparisonFeatures(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch comparison features");
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-foreground">Comparison Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage service comparison matrix
          </p>
        </div>
      </div>

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

      {/* Dialog */}
      <ComparisonDialog
        open={isComparisonDialogOpen}
        onOpenChange={setIsComparisonDialogOpen}
        feature={selectedComparison}
        onSuccess={handleComparisonSuccess}
      />
    </div>
  );
}