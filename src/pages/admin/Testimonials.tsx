import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  review: string;
  photoUrl: string;
  status: 'active' | 'inactive';
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'testimonials'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setItems(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    try {
      const newItem = {
        name: 'John Doe',
        city: 'Mumbai',
        country: 'India',
        rating: 5,
        review: 'Excellent service!',
        photoUrl: '',
        status: 'active'
      };
      const docRef = await addDoc(collection(db, 'testimonials'), newItem);
      setItems([{ id: docRef.id, ...newItem } as Testimonial, ...items]);
      setIsEditing(docRef.id);
      setEditForm(newItem);
    } catch (error) {
      toast.error('Failed to create testimonial');
    }
  };

  const handleSave = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), editForm);
      toast.success('Changes saved successfully.');
      setItems(items.map(p => p.id === id ? { ...p, ...editForm } as Testimonial : p));
      setIsEditing(null);
    } catch (error) {
      toast.error('Unable to save changes. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        setItems(items.filter(p => p.id !== id));
        toast.success('Testimonial deleted.');
      } catch (error) {
        toast.error('Failed to delete testimonial.');
      }
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
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Testimonials</h2>
          <p className="text-slate-500 mt-1">Manage customer reviews and feedback.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            No testimonials found. Click "Add Testimonial" to create one.
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                {isEditing === item.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Customer Name</label>
                      <Input 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating (1-5)</label>
                      <Input 
                        type="number"
                        min="1" max="5"
                        value={editForm.rating || 5} 
                        onChange={e => setEditForm({...editForm, rating: Number(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        value={editForm.city || ''} 
                        onChange={e => setEditForm({...editForm, city: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input 
                        value={editForm.country || ''} 
                        onChange={e => setEditForm({...editForm, country: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Photo URL</label>
                      <Input 
                        value={editForm.photoUrl || ''} 
                        onChange={e => setEditForm({...editForm, photoUrl: e.target.value})} 
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Review</label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editForm.review || ''} 
                        onChange={e => setEditForm({...editForm, review: e.target.value})} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 pt-4">
                      <label className="flex items-center space-x-2">
                        <select 
                          value={editForm.status || 'active'}
                          onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-sm border-slate-300 rounded"
                        >
                          <option value="active">Published</option>
                          <option value="inactive">Hidden</option>
                        </select>
                      </label>
                    </div>
                    <div className="flex items-end justify-end space-x-2 pt-4">
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>Cancel</Button>
                      <Button size="sm" onClick={() => handleSave(item.id)} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                          {item.photoUrl ? (
                            <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-medium text-slate-400">{item.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.city}, {item.country}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setEditForm(item);
                          setIsEditing(item.id);
                        }}>
                          <Edit2 className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm italic mb-4 line-clamp-3 leading-relaxed">"{item.review}"</p>
                    <div className="mt-auto">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {item.status === 'active' ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
