// lib/whatsapp.ts
export function formatWhatsAppMessage(formData: {
  name: string;
  address: string;
  service: string;
  area: string;
  budget: string;
  details: string;
}): string {
  const serviceLabel = formData.service === 'renovation' ? 'Renovasi' : 'Bangun Baru';
  const areaText = formData.area ? `*Luasan Area:* ${formData.area}` : '*Luasan Area:* Belum diisi';
  const budgetText = formData.budget ? `*Estimasi Anggaran:* Rp ${formData.budget}` : '*Estimasi Anggaran:* Belum diisi';
  const detailsText = formData.details ? `*Detail Tambahan:* ${formData.details}` : '*Detail Tambahan:* Tidak ada';

  const message = `
📋 *Formulir Kontak Baru*

👤 *Nama:* ${formData.name}
📍 *Alamat:* ${formData.address}
🔨 *Jenis Layanan:* ${serviceLabel}
📐 ${areaText}
💰 ${budgetText}
📝 ${detailsText}

🔔 *Mohon segera follow up lead ini.*

*Waktu Pengiriman:* ${new Date().toLocaleString('id-ID')}
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