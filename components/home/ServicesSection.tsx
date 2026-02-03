// /components/home/ServicesSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Ruler, Palette, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 text-primary">Our Services</h2>
          <p className="text-lg text-primary/70">
            Comprehensive design solutions tailored to bring your vision to life
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group transition-all hover:shadow-lg hover:border-secondary"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-primary/60">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}