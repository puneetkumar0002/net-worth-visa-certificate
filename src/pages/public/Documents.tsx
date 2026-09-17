import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle2, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';
import { openWhatsApp } from '../../lib/whatsapp';

import SEO from '../../components/SEO';

export default function Documents() {
  const { settings, loading } = useSiteSettings();
  
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
        "name": "Documents Required",
        "item": "https://networthvisa.com/documents"
      }
    ]
  };
  
  const handleWhatsAppClick = () => {
    const fallbackNumber = '+919876543210';
    const message = `Hello, I need a Net Worth Certificate for my visa application.

Please guide me regarding the required documents and process.

Name:
Country Applying For:
Visa Type:`;
    openWhatsApp(settings?.whatsapp || fallbackNumber, message);
  };

  const categories = [
    {
      title: "Personal Documents",
      items: ["PAN Card", "Aadhaar / Government ID", "Passport", "Photograph"]
    },
    {
      title: "Bank Documents",
      items: ["Latest Bank Statements", "Bank Balance Certificate", "Fixed Deposit Certificates"]
    },
    {
      title: "Property Documents",
      items: ["Sale Deed / Registry", "Ownership Documents", "Property Valuation Documents if applicable"]
    },
    {
      title: "Investment Documents",
      items: ["Mutual Fund Statements", "Demat / Share Statements", "PPF / EPF", "Bonds", "Insurance Value Documents where applicable"]
    },
    {
      title: "Business Documents",
      items: ["Business Ownership Proof", "Balance Sheet", "Capital Account", "Financial Statements"]
    },
    {
      title: "Liabilities",
      items: ["Loan Statements", "Outstanding Loan Certificate", "EMI / Repayment Schedule"]
    },
    {
      title: "Other Documents",
      items: ["Gold Valuation", "Vehicle Valuation", "Other Supporting Financial Documents"]
    }
  ];

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title="Documents Required for Net Worth Certificate for Visa"
        description="Comprehensive checklist of personal, bank, property, and investment documents required for preparing your CA-certified Net Worth Certificate for visa applications."
        canonical="/documents"
        schema={breadcrumbSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#0B1830] mb-6">Documents Required for Net Worth Certificate</h1>
          <p className="text-lg text-slate-600">A professional Net Worth Certificate is based on verifiable documents. Below is a checklist of records you may need to provide based on the assets you want to include.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="border-none shadow-md h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 pb-4 border-b">
                    <FileCheck className="w-6 h-6 text-[#0C6D62] mr-3" />
                    <h3 className="font-bold text-lg text-[#0B1830] tracking-wide">{category.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex items-start text-sm text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-[#0C6D62] mr-3 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="bg-gradient-to-r from-[#0B1830] to-[#123C69] rounded-2xl p-10 text-center text-white shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">You can start your application online right away, or reach out to us if you need help with the document requirements.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="bg-[#D6A84B] text-[#0B1830] hover:bg-[#D6A84B]/90 font-bold rounded-full px-8 h-14 text-lg w-full">
                Start Application
              </Button>
            </Link>
            <WhatsAppButton 
              text="WhatsApp for Help"
              message={`Hello, I need a Net Worth Certificate for my visa application.

Please guide me regarding the required documents and process.

Name:
Country Applying For:
Visa Type:`}
              className="w-full sm:w-auto"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
