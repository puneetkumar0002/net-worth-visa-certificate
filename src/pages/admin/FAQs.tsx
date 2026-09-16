import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: 'active' | 'inactive';
}

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FAQ>>({});

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    try {
      const newItem = {
        question: 'New Question',
        answer: 'Answer goes here',
        category: 'General',
        order: faqs.length,
        status: 'active'
      };
      const docRef = await addDoc(collection(db, 'faqs'), newItem);
      setFaqs([...faqs, { id: docRef.id, ...newItem } as FAQ]);
      setIsEditing(docRef.id);
      setEditForm(newItem);
    } catch (error) {
      toast.error('Failed to create FAQ');
    }
  };

  const handleSave = async (id: string) => {
    try {
      await updateDoc(doc(db, 'faqs', id), editForm);
      toast.success('Changes saved successfully.');
      setFaqs(faqs.map(p => p.id === id ? { ...p, ...editForm } as FAQ : p));
      setIsEditing(null);
    } catch (error) {
      toast.error('Unable to save changes. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteDoc(doc(db, 'faqs', id));
        setFaqs(faqs.filter(p => p.id !== id));
        toast.success('FAQ deleted.');
      } catch (error) {
        toast.error('Failed to delete FAQ.');
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
          <h2 className="text-2xl font-bold text-slate-900">FAQs</h2>
          <p className="text-slate-500 mt-1">Manage frequently asked questions.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            No FAQs found. Click "Add FAQ" to create one.
          </div>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                {isEditing === faq.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Question</label>
                      <Input 
                        value={editForm.question || ''} 
                        onChange={e => setEditForm({...editForm, question: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Answer</label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editForm.answer || ''} 
                        onChange={e => setEditForm({...editForm, answer: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input 
                        value={editForm.category || ''} 
                        onChange={e => setEditForm({...editForm, category: e.target.value})} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4 pt-6">
                      <label className="flex items-center space-x-2">
                        <select 
                          value={editForm.status || 'active'}
                          onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-sm border-slate-300 rounded"
                        >
                          <option value="active">Published</option>
                          <option value="inactive">Draft (Hidden)</option>
                        </select>
                      </label>
                    </div>
                    <div className="md:col-span-2 flex items-end justify-end space-x-2">
                      <Button variant="ghost" onClick={() => setIsEditing(null)}>Cancel</Button>
                      <Button onClick={() => handleSave(faq.id)} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${faq.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {faq.status === 'active' ? 'Published' : 'Hidden'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-full">{faq.category}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{faq.question}</h3>
                      <p className="text-slate-600 text-sm">{faq.answer}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditForm(faq);
                        setIsEditing(faq.id);
                      }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
