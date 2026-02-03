// /app/portfolio/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const categories = ["All", "Interior Design", "Architecture", "Renovation", "Complete Projects"];

const projects = [
  {
    id: 1,
    title: "Modern Villa Residence",
    category: "Architecture",
    location: "Beverly Hills, CA",
    year: "2023",
    description: "A contemporary villa featuring open-plan living spaces and seamless indoor-outdoor integration.",
    image: "bg-gradient-to-br from-primary to-primary-700",
    tags: ["Modern", "Luxury", "Sustainable"],
  },
  {
    id: 2,
    title: "Urban Luxury Apartment",
    category: "Interior Design",
    location: "Manhattan, NY",
    year: "2023",
    description: "High-end apartment interior showcasing minimalist design with premium finishes.",
    image: "bg-gradient-to-br from-secondary to-secondary-700",
    tags: ["Contemporary", "Luxury", "Urban"],
  },
  {
    id: 3,
    title: "Minimalist Family Home",
    category: "Complete Projects",
    location: "Portland, OR",
    year: "2022",
    description: "A serene family home emphasizing clean lines and functional spaces.",
    image: "bg-gradient-to-br from-primary-600 to-primary-800",
    tags: ["Minimalist", "Family", "Eco-Friendly"],
  },
  {
    id: 4,
    title: "Industrial Loft Conversion",
    category: "Renovation",
    location: "Chicago, IL",
    year: "2023",
    description: "Transformation of a warehouse into a sophisticated living space with industrial charm.",
    image: "bg-gradient-to-br from-secondary-600 to-secondary-800",
    tags: ["Industrial", "Loft", "Urban"],
  },
  {
    id: 5,
    title: "Coastal Beach House",
    category: "Architecture",
    location: "Malibu, CA",
    year: "2022",
    description: "Beachfront property designed to maximize ocean views and natural light.",
    image: "bg-gradient-to-br from-primary-500 to-primary-700",
    tags: ["Coastal", "Modern", "Luxury"],
  },
  {
    id: 6,
    title: "Scandinavian Apartment",
    category: "Interior Design",
    location: "Seattle, WA",
    year: "2023",
    description: "Light-filled apartment featuring Nordic-inspired design and natural materials.",
    image: "bg-gradient-to-br from-secondary-500 to-secondary-700",
    tags: ["Scandinavian", "Cozy", "Natural"],
  },
  {
    id: 7,
    title: "Mid-Century Modern Renovation",
    category: "Renovation",
    location: "Palm Springs, CA",
    year: "2022",
    description: "Restoration and modernization of a classic mid-century home.",
    image: "bg-gradient-to-br from-primary-700 to-primary-900",
    tags: ["Mid-Century", "Vintage", "Modern"],
  },
  {
    id: 8,
    title: "Contemporary Townhouse",
    category: "Complete Projects",
    location: "Boston, MA",
    year: "2023",
    description: "Multi-level townhouse with smart home integration and contemporary design.",
    image: "bg-gradient-to-br from-secondary-700 to-secondary-900",
    tags: ["Contemporary", "Smart Home", "Urban"],
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6">Our Portfolio</h1>
            <p className="text-xl text-white/80">
              Explore our collection of exceptional design projects that showcase our commitment to excellence
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-tertiary sticky top-[73px] z-40">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-tertiary/20">
        <div className="container-custom">
          <div className="mb-8 text-center">
            <p className="text-primary/70">
              Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className={`aspect-[4/3] ${project.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {project.year}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform group-hover:translate-y-0">
                    <div className="text-sm text-white/80 mb-2">{project.category}</div>
                    <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
                    <p className="text-sm text-white/70 mb-2">{project.location}</p>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <p className="text-primary/70 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-tertiary text-primary px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-primary/70">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">1000+</div>
              <div className="text-primary/70">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">25+</div>
              <div className="text-primary/70">Design Awards</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">15+</div>
              <div className="text-primary/70">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6">Start Your Project Today</h2>
            <p className="mb-8 text-lg text-white/80">
              Ready to create something exceptional? Let&apos;s discuss how we can bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}