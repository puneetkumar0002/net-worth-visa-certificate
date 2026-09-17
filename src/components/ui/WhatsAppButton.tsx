import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { openWhatsApp } from '../../lib/whatsapp';
import { cn } from '../../lib/utils';

interface WhatsAppButtonProps {
  text?: string;
  message?: string;
  className?: string;
  fullWidth?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  text = "WhatsApp Now", 
  message = "Hello, I would like help with a Net Worth Certificate for my visa application.",
  className,
  fullWidth = false
}) => {
  const { settings, loading } = useSiteSettings();

  const handleClick = () => {
    if (!loading && settings?.whatsapp) {
      openWhatsApp(settings.whatsapp, message);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 md:gap-3",
        "bg-white border border-slate-200 text-[#0B1830]",
        "rounded-full shadow-sm hover:shadow-md hover:border-[#0C6D62]/30",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 active:scale-[0.98]",
        "font-semibold text-[15px] md:text-[16px]",
        "h-[52px] md:h-[58px] px-7 md:px-9",
        fullWidth ? "w-full" : "w-auto",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        className
      )}
    >
      <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 text-[#25D366]">
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-full h-full"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </div>
      <span>{text}</span>
    </button>
  );
};
