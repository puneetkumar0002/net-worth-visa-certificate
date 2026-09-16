import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { DataTable } from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  order: number;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm(`Are you sure you want to delete ${service.title}?`)) {
      try {
        await deleteDoc(doc(db, 'services', service.id));
        setServices(services.filter(s => s.id !== service.id));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error('Failed to delete service');
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      shortDescription: formData.get('shortDescription'),
      status: formData.get('status'),
      order: Number(formData.get('order')),
      updatedAt: serverTimestamp(),
    };

    try {
      if (isEditing) {
        await updateDoc(doc(db, 'services', isEditing.id), data);
        setServices(services.map(s => s.id === isEditing.id ? { ...s, ...data } as Service : s));
        toast.success('Service updated');
      } else {
        const docRef = await addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp() });
        setServices([...services, { id: docRef.id, ...data } as Service]);
        toast.success('Service created');
      }
      setIsEditing(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error('Failed to save service');
    }
  };

  if (isAdding || isEditing) {
    const item = isEditing || {} as Partial<Service>;
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-[#0B1830] mb-6">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Title</label>
              <Input name="title" defaultValue={item.title} required placeholder="e.g. Net Worth Certificate" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL Slug</label>
              <Input name="slug" defaultValue={item.slug} required placeholder="e.g. net-worth-certificate" />
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
            <Button type="submit" className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save Service</Button>
            <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setIsEditing(null); }}>Cancel</Button>
          </div>
        </form>
      </div>
    );
  }

  const columns = [
    { header: 'Title', accessorKey: 'title' as keyof Service },
    { header: 'Slug', accessorKey: 'slug' as keyof Service },
    { header: 'Order', accessorKey: 'order' as keyof Service },
    { 
      header: 'Status', 
      accessorKey: 'status' as keyof Service,
      cell: (item: Service) => (
        <Badge className={item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
          {item.status.toUpperCase()}
        </Badge>
      )
    },
  ];

  return (
    <DataTable 
      title="Services Management"
      description="Manage the services offered by the firm"
      data={services}
      columns={columns}
      loading={loading}
      onAdd={() => setIsAdding(true)}
      onEdit={setIsEditing}
      onDelete={handleDelete}
      searchPlaceholder="Search services..."
    />
  );
}
