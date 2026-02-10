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
    title: "Implementation of Development",
    subtitle: "Pelaksanaan Pembangunan",
  },
  {
    number: "06",
    icon: FileText,
    title: "Implementation Schedule",
    subtitle: "Membuat Jadwal Pelaksanaan",
  },
  {
    number: "07",
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
      <section className="py-20 pt-24 bg-background">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Layanan Utama Kami</h2>
            <p className="text-xl text-muted-foreground">
              Solusi renovasi dan pembangunan rumah yang komprehensif dan disesuaikan dengan kebutuhan Anda
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service: any, index: number) => {
              const Icon = getIconComponent(service.icon);
              const isEven = index % 2 === 0;
              
              return (
                <div key={service.id} className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                  <div className={`relative ${!isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-[var(--color-secondary)]/10 rounded-2xl -z-10 hidden lg:block"></div>
                  </div>
                  
                  <div className={`space-y-6 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-secondary">{service.title}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4" />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg text-muted-foreground">
                      {service.description}
                    </p>
                    
                    <div className="bg-card p-6 rounded-xl border border-border">
                      <h4 className="font-semibold text-secondary mb-3">Cocok untuk:</h4>
                      <p className="text-muted-foreground">{service.bestFor}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-secondary mb-3">Yang termasuk dalam layanan:</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {service.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-sm">{feature}</span>
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
          <div className="max-w-4xl mx-auto mt-20">
            <Card className="border-2 border-[var(--color-secondary)]/20 bg-gradient-to-br from-[var(--color-secondary)]/5 to-background">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-secondary">Service Area</CardTitle>
                <CardDescription className="text-muted-foreground">Area layanan kami meliputi wilayah Jabodetabek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-3">
                  {serviceArea.map((area, index) => (
                    <div 
                      key={index}
                      className="px-6 py-3 bg-[var(--color-secondary)] text-white rounded-full font-semibold text-sm hover:bg-[var(--color-secondary-600)] transition-colors shadow-md hover:shadow-lg"
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
      <section className="py-20 pt-28 bg-muted/30">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Bandingkan Layanan Kami</h2>
            <p className="text-xl text-muted-foreground">
              Temukan layanan yang paling sesuai dengan kebutuhan renovasi Anda
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-background rounded-xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-[var(--color-secondary)]">
                  <th className="text-left p-6 font-semibold text-white">Fitur Layanan</th>
                  <th className="text-center p-6 font-semibold text-white">Home Renovation</th>
                  <th className="text-center p-6 font-semibold text-white">Design Visualization</th>
                  <th className="text-center p-6 font-semibold text-white">Consultation</th>
                  <th className="text-center p-6 font-semibold text-white">Cost Estimation</th>
                  <th className="text-center p-6 font-semibold text-white">Project Execution</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row: any, index: number) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
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
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Alur Kerja Kami</h2>
            <p className="text-xl text-muted-foreground">
              Proses kerja yang terstruktur dari awal hingga selesai
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop view with 2-column snake layout */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - First half of steps */}
                <div className="space-y-8">
                  {workSteps.slice(0, Math.ceil(workSteps.length / 2)).map((step, index) => {
                    const Icon = step.icon;
                    const isLastInColumn = index === Math.ceil(workSteps.length / 2) - 1;
                    
                    return (
                      <div key={index} className="flex flex-col items-center relative">
                        <div className="rounded-xl shadow-md p-6 w-full hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center shrink-0">
                              <span className="text-lg font-bold text-[var(--color-secondary)]">{step.number}</span>
                            </div>
                            <Icon className="h-8 w-8 text-[var(--color-secondary)] shrink-0" />
                          </div>
                          <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                        </div>
                        
                        {/* Arrow connector for vertical flow within column */}
                        {!isLastInColumn && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-10">
                            <ArrowRight className="h-6 w-6 text-gray-300 transform rotate-90" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Right Column - Second half of steps */}
                <div className="space-y-8">
                  {workSteps.slice(Math.ceil(workSteps.length / 2)).map((step, index) => {
                    const Icon = step.icon;
                    const actualIndex = index + Math.ceil(workSteps.length / 2);
                    const isLastInColumn = actualIndex === workSteps.length - 1;
                    
                    return (
                      <div key={actualIndex} className="flex flex-col items-center relative">
                        <div className="rounded-xl shadow-md p-6 w-full hover:shadow-lg transition-shadow duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center shrink-0">
                              <span className="text-lg font-bold text-[var(--color-secondary)]">{step.number}</span>
                            </div>
                            <Icon className="h-8 w-8 text-[var(--color-secondary)] shrink-0" />
                          </div>
                          <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                        </div>
                        
                        {/* Arrow connector for vertical flow within column */}
                        {!isLastInColumn && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-10">
                            <ArrowRight className="h-6 w-6 text-gray-300 transform rotate-90" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Tablet view */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 lg:hidden">
              {workSteps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={index} className="rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-[var(--color-secondary)]">{step.number}</span>
                      </div>
                      <Icon className="h-8 w-8 text-[var(--color-secondary)] shrink-0" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Mobile view */}
            <div className="md:hidden space-y-4">
              {workSteps.map((step, index) => {
                const Icon = step.icon;
                
                return (
                  <div key={index} className="rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-[var(--color-secondary)]">{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="size-5 text-[var(--color-secondary)]" />
                          <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Arrow connector for mobile */}
                    {index < workSteps.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <ArrowRight className="h-5 w-5 text-gray-300 transform rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Siap Memulai Renovasi Rumah Anda?</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Jadwalkan konsultasi dan survey gratis untuk mendiskusikan kebutuhan renovasi Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/schedule">
                <Button size="lg" className="bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-600)]">
                  Jadwalkan Konsultasi
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="text-foreground border-2">
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