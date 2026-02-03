// /components/home/AboutSection.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const features = [
  "Award-winning design team",
  "Personalized approach",
  "On-time project delivery",
  "Sustainable practices",
];

export default function AboutSection() {
  return (
    <section className="section-padding bg-tertiary/30">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary to-secondary-700 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-6xl font-bold mb-2">15+</div>
                  <div className="text-xl">Years of Excellence</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-2xl p-6 text-white hidden md:flex flex-col justify-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm mt-1">Happy Clients</div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            <div className="mb-4 inline-block rounded-full bg-secondary/10 px-4 py-2">
              <span className="text-sm font-medium text-secondary">About Knock</span>
            </div>
            
            <h2 className="mb-6 text-primary">
              Creating Spaces That Inspire & Delight
            </h2>
            
            <p className="mb-6 text-lg text-primary/70">
              At Knock, we believe that every space has the potential to be extraordinary. 
              With over 15 years of experience, our team of passionate designers and architects 
              has transformed countless houses into dream homes.
            </p>
            
            <p className="mb-8 text-primary/70">
              We combine innovative design thinking with timeless aesthetics to create spaces 
              that not only look beautiful but also enhance the way you live.
            </p>

            <ul className="mb-8 space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-primary/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Link href="/about">
              <Button size="lg" variant="default">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}