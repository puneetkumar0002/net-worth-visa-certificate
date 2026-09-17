import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle, ArrowRight, FileText, Globe } from 'lucide-react';
import SEO from '../../components/SEO';

interface CountryInfo {
  name: string;
  slug: string;
  title: string;
  description: string;
  flag: string;
  content: string;
  faqs: { q: string; a: string }[];
}

const countries: Record<string, CountryInfo> = {
  'canada': {
    name: 'Canada',
    slug: 'canada',
    title: 'Net Worth Certificate for Canada Visa | CA-Certified',
    description: 'Get a CA-certified Net Worth Certificate for Canada Student (SDS), Visitor, or Business visas. Detailed asset valuation for high success rate.',
    flag: '🇨🇦',
    content: 'For Canada visa applications, including Student Direct Stream (SDS) and various visitor categories, a Net Worth Certificate helps demonstrate the financial ties and stability of the applicant in their home country. It consolidates properties, liquid funds, and other investments into a single document verified by a Chartered Accountant.',
    faqs: [
      { q: 'Is it required for Canada Student Visa?', a: 'While not mandatory, it is highly recommended to show total family net worth to support the financial capacity of sponsors.' },
      { q: 'Can I include ancestral property?', a: 'Yes, ancestral property can be included if supported by a professional valuation report.' }
    ]
  },
  'australia': {
    name: 'Australia',
    slug: 'australia',
    title: 'Net Worth Certificate for Australia Visa | CA-Certified',
    description: 'Professional Net Worth Certificate for Australia Subclass 600, 500 and other visa categories. CA-verified financial documentation.',
    flag: '🇦🇺',
    content: 'Australia visa applications often require a clear summary of your financial position. Whether you are applying for a Tourist visa or a Student visa, a Net Worth Certificate provides a professional summary of your financial strength, making it easier for visa officers to assess your file.',
    faqs: [
      { q: 'Does it help in Subclass 600?', a: 'Yes, it provides a comprehensive overview of your financial standing, which is a key factor in visitor visa assessments.' }
    ]
  },
  'uk': {
    name: 'United Kingdom',
    slug: 'uk',
    title: 'Net Worth Certificate for UK Visa | CA-Certified',
    description: 'Get your Net Worth Certificate for UK Standard Visitor or Student visas. CA-sealed documentation for visa financial proof.',
    flag: '🇬🇧',
    content: 'The UK Home Office expects clear proof of financial circumstances. A Net Worth Certificate prepared by a Chartered Accountant helps in presenting a consolidated view of your assets and liabilities, supporting your claims of financial stability.',
    faqs: [
      { q: 'Is UDIN mandatory?', a: 'Yes, all our certificates are issued with a unique UDIN for verification.' }
    ]
  },
  'usa': {
    name: 'USA',
    slug: 'usa',
    title: 'Net Worth Certificate for USA Visa | CA-Certified',
    description: 'CA-certified Net Worth Certificate for USA B1/B2, F1 and other visa types. Professional financial summary for consulate interviews.',
    flag: '🇺🇸',
    content: 'For USA visa interviews, having a clear and professional summary of your financial assets can be very helpful. It shows the consular officer your strong financial ties to your home country.',
    faqs: [
      { q: 'Can I use it for F1 visa?', a: 'Yes, it is often used by sponsors to show their overall financial capability beyond just bank balances.' }
    ]
  },
  'new-zealand': {
    name: 'New Zealand',
    slug: 'new-zealand',
    title: 'Net Worth Certificate for New Zealand Visa | CA-Certified',
    description: 'Professional Net Worth Certificate for New Zealand visa applications. CA-verified documentation for financial proof.',
    flag: '🇳🇿',
    content: 'New Zealand immigration requires robust evidence of financial capacity. Consolidating your assets into a professional certificate simplifies the review process for the visa officer.',
    faqs: [
      { q: 'How long does it take?', a: 'Usually, it takes 24-48 hours once all supporting documents are received.' }
    ]
  },
  'schengen': {
    name: 'Schengen Area',
    slug: 'schengen',
    title: 'Net Worth Certificate for Schengen Visa | CA-Certified',
    description: 'Get a CA-certified Net Worth Certificate for Schengen (Europe) visa applications. Professional financial summary for all member states.',
    flag: '🇪🇺',
    content: 'Applying for a Schengen visa involves proving sufficient financial means. A Net Worth Certificate acts as a professional summary of your financial health across various asset classes.',
    faqs: [
      { q: 'Is it valid for all Schengen countries?', a: 'Yes, it is a professional financial statement that can be used for any Schengen member state application.' }
    ]
  }
};

export default function CountryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const countrySlug = slug?.replace('-net-worth-certificate', '') || '';
  const country = countries[countrySlug as keyof typeof countries];

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
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
        "name": "Visa Countries",
        "item": "https://networthvisa.com/visa-countries"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": country.name,
        "item": `https://networthvisa.com/${country.slug}-net-worth-certificate`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": country.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <SEO 
        title={country.title}
        description={country.description}
        canonical={`/${country.slug}-net-worth-certificate`}
        schema={[breadcrumbSchema, faqSchema]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/visa-countries" className="text-[#0C6D62] font-semibold flex items-center mb-6 hover:underline">
            <Globe className="w-4 h-4 mr-2" />
            Back to Visa Countries
          </Link>
          <div className="flex items-center mb-6">
            <span className="text-5xl mr-4">{country.flag}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B1830]">{country.name} Visa Financial Proof</h1>
          </div>
          <p className="text-xl text-slate-600 max-w-4xl leading-relaxed">
            {country.content}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-[#0B1830] mb-6">Common Financial Documents Required</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Property Sale Deeds/Valuation Reports',
                  'Latest Bank Statements (3-6 Months)',
                  'Fixed Deposit Receipts',
                  'Share/Mutual Fund Statements',
                  'Jewelry Valuation Reports',
                  'Business Ownership Proofs'
                ].map((doc, i) => (
                  <div key={i} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <CheckCircle className="w-5 h-5 text-[#0C6D62] mr-3 shrink-0" />
                    <span className="text-slate-700 font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#0B1830] mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {country.faqs.map((faq, i) => (
                  <Card key={i} className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <h3 className="font-bold text-[#0B1830] mb-2">{faq.q}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-[#0B1830] text-white border-none shadow-xl sticky top-24">
              <CardContent className="p-8">
                <FileText className="w-12 h-12 text-[#D6A84B] mb-6" />
                <h3 className="text-2xl font-bold mb-4">Start Your {country.name} Application</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Consolidate your assets and strengthen your visa file with a professionally prepared Net Worth Certificate.
                </p>
                <Link to="/contact">
                  <Button size="lg" className="w-full bg-[#D6A84B] text-[#0B1830] hover:bg-[#D6A84B]/90 font-bold h-14 rounded-full">
                    Enquire Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
