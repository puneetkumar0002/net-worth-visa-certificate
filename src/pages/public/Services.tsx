import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FileText, Landmark, Briefcase, HandCoins, Building2, Calculator, ShieldCheck, Scale, FileBadge } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';

export default function Services() {
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultServices = [
    {
      icon: FileText,
      title: 'Net Worth Certificate',
      desc: 'Individual or family financial statement showing assets, liabilities and resulting net worth for visa applications.',
      link: '/net-worth-certificate'
    },
    {
      icon: Landmark,
      title: 'Property & Land Valuation',
      desc: 'Valuation of residential, commercial, agricultural and ancestral property with proper documentation.',
      link: '/property-valuation'
    },
    {
      icon: HandCoins,
      title: 'Bank & Fixed Deposits',
      desc: 'Consolidation and certification of bank balances, fixed deposits and liquid financial assets.',
      link: '/contact'
    },
    {
      icon: Briefcase,
      title: 'Investment Valuation',
      desc: 'Valuation and documentation of mutual funds, shares, demat holdings, PPF, bonds and other investments.',
      link: '/investment-valuation'
    },
    {
      icon: Building2,
      title: 'Business / Capital Interest',
      desc: 'Financial interest in proprietorships, partnerships and companies based on audited/unaudited available records.',
      link: '/contact'
    },
    {
      icon: ShieldCheck,
      title: 'Gold & Other Assets',
      desc: 'Inclusion of gold, vehicles and other document-supported physical assets where appropriate.',
      link: '/contact'
    },
    {
      icon: Scale,
      title: 'Liability Assessment',
      desc: 'Accurate reporting of home loans, vehicle loans, and other outstanding liabilities.',
      link: '/contact'
    },
    {
      icon: Calculator,
      title: 'Supporting Financial Review',
      desc: 'Review of available ITRs, bank records and financial statements for consistency before finalization.',
      link: '/contact'
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('status', '==', 'published'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          icon: FileBadge, // Fallback icon for dynamic services
          title: doc.data().title,
          desc: doc.data().shortDescription,
          link: `/${doc.data().slug}`
        }));
        if (data.length > 0) {
          setDynamicServices(data);
        } else {
          setDynamicServices(defaultServices);
        }
      } catch (error) {
        console.error("Error fetching services", error);
        setDynamicServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F5F8FB] py-12 flex justify-center items-center">Loading services...</div>;
  }

  return (
    <div className="bg-[#F5F8FB] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1830] mb-6">Our Services</h1>
          <p className="text-lg text-slate-600">Complete financial documentation and valuation services designed specifically to strengthen your visa application file.</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {dynamicServices.map((service, i) => (
            <motion.div key={i} variants={item}>
              <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-md group h-full">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="w-14 h-14 bg-[#E5F1F0] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0C6D62] transition-colors">
                    <service.icon className="w-7 h-7 text-[#0C6D62] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-[#0B1830]">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">{service.desc}</p>
                  <Link to={service.link} className="text-[#0C6D62] font-semibold text-sm hover:underline inline-flex items-center mt-auto">
                    Learn More <ArrowRight className="w-4 h-4 ml-1"/>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
