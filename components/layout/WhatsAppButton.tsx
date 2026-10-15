// components/layout/WhatsAppButton.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useIntro } from "@/context/IntroContext";
import {
  buildWhatsAppLink,
  type WhatsAppButtonConfig,
} from "@/lib/whatsapp-config";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* chat bubble with tail bottom-left */}
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      {/* handset */}
      <g transform="translate(7.6 7.4) scale(0.4)" strokeWidth="2.6">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
    </svg>
  );
}

export default function WhatsAppButton() {
  const pathname = usePathname();
  const { isIntroActive } = useIntro();
  const [config, setConfig] = useState<WhatsAppButtonConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/whatsapp")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.data) setConfig(json.data);
      })
      .catch(() => {
        /* the button is optional – fail silently */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Same rule as the header: wait for the intro on the home page
  const introDone = pathname !== "/" || !isIntroActive;
  const visible = introDone && !!config?.enabled && !!config.phoneNumber;

  return (
    <AnimatePresence>
      {visible && config && (
        <motion.a
          key="whatsapp-button"
          href={buildWhatsAppLink(config.phoneNumber, config.message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={config.label || "Chat via WhatsApp"}
          title={config.label || "Chat via WhatsApp"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={`fixed z-50 ${
            // the portfolio list has its own bottom bar – sit above it
            pathname === "/portfolio"
              ? "bottom-[7.5rem]"
              : "bottom-[max(1rem,env(safe-area-inset-bottom))]"
          } ${
            config.position === "left"
              ? "left-[max(1rem,env(safe-area-inset-left))]"
              : "right-[max(1rem,env(safe-area-inset-right))]"
          } flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-white shadow-md shadow-black/25 ring-1 ring-white/20 transition-colors hover:bg-secondary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white`}
        >
          <WhatsAppGlyph className="h-5 w-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
