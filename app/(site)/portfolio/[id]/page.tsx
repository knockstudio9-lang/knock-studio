/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(site)/portfolio/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Ruler,
  CheckCircle2,
  CalendarDays,
  Maximize2,
} from "lucide-react";

// Define types - matching the portfolio page
interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  completion: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  galleryImages: string[];
  tags: string[];
}

// Smooth Before/After Animation Component (non-interactive)
const BeforeAfterAnimation = ({ 
  beforeSrc, 
  afterSrc, 
  className = "",
  autoPlay = false 
}: { 
  beforeSrc: string;
  afterSrc: string;
  className?: string;
  autoPlay?: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const duration = 4000; // 4 seconds total
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function (ease-in-out-cubic)
      const easeInOutCubic = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;
      
      // Animation sequence:
      // 0-0.4: Show before image (pause)
      // 0.4-0.8: Slide to reveal after image
      // 0.8-1.0: Show after image (pause)
      
      let slideProgress;
      if (rawProgress < 0.3) {
        // Pause on before image
        slideProgress = 0;
      } else if (rawProgress < 0.7) {
        // Slide transition
        const transitionProgress = (rawProgress - 0.3) / 0.4;
        const easedTransition = transitionProgress < 0.5
          ? 4 * transitionProgress * transitionProgress * transitionProgress
          : 1 - Math.pow(-2 * transitionProgress + 2, 3) / 2;
        slideProgress = easedTransition;
      } else {
        // Pause on after image
        slideProgress = 1;
      }
      
      setProgress(slideProgress);
      
      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setProgress(0); // Reset for next play
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        startAnimation();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle case where beforeSrc is empty
  if (!beforeSrc || beforeSrc.trim() === '') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0">
          <Image
            src={afterSrc}
            alt="After"
            fill
            className="object-cover"
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 text-sm font-medium rounded-md backdrop-blur-sm"
        >
          After
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* After image (background) */}
      <div className="absolute inset-0">
        <Image
          src={afterSrc}
          alt="After"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Before image (slides out) */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          clipPath: `inset(0 ${progress * 100}% 0 0)`,
        }}
      >
        <Image
          src={beforeSrc}
          alt="Before"
          fill
          className="object-cover"
        />
      </motion.div>
      
      {/* Labels with fade animation */}
      <AnimatePresence>
        {progress < 0.5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 text-sm font-medium rounded-md backdrop-blur-sm"
          >
            Before
          </motion.div>
        )}
        {progress > 0.5 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 text-sm font-medium rounded-md backdrop-blur-sm"
          >
            After
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play Animation Button */}
      {!isAnimating && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={startAnimation}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 hover:bg-black/80 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 2v12l10-6L3 2z" />
          </svg>
          Play Transformation
        </motion.button>
      )}

      {/* Progress indicator during animation */}
      {isAnimating && (
        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-xs backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Transforming...
        </motion.div>
      )}
    </div>
  );
};

// Gallery Modal Component
const GalleryModal = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev,
  project 
}: { 
  images: Array<{ type: string; src: string; label: string }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  project: Project;
}) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={28} />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Image Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium">
        {currentImage.label}
      </div>

      {/* Main Image Display */}
      <div className="relative w-full h-full p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          {currentImage.type === 'before-after' ? (
            <motion.div
              key={`before-after-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <BeforeAfterAnimation
                beforeSrc={project.beforeImage}
                afterSrc={project.afterImage}
                className="w-full h-full rounded-lg"
                autoPlay={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`image-${currentIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImage.src}
                alt={currentImage.label}
                fill
                className="object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Reveal-on-scroll helper used across the page
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: EASE, delay },
});

// Photo tile: image + hover zoom + glass label
const PhotoTile = ({
  src,
  alt,
  label,
  onClick,
  className,
  delay = 0,
}: {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
  className?: string;
  delay?: number;
}) => (
  <motion.button
    type="button"
    {...reveal(delay)}
    onClick={onClick}
    aria-label={`Open ${label}`}
    className={`group relative block overflow-hidden rounded-2xl bg-muted text-left ${className ?? ""}`}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 60vw, 100vw"
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
    <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
      {label}
    </span>
    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
      <Maximize2 className="h-4 w-4" />
    </span>
  </motion.button>
);

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Window-scroll based (no element target: the hero isn't mounted while loading)
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 800], [0, 140]);
  const heroContentOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/portfoliopublic/${resolvedParams.id}`);

        if (!response.ok) {
          if (response.status === 404) throw new Error("Project not found");
          throw new Error("Failed to fetch project");
        }

        setProject(await response.json());
      } catch (err: any) {
        console.error("Error fetching project:", err);
        setError(err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [resolvedParams.id]);

  // Work out the "next project" (wraps around) – optional, fails silently
  useEffect(() => {
    let cancelled = false;
    fetch("/api/portfoliopublic")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: Array<Project & { order?: number }>) => {
        if (cancelled || !Array.isArray(list) || list.length < 2) return;
        const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const index = sorted.findIndex((p) => String(p.id) === resolvedParams.id);
        if (index === -1) return;
        setNextProject(sorted[(index + 1) % sorted.length]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  const hasBeforeImage = (p: Project) => !!p.beforeImage && p.beforeImage.trim() !== "";

  // Order must match openGallery() indexes below
  const allImages = project
    ? [
        { type: "after", src: project.afterImage, label: "After" },
        ...(hasBeforeImage(project) ? [{ type: "before", src: project.beforeImage, label: "Before" }] : []),
        ...(hasBeforeImage(project)
          ? [{ type: "before-after", src: "", label: "Before & After Transformation" }]
          : []),
        ...project.galleryImages.map((img, idx) => ({
          type: "gallery",
          src: img,
          label: `Gallery ${idx + 1}`,
        })),
      ]
    : [];

  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setShowGalleryModal(true);
  };

  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () =>
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat proyek...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The project you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/portfolio">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: MapPin, label: "Lokasi", value: project.location },
    { icon: Ruler, label: "Luas", value: project.area },
    { icon: CheckCircle2, label: "Status", value: project.completion },
    { icon: CalendarDays, label: "Tahun", value: project.year },
  ];

  const withBefore = hasBeforeImage(project);
  // Alternating 7/5 – 5/7 column spans for the extra gallery photos
  const gallerySpans = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];

  return (
    <div className="min-h-screen bg-background">
      {/* ───────── Hero ───────── */}
      <section className="relative h-[78svh] min-h-[520px] w-full overflow-hidden bg-primary-950 text-white md:h-[88svh]">
        <motion.div className="absolute inset-0 -top-[6%] h-[112%]" style={{ y: heroImageY }}>
          <motion.div
            className="relative h-full w-full"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            <Image
              src={project.afterImage}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Scrims keep both the header (top) and the title (bottom) readable on any photo */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        <motion.div
          className="absolute inset-x-0 bottom-0 pb-20 md:pb-28"
          style={{ opacity: heroContentOpacity }}
        >
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            >
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-white backdrop-blur-md transition-colors hover:bg-black/55"
              >
                <ArrowLeft size={16} />
                Portofolio
              </Link>
            </motion.div>

            <motion.span
              className="mt-6 inline-block rounded-full border border-secondary/70 bg-secondary/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            >
              {project.category}
            </motion.span>

            <motion.h1
              className="mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight drop-shadow-md md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
            >
              {project.title}
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* ───────── Stats card (overlaps hero) ───────── */}
      <section className="container-custom relative z-10 -mt-12 md:-mt-16">
        <motion.dl
          {...reveal()}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-xl shadow-black/10 md:grid-cols-4"
        >
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 bg-card p-5 md:p-6">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
                <dd className="mt-1 break-words text-base font-semibold md:text-lg">{value}</dd>
              </div>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* ───────── About ───────── */}
      <section className="container-custom py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <motion.div {...reveal()} className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Tentang Proyek
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl lg:text-4xl">Cerita di balik ruangnya</h2>
          </motion.div>

          <motion.div {...reveal(0.1)} className="md:col-span-8">
            <p className="whitespace-pre-line text-lg leading-relaxed text-foreground/80 md:text-xl">
              {project.description}
            </p>
            {project.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-secondary/40 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ───────── Gallery ───────── */}
      <section className="container-custom pb-16 md:pb-24">
        <motion.div {...reveal()} className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">Galeri</p>
            <h2 className="mt-3 text-2xl font-bold md:text-4xl">Project Gallery</h2>
          </div>
          <span className="text-sm text-muted-foreground tabular-nums">{allImages.length} item</span>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <PhotoTile
            src={project.afterImage}
            alt="After"
            label="After"
            onClick={() => openGallery(0)}
            className={`h-72 md:h-[460px] ${withBefore ? "md:col-span-8" : "md:col-span-12"}`}
          />

          {withBefore && (
            <PhotoTile
              src={project.beforeImage}
              alt="Before"
              label="Before"
              onClick={() => openGallery(1)}
              delay={0.1}
              className="h-72 md:col-span-4 md:h-[460px]"
            />
          )}

          {withBefore && (
            <motion.div
              {...reveal(0.1)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl md:col-span-12 md:aspect-[16/8]"
              onClick={() => openGallery(2)}
            >
              <BeforeAfterAnimation
                beforeSrc={project.beforeImage}
                afterSrc={project.afterImage}
                className="h-full w-full"
              />
            </motion.div>
          )}

          {project.galleryImages.map((img, index) => (
            <PhotoTile
              key={index}
              src={img}
              alt={`Gallery ${index + 1}`}
              label={`Gallery ${index + 1}`}
              onClick={() => openGallery(withBefore ? 3 + index : 1 + index)}
              delay={0.05 * (index % 2)}
              className={`h-64 md:h-[380px] ${gallerySpans[index % gallerySpans.length]}`}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {showGalleryModal && (
          <GalleryModal
            images={allImages}
            currentIndex={selectedImageIndex}
            onClose={() => setShowGalleryModal(false)}
            onNext={nextImage}
            onPrev={prevImage}
            project={project}
          />
        )}
      </AnimatePresence>

      {/* ───────── Next project ───────── */}
      {nextProject && (
        <section className="container-custom pb-16 md:pb-24">
          <motion.div {...reveal()}>
            <Link
              href={`/portfolio/${nextProject.id}`}
              className="group relative block h-56 overflow-hidden rounded-2xl bg-primary-950 text-white md:h-72"
            >
              <Image
                src={nextProject.afterImage}
                alt={nextProject.title}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-between gap-6 p-6 md:p-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary-300">
                    Proyek Berikutnya
                  </p>
                  <h3 className="mt-3 text-2xl font-bold md:text-4xl">{nextProject.title}</h3>
                  <p className="mt-2 text-sm text-white/75">{nextProject.category}</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white transition-transform duration-300 group-hover:translate-x-1 md:h-14 md:w-14">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ───────── CTA ───────── */}
      <section className="container-custom pb-20 md:pb-28">
        <motion.div
          {...reveal()}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-primary px-6 py-14 text-center text-white md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold md:text-4xl">Tertarik dengan proyek serupa?</h3>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 md:text-lg">
              Mari diskusikan bagaimana kami dapat mengubah ruang Anda menjadi sesuatu yang luar biasa.
            </p>
            <Link href="/schedule" className="mt-8 inline-block">
              <Button size="lg" className="group bg-secondary text-white hover:bg-secondary-600">
                Konsultasi dengan Kami
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
