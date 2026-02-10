/* eslint-disable @typescript-eslint/no-explicit-any */
// /components/home/ServicesSection.tsx
"use client";

import { Home, Ruler, Layers, Wallet, Eye, Calculator, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Service } from "@/lib/db/schema";

// Map icon names from database to Lucide React components
const iconMap: Record<string, any> = {
  Home,
  Ruler,
  Layers,
  Wallet,
  Eye,
  MessageSquare,
  Calculator
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
          // Only take the first 4 services
          setServices(data.data.slice(0, 4));
        } else {
          setError(data.error || 'Failed to fetch services');
        }
      } catch (err) {
        setError('An error occurred while fetching services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-background transition-colors duration-300 min-h-screen flex items-center">
        <div className="container-custom pt-20">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-secondary">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Loading services...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-background transition-colors duration-300 min-h-screen flex items-center">
        <div className="container-custom pt-20">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-secondary">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Error: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background transition-colors duration-300 min-h-screen flex items-center">
      <div className="container-custom pt-20">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-secondary">Our Services</h2>
          <p className="text-lg text-muted-foreground">
            Solusi renovasi dan pembangunan rumah yang komprehensif dan disesuaikan dengan kebutuhan Anda
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}