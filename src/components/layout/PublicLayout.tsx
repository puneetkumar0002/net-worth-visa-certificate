import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Phone, Mail, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { PremiumCTAButton } from '../ui/PremiumCTAButton';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { openWhatsApp } from '../../lib/whatsapp';
import { useNavigate } from 'react-router-dom';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { settings, loading } = useSiteSettings();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#162235] bg-[#F5F8FB]">
      {/* Top Strip */}
      <div className="bg-[#0B1830] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="hidden md:block text-slate-300 font-medium">CA-Certified Visa Financial Documentation</div>
          <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
            <a href={!loading ? `tel:${settings.phone.replace(/[^0-9+]/g, '')}` : '#'} className="flex items-center hover:text-white transition-colors">
              <Phone className="w-4 h-4 mr-2" />
              <span>{loading ? 'Loading...' : settings.phone}</span>
            </a>
            <a href={!loading ? `mailto:${settings.email}` : '#'} className="flex items-center hover:text-white transition-colors">
              <Mail className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{loading ? 'Loading...' : settings.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src="/images/networth-certificate-visa-logo.png" 
                  alt="Networth Certificate Visa" 
                  className="h-12 md:h-14 w-auto object-contain" 
                />
                <span className="font-bold text-[#0B1830] text-lg md:text-xl whitespace-nowrap">
                  {settings?.businessName || 'Networth Certificate Visa'}
                </span>
              </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8 font-medium text-sm text-[#162235]">
            <Link to="/" className="hover:text-[#0C6D62] transition-colors">Home</Link>
            <Link to="/services" className="hover:text-[#0C6D62] transition-colors">Services</Link>
            <Link to="/visa-countries" className="hover:text-[#0C6D62] transition-colors">Countries</Link>
            <Link to="/documents" className="hover:text-[#0C6D62] transition-colors">Documents</Link>
            <Link to="/about" className="hover:text-[#0C6D62] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#0C6D62] transition-colors">Contact</Link>
            <PremiumCTAButton 
              text="Get Net Worth Certificate" 
              onClick={() => navigate('/contact')}
              className="px-6 h-10 text-sm"
            />
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b absolute top-[120px] left-0 w-full z-40 p-4 shadow-lg flex flex-col space-y-4 font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">Home</Link>
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">Services</Link>
          <Link to="/visa-countries" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">Countries</Link>
          <Link to="/documents" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">Documents</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">About</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="p-2 border-b">Contact</Link>
          <PremiumCTAButton 
            text="Get Net Worth Certificate" 
            onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
            className="w-full"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1830] text-white py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/images/networth-certificate-visa-logo.png" 
                alt="Networth Certificate Visa" 
                className="h-12 w-auto object-contain bg-white rounded-lg p-1" 
              />
              <span className="font-bold text-white text-lg">
                {settings?.businessName || 'Networth Certificate Visa'}
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Professional Chartered Accountant services specializing in Net Worth Certificates and financial documentation for visa applications.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#D6A84B]">Services</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/net-worth-certificate" className="hover:text-white transition-colors">Net Worth Certificate</Link></li>
              <li><Link to="/property-valuation" className="hover:text-white transition-colors">Property Valuation</Link></li>
              <li><Link to="/investment-valuation" className="hover:text-white transition-colors">Investment Valuation</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">View All Services</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#D6A84B]">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/visa-countries" className="hover:text-white transition-colors">Visa Countries</Link></li>
              <li><Link to="/documents" className="hover:text-white transition-colors">Document Checklist</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Firm</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#D6A84B]">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
            <div className="mt-6 text-xs text-slate-500">
              © {new Date().getFullYear()} Networth Certificate Visa. All rights reserved.
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-xs text-slate-400 text-center">
          Disclaimer: Visa and immigration documentation requirements vary by country, visa category and applicant circumstances. A Net Worth Certificate is supporting financial documentation and does not guarantee visa approval. Final visa decisions are made solely by the relevant immigration or visa authority.
        </div>
      </footer>

      {/* Mobile Sticky Bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <a href={!loading ? `tel:${settings.phone.replace(/[^0-9+]/g, '')}` : '#'} className="flex-1 flex flex-col items-center justify-center text-[#0B1830]">
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-semibold uppercase">Call</span>
        </a>
        <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>
        <button 
          onClick={() => !loading && openWhatsApp(settings.whatsapp, "Hello, I would like help with a Net Worth Certificate for my visa application.")}
          className="flex-1 flex flex-col items-center justify-center text-green-600 disabled:opacity-50"
          disabled={loading}
        >
          <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          <span className="text-[10px] font-semibold uppercase">WhatsApp</span>
        </button>
        <div className="flex-[2] ml-2">
          <PremiumCTAButton 
            text="Get Certificate" 
            onClick={() => navigate('/contact')}
            className="w-full h-9 text-xs"
            fullWidthMobile={true}
          />
        </div>
      </div>
      
      <FloatingWhatsApp />
    </div>
  );
}
