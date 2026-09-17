import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Award, Briefcase, FileSignature, CheckCircle } from 'lucide-react';

import SEO from '../../components/SEO';

export default function About() {
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
        "name": "About Us",
        "item": "https://networthvisa.com/about"
      }
    ]
  };

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title="About Networth Certificate Visa | Chartered Accountants"
        description="Learn about our professional Chartered Accountant firm specializing in Net Worth Certificates and financial documentation for global visa applications."
        canonical="/about"
        schema={breadcrumbSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full bg-[#E5F1F0] px-3 py-1 text-sm font-semibold text-[#0C6D62] mb-6">
              About The Firm
            </div>
            <h1 className="text-4xl font-bold text-[#0B1830] mb-6 leading-tight">
              Professional Chartered Accountants Focused on Visa Financial Documentation
            </h1>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              We are a dedicated professional firm assisting individuals and families with accurate, reliable, and well-structured financial documentation for global visa applications.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              A well-prepared Net Worth Certificate helps immigration officers understand your financial ties to your home country. We ensure that every document we prepare is backed by verifiable evidence, mathematically accurate, and presented in a clean, professional format.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[#0C6D62] mr-3" />
                <span className="font-medium text-slate-800">Ethical & Transparent Practices</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[#0C6D62] mr-3" />
                <span className="font-medium text-slate-800">Strict Adherence to Professional Standards</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-[#0C6D62] mr-3" />
                <span className="font-medium text-slate-800">Clear Communication & Digital Delivery</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-[#0C6D62] rounded-3xl transform translate-x-4 translate-y-4 opacity-10"></div>
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden relative z-10 bg-white">
              <CardContent className="p-10">
                <div className="w-20 h-20 bg-[#F5F8FB] rounded-full flex items-center justify-center mb-6">
                  <FileSignature className="w-10 h-10 text-[#0B1830]" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1830] mb-2">CA Profile Placeholder</h3>
                <p className="text-[#0C6D62] font-semibold mb-6">Chartered Accountant</p>
                
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-slate-500">Firm Name</span>
                    <span className="font-semibold text-slate-800 text-right">M/S Professional Firm</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-slate-500">Qualification</span>
                    <span className="font-semibold text-slate-800 text-right">FCA, B.Com</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-slate-500">Membership No.</span>
                    <span className="font-semibold text-slate-800 text-right">XXXXXX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-slate-500">FRN</span>
                    <span className="font-semibold text-slate-800 text-right">XXXXXXW</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-md bg-white h-full">
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 text-[#D6A84B] mx-auto mb-4" />
                <h3 className="font-bold text-xl text-[#0B1830] mb-3">Accuracy</h3>
                <p className="text-slate-600 text-sm">Every asset is carefully cross-verified with supporting documentation.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-none shadow-md bg-white h-full">
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-[#D6A84B] mx-auto mb-4" />
                <h3 className="font-bold text-xl text-[#0B1830] mb-3">Professionalism</h3>
                <p className="text-slate-600 text-sm">Clean, beautifully formatted reports ready for submission.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-none shadow-md bg-[#0B1830] text-white h-full">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-[#0C6D62] mx-auto mb-4" />
                <h3 className="font-bold text-xl text-white mb-3">Trust</h3>
                <p className="text-slate-300 text-sm">We provide realistic valuations and transparent reporting standards.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
