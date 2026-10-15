// app/(site)/portfolio/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
  afterImage: string;
  galleryImages: string[];
  tags: string[];
  order: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pad = (n: number) => String(n).padStart(2, "0");

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/portfoliopublic");
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data.sort((a: Project, b: Project) => a.order - b.order));
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const selectedProject = projects[selectedProjectIndex];

  // "After" image + gallery images of the active project
  const imageCount = selectedProject ? 1 + selectedProject.galleryImages.length : 0;
  const galleryImage =
    selectedProject && selectedImageIndex > 0
      ? selectedProject.galleryImages[selectedImageIndex - 1]
      : null;

  // Track which project is in view while scrolling
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || projects.length === 0) return;

    const handleScroll = () => {
      const index = Math.min(
        Math.max(Math.round(container.scrollTop / container.clientHeight), 0),
        projects.length - 1
      );
      if (index !== selectedProjectIndex) {
        setSelectedProjectIndex(index);
        setSelectedImageIndex(0);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedProjectIndex, projects.length]);

  const nextImage = useCallback(() => {
    if (imageCount < 2) return;
    setSelectedImageIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const prevImage = useCallback(() => {
    if (imageCount < 2) return;
    setSelectedImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage]);

  const scrollToProject = (index: number) => {
    const container = imageContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: index * container.clientHeight, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat portofolio...</p>
        </div>
      </div>
    );
  }

  if (error || projects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold mb-2">No Projects Available</h2>
          <p className="text-muted-foreground mb-4">
            {error || "There are no published projects at the moment."}
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = selectedProject
    ? [
        { label: "Luas", value: selectedProject.area },
        { label: "Status", value: selectedProject.completion },
        { label: "Tahun", value: selectedProject.year },
      ]
    : [];

  return (
    <div className="bg-primary-950">
      <section className="relative flex h-svh w-full flex-col overflow-hidden text-white">
        {/* ───────── Image stage ───────── */}
        <div className="relative min-h-0 flex-1">
          {/* Scroll-snap layer: one full slide per project */}
          <div
            ref={imageContainerRef}
            className="scrollbar-hide absolute inset-0 overflow-y-scroll"
            style={{ scrollSnapType: "y mandatory" }}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="relative w-full overflow-hidden"
                style={{ height: "100%", scrollSnapAlign: "start", scrollSnapStop: "always" }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: index === selectedProjectIndex ? 1 : 1.08 }}
                  transition={{ duration: 1.4, ease: EASE }}
                >
                  <Image
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index <= selectedProjectIndex + 1}
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Gallery image overlay (only when browsing gallery photos) */}
          <div className="pointer-events-none absolute inset-0 z-[5]">
            <AnimatePresence>
              {galleryImage && selectedProject && (
                <motion.div
                  key={`gallery-${selectedProject.id}-${selectedImageIndex}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                >
                  <Image
                    src={galleryImage}
                    alt={`${selectedProject.title} - foto ${selectedImageIndex}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scrims: keep the header (top) and the text (bottom/left) legible on any photo */}
          <div className="pointer-events-none absolute inset-0 z-[6]">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/65 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            <div className="absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-black/45 to-transparent md:block" />
          </div>

          {/* Project index (desktop) */}
          <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex lg:right-10">
            <span className="text-xs font-medium tracking-widest text-white/80 tabular-nums">
              {pad(selectedProjectIndex + 1)}
            </span>
            <div className="flex flex-col gap-2.5">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => scrollToProject(index)}
                  aria-label={`Go to ${project.title}`}
                  className="group flex h-4 w-4 items-center justify-center"
                >
                  <span
                    className={cn(
                      "block rounded-full transition-all duration-300",
                      index === selectedProjectIndex
                        ? "h-6 w-1 bg-secondary"
                        : "h-1.5 w-1.5 bg-white/50 group-hover:bg-white"
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs tracking-widest text-white/50 tabular-nums">
              {pad(projects.length)}
            </span>
          </div>

          {/* Project info */}
          {selectedProject && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-12 md:pb-10">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10 md:pr-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`info-${selectedProject.id}`}
                    className="max-w-2xl"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className="inline-block rounded-full border border-secondary/70 bg-secondary/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      {selectedProject.category}
                    </span>
                    <h1 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                      {selectedProject.title}
                    </h1>
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-white/85 md:text-base">
                      <MapPin className="h-4 w-4 shrink-0 text-secondary-300" />
                      {selectedProject.location}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`meta-${selectedProject.id}`}
                    className="pointer-events-auto flex flex-col gap-3 md:items-end"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.06 }}
                  >
                    <dl className="grid grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/15 bg-black/35 py-3 backdrop-blur-md">
                      {stats.map((stat) => (
                        <div key={stat.label} className="px-4 md:px-5">
                          <dt className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                            {stat.label}
                          </dt>
                          <dd className="mt-1 text-sm font-semibold md:text-base">{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link href={`/portfolio/${selectedProject.id}`} className="self-start md:self-end">
                      <Button
                        size="lg"
                        className="group bg-secondary text-white shadow-lg hover:bg-secondary-600"
                      >
                        Lihat Proyek Lengkap
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* ───────── Bottom navigation bar ───────── */}
        <motion.div
          className="relative z-20 flex shrink-0 items-center gap-2 border-t border-white/10 bg-primary-950 px-4 py-3 md:gap-6 md:px-10 md:py-4"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        >
          <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto py-1 md:gap-3">
            {projects.map((project, index) => (
              <button
                key={project.id}
                onClick={() => scrollToProject(index)}
                aria-label={project.title}
                aria-current={selectedProjectIndex === index}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-md transition-all duration-300 md:h-[4.5rem] md:w-[4.5rem]",
                  selectedProjectIndex === index
                    ? "opacity-100 ring-2 ring-secondary ring-offset-2 ring-offset-primary-950"
                    : "opacity-55 hover:opacity-90"
                )}
              >
                <Image
                  src={project.afterImage}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Photo navigation for the active project */}
          {imageCount > 1 && (
            <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
              <button
                onClick={prevImage}
                aria-label="Previous photo"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-12 text-center text-xs tabular-nums text-white/80">
                {selectedImageIndex + 1} / {imageCount}
              </span>
              <button
                onClick={nextImage}
                aria-label="Next photo"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
