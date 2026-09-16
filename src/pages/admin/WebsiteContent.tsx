import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function WebsiteContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [cta, setCta] = useState({
    primary: { text: "Get Started Now", actionType: "internal", value: "/apply", openInNewTab: false, enabled: true },
    secondary: { text: "WhatsApp Now", actionType: "whatsapp", useGlobalWhatsapp: true, openInNewTab: true, enabled: true, message: "" },
  });
  
  const [content, setContent] = useState({
    heroHeading: 'Net Worth Certificate for Visa in 30 Minutes',
    heroSubheading: 'CA-Certified Financial Documentation',
    heroDescription: 'Get your digital or physical Net Worth Certificate prepared by qualified Chartered Accountants for US, UK, Canada, Australia and Schengen visas.',
    heroImage: '',
    trustPoints: [
      { id: '1', text: 'Prepared by Chartered Accountant', order: 0 },
      { id: '2', text: 'Digital PDF Option Available', order: 1 },
      { id: '3', text: 'Individual & Family Net Worth', order: 2 },
      { id: '4', text: 'Clear Asset & Liability Summary', order: 3 },
    ]
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const docRefHero = doc(db, 'siteSettings', 'homepage');
      const docRefCta = doc(db, 'siteSettings', 'cta');
      
      const [docSnapHero, docSnapCta] = await Promise.all([getDoc(docRefHero), getDoc(docRefCta)]);
      
      if (docSnapHero.exists()) setContent(prev => ({ ...prev, ...docSnapHero.data() }));
      if (docSnapCta.exists()) setCta(docSnapCta.data() as any);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCTAChange = (btn: 'primary' | 'secondary', field: string, value: any) => {
    setCta(prev => ({
      ...prev,
      [btn]: { ...prev[btn], [field]: value }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleTrustPointChange = (index: number, value: string) => {
    const newPoints = [...content.trustPoints];
    newPoints[index].text = value;
    setContent(prev => ({ ...prev, trustPoints: newPoints }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docRefHero = doc(db, 'siteSettings', 'homepage');
      const docRefCta = doc(db, 'siteSettings', 'cta');
      
      await Promise.all([
        setDoc(docRefHero, content, { merge: true }),
        setDoc(docRefCta, cta, { merge: true })
      ]);
      toast.success('Changes saved successfully.');
    } catch (error) {
      console.error("Error saving content:", error);
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Website Content CMS</h2>
        <p className="text-slate-500 mt-1">Edit the content of your public homepage.</p>
      </div>
      
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'hero' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('trust')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'trust' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Trust Points
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cta' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          CTA Buttons
        </button>
      </div>

      <form onSubmit={handleSave}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Heading</label>
                  <Input name="heroHeading" value={content.heroHeading} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Subheading / Eyebrow</label>
                  <Input name="heroSubheading" value={content.heroSubheading} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Description</label>
                  <textarea
                    name="heroDescription"
                    className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    value={content.heroDescription} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hero Image URL</label>
                  <Input name="heroImage" value={content.heroImage} onChange={handleChange} placeholder="Leave blank for default illustration" />
                </div>
              </div>
            )}

            {activeTab === 'trust' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">Edit the 4 trust points displayed below the hero section.</p>
                {content.trustPoints.map((point, index) => (
                  <div key={point.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-medium text-slate-500 shrink-0">
                      {index + 1}
                    </div>
                    <Input 
                      value={point.text} 
                      onChange={(e) => handleTrustPointChange(index, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cta' && (
              <div className="space-y-8">
                {(['primary', 'secondary'] as const).map((btn) => (
                  <div key={btn} className="space-y-4 border-b pb-8">
                    <h3 className="font-bold capitalize">{btn} Button</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Button Text" value={cta[btn].text} onChange={(e) => handleCTAChange(btn, 'text', e.target.value)} />
                      <select className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm" value={cta[btn].actionType} onChange={(e) => handleCTAChange(btn, 'actionType', e.target.value)}>
                        <option value="internal">Internal Page</option>
                        <option value="external">External URL</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="scroll">Scroll to Section</option>
                        <option value="application">Start Application</option>
                      </select>
                      <Input placeholder="Value / Destination" value={cta[btn].value || ''} onChange={(e) => handleCTAChange(btn, 'value', e.target.value)} />
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={cta[btn].openInNewTab} onChange={(e) => handleCTAChange(btn, 'openInNewTab', e.target.checked)} />
                        <label className="text-sm">Open in New Tab</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" checked={cta[btn].enabled} onChange={(e) => handleCTAChange(btn, 'enabled', e.target.checked)} />
                        <label className="text-sm">Enabled</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-6 mt-6 flex items-center justify-end border-t border-slate-100">
              <Button type="submit" disabled={saving} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
