import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

export default function SEO() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [seo, setSeo] = useState({
    globalTitleTemplate: '%s | Net Worth Certificate for Visa',
    defaultDescription: 'Get your digital or physical Net Worth Certificate prepared by qualified Chartered Accountants for US, UK, Canada, Australia and Schengen visas.',
    defaultKeywords: 'net worth certificate, visa net worth, CA certificate, financial documentation',
    ogImage: '',
    googleAnalyticsId: '',
    googleTagManagerId: ''
  });

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSeo(prev => ({ ...prev, ...docSnap.data() }));
      }
    } catch (error) {
      console.error("Error fetching SEO:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docRef = doc(db, 'siteSettings', 'seo');
      await setDoc(docRef, seo, { merge: true });
      toast.success('SEO settings saved successfully.');
    } catch (error) {
      console.error("Error saving SEO:", error);
      toast.error('Unable to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Search Engine Optimization</h2>
        <p className="text-slate-500 mt-1">Manage global meta tags, social sharing, and tracking codes.</p>
      </div>
      
      <form onSubmit={handleSave}>
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-[#0C6D62]" /> Global Meta Data
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Global Title Template</label>
                <Input name="globalTitleTemplate" value={seo.globalTitleTemplate} onChange={handleChange} />
                <p className="text-xs text-slate-500">%s will be replaced by the specific page title.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Meta Description</label>
                <textarea
                  name="defaultDescription"
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                  value={seo.defaultDescription} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Keywords</label>
                <Input name="defaultKeywords" value={seo.defaultKeywords} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default OpenGraph Image URL (Social Sharing)</label>
                <Input name="ogImage" value={seo.ogImage} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tracking & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Analytics Measurement ID</label>
                <Input name="googleAnalyticsId" value={seo.googleAnalyticsId} onChange={handleChange} placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Tag Manager ID</label>
                <Input name="googleTagManagerId" value={seo.googleTagManagerId} onChange={handleChange} placeholder="GTM-XXXXXXX" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
