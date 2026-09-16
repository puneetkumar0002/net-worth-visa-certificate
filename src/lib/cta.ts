import { openWhatsApp } from './whatsapp';

export const handleCTAAction = (
  config: any, 
  settings: any, 
  navigate: (path: string) => void
) => {
  if (!config || !config.enabled) return;

  const { actionType, value, openInNewTab, message } = config;

  if (actionType === 'internal') {
    navigate(value || '/');
  } else if (actionType === 'external') {
    if (openInNewTab) {
      window.open(value, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = value;
    }
  } else if (actionType === 'whatsapp') {
    const number = config.useGlobalWhatsapp ? settings.whatsapp : (config.customWhatsapp || '');
    openWhatsApp(number, message || "Hello, I need help.");
  } else if (actionType === 'phone') {
    window.location.href = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
  } else if (actionType === 'email') {
    window.location.href = `mailto:${settings.email}`;
  } else if (actionType === 'scroll' && value) {
    const el = document.getElementById(value);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (actionType === 'application') {
    navigate('/apply'); // Assuming /apply is the application route
  }
};
