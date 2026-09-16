import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { DataTable } from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

interface Country {
  id: string;
  name: string;
  slug: string;
  flag: string;
  shortDescription: string;
  visaTypes: string;
  status: string;
  order: number;
}

export default function AdminCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Country | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const q = query(collection(db, 'countries'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Country[];
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (country: Country) => {
    if (window.confirm(`Are you sure you want to delete ${country.name}?`)) {
      try {
        await deleteDoc(doc(db, 'countries', country.id));
        setCountries(countries.filter(c => c.id !== country.id));
        toast.success('Country deleted successfully');
      } catch (error) {
        console.error("Error deleting country:", error);
        toast.error('Failed to delete country');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      flag: formData.get('flag'),
      shortDescription: formData.get('shortDescription'),
      visaTypes: formData.get('visaTypes'),
      status: formData.get('status'),
      order: Number(formData.get('order')),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'countries', isEditing.id), data);
        setCountries(countries.map(c => c.id === isEditing.id ? { ...c, ...data } as Country : c));
        toast.success('Country updated');
      } else {
        const docRef = await addDoc(collection(db, 'countries'), { ...data, createdAt: serverTimestamp() });
        setCountries([...countries, { id: docRef.id, ...data } as Country]);
        toast.success('Country created');
      }
      setIsEditing(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving country:", error);
      toast.error('Failed to save country');
    }
  };

  if (isAdding || isEditing) {
    const item = isEditing || {} as Partial<Country>;
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-[#0B1830] mb-6">{isEditing ? 'Edit Country' : 'Add New Country'}</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country Name</label>
              <Input name="name" defaultValue={item.name} required placeholder="e.g. Canada" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug</label>
              <Input name="slug" defaultValue={item.slug} required placeholder="e.g. canada" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Flag Emoji</label>
              <Input name="flag" defaultValue={item.flag} required placeholder="e.g. 🇨🇦" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Visa Types (Comma separated)</label>
              <Input name="visaTypes" defaultValue={item.visaTypes} placeholder="e.g. Study, Work, PR" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Short Description</label>
            <Textarea name="shortDescription" defaultValue={item.shortDescription} required rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select name="status" defaultValue={item.status || 'published'} className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input name="order" type="number" defaultValue={item.order || 0} required />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save Country</Button>
            <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  const columns = [
    { 
      header: 'Country', 
      accessorKey: 'name' as keyof Country,
      cell: (item: Country) => (
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{item.flag}</span>
          <span className="font-medium text-slate-900">{item.name}</span>
        </div>
      )
    },
    { header: 'Slug', accessorKey: 'slug' as keyof Country },
    { header: 'Order', accessorKey: 'order' as keyof Country },
    { 
      header: 'Status', 
      accessorKey: 'status' as keyof Country,
      cell: (item: Country) => (
        <Badge className={item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
          {item.status.toUpperCase()}
        </Badge>
      )
    },
  ];

  return (
    <DataTable 
      title="Countries Management"
      description="Manage supported destination countries"
      data={countries}
      columns={columns}
      loading={loading}
      onAdd={() => setIsAdding(true)}
      onEdit={setIsEditing}
      onDelete={handleDelete}
      searchPlaceholder="Search countries..."
    />
  );
}
