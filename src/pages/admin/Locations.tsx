import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { DataTable } from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Trash, Globe, MapPin, Search, Database } from 'lucide-react';
import { CityLocation } from '../../types';
import { seedLocations } from '../../lib/seedLocations';

export default function AdminLocations() {
  const [locations, setLocations] = useState<CityLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<CityLocation | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const q = query(collection(db, 'locations'), orderBy('city', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CityLocation[];
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (location: CityLocation) => {
    if (window.confirm(`Are you sure you want to delete ${location.city}?`)) {
      try {
        await deleteDoc(doc(db, 'locations', location.id));
        setLocations(locations.filter(l => l.id !== location.id));
        toast.success('Location deleted successfully');
      } catch (error) {
        console.error("Error deleting location:", error);
        toast.error('Failed to delete location');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Extract FAQs
    const faqQuestions = formData.getAll('faq_question') as string[];
    const faqAnswers = formData.getAll('faq_answer') as string[];
    const faqs = faqQuestions.map((q, i) => ({ question: q, answer: faqAnswers[i] })).filter(f => f.question && f.answer);

    const data: Partial<CityLocation> = {
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      slug: formData.get('slug') as string,
      status: formData.get('status') as 'active' | 'inactive',
      h1: formData.get('h1') as string,
      intro: formData.get('intro') as string,
      localContent: formData.get('localContent') as string,
      faqs: faqs,
      metaTitle: formData.get('metaTitle') as string,
      metaDescription: formData.get('metaDescription') as string,
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'locations', isEditing.id), data);
        setLocations(locations.map(l => l.id === isEditing.id ? { ...l, ...data } as CityLocation : l));
        toast.success('Location updated successfully');
      } else {
        const docRef = await addDoc(collection(db, 'locations'), { ...data, createdAt: serverTimestamp() });
        setLocations([...locations, { id: docRef.id, ...data } as CityLocation]);
        toast.success('Location created successfully');
      }
      setIsEditing(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error('Failed to save location');
    }
  };

  if (isAdding || isEditing) {
    const item = isEditing || {
      faqs: [{ question: '', answer: '' }]
    } as Partial<CityLocation>;

    return (
      <div className="bg-white rounded-xl shadow-sm border p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b pb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1830]">{isEditing ? 'Edit City Location' : 'Add New City Landing Page'}</h2>
            <p className="text-slate-500 text-sm mt-1">Configure location-specific landing page content and SEO.</p>
          </div>
          <Button variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* Basic Info */}
          <section className="space-y-6">
            <h3 className="text-lg font-bold text-[#0B1830] flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-[#0C6D62]" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">City Name</label>
                <Input name="city" defaultValue={item.city} required placeholder="e.g. Chandigarh" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">State</label>
                <Input name="state" defaultValue={item.state} required placeholder="e.g. Punjab" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">URL Slug</label>
                <Input name="slug" defaultValue={item.slug} required placeholder="e.g. chandigarh" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Status</label>
                <select 
                  name="status" 
                  defaultValue={item.status || 'active'} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Hero Section Content */}
          <section className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-bold text-[#0B1830] flex items-center">
              <Globe className="w-5 h-5 mr-2 text-[#0C6D62]" />
              Landing Page Hero Content
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Primary Heading (H1)</label>
                <Input name="h1" defaultValue={item.h1} required placeholder="Net Worth Certificate for Your Visa Application in {City}" />
                <p className="text-xs text-slate-400">Use {item.city || '{City}'} dynamically in your wording.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Hero Introduction Text</label>
                <Textarea name="intro" defaultValue={item.intro} required rows={3} placeholder="Brief summary for the top of the page..." />
              </div>
            </div>
          </section>

          {/* Detailed Content */}
          <section className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-bold text-[#0B1830]">Main Body Content</h3>
            <div className="space-y-2">
              <label className="text-sm font-semibold">City-Specific Details</label>
              <Textarea 
                name="localContent" 
                defaultValue={item.localContent} 
                required 
                rows={10} 
                placeholder="Detailed information about services in this city, common document types for local residents, etc."
              />
              <p className="text-xs text-slate-400">Use line breaks to separate paragraphs. This content should be unique for SEO value.</p>
            </div>
          </section>

          {/* FAQs */}
          <section className="space-y-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0B1830]">City-Specific FAQs</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // This is a bit hacky with uncontrolled inputs, but works for the demo
                  const container = document.getElementById('faqs-container');
                  if (container) {
                    const newFaq = document.createElement('div');
                    newFaq.className = "space-y-4 p-4 bg-slate-50 rounded-xl border relative group";
                    newFaq.innerHTML = `
                      <div class="space-y-2">
                        <label class="text-xs font-bold uppercase text-slate-400">Question</label>
                        <input name="faq_question" class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm" />
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-bold uppercase text-slate-400">Answer</label>
                        <textarea name="faq_answer" rows="3" class="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm"></textarea>
                      </div>
                      <button type="button" class="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    `;
                    container.appendChild(newFaq);
                  }
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add FAQ
              </Button>
            </div>
            <div id="faqs-container" className="space-y-4">
              {item.faqs?.map((faq, index) => (
                <div key={index} className="space-y-4 p-4 bg-slate-50 rounded-xl border relative group">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Question</label>
                    <Input name="faq_question" defaultValue={faq.question} placeholder="e.g. Can I get a Net Worth Certificate online in Chandigarh?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Answer</label>
                    <Textarea name="faq_answer" defaultValue={faq.answer} rows={3} placeholder="Detailed answer..." />
                  </div>
                  <button 
                    type="button" 
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => (e.currentTarget.parentElement as HTMLElement).remove()}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Metadata */}
          <section className="space-y-6 pt-6 border-t">
            <h3 className="text-lg font-bold text-[#0B1830]">SEO Metadata</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">SEO Meta Title</label>
                <Input name="metaTitle" defaultValue={item.metaTitle} required placeholder="Net Worth Certificate for Visa in {City} | CA-Certified" />
                <p className="text-xs text-slate-400">Ideally between 50-60 characters.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">SEO Meta Description</label>
                <Textarea name="metaDescription" defaultValue={item.metaDescription} required rows={3} placeholder="Compelling summary for Google search results..." />
                <p className="text-xs text-slate-400">Ideally between 150-160 characters.</p>
              </div>
            </div>
          </section>

          <div className="flex gap-4 pt-10 border-t sticky bottom-0 bg-white pb-6 z-10">
            <Button type="submit" size="lg" className="bg-[#0C6D62] hover:bg-[#0C6D62]/90 flex-1">
              {isEditing ? 'Update Location Page' : 'Create Location Page'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => { setIsAdding(false); setIsEditing(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  const columns = [
    { 
      header: 'City', 
      accessorKey: 'city' as keyof CityLocation,
      cell: (item: CityLocation) => (
        <div className="font-bold text-[#0B1830]">{item.city}</div>
      )
    },
    { header: 'State', accessorKey: 'state' as keyof CityLocation },
    { header: 'Slug', accessorKey: 'slug' as keyof CityLocation },
    { 
      header: 'Status', 
      accessorKey: 'status' as keyof CityLocation,
      cell: (item: CityLocation) => (
        <Badge className={item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
          {item.status?.toUpperCase() || 'INACTIVE'}
        </Badge>
      )
    },
  ];

  const handleSeed = async () => {
    if (window.confirm('This will seed the initial high-priority cities. Continue?')) {
      await seedLocations();
      fetchLocations();
    }
  };

  return (
    <div className="space-y-6">
      {locations.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center text-blue-800">
            <Database className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">Initial city data is empty. You can seed the starting cities to get started quickly.</span>
          </div>
          <Button onClick={handleSeed} size="sm" className="bg-blue-600 hover:bg-blue-700">Seed Initial Cities</Button>
        </div>
      )}
      <DataTable 
        title="Location Landing Pages"
        description="Manage location-specific SEO pages for major cities."
        data={locations}
        columns={columns}
        loading={loading}
        onAdd={() => setIsAdding(true)}
        onEdit={setIsEditing}
        onDelete={handleDelete}
        searchPlaceholder="Search cities or states..."
      />
    </div>
  );
}
