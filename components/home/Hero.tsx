// /components/home/Hero.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary via-primary-800 to-primary-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMCAydjJoLTJ2LTJoMnptMCAyaDJ2Mmgtdi0yem0yIDB2Mmgydi0yaC0yem0yIDB2Mmgydi0yaC0yem0wIDJ2Mmgydi0yaC0yem0wIDJoLTJ2Mmgydi0yem0tMiAwdi0yaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <div className="mb-6 inline-block rounded-full bg-secondary/20 px-4 py-2">
            <span className="text-sm font-medium text-white">Premium Housing Design</span>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Transform Your Space Into a
            <span className="block text-secondary"> Dream Home</span>
          </h1>
          
          <p className="mb-8 text-lg text-white/80 md:text-xl max-w-2xl">
            Expert interior design and architecture services that bring your vision to life. 
            We create spaces that inspire, comfort, and reflect your unique style.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/schedule">
              <Button size="lg" variant="secondary" className="group">
                Schedule Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Portfolio
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-secondary">500+</div>
              <div className="mt-1 text-sm text-white/70">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">15+</div>
              <div className="mt-1 text-sm text-white/70">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary">98%</div>
              <div className="mt-1 text-sm text-white/70">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}