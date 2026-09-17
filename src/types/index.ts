export interface SiteSettings {
  siteName: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  logoUrl?: string;
  announcementBarText?: string;
  announcementBarEnabled: boolean;
}

export interface ContactSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  whatsappDefaultMessage: string;
  googleMapsEmbedUrl?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  icon: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface Country {
  id: string;
  name: string;
  description: string;
  visaTypes: string[];
  featured: boolean;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  country: string;
  visaType: string;
  certificateType: string;
  assets: string[];
  propertyValue: string;
  bankValue: string;
  investmentValue: string;
  goldValue: string;
  businessValue: string;
  liabilities: string;
  preferredContact: string;
  message: string;
  status: 'new' | 'contacted' | 'documents_pending' | 'documents_received' | 'in_review' | 'certificate_prepared' | 'completed' | 'not_interested';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface CAProfile {
  name: string;
  qualification: string;
  membershipNumber: string;
  firmName: string;
  firmRegistrationNumber: string;
  experience: string;
  profileImage: string;
  officeAddress: string;
  phone: string;
  email: string;
}

export interface CityLocation {
  id: string;
  city: string;
  state: string;
  slug: string;
  status: 'active' | 'inactive';
  h1: string;
  intro: string;
  localContent: string;
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  createdAt: any;
  updatedAt: any;
}
