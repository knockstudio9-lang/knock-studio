// /components/home/CTASection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-primary-800 to-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItMnptMCAydjJoLTJ2LTJoMnptMCAyaDJ2Mmgtdi0yem0yIDB2Mmgydi0yaC0yem0yIDB2Mmgydi0yaC0yem0wIDJ2Mmgydi0yaC0yem0wIDJoLTJ2Mmgydi0yem0tMiAwdi0yaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-secondary/20 p-3">
            <Calendar className="h-8 w-8 text-secondary" />
          </div>
          
          <h2 className="mb-6 text-white">
            Ready to Transform Your Space?
          </h2>
          
          <p className="mb-8 text-lg text-white/80 max-w-2xl mx-auto">
            Schedule a free consultation with our design experts and let&apos;s bring your vision to life. 
            We&apos;ll discuss your needs, preferences, and create a customized plan for your project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/schedule">
              <Button size="lg" variant="secondary" className="group">
                Schedule Free Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Our Work
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
            <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-secondary mb-2">Free</div>
              <div className="text-sm text-white/70">Initial Consultation</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-sm text-white/70">Customer Support</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm">
              <div className="text-2xl font-bold text-secondary mb-2">100%</div>
              <div className="text-sm text-white/70">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}