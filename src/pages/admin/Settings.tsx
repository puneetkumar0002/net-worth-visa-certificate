import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  
  const [settings, setSettings] = useState({
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    email: '',
    supportEmail: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    googleMapsUrl: '',
    businessName: '',
    logoUrl: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'siteSettings', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const docRef = doc(db, 'siteSettings', 'general');
      await setDoc(docRef, settings, { merge: true });
      toast.success('Changes saved successfully.');
    } catch (error) {
      console.error("Error saving settings:", error);
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
        <h2 className="text-2xl font-bold text-slate-900">Global Settings</h2>
        <p className="text-slate-500 mt-1">Manage website settings, contact details, and preferences.</p>
      </div>
      
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contact' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Contact Details
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'business' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Business & Branding
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'social' 
              ? 'border-[#0C6D62] text-[#0C6D62]' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Social Media
        </button>
      </div>

      <form onSubmit={handleSave}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{
              activeTab === 'contact' ? 'Contact Information' : 
              activeTab === 'business' ? 'Business Details' : 'Social Profiles'
            }</CardTitle>
            <CardDescription>
              These details will be updated directly on the public website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeTab === 'contact' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Phone Number</label>
                    <Input name="phone" value={settings.phone} onChange={handleChange} placeholder="+1234567890" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WhatsApp Number (with country code)</label>
                    <Input name="whatsapp" value={settings.whatsapp} onChange={handleChange} placeholder="1234567890" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Primary Email</label>
                    <Input name="email" type="email" value={settings.email} onChange={handleChange} placeholder="info@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <Input name="supportEmail" type="email" value={settings.supportEmail} onChange={handleChange} placeholder="support@example.com" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-medium mb-4">Office Address</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address Line 1</label>
                      <Input name="address" value={settings.address} onChange={handleChange} placeholder="123 Main St" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input name="city" value={settings.city} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State/Province</label>
                      <Input name="state" value={settings.state} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input name="country" value={settings.country} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PIN Code</label>
                      <Input name="pincode" value={settings.pincode} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Google Maps URL</label>
                      <Input name="googleMapsUrl" value={settings.googleMapsUrl} onChange={handleChange} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Office Visit Note</label>
                      <Input name="officeVisitNote" value={settings.officeVisitNote} onChange={handleChange} placeholder="e.g. Visits by appointment only" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'business' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <Input name="businessName" value={settings.businessName} onChange={handleChange} placeholder="My Company" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo URL</label>
                  <Input name="logoUrl" value={settings.logoUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facebook URL</label>
                  <Input name="facebook" value={settings.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram URL</label>
                  <Input name="instagram" value={settings.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input name="linkedin" value={settings.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">YouTube URL</label>
                  <Input name="youtube" value={settings.youtube} onChange={handleChange} placeholder="https://youtube.com/..." />
                </div>
              </div>
            )}
            
            <div className="pt-6 flex items-center justify-end border-t border-slate-100">
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
