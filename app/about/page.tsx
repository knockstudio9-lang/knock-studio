// /app/about/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award, Users } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To transform living spaces into personalized sanctuaries that reflect the unique lifestyle and aspirations of each client through innovative design and meticulous craftsmanship.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description: "To be the leading housing design firm recognized for creating sustainable, aesthetically stunning spaces that enhance quality of life and set new standards in residential architecture.",
  },
];

const team = [
  {
    name: "Sarah Mitchell",
    role: "Principal Architect",
    image: "bg-gradient-to-br from-secondary to-secondary-700",
  },
  {
    name: "James Chen",
    role: "Lead Interior Designer",
    image: "bg-gradient-to-br from-primary to-primary-700",
  },
  {
    name: "Emily Rodriguez",
    role: "Project Manager",
    image: "bg-gradient-to-br from-secondary-600 to-secondary-800",
  },
  {
    name: "Michael Park",
    role: "Senior Architect",
    image: "bg-gradient-to-br from-primary-600 to-primary-800",
  },
];

const milestones = [
  { year: "2009", title: "Founded", description: "Knock was established with a vision to revolutionize housing design" },
  { year: "2012", title: "First Award", description: "Received Best Emerging Design Firm award" },
  { year: "2016", title: "100 Projects", description: "Completed our 100th successful project" },
  { year: "2020", title: "Expansion", description: "Opened second office and expanded team" },
  { year: "2024", title: "500+ Projects", description: "Celebrated milestone of 500+ completed projects" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6">About Knock</h1>
            <p className="text-xl text-white/80">
              We are a passionate team of architects and designers dedicated to creating 
              exceptional living spaces that inspire and delight.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid gap-8 lg:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-2 hover:border-secondary transition-colors">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-primary">{value.title}</h3>
                    <p className="text-primary/70 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-tertiary/30">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-6 text-primary">Our Story</h2>
              <div className="space-y-4 text-primary/70">
                <p>
                  Founded in 2009, Knock began with a simple belief: that everyone deserves 
                  a home that not only meets their needs but exceeds their dreams. Our founders, 
                  a team of passionate architects and designers, saw an opportunity to bring 
                  fresh perspectives to residential design.
                </p>
                <p>
                  Over the years, we&apos;ve grown from a small studio to a full-service design firm, 
                  but our core values remain unchanged. We believe in listening to our clients, 
                  understanding their vision, and translating it into spaces that are both 
                  beautiful and functional.
                </p>
                <p>
                  Today, with over 500 completed projects and a team of 30+ talented professionals, 
                  we continue to push the boundaries of residential design while maintaining the 
                  personalized approach that has been our hallmark from the beginning.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary to-secondary-700 flex items-center justify-center text-white p-8">
                <div className="text-center">
                  <Award className="h-20 w-20 mx-auto mb-4" />
                  <div className="text-4xl font-bold">25+</div>
                  <div className="text-xl mt-2">Industry Awards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-primary">Our Journey</h2>
            <p className="text-lg text-primary/70">
              Key milestones that shaped Knock into what it is today
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-tertiary hidden lg:block" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <Card className="inline-block border-2 hover:border-secondary transition-colors">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-secondary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-primary mb-2">{milestone.title}</h3>
                        <p className="text-primary/70">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="hidden lg:flex h-4 w-4 rounded-full bg-secondary border-4 border-white shadow-lg flex-shrink-0" />
                  
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-tertiary/30">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="mb-4 text-primary">Meet Our Team</h2>
            <p className="text-lg text-primary/70">
              Talented professionals dedicated to bringing your vision to life
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all">
                <div className={`aspect-square ${member.image} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Users className="h-12 w-12 mb-4 opacity-50" />
                  </div>
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-medium">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6">Let&apos;s Work Together</h2>
            <p className="mb-8 text-lg text-white/80">
              Ready to start your design journey? Schedule a consultation with our team today.
            </p>
            <Link href="/schedule">
              <Button size="lg" variant="secondary">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}