/* eslint-disable @typescript-eslint/no-explicit-any */
// /components/home/ServicesSection.tsx
"use client";

import { Home, Hammer } from "lucide-react";
import Link from "next/link";

// Dummy data in Bahasa Indonesia
const services = [
  {
    id: 1,
    title: "Pembangunan",
    description: "Layanan pembangunan rumah dari awal dengan desain modern dan material berkualitas tinggi. Kami memastikan setiap detail sesuai dengan visi dan kebutuhan Anda.",
    icon: "Home"
  },
  {
    id: 2,
    title: "Renovasi",
    description: "Transformasi dan pembaruan rumah existing Anda menjadi lebih modern dan functional. Dari renovasi kecil hingga perombakan total, kami siap membantu.",
    icon: "Hammer"
  }
];

// Map icon names to Lucide React components
const iconMap: Record<string, any> = {
  Home,
  Hammer
};

export default function ServicesSection() {
  return (
    <section className="section-padding bg-background transition-colors duration-300 min-h-screen flex items-center">
      <div className="container-custom pt-20">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-secondary">Our Service</h2>
          <p className="text-lg text-muted-foreground">
            Solusi renovasi dan pembangunan rumah yang komprehensif dan disesuaikan dengan kebutuhan Anda
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {services.map((service) => {
            // Get the icon component from the iconMap, fallback to Home if not found
            const IconComponent = iconMap[service.icon] || Home;
            
            return (
              <div 
                key={service.id} 
                className="group relative p-6 border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-ring"
              >
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-ring transition-all duration-300 group-hover:bg-ring group-hover:text-white">
                  <IconComponent className="h-6 w-6" />
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-secondary">
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
            Lihat Semua Layanan
          </Link>
        </div>
      </div>
    </section>
  );
}