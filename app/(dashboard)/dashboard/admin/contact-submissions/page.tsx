/* eslint-disable prefer-const */
// app/(dashboard)/dashboard/admin/contact-submissions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  X,
  ExternalLink
} from "lucide-react";
import { ContactSubmission } from "@/lib/db/schema";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Format number to Indonesian Rupiah
const formatRupiah = (value: string | null | undefined): string => {
  if (!value) return "Tidak disebutkan";
  
  // Remove non-numeric characters
  const numericValue = value.replace(/[^\d]/g, "");
  
  if (!numericValue) return value;
  
  // Format with thousand separators
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(numericValue));
  
  return formatted;
};

// Image Gallery Component
function ImageGallery({ images }: { images: string[] | null | undefined }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Tidak ada foto yang diunggah</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((imageUrl, index) => (
          <div 
            key={index} 
            className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg border border-border hover:border-primary transition-colors"
            onClick={() => setSelectedImage(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Foto</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedImage, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka di Tab Baru
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Pagination component
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          {pages.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editStatusId, setEditStatusId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewSubmission, setViewSubmission] = useState<ContactSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSubmissions.slice(startIndex, endIndex);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    // Filter submissions based on search term, status, and service
    let filtered = submissions;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((submission) => submission.status === statusFilter);
    }
    
    if (serviceFilter !== "all") {
      filtered = filtered.filter((submission) => submission.service === serviceFilter);
    }
    
    setFilteredSubmissions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [submissions, searchTerm, statusFilter, serviceFilter]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/contact-submissions");
      const data = await response.json();
      
      if (response.ok) {
        setSubmissions(data.submissions);
      } else {
        console.error("Failed to fetch submissions:", data.error);
        toast.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Error fetching submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        const response = await fetch(`/api/contact-submissions/${id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          toast.success("Submission deleted successfully");
          fetchSubmissions();
        } else {
          const data = await response.json();
          console.error("Failed to delete submission:", data.error);
          toast.error("Failed to delete submission");
        }
      } catch (error) {
        console.error("Error deleting submission:", error);
        toast.error("Error deleting submission");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} submissions?`)) {
      try {
        const response = await fetch("/api/contact-submissions/bulk-delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedIds }),
        });
        
        if (response.ok) {
          toast.success(`${selectedIds.length} submission${selectedIds.length > 1 ? 's' : ''} deleted successfully`);
          fetchSubmissions();
          setSelectedIds([]);
        } else {
          const data = await response.json();
          console.error("Failed to delete submissions:", data.error);
          toast.error("Failed to delete submissions");
        }
      } catch (error) {
        console.error("Error deleting submissions:", error);
        toast.error("Error deleting submissions");
      }
    }
  };

  const handleUpdateStatus = async () => {
    if (!editStatusId || !newStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/contact-submissions/${editStatusId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        toast.success("Status updated successfully");
        fetchSubmissions();
        setIsDialogOpen(false);
        setEditStatusId(null);
        setNewStatus("");
      } else {
        const data = await response.json();
        console.error("Failed to update status:", data.error);
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">New</Badge>;
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getServiceBadge = (service: string | null) => {
    switch (service) {
      case "renovation":
        return <Badge variant="secondary">Renovasi</Badge>;
      case "new-construction":
        return <Badge variant="secondary">Bangun Baru</Badge>;
      default:
        return <Badge variant="outline">{service || "Unknown"}</Badge>;
    }
  };

  const getServiceLabel = (service: string | null) => {
    switch (service) {
      case "renovation":
        return "Renovasi";
      case "new-construction":
        return "Bangun Baru";
      default:
        return service || "Tidak disebutkan";
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd MMMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd MMMM yyyy, HH:mm");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleViewSubmission = (submission: ContactSubmission) => {
    setViewSubmission(submission);
    setIsViewDialogOpen(true);
  };

  // Helper to get image count
  const getImageCount = (images: string[] | null | undefined) => {
    if (!images || !Array.isArray(images)) return 0;
    return images.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage and track contact form submissions from potential clients.
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
            <Button variant="default" size="sm" onClick={handleBulkDelete} className="text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription className="text-foreground">
            A list of all contact form submissions received.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, address, service, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="renovation">Renovasi</SelectItem>
                  <SelectItem value="new-construction">Bangun Baru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || serviceFilter !== "all"
                  ? "No submissions match your search criteria."
                  : "No submissions yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                          onCheckedChange={handleSelectAll}
                          className="text-white"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(submission.id)}
                            onCheckedChange={(checked) => handleSelectOne(submission.id, checked as boolean)}
                            className="text-white"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <p>{submission.name || "N/A"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getServiceBadge(submission.service)}</TableCell>
                        <TableCell>
                          <span className="truncate max-w-[150px] block">
                            {submission.address || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatRupiah(submission.budget)}
                        </TableCell>
                        <TableCell>
                          {getImageCount(submission.images) > 0 ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ImageIcon className="h-4 w-4" />
                              <span>{getImageCount(submission.images)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{formatDate(submission.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewSubmission(submission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Dialog open={isDialogOpen && editStatusId === submission.id} onOpenChange={(open) => {
                              setIsDialogOpen(open);
                              if (!open) {
                                setEditStatusId(null);
                                setNewStatus("");
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setEditStatusId(submission.id);
                                    setNewStatus(submission.status || "");
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Status
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Status</DialogTitle>
                                  <DialogDescription>
                                    Update the status for this submission.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                      value={newStatus}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsDialogOpen(false);
                                      setEditStatusId(null);
                                      setNewStatus("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleUpdateStatus}
                                    disabled={isUpdatingStatus || !newStatus}
                                  >
                                    {isUpdatingStatus ? "Updating..." : "Update Status"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(submission.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Submission Dialog - Improved with Image Gallery */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan</DialogTitle>
            <DialogDescription>
              Informasi lengkap dari pengajuan kontak klien
            </DialogDescription>
          </DialogHeader>
          {viewSubmission && (
            <div className="space-y-6 py-4">
              {/* Client Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Informasi Klien
                </h3>
                <Separator />
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Nama
                    </Label>
                    <p className="col-span-2 text-sm">
                      {viewSubmission.name || "Tidak disebutkan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Informasi Proyek
                </h3>
                <Separator />
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Jenis Layanan
                    </Label>
                    <p className="col-span-2 text-sm">
                      {getServiceLabel(viewSubmission.service)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Lokasi Proyek
                    </Label>
                    <p className="col-span-2 text-sm">
                      {viewSubmission.address || "Tidak disebutkan"}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Luas Area
                    </Label>
                    <p className="col-span-2 text-sm">
                      {viewSubmission.area ? `${viewSubmission.area}` : "Tidak disebutkan"}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Budget
                    </Label>
                    <p className="col-span-2 text-sm font-medium">
                      {formatRupiah(viewSubmission.budget)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Detail Tambahan
                </h3>
                <Separator />
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Detail
                    </Label>
                    <p className="col-span-2 text-sm whitespace-pre-wrap">
                      {viewSubmission.details || "Tidak ada keterangan tambahan"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Foto Properti
                </h3>
                <Separator />
                <ImageGallery images={viewSubmission.images} />
              </div>

              {/* Status & Timeline Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Status & Timeline
                </h3>
                <Separator />
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Status
                    </Label>
                    <div className="col-span-2">
                      {getStatusBadge(viewSubmission.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Tanggal Pengajuan
                    </Label>
                    <p className="col-span-2 text-sm">
                      {formatDateTime(viewSubmission.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}