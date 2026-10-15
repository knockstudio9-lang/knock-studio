// lib/whatsapp-config.ts
// Client-safe types/helpers for the floating WhatsApp button (no DB imports).

export interface WhatsAppButtonConfig {
  enabled: boolean;
  phoneNumber: string; // digits, with country code (e.g. 6281234567890)
  message: string; // pre-filled chat message
  label: string; // tooltip / accessible name of the icon button
  position: "right" | "left";
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppButtonConfig = {
  enabled: true,
  phoneNumber: "",
  message: "Halo, saya tertarik untuk berkonsultasi mengenai proyek rumah saya.",
  label: "Chat WhatsApp",
  position: "right",
};

/** Normalise a phone number to digits with an Indonesian (62) country code fallback. */
export function normalizePhoneNumber(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.substring(1)}`;
  return digits;
}

export function buildWhatsAppLink(phone: string, message?: string): string {
  const base = `https://wa.me/${normalizePhoneNumber(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Merge a (possibly partial / untrusted) object over the defaults. */
export function sanitizeWhatsAppConfig(
  input: Partial<WhatsAppButtonConfig> | null | undefined
): WhatsAppButtonConfig {
  const d = DEFAULT_WHATSAPP_CONFIG;
  const str = (v: unknown, fallback: string, max: number) =>
    typeof v === "string" ? v.slice(0, max) : fallback;

  return {
    enabled: typeof input?.enabled === "boolean" ? input.enabled : d.enabled,
    phoneNumber: normalizePhoneNumber(str(input?.phoneNumber, d.phoneNumber, 30)),
    message: str(input?.message, d.message, 1000),
    label: str(input?.label, d.label, 40),
    position: input?.position === "left" ? "left" : "right",
  };
}
