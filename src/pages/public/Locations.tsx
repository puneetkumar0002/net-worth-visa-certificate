import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { CityLocation } from '../../types';
import { Card, CardContent } from '../../components/ui/card';
import { MapPin, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../../components/SEO';

export default function Locations() {
  const [locations, setLocations] = useState<CityLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const q = query(
          collection(db, 'locations'), 
          where('status', '==', 'active'),
          orderBy('state', 'asc'),
          orderBy('city', 'asc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CityLocation[];
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Group locations by state
  const locationsByState = locations.reduce((acc, loc) => {
    if (!acc[loc.state]) {
      acc[loc.state] = [];
    }
    acc[loc.state].push(loc);
    return acc;
  }, {} as Record<string, CityLocation[]>);

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
      }
    ]
  };

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-20">
      <SEO 
        title="Our Locations | Net Worth Certificate Services Across India"
        description="Find our Net Worth Certificate services in your city. We provide professional CA-certified financial documentation for visa applications in major cities across India."
        canonical="/locations"
        schema={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#0C6D62]/10 text-[#0C6D62] text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Nationwide Service Coverage
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1830] mb-6">Service Locations</h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            We provide remote processing and online CA review for Net Worth Certificates in all major cities across India. Select your city to find specific information.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Loading locations...</p>
          </div>
        ) : locations.length === 0 ? (
          <Card className="border-none shadow-sm text-center py-20">
            <CardContent>
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0B1830] mb-2">No active locations found</h3>
              <p className="text-slate-500 mb-8">Please check back later or contact us directly.</p>
              <Link to="/contact">
                <Button className="bg-[#0B1830]">Contact Support</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(locationsByState).map(([state, stateLocations]: [string, any], index) => (
              <motion.div 
                key={state}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-[#0B1830] mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-[#0C6D62]" />
                  {state}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {stateLocations.map((loc) => (
                    <Link key={loc.id} to={`/net-worth-certificate/${loc.slug}`}>
                      <Card className="hover:shadow-lg transition-all duration-300 border-none group bg-white overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-[#0B1830] group-hover:text-[#0C6D62] transition-colors">{loc.city}</h3>
                              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{state}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#0C6D62]/10 flex items-center justify-center transition-colors">
                              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0C6D62] transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <section className="mt-24 bg-[#0B1830] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't See Your City?</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Our online CA review process works for applicants across India. You can submit your documents digitally from anywhere.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-[#0C6D62] hover:bg-[#0C6D62]/90 text-white font-bold h-14 px-10 rounded-full">
              Get Started Anywhere
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Button({ children, className, variant, size, onClick }: any) {
  const variants = {
    primary: "bg-[#0C6D62] text-white hover:bg-[#0C6D62]/90",
    outline: "border border-white/30 text-white hover:bg-white/10",
  };
  const sizes = {
    lg: "h-14 px-10 text-lg",
    md: "h-11 px-6",
  };
  
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full font-bold transition-all ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes] || sizes.md} ${className}`}
    >
      {children}
    </button>
  );
}
