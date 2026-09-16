import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, FileText, Globe, FileCheck, Landmark, Briefcase, HandCoins } from 'lucide-react';
import { PremiumCTAButton } from '../../components/ui/PremiumCTAButton';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { openWhatsApp } from '../../lib/whatsapp';
import { handleCTAAction } from '../../lib/cta';

export default function Home() {
  const navigate = useNavigate();
  const { settings, cta, loading } = useSiteSettings();
  const [content, setContent] = useState({
    heroHeading: 'Net Worth Certificate for Your Visa Application',
    heroSubheading: 'CA-Certified Visa Financial Documentation',
    heroDescription: 'Consolidate property, bank balances, fixed deposits, investments, gold, business interests and liabilities into one professionally prepared financial statement for your visa documentation.',
    heroImage: '',
    trustPoints: [
      { id: '1', text: 'Prepared by Chartered Accountant', order: 0 },
      { id: '2', text: 'Digital PDF Option', order: 1 },
      { id: '3', text: 'Individual & Family Net Worth', order: 2 },
      { id: '4', text: 'Clear Asset & Liability Summary', order: 3 },
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error("Error fetching homepage content:", error);
      }
    };
    fetchContent();
  }, []);

  const handlePrimaryClick = () => {
    handleCTAAction(cta.primary, settings, navigate);
  };

  const handleSecondaryClick = () => {
    handleCTAAction(cta.secondary, settings, navigate);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white pt-12 md:pt-20 pb-16 md:pb-24 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full bg-[#E5F1F0] px-3 py-1 text-sm font-semibold text-[#0C6D62] mb-6">
                {content.heroSubheading}
              </div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0B1830] leading-[1.1] mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {content.heroHeading}
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed whitespace-pre-line"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {content.heroDescription}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {cta.primary.enabled && (
                    <PremiumCTAButton 
                    text={cta.primary.text}
                    onClick={handlePrimaryClick}
                    />
                )}
                {cta.secondary.enabled && (
                    <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={handleSecondaryClick}
                    className="rounded-full font-semibold border-slate-300 text-[#0B1830] transition-transform hover:-translate-y-1 active:scale-95"
                    >
                    {cta.secondary.text}
                    </Button>
                )}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-slate-700">
                {content.trustPoints.map((point: any, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-[#0C6D62] mr-2 flex-shrink-0" /> 
                    {point.text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Visual Mockup */}
            <motion.div 
              className="relative mx-auto w-full max-w-lg lg:ml-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {content.heroImage ? (
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                  <img src={content.heroImage} alt="Net Worth Certificate Mockup" className="w-full h-auto object-cover" />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0C6D62]/10 to-[#D6A84B]/10 rounded-[32px] transform translate-x-4 translate-y-4"></div>
                  <Card className="relative bg-white shadow-2xl rounded-2xl overflow-hidden border-0">
                    <div className="bg-[#0B1830] px-6 py-4 flex justify-between items-center text-white">
                      <span className="font-bold tracking-widest text-sm uppercase text-[#D6A84B]">Sample Preview</span>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="text-center mb-8 border-b pb-6">
                        <h3 className="font-bold text-xl text-[#0B1830] uppercase mb-1">Net Worth Certificate</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">As on {new Date().toLocaleDateString()}</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm font-semibold text-[#0B1830] mb-2 border-b pb-1">
                            <span>A. Immovable Assets</span>
                            <span>₹ 1,50,00,000</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Residential Property</span>
                            <span>₹ 1,20,00,000</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Agricultural Land</span>
                            <span>₹ 30,00,000</span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm font-semibold text-[#0B1830] mb-2 border-b pb-1">
                            <span>B. Liquid Assets & Investments</span>
                            <span>₹ 45,50,000</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Bank Balances & FDs</span>
                            <span>₹ 25,00,000</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                        <span>Mutual Funds & Shares</span>
                        <span>₹ 20,50,000</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold text-red-600 mb-2 border-b pb-1">
                        <span>C. Liabilities</span>
                        <span>(₹ 15,00,000)</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Home Loan Outstanding</span>
                        <span>₹ 15,00,000</span>
                      </div>
                    </div>

                    <div className="bg-[#F5F8FB] p-4 rounded-lg flex justify-between items-center mt-6 border border-[#E2E8F0]">
                      <span className="font-bold text-[#0B1830]">Total Net Worth (A+B-C)</span>
                      <span className="font-bold text-[#0C6D62] text-lg">₹ 1,80,50,000</span>
                    </div>

                    <div className="flex justify-between items-end pt-8">
                      <div className="text-xs text-slate-400">
                        <div className="w-20 h-[1px] bg-slate-300 mb-2"></div>
                        Applicant Signature
                      </div>
                      <div className="text-right text-xs text-[#0B1830]">
                        <div className="w-24 h-24 border-2 border-[#0B1830]/20 rounded-full flex items-center justify-center mb-2 mx-auto text-[#0B1830]/40 font-bold rotate-[-15deg]">
                          CA SEAL
                        </div>
                        <div className="font-bold">Chartered Accountant</div>
                        <div className="text-slate-500">M.No. XXXXXX</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#F5F8FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1830] mb-4">Complete Financial Documentation for Your Visa File</h2>
            <p className="text-lg text-slate-600">Professional valuation and certification of all eligible asset classes to strengthen your visa application.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardContent className="p-6">
                  <FileText className="w-10 h-10 text-[#0C6D62] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#0B1830]">Net Worth Certificate</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">Individual or family financial statement showing assets, liabilities and resulting net worth.</p>
                  <a href="#" className="text-[#0C6D62] font-semibold text-sm hover:underline inline-flex items-center">Learn More <ArrowRight className="w-4 h-4 ml-1"/></a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardContent className="p-6">
                  <Landmark className="w-10 h-10 text-[#0C6D62] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#0B1830]">Property Valuation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">Residential, commercial, agricultural and ancestral property documentation.</p>
                  <a href="#" className="text-[#0C6D62] font-semibold text-sm hover:underline inline-flex items-center">Learn More <ArrowRight className="w-4 h-4 ml-1"/></a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardContent className="p-6">
                  <Briefcase className="w-10 h-10 text-[#0C6D62] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#0B1830]">Investment Valuation</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">Mutual funds, shares, demat holdings, PPF, bonds and other investments.</p>
                  <a href="#" className="text-[#0C6D62] font-semibold text-sm hover:underline inline-flex items-center">Learn More <ArrowRight className="w-4 h-4 ml-1"/></a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
                <CardContent className="p-6">
                  <HandCoins className="w-10 h-10 text-[#0C6D62] mb-4" />
                  <h3 className="font-bold text-lg mb-2 text-[#0B1830]">Bank & Fixed Deposits</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">Bank balances, fixed deposits and liquid financial assets certification.</p>
                  <a href="#" className="text-[#0C6D62] font-semibold text-sm hover:underline inline-flex items-center">Learn More <ArrowRight className="w-4 h-4 ml-1"/></a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-[#0B1830] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">A Professional Net Worth Certificate Is More Than Just a Total</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                A well-prepared financial statement should clearly show how major figures are supported through available records, increasing trust and transparency for visa officers.
              </p>
            </motion.div>
            
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { num: '01', title: 'CA Prepared', desc: 'Professionally drafted by qualified Chartered Accountants.' },
                { num: '02', title: 'Clear Asset Mapping', desc: 'Assets logically grouped and referenced to supporting documents.' },
                { num: '03', title: 'Professional Documentation', desc: 'Clean, formatted, and strictly adheres to professional standards.' },
                { num: '04', title: 'Digital Delivery', desc: 'Secure, high-quality digital PDFs ready for portal upload.' },
                { num: '05', title: 'Transparent Process', desc: 'Clear communication on what can and cannot be included.' },
                { num: '06', title: 'Fast Communication', desc: 'Direct access via WhatsApp and email for quick revisions.' }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-[#D6A84B] font-bold text-xl mb-2">{feature.num}</div>
                  <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0C6D62] to-[#095048] text-white">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Need a Net Worth Certificate for Your Visa?</h2>
          <p className="text-lg md:text-xl text-[#E5F1F0] mb-10 max-w-2xl mx-auto">
            Share your visa destination and financial details to receive a personalized document checklist and quote.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
          {cta.primary.enabled && (
            <PremiumCTAButton 
              text={cta.primary.text}
              onClick={handlePrimaryClick}
            />
          )}
          {cta.secondary.enabled && (
            <Button size="lg" variant="outline" onClick={handleSecondaryClick} className="rounded-full px-8 h-14 text-lg font-semibold border-white text-[#0B1830] hover:bg-white/10 bg-white">
              {cta.secondary.text}
            </Button>
          )}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
