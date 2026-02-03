// /app/services/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Ruler, 
  Palette, 
  Layers, 
  Lightbulb, 
  Building2,
  Sofa,
  Trees,
  Hammer,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

const mainServices = [
  {
    icon: Palette,
    title: "Interior Design",
    description: "Transform your interiors with our expert design services that blend functionality with aesthetics.",
    features: [
      "Space planning and layout design",
      "Color consultation and palettes",
      "Furniture selection and placement",
      "Custom millwork and built-ins",
      "Lighting design",
      "Material and finish selection",
    ],
  },
  {
    icon: Home,
    title: "Architecture",
    description: "Comprehensive architectural services from initial concept through to final construction.",
    features: [
      "Residential design and planning",
      "Structural engineering coordination",
      "Building permits and approvals",
      "3D modeling and visualization",
      "Construction documentation",
      "Site analysis and planning",
    ],
  },
  {
    icon: Ruler,
    title: "Space Planning",
    description: "Optimize your space for maximum functionality and flow with our expert planning services.",
    features: [
      "Floor plan development",
      "Traffic flow analysis",
      "Furniture layout planning",
      "Storage optimization",
      "Multi-functional space design",
      "Accessibility considerations",
    ],
  },
  {
    icon: Layers,
    title: "3D Visualization",
    description: "See your project come to life before construction begins with photorealistic 3D renderings.",
    features: [
      "Photorealistic 3D renders",
      "Virtual walkthroughs",
      "Material and lighting studies",
      "Multiple design options",
      "360-degree views",
      "Animation and video tours",
    ],
  },
];

const additionalServices = [
  {
    icon: Lightbulb,
    title: "Lighting Design",
    description: "Strategic lighting solutions to enhance ambiance and functionality",
  },
  {
    icon: Building2,
    title: "Renovation",
    description: "Complete home renovation services from concept to completion",
  },
  {
    icon: Sofa,
    title: "Furniture Curation",
    description: "Custom furniture selection and procurement services",
  },
  {
    icon: Trees,
    title: "Landscape Integration",
    description: "Seamless indoor-outdoor living space design",
  },
  {
    icon: Hammer,
    title: "Project Management",
    description: "End-to-end project coordination and construction oversight",
  },
];

const process = [
  {
    step: "01",
    title: "Consultation",
    description: "We begin with a comprehensive consultation to understand your vision, needs, and budget.",
  },
  {
    step: "02",
    title: "Concept Development",
    description: "Our team creates initial design concepts and presents them for your review and feedback.",
  },
  {
    step: "03",
    title: "Design Refinement",
    description: "We refine the chosen concept, incorporating your feedback and finalizing all details.",
  },
  {
    step: "04",
    title: "Implementation",
    description: "With approved designs, we coordinate with contractors and oversee the construction process.",
  },
  {
    step: "05",
    title: "Final Walkthrough",
    description: "We conduct a thorough walkthrough to ensure everything meets our high standards and your expectations.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6">Our Services</h1>
            <p className="text-xl text-white/80">
              Comprehensive design solutions tailored to transform your house into your dream home
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-primary">Core Services</h2>
            <p className="text-lg text-primary/70">
              Expert services designed to bring your vision to life
            </p>
          </div>

          <div className="space-y-12">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="overflow-hidden border-2 hover:border-secondary transition-all">
                  <div className="grid lg:grid-cols-3 gap-0">
                    <div className="lg:col-span-1 bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 flex flex-col justify-center items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-white">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary">{service.title}</h3>
                    </div>
                    <CardContent className="lg:col-span-2 p-8">
                      <p className="text-primary/70 mb-6 text-lg">{service.description}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                            <span className="text-primary/80 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-tertiary/30">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-primary">Additional Services</h2>
            <p className="text-lg text-primary/70">
              Complementary services to complete your project
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="group hover:shadow-lg hover:border-secondary transition-all">
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
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-primary">Our Process</h2>
            <p className="text-lg text-primary/70">
              A streamlined approach to bring your project from concept to reality
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {process.map((item, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-2 text-5xl font-bold text-secondary/20 group-hover:text-secondary/30 transition-colors">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-primary/60 text-sm">
                    {item.description}
                  </CardDescription>
                </CardContent>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="h-0.5 w-6 bg-secondary/30" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6">Ready to Get Started?</h2>
            <p className="mb-8 text-lg text-white/80">
              Schedule a free consultation to discuss your project and how we can help bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule">
                <Button size="lg" variant="secondary">
                  Schedule Consultation
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}