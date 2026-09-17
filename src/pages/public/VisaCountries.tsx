import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Globe, Plane, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';

import SEO from '../../components/SEO';

export default function VisaCountries() {
  const [dynamicCountries, setDynamicCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        "name": "Visa Countries",
        "item": "https://networthvisa.com/visa-countries"
      }
    ]
  };

  const defaultCountries = [
    { name: 'Canada', types: ['Visitor Visa', 'Study Permit', 'Family Visa', 'Super Visa'], flag: '🇨🇦' },
    { name: 'UK', types: ['Standard Visitor Visa', 'Student Visa', 'Family Route'], flag: '🇬🇧' },
    { name: 'Australia', types: ['Visitor Visa', 'Student Visa', 'Parent Visa', 'Partner Visa'], flag: '🇦🇺' },
    { name: 'USA', types: ['B1/B2 Visitor', 'F1 Student', 'Family Sponsorship'], flag: '🇺🇸' },
    { name: 'Schengen', types: ['Tourist Visa', 'Business Visa', 'Student Visa'], flag: '🇪🇺' },
    { name: 'New Zealand', types: ['Visitor Visa', 'Student Visa', 'Partnership Visa'], flag: '🇳🇿' },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const q = query(collection(db, 'countries'), where('status', '==', 'published'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          name: doc.data().name,
          types: doc.data().visaTypes ? doc.data().visaTypes.split(',').map((t: string) => t.trim()) : [],
          flag: doc.data().flag || '🌍'
        }));
        
        if (data.length > 0) {
          setDynamicCountries(data);
        } else {
          setDynamicCountries(defaultCountries);
        }
      } catch (error) {
        console.error("Error fetching countries", error);
        setDynamicCountries(defaultCountries);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCountries();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-[#F5F8FB] py-12 flex justify-center items-center">Loading destinations...</div>;
  }
  
  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title="Visa Destinations Financial Documentation | Global Coverage"
        description="We provide Net Worth Certificates for Canada, UK, Australia, USA, New Zealand, and Schengen visas. Specialized documentation for student, visitor and family visas."
        canonical="/visa-countries"
        schema={breadcrumbSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full bg-[#E5F1F0] px-3 py-1 text-sm font-semibold text-[#0C6D62] mb-6">
            Global Destinations
          </div>
          <h1 className="text-4xl font-bold text-[#0B1830] mb-6">Financial Documentation for Popular Visa Destinations</h1>
          <p className="text-lg text-slate-600">Each country and visa category has different expectations for financial proof. A Net Worth Certificate helps present your financial standing clearly.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {dynamicCountries.map((country, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md overflow-hidden h-full">
                <div className="h-2 bg-[#0B1830]"></div>
                <CardContent className="p-6 flex flex-col h-[calc(100%-8px)]">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{country.flag}</span>
                    <h3 className="font-bold text-xl text-[#0B1830]">{country.name}</h3>
                  </div>
                  <div className="space-y-2 mb-6 flex-1">
                    {country.types.map((type, j) => (
                      <div key={j} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D6A84B] mr-2"></div>
                        {type}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <Link to={`/${country.name.toLowerCase().replace(/\s+/g, '-')}-net-worth-certificate`}>
                      <Button variant="outline" className="w-full font-semibold border-slate-200 hover:border-[#0C6D62] text-[#0C6D62]">
                        View Details
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button className="w-full bg-[#0B1830] hover:bg-[#0B1830]/90 font-semibold">
                        Enquire Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="bg-[#0B1830] text-white p-8 rounded-2xl text-center shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Globe className="w-12 h-12 text-[#D6A84B] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Important Disclaimer</h2>
          <p className="text-slate-300 max-w-3xl mx-auto text-sm leading-relaxed">
            Financial documentation requirements vary heavily by visa type, country, and individual applicant profile. We do not claim that a Net Worth Certificate is mandatory for every visa. It is a supporting document designed to consolidate and present your financial information professionally. Final decisions regarding visa approval are made solely by the respective immigration authorities.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
