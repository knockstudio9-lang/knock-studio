// lib/whatsapp.ts
export function formatWhatsAppMessage(formData: {
  name: string;
  address: string;
  service: string;
  area: string;
  budget: string;
}): string {
  const message = `
*New Contact Form Submission*

*Name:* ${formData.name}
*Address:* ${formData.address}
*Service:* ${formData.service}
*Area:* ${formData.area}
*Budget:* ${formData.budget}

Please follow up with this lead as soon as possible.
  `.trim();

  return encodeURIComponent(message);
}

export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-digit characters from the phone number
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Ensure the phone number has country code
  const formattedPhone = cleanPhone.startsWith('62') 
    ? cleanPhone 
    : cleanPhone.startsWith('0') 
      ? `62${cleanPhone.substring(1)}` 
      : `62${cleanPhone}`;
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}