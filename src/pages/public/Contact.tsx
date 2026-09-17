import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { openWhatsApp } from '../../lib/whatsapp';

import SEO from '../../components/SEO';

export default function Contact() {
  const { settings, loading: settingsLoading } = useSiteSettings();
  
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
        "name": "Contact Us",
        "item": "https://networthvisa.com/contact"
      }
    ]
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Consent check
    if (!formData.get('consent')) {
      toast.error('Please provide consent before submitting your enquiry.');
      return;
    }

    setLoading(true);
    
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      visaType: formData.get('visaType'),
      certificateType: formData.get('certificateType'),
      propertyValue: formData.get('propertyValue'),
      bankValue: formData.get('bankValue'),
      fdValue: formData.get('fdValue'),
      investmentValue: formData.get('investmentValue'),
      goldValue: formData.get('goldValue'),
      businessValue: formData.get('businessValue'),
      otherAssets: formData.get('otherAssets'),
      liabilities: formData.get('liabilities'),
      preferredContact: formData.get('preferredContact'),
      message: formData.get('message'),
      consent: true,
      source: "Contact Form - Document Checklist",
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      // 1. Save to Firebase
      await addDoc(collection(db, 'leads'), data);
      toast.success('Your enquiry has been saved. Opening WhatsApp...');
      
      // 2. Build WhatsApp message
      const assetDetails = [
        data.propertyValue && `Property: ${data.propertyValue}`,
        data.bankValue && `Bank Balance: ${data.bankValue}`,
        data.fdValue && `Fixed Deposits: ${data.fdValue}`,
        data.investmentValue && `Investments: ${data.investmentValue}`,
        data.goldValue && `Gold Assets: ${data.goldValue}`,
        data.businessValue && `Business Assets: ${data.businessValue}`,
        data.otherAssets && `Other Assets: ${data.otherAssets}`,
      ].filter(Boolean).join("\n");

      const liabilitiesDetails = data.liabilities ? `Liabilities / Loans: ${data.liabilities}` : "";

      const whatsappMessage = `Hello, I would like to request the document checklist for a Net Worth Certificate.

*Applicant Details*
Name: ${data.name}
Phone / WhatsApp: ${data.phone}
Email: ${data.email}

*Visa Details*
Destination Country: ${data.country}
Visa Type: ${data.visaType}
Certificate Type: ${data.certificateType}

*Asset Details*
${assetDetails}

${liabilitiesDetails}

Preferred Contact Method: ${data.preferredContact}

Please share the required document checklist and next steps.`;

      // 3. Open WhatsApp
      if (settings.whatsapp) {
        const normalizedNumber = settings.whatsapp.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${normalizedNumber.startsWith('91') ? normalizedNumber : '91' + normalizedNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error('Your enquiry has been received, but WhatsApp is currently unavailable.');
      }
      
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Unable to submit your enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title="Contact Networth Certificate Visa | Visa Financial Documentation"
        description="Have questions about your Net Worth Certificate? Contact us for professional CA-certified financial documentation guidance for visa applications."
        canonical="/contact"
        schema={breadcrumbSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-[#0B1830] mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">Have questions about your Net Worth Certificate? Send us a message or contact us directly.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#0C6D62]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#0C6D62]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1830] mb-1">Phone / WhatsApp</h3>
                  <p className="text-slate-600 text-sm mb-2">{settingsLoading ? 'Loading...' : settings.phone}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => !settingsLoading && openWhatsApp(settings.whatsapp, "Hello, I would like to get in touch with you.")}
                    disabled={settingsLoading}
                    className="w-full font-semibold border-[#0C6D62] text-[#0C6D62] hover:bg-[#0C6D62] hover:text-white disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Message on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="w-10 h-10 bg-[#0C6D62]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#0C6D62]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0B1830] mb-1">Email</h3>
                  <a href={`mailto:${settings.email}`} className="text-slate-600 text-sm hover:text-[#0C6D62] hover:underline">
                    {settings.email}
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#0B1830] mb-6">Send an Enquiry</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                      <Input id="name" name="name" required placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone / WhatsApp</label>
                      <Input id="phone" name="phone" required placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                      <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="text-sm font-medium text-slate-700">Destination Country</label>
                      <Input id="country" name="country" required placeholder="Canada, UK, Australia, etc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="visaType" className="text-sm font-medium text-slate-700">Visa Type</label>
                      <select id="visaType" name="visaType" required className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                        <option value="">Select Visa Type</option>
                        <option value="Visitor Visa">Visitor Visa</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Family Visa">Family Visa</option>
                        <option value="Super Visa">Super Visa</option>
                        <option value="Business Visa">Business Visa</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="certificateType" className="text-sm font-medium text-slate-700">Certificate Type</label>
                      <select id="certificateType" name="certificateType" required className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                        <option value="Individual">Individual Net Worth</option>
                        <option value="Family">Family Net Worth</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-[#0B1830]">Asset Details (Approximate Values in INR)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="propertyValue" className="text-sm font-medium text-slate-700">Property</label>
                        <Input id="propertyValue" name="propertyValue" placeholder="e.g. 1.5 Cr" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bankValue" className="text-sm font-medium text-slate-700">Bank Balance</label>
                        <Input id="bankValue" name="bankValue" placeholder="e.g. 15 Lakhs" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="fdValue" className="text-sm font-medium text-slate-700">Fixed Deposits</label>
                        <Input id="fdValue" name="fdValue" placeholder="e.g. 10 Lakhs" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="investmentValue" className="text-sm font-medium text-slate-700">Investments</label>
                        <Input id="investmentValue" name="investmentValue" placeholder="e.g. 5 Lakhs" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="goldValue" className="text-sm font-medium text-slate-700">Gold Assets</label>
                        <Input id="goldValue" name="goldValue" placeholder="e.g. 8 Lakhs" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="businessValue" className="text-sm font-medium text-slate-700">Business Assets</label>
                        <Input id="businessValue" name="businessValue" placeholder="e.g. 25 Lakhs" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="otherAssets" className="text-sm font-medium text-slate-700">Other Assets</label>
                        <Input id="otherAssets" name="otherAssets" placeholder="e.g. Vehicles, PF (12 Lakhs)" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="liabilities" className="text-sm font-medium text-slate-700">Liabilities / Loans</label>
                        <Input id="liabilities" name="liabilities" placeholder="e.g. Home Loan (20 Lakhs)" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="preferredContact" className="text-sm font-medium text-slate-700">Preferred Contact Method</label>
                        <select id="preferredContact" name="preferredContact" className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                          <option value="whatsapp">WhatsApp</option>
                          <option value="phone">Phone Call</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-slate-700">Additional Message</label>
                      <Textarea id="message" name="message" rows={3} placeholder="Any specific requirements or questions?" />
                    </div>
                    
                    <div className="flex items-start space-x-2 pt-2">
                      <input type="checkbox" id="consent" name="consent" required className="mt-1" />
                      <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed">
                        I consent to being contacted regarding my enquiry. I understand that a Net Worth Certificate is a supporting document and does not guarantee visa approval.
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-[#D6A84B] hover:bg-[#D6A84B]/90 text-[#0B1830] font-bold py-6 rounded-lg text-lg mt-4 shadow-lg" disabled={loading}>
                    {loading ? 'Submitting...' : 'Request Document Checklist'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
