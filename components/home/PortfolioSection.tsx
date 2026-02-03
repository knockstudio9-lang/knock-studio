// /components/home/PortfolioSection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

const projects = [
  {
    title: "Modern Villa",
    category: "Architecture",
    image: "bg-gradient-to-br from-primary to-primary-700",
  },
  {
    title: "Luxury Apartment",
    category: "Interior Design",
    image: "bg-gradient-to-br from-secondary to-secondary-700",
  },
  {
    title: "Minimalist Home",
    category: "Complete Renovation",
    image: "bg-gradient-to-br from-primary-600 to-primary-800",
  },
  {
    title: "Urban Loft",
    category: "Space Planning",
    image: "bg-gradient-to-br from-secondary-600 to-secondary-800",
  },
];

export default function PortfolioSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="mb-4 text-primary">Featured Projects</h2>
          <p className="text-lg text-primary/70">
            Explore our portfolio of exceptional design projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <Link 
              key={index}
              href="/portfolio"
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <div className={`absolute inset-0 ${project.image} transition-transform duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-sm text-white/80 mb-2">{project.category}</div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/portfolio">
            <Button variant="default" size="lg">
              View Full Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}