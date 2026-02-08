// /components/home/AboutSection.tsx
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const features = [
  "Tim desain berpengalaman",
  "Komitmen terhadap kepuasan klien",
  "Manajemen proyek yang efisien",
  "Konsiderasi praktik berkelanjutan"
];

export default function AboutSection() {
  return (
    <section className="section-padding bg-linear-to-br from-background/50 to-background/80 backdrop-blur-sm transition-colors duration-300 min-h-screen flex items-center">
      <div className="container-custom pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-4/3 rounded-2xl overflow-hidden relative">
              <Image
                src="/home/about-section-2.jpg"
                alt="Proyek Desain Interior"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              {/* Years of Excellence Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-6xl font-bold mb-2">Tahunan</div>
                  <div className="text-xl">Pengalaman</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl overflow-hidden hidden md:block">
              <Image
                src="/home/about-section-1.jpg"
                alt="Klien Puas"
                fill
                className="object-cover filter grayscale"
              />
              <div className="absolute inset-0 bg-(--color-primary)/80 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <div className="text-3xl font-bold">Puluhan+</div>
                  <div className="text-sm mt-1">Klien Puas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div>
            
            <h2 className="mb-6 text-foreground">
              Menciptakan Ruang yang Menginspirasi & Menyenangkan
            </h2>
            
            <p className="mb-6 text-lg text-muted-foreground FONT">
              Di Knock, kami percaya bahwa setiap ruang memiliki potensi untuk menjadi luar biasa. Dengan pengalaman bertahun-tahun, kami telah mengubah banyak rumah menjadi lebih berkarakter dan fungsional.
            </p>

            <ul className="mb-8 space-y-3 font-bold">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-(--color-secondary) shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}