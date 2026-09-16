export const normalizeWhatsAppNumber = (number: string) => {
  if (!number) return '';
  
  // Remove spaces, hyphens, brackets
  let cleaned = number.replace(/[\s\-\(\)]/g, '');
  
  // If it doesn't start with '+', check if it needs '91'
  if (!cleaned.startsWith('+') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  // Remove '+' if it exists at the beginning
  cleaned = cleaned.replace('+', '');
  
  return cleaned;
};

export const openWhatsApp = (number: string, message: string) => {
  const normalizedNumber = normalizeWhatsAppNumber(number);
  
  if (!normalizedNumber) {
    console.error("WhatsApp number is not configured.");
    return;
  }

  const encodedMessage = encodeURIComponent(message);
  window.open(
    `https://wa.me/${normalizedNumber}?text=${encodedMessage}`,
    "_blank",
    "noopener,noreferrer"
  );
};
