// /components/home/ServicesSection.tsx
"use client";

import { Home, Ruler, Palette, Layers } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Palette,
    title: "Interior Design",
    description: "Creating beautiful, functional spaces that reflect your personality and lifestyle with expert color palettes and furnishing.",
  },
  {
    icon: Home,
    title: "Architecture",
    description: "Innovative architectural solutions from concept to completion, ensuring structural integrity and aesthetic excellence.",
  },
  {
    icon: Ruler,
    title: "Space Planning",
    description: "Optimizing layouts for maximum functionality and flow, making the most of every square foot in your home.",
  },
  {
    icon: Layers,
    title: "3D Visualization",
    description: "Photorealistic 3D renderings that help you visualize your project before construction begins.",
  },
];

export default function ServicesSection() {
  return (
    <section className="section-padding bg-background transition-colors duration-300 min-h-screen flex items-center">
      <div className="container-custom pt-20">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-foreground">Our Services</h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive design solutions tailored to bring your vision to life
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative p-6 rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-ring"
              >
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-ring transition-all duration-300 group-hover:bg-ring group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-card-foreground">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="my-10 text-center">
          <Link 
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3 rounded-md border-2 border-border bg-background text-foreground font-medium transition-all duration-300 hover:bg-ring hover:text-white hover:border-ring"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}