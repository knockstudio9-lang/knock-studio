// components/dashboard/service/ComparisonDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Import from sonner instead of useToast

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

interface ComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: ComparisonFeature | null;
  onSuccess: () => void;
}

export function ComparisonDialog({
  open,
  onOpenChange,
  feature,
  onSuccess,
}: ComparisonDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    feature: "",
    renovation: false,
    visualization: false,
    consultation: false,
    estimation: false,
    execution: false,
    order: 0,
  });

  useEffect(() => {
    if (feature) {
      setFormData({
        feature: feature.feature,
        renovation: feature.renovation,
        visualization: feature.visualization,
        consultation: feature.consultation,
        estimation: feature.estimation,
        execution: feature.execution,
        order: feature.order,
      });
    } else {
      setFormData({
        feature: "",
        renovation: false,
        visualization: false,
        consultation: false,
        estimation: false,
        execution: false,
        order: 0,
      });
    }
  }, [feature, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = feature
        ? `/api/admin/services/comparison/${feature.id}`
        : "/api/admin/services/comparison";
      const method = feature ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save comparison feature");

      toast.success(`Comparison feature ${feature ? "updated" : "created"} successfully`);
      onSuccess();
      onOpenChange(false); // Close the dialog after successful submission
    } catch (error) {
      toast.error(`Failed to ${feature ? "update" : "create"} comparison feature`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {feature ? "Edit Comparison Feature" : "Add Comparison Feature"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feature">Feature Name</Label>
            <Input
              id="feature"
              value={formData.feature}
              onChange={(e) =>
                setFormData({ ...formData, feature: e.target.value })
              }
              placeholder="e.g., Konsultasi & Survey"
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
                setFormData({ ...formData, order: parseInt(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Included in Services</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="renovation" className="font-normal">
                Home Renovation
              </Label>
              <Switch
                id="renovation"
                checked={formData.renovation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, renovation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="visualization" className="font-normal">
                Design Visualization
              </Label>
              <Switch
                id="visualization"
                checked={formData.visualization}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, visualization: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="consultation" className="font-normal">
                Consultation & Survey
              </Label>
              <Switch
                id="consultation"
                checked={formData.consultation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, consultation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="estimation" className="font-normal">
                Cost Estimation
              </Label>
              <Switch
                id="estimation"
                checked={formData.estimation}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, estimation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="execution" className="font-normal">
                Project Execution
              </Label>
              <Switch
                id="execution"
                checked={formData.execution}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, execution: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {feature ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}