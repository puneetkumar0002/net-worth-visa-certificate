import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface SiteSettings {
  phone: string;
  secondaryPhone: string;
  whatsapp: string;
  email: string;
  supportEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  googleMapsUrl: string;
  officeVisitNote: string;
  businessName: string;
  logoUrl: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface CTAConfig {
  text: string;
  actionType: string;
  value?: string;
  openInNewTab: boolean;
  enabled: boolean;
  useGlobalWhatsapp?: boolean;
  customWhatsapp?: string;
  message?: string;
}

interface CTAState {
  primary: CTAConfig;
  secondary: CTAConfig;
}

const defaultCTA: CTAState = {
  primary: { text: "Get Started Now", actionType: "internal", value: "/contact", openInNewTab: false, enabled: true },
  secondary: { text: "WhatsApp Now", actionType: "whatsapp", useGlobalWhatsapp: true, openInNewTab: true, enabled: true, message: "Hello, I need help with a Net Worth Certificate for my visa application." },
};

const defaultSettings: SiteSettings = {
  phone: '+91 98765 43210',
  secondaryPhone: '',
  whatsapp: '919876543210',
  email: 'hello@visaworthcertificate.com',
  supportEmail: '',
  address: '123 Financial District',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
  googleMapsUrl: '',
  officeVisitNote: '',
  businessName: 'Networth Certificate Visa',
  logoUrl: '/assets/aistudio/logo.png',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
};

const SiteSettingsContext = createContext<{ 
  settings: SiteSettings; 
  cta: CTAState; 
  loading: boolean 
}>({
  settings: defaultSettings,
  cta: defaultCTA,
  loading: true,
});

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [cta, setCta] = useState<CTAState>(defaultCTA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const genDocRef = doc(db, 'siteSettings', 'general');
    const ctaDocRef = doc(db, 'siteSettings', 'cta');
    
    const unsubGen = onSnapshot(genDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() as SiteSettings }));
      }
    });

    const unsubCta = onSnapshot(ctaDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setCta(docSnap.data() as CTAState);
      }
      setLoading(false);
    });
    
    return () => {
        unsubGen();
        unsubCta();
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, cta, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
