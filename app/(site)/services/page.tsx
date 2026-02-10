/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/(site)/services/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Eye,
  MessageSquare,
  Calculator,
  Wrench,
  MapPin,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  FileText,
  Pencil,
  Check,
  Calendar,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as LucideIcons from "lucide-react";

import { db } from "@/lib/db";
import { services as servicesTable, serviceComparisonFeatures } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Home,
    Eye,
    MessageSquare,
    Calculator,
    Wrench,
    Package: LucideIcons.Package,
  };
  return icons[iconName] || Home;
}

// Fetch services directly from database
async function getServices() {
  try {
    const services = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.isActive, true))
      .orderBy(servicesTable.order);
    
    return services;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

// Fetch comparison data directly from database
async function getComparisonData() {
  try {
    const features = await db
      .select()
      .from(serviceComparisonFeatures)
      .orderBy(serviceComparisonFeatures.order);
    
    return features;
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return [];
  }
}

const serviceArea = [
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi"
];

const workSteps = [
  {
    number: "01",
    icon: Calendar,
    title: "Set A Survey Schedule",
    subtitle: "Tetapkan Jadwal Survei",
  },
  {
    number: "02",
    icon: MapPin,
    title: "Field Survey",
    subtitle: "Survei Lapangan",
  },
  {
    number: "03",
    icon: Pencil,
    title: "Study Architect's",
    subtitle: "Mempelajari Gambar Kerja Arsitek",
  },
  {
    number: "04",
    icon: Calculator,
    title: "RAB Calculation",
    subtitle: "Menghitung Rencana Anggaran Bangunan (RAB)",
  },
  {
    number: "05",
    icon: Wrench,
    title: "Scheduling & Development",
    subtitle: "Perencanaan dan Pembangunan",
  },
  {
    number: "06",
    icon: Check,
    title: "Serah Terima Bangunan",
    subtitle: "Building Handover",
  },
];

export default async function ServicesPage() {
  const services = await getServices();
  const comparisonData = await getComparisonData();

  return (
    <div className="min-h-screen bg-background">
      
      {/* Main Services Section */}
      <section className="py-24 pt-32 bg-background">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Layanan Utama Kami</h2>
            <p className="text-xl text-muted-foreground">
              Solusi renovasi dan pembangunan rumah yang komprehensif dan disesuaikan dengan kebutuhan Anda
            </p>
          </div>

          <div className="space-y-28">
            {services.map((service: any, index: number) => {
              const Icon = getIconComponent(service.icon);
              const isEven = index % 2 === 0;
              
              return (
                <div key={service.id} className={`grid lg:grid-cols-5 gap-16 items-start ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  <div className={`lg:col-span-2 ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 500px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                  
                  <div className={`lg:col-span-3 space-y-8 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 items-center justify-center bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex-shrink-0">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-secondary mb-2">{service.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="bg-muted/30 p-7 border-l-4 border-[var(--color-secondary)]">
                      <h4 className="font-semibold text-secondary mb-3 text-base">Cocok untuk:</h4>
                      <p className="text-muted-foreground leading-relaxed">{service.bestFor}</p>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-semibold text-secondary mb-5 text-base">Yang termasuk dalam layanan:</h4>
                      <div className="space-y-3">
                        {service.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Service Area */}
          <div className="max-w-4xl mx-auto mt-32">
            <Card className="border border-[var(--color-secondary)]/20 bg-gradient-to-br from-[var(--color-secondary)]/5 to-background">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="flex h-16 w-16 items-center justify-center bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-secondary mb-3">Service Area</CardTitle>
                <CardDescription className="text-muted-foreground text-base">Area layanan kami meliputi wilayah Jabodetabek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-4">
                  {serviceArea.map((area, index) => (
                    <div 
                      key={index}
                      className="px-8 py-3 bg-[var(--color-secondary)] text-white font-semibold text-sm"
                    >
                      {area}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Comparison Section */}
      <section className="py-24 pt-32 bg-muted/30">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Bandingkan Layanan Kami</h2>
            <p className="text-xl text-muted-foreground">
              Temukan layanan yang paling sesuai dengan kebutuhan renovasi Anda
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-secondary)]">
                  <th className="text-left p-6 font-semibold text-white border-r border-[var(--color-secondary-600)]">Fitur Layanan</th>
                  <th className="text-center p-6 font-semibold text-white border-r border-[var(--color-secondary-600)]">Home Renovation</th>
                  <th className="text-center p-6 font-semibold text-white border-r border-[var(--color-secondary-600)]">Design Visualization</th>
                  <th className="text-center p-6 font-semibold text-white border-r border-[var(--color-secondary-600)]">Consultation</th>
                  <th className="text-center p-6 font-semibold text-white border-r border-[var(--color-secondary-600)]">Cost Estimation</th>
                  <th className="text-center p-6 font-semibold text-white">Project Execution</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">{row.feature}</td>
                    <td className="text-center p-6">
                      {row.renovation ? (
                        <CheckCircle className="h-6 w-6 text-[var(--color-secondary)] mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-6">
                      {row.visualization ? (
                        <CheckCircle className="h-6 w-6 text-[var(--color-secondary)] mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-6">
                      {row.consultation ? (
                        <CheckCircle className="h-6 w-6 text-[var(--color-secondary)] mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-6">
                      {row.estimation ? (
                        <CheckCircle className="h-6 w-6 text-[var(--color-secondary)] mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                    <td className="text-center p-6">
                      {row.execution ? (
                        <CheckCircle className="h-6 w-6 text-[var(--color-secondary)] mx-auto" />
                      ) : (
                        <X className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Work Steps Section - Improved Design */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Alur Kerja Kami</h2>
            <p className="text-xl text-muted-foreground">
              Proses kerja yang terstruktur dari awal hingga selesai
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Desktop view - 3 columns */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-x-12 gap-y-16">
              {workSteps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={index} className="relative">
                    {/* Connecting line to next step */}
                    {index < workSteps.length - 1 && (
                      <div className="absolute top-12 left-full w-12 h-0.5 bg-[var(--color-secondary)]/20 hidden lg:block -translate-x-full z-0" 
                           style={{ 
                             display: (index + 1) % 3 === 0 ? 'none' : 'block'
                           }} 
                      />
                    )}
                    
                    <div className="relative z-10">
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-secondary)] text-white mb-4">
                          <span className="text-2xl font-bold">{step.number}</span>
                        </div>
                        <div className="w-12 h-12 bg-[var(--color-secondary)]/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-[var(--color-secondary)]" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Tablet view - 2 columns */}
            <div className="hidden md:grid md:grid-cols-2 gap-x-12 gap-y-12 lg:hidden">
              {workSteps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={index} className="relative">
                    <div className="mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--color-secondary)] text-white mb-4">
                        <span className="text-2xl font-bold">{step.number}</span>
                      </div>
                      <div className="w-12 h-12 bg-[var(--color-secondary)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[var(--color-secondary)]" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Mobile view - Single column with flow */}
            <div className="md:hidden">
              <div className="relative">
                {/* Vertical connecting line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[var(--color-secondary)]/20" />
                
                <div className="space-y-12">
                  {workSteps.map((step, index) => {
                    const Icon = step.icon;
                    
                    return (
                      <div key={index} className="relative flex gap-6">
                        <div className="flex-shrink-0 relative z-10">
                          <div className="w-16 h-16 bg-[var(--color-secondary)] text-white flex items-center justify-center mb-3">
                            <span className="text-xl font-bold">{step.number}</span>
                          </div>
                          <div className="w-12 h-12 bg-[var(--color-secondary)]/10 flex items-center justify-center ml-2">
                            <Icon className="h-6 w-6 text-[var(--color-secondary)]" />
                          </div>
                        </div>
                        
                        <div className="flex-1 pt-3 space-y-2">
                          <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/30">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Siap Memulai Renovasi Rumah Anda?</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Jadwalkan konsultasi dan survey gratis untuk mendiskusikan kebutuhan renovasi Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule">
                <Button size="lg" className="bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-600)]">
                  Jadwalkan Konsultasi
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="text-foreground border-2 hover:bg-muted/50">
                  Lihat Portfolio Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}