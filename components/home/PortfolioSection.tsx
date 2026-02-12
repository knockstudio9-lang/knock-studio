"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface FeaturedProject {
  id: number;
  title: string;
  category: string;
  afterImage: string | null;
  featured: boolean;
}

export default function PortfolioSection() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/featuredPortfolio');
        
        if (!res.ok) {
          console.error('Failed to fetch featured projects');
          setProjects([]);
          return;
        }
        
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching featured projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Don't render anything while loading or if no projects
  if (isLoading || projects.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-background py-10 transition-colors duration-300">
      <div className="container-custom pt-20">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-secondary">Proyek Unggulan</h2>
          <p className="text-lg text-muted-foreground">
            Ingin melihat hasil kerja kami? Jelajahi portofolio proyek kami di sini.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <Link 
              key={project.id}
              href={`/portfolio/${project.id}`}
              className="group relative aspect-[3/4] overflow-hidden border border-border"
            >
              <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-110">
                {project.afterImage ? (
                  <Image
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-sm text-white/80 mb-2">{project.category}</div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">
              Lihat Semua Proyek
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}