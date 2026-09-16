import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

export default function GenericAdminPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-1">{description}</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Module Under Construction</h3>
          <p className="max-w-md mx-auto">This module is currently being configured. Content management features for {title.toLowerCase()} will be available here soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
