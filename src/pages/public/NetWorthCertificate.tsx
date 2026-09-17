import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle } from 'lucide-react';

import SEO from '../../components/SEO';

export default function NetWorthCertificate() {
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
        "name": "Net Worth Certificate",
        "item": "https://networthvisa.com/net-worth-certificate"
      }
    ]
  };

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title="Net Worth Certificate for Visa | Individual & Family Assets"
        description="Learn about Individual and Family Net Worth Certificates for visa applications. Professional CA certification of property, bank balances, and investments."
        canonical="/net-worth-certificate"
        schema={breadcrumbSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1830] mb-6">Net Worth Certificate</h1>
          <p className="text-lg text-slate-600">A comprehensive financial statement mapping your global assets and liabilities, signed and sealed by a Chartered Accountant.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#0B1830] mb-6">Individual vs Family Net Worth</h2>
            <div className="space-y-6">
              <Card className="border-none shadow-md bg-white border-l-4 border-l-[#0C6D62]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[#0B1830] mb-2">Individual Net Worth Certificate</h3>
                  <p className="text-slate-600 text-sm mb-4">Suitable where financial assets are primarily being shown in the applicant's name.</p>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#0C6D62] mr-2" /> Applicant's Property</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#0C6D62] mr-2" /> Bank Balances & FDs</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#0C6D62] mr-2" /> Personal Investments</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-none shadow-md bg-white border-l-4 border-l-[#D6A84B]">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[#0B1830] mb-2">Family Net Worth Certificate</h3>
                  <p className="text-slate-600 text-sm mb-4">May consolidate eligible financial assets of relevant family members depending on intended purpose.</p>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#D6A84B] mr-2" /> Applicant & Spouse</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#D6A84B] mr-2" /> Parents (for student visas)</li>
                    <li className="flex items-center"><CheckCircle className="w-4 h-4 text-[#D6A84B] mr-2" /> Shared Family Assets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <p className="text-xs text-slate-500 mt-4 italic">* Final structure depends on available documentation and intended visa use.</p>
          </motion.div>
          
          <motion.div 
            className="bg-[#0B1830] p-8 md:p-12 rounded-3xl text-white text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FileText className="w-16 h-16 text-[#D6A84B] mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-slate-300 mb-8">Share your details with us and we'll provide a customized checklist of documents needed to prepare your certificate.</p>
            <Link to="/contact">
              <Button size="lg" className="w-full bg-[#D6A84B] text-[#0B1830] hover:bg-[#D6A84B]/90 font-bold rounded-full h-14 text-lg">
                Request Checklist
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
