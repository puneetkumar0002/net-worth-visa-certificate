import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { CityLocation } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  CheckCircle, ArrowRight, FileText, Globe, MapPin, 
  ShieldCheck, MessageSquare, PhoneCall, Clock, Info,
  Navigation
} from 'lucide-react';
import SEO from '../../components/SEO';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { openWhatsApp } from '../../lib/whatsapp';

export default function CityLandingPage() {
  const { city: citySlug } = useParams<{ city: string }>();
  const [location, setLocation] = useState<CityLocation | null>(null);
  const [nearbyCities, setNearbyCities] = useState<CityLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const q = query(
          collection(db, 'locations'), 
          where('slug', '==', citySlug),
          where('status', '==', 'active'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CityLocation;
          setLocation(data);
          
          // Fetch nearby/other cities
          const otherQ = query(
            collection(db, 'locations'),
            where('status', '==', 'active'),
            orderBy('city', 'asc'),
            limit(10)
          );
          const otherSnapshot = await getDocs(otherQ);
          const others = otherSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }) as CityLocation)
            .filter(c => c.slug !== citySlug);
          setNearbyCities(others);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [citySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Location Not Found</h1>
        <p className="text-slate-600 mb-8 text-center max-w-md">
          We couldn't find the specific city page you're looking for. Please check our locations index.
        </p>
        <Link to="/locations">
          <Button className="bg-[#0B1830]">View All Locations</Button>
        </Link>
      </div>
    );
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://networthvisa.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Locations",
        "item": "https://networthvisa.com/locations"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": location.city,
        "item": `https://networthvisa.com/net-worth-certificate/${location.slug}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": location.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Net Worth Certificate",
    "provider": {
      "@type": "ProfessionalService",
      "name": "Networth Certificate Visa",
      "url": "https://networthvisa.com",
      "telephone": settings.phone || "",
      "image": "https://networthvisa.com/logo.png"
    },
    "areaServed": {
      "@type": "City",
      "name": location.city
    },
    "description": location.intro
  };

  const handleWhatsApp = () => {
    openWhatsApp(settings.whatsapp, `Hello, I'm looking for a Net Worth Certificate in ${location.city}.`);
  };

  return (
    <div className="bg-white">
      <SEO 
        title={location.metaTitle}
        description={location.metaDescription}
        canonical={`/net-worth-certificate/${location.slug}`}
        schema={[breadcrumbSchema, faqSchema, serviceSchema]}
      />

      {/* Hero Section */}
      <section className="bg-slate-50 pt-16 pb-20 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-[#0C6D62]/10 text-[#0C6D62] text-xs font-bold uppercase tracking-wider mb-6"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              CA-Certified Visa Financial Documentation
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-[#0B1830] mb-6 leading-tight"
            >
              {location.h1}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
            >
              {location.intro}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/contact">
                <Button size="lg" className="bg-[#0C6D62] hover:bg-[#0C6D62]/90 text-white font-bold h-14 px-10 rounded-full w-full">
                  Get Net Worth Certificate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleWhatsApp}
                className="border-slate-200 text-slate-700 font-bold h-14 px-10 rounded-full w-full hover:bg-slate-50"
              >
                <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                WhatsApp Now
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-[#0C6D62] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/locations" className="hover:text-[#0C6D62] transition-colors">Locations</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-[#0B1830]">{location.city}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* Local Content Section */}
              <div className="prose prose-slate max-w-none">
                <h2 className="text-3xl font-bold text-[#0B1830] mb-8">Net Worth Certificate Services in {location.city}</h2>
                <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                  {location.localContent}
                </div>
              </div>

              {/* Who Needs This */}
              <div className="bg-[#F5F8FB] rounded-3xl p-8 md:p-12">
                <h2 className="text-2xl font-bold text-[#0B1830] mb-8">Who Usually Needs This in {location.city}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    'Study Visa applicants (Canada, UK, Australia, etc.)',
                    'Tourist/Visitor Visa applicants',
                    'Spouse/Family Visa sponsorship',
                    'Business/Investment Visa categories',
                    'Parental sponsorship documentation',
                    'Schengen Visa financial proof'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-[#0C6D62] mr-3 shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div>
                <h2 className="text-2xl font-bold text-[#0B1830] mb-8">How the Process Works</h2>
                <div className="space-y-8">
                  {[
                    { title: 'Inquiry & Document Checklist', desc: 'Contact us via WhatsApp or Contact form. We provide a tailored checklist for your specific visa type.' },
                    { title: 'Online Submission', desc: 'Send clear scanned copies or photos of your documents via email or secure WhatsApp.' },
                    { title: 'CA Review & Preparation', desc: 'Our Chartered Accountants review the documents, calculate the net worth, and prepare the draft.' },
                    { title: 'Verification & Final Copy', desc: 'Once you verify the draft, we generate the final signed certificate with UDIN and send it digitally.' }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 rounded-full bg-[#0B1830] text-white flex items-center justify-center font-bold text-xl shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0B1830] mb-2">{step.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div>
                <h2 className="text-3xl font-bold text-[#0B1830] mb-10">Frequently Asked Questions in {location.city}</h2>
                <div className="space-y-6">
                  {location.faqs.map((faq, i) => (
                    <Card key={i} className="border-none shadow-sm bg-slate-50 hover:bg-slate-100 transition-colors">
                      <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-[#0B1830] mb-4 flex items-center">
                          <Info className="w-5 h-5 mr-3 text-[#0C6D62]" />
                          {faq.question}
                        </h3>
                        <p className="text-slate-600 leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Nearby Cities */}
              {nearbyCities.length > 0 && (
                <div className="pt-10 border-t">
                  <h2 className="text-2xl font-bold text-[#0B1830] mb-8 flex items-center">
                    <Navigation className="w-6 h-6 mr-3 text-[#0C6D62]" />
                    Other Service Locations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nearbyCities.map((city) => (
                      <Link key={city.id} to={`/net-worth-certificate/${city.slug}`}>
                        <Card className="hover:shadow-md transition-shadow border-slate-100 group">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-[#0B1830] group-hover:text-[#0C6D62] transition-colors">{city.city}</div>
                              <div className="text-xs text-slate-400">{city.state}</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0C6D62] group-hover:translate-x-1 transition-all" />
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* CTA Card */}
                <Card className="bg-[#0B1830] text-white border-none shadow-2xl overflow-hidden rounded-3xl">
                  <div className="p-8">
                    <FileText className="w-12 h-12 text-[#D6A84B] mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Need a Net Worth Certificate in {location.city}?</h3>
                    <p className="text-slate-300 mb-8 leading-relaxed">
                      Start your application today. Our team provides remote support and fast CA-certified document processing.
                    </p>
                    <Button 
                      size="lg" 
                      onClick={handleWhatsApp}
                      className="w-full bg-[#D6A84B] text-[#0B1830] hover:bg-[#D6A84B]/90 font-bold h-14 rounded-full"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      WhatsApp for Assistance
                    </Button>
                  </div>
                  <div className="bg-[#081224] p-6 text-center">
                    <p className="text-xs text-slate-400">100% Online & Remote Processing</p>
                  </div>
                </Card>

                {/* Info Card */}
                <Card className="border-slate-100 shadow-sm rounded-3xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0C6D62]/10 flex items-center justify-center mr-4">
                        <Clock className="w-5 h-5 text-[#0C6D62]" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Fast Turnaround</div>
                        <div className="text-[#0B1830] font-bold">24-48 Hours</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0C6D62]/10 flex items-center justify-center mr-4">
                        <PhoneCall className="w-5 h-5 text-[#0C6D62]" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Online Support</div>
                        <div className="text-[#0B1830] font-bold">Mon - Sat</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#0C6D62]/10 flex items-center justify-center mr-4">
                        <Globe className="w-5 h-5 text-[#0C6D62]" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Digital Delivery</div>
                        <div className="text-[#0B1830] font-bold">Secured PDF with UDIN</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Navigation */}
                <Card className="border-slate-100 shadow-sm rounded-3xl">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-[#0B1830] mb-6">Useful Resources</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link to="/documents" className="flex items-center text-slate-600 hover:text-[#0C6D62] font-medium transition-colors">
                          <CheckCircle className="w-4 h-4 mr-3" />
                          Document Checklist
                        </Link>
                      </li>
                      <li>
                        <Link to="/pricing" className="flex items-center text-slate-600 hover:text-[#0C6D62] font-medium transition-colors">
                          <CheckCircle className="w-4 h-4 mr-3" />
                          Service Pricing
                        </Link>
                      </li>
                      <li>
                        <Link to="/visa-countries" className="flex items-center text-slate-600 hover:text-[#0C6D62] font-medium transition-colors">
                          <Globe className="w-4 h-4 mr-3" />
                          Visa Countries
                        </Link>
                      </li>
                      <li>
                        <Link to="/about" className="flex items-center text-slate-600 hover:text-[#0C6D62] font-medium transition-colors">
                          <Info className="w-4 h-4 mr-3" />
                          About Our Firm
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[#0C6D62] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Strengthen Your Visa File?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-[#0C6D62] hover:bg-slate-100 font-bold h-14 px-10 rounded-full">
                Get Started Now
              </Button>
            </Link>
            <Link to="/locations">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-bold h-14 px-10 rounded-full">
                View All Locations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
