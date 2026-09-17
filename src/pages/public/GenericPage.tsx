import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

import SEO from '../../components/SEO';
import { useLocation } from 'react-router-dom';

export default function GenericPage({ title, description }: { title: string, description: string }) {
  const location = useLocation();
  
  return (
    <div className="bg-[#F5F8FB] min-h-[60vh] py-16 px-4">
      <SEO 
        title={title} 
        description={description.substring(0, 160)} 
        canonical={location.pathname}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0B1830] mb-6">{title}</h1>
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-8">
            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
