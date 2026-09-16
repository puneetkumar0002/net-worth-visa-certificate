import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  tax: string;
  description: string;
  popular: boolean;
  order: number;
  status: 'active' | 'inactive';
}

export default function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingPackage>>({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const q = query(collection(db, 'pricing'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const pkgData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingPackage));
      setPackages(pkgData);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    try {
      const newPkg = {
        name: 'New Package',
        price: 0,
        tax: '+ 18% GST',
        description: 'Package description',
        popular: false,
        order: packages.length,
        status: 'active'
      };
      const docRef = await addDoc(collection(db, 'pricing'), newPkg);
      setPackages([...packages, { id: docRef.id, ...newPkg } as PricingPackage]);
      setIsEditing(docRef.id);
      setEditForm(newPkg);
    } catch (error) {
      toast.error('Failed to create package');
    }
  };

  const handleSave = async (id: string) => {
    try {
      await updateDoc(doc(db, 'pricing', id), editForm);
      toast.success('Changes saved successfully.');
      setPackages(packages.map(p => p.id === id ? { ...p, ...editForm } as PricingPackage : p));
      setIsEditing(null);
    } catch (error) {
      toast.error('Unable to save changes. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deleteDoc(doc(db, 'pricing', id));
        setPackages(packages.filter(p => p.id !== id));
        toast.success('Package deleted.');
      } catch (error) {
        toast.error('Failed to delete package.');
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
          <h2 className="text-2xl font-bold text-slate-900">Pricing Packages</h2>
          <p className="text-slate-500 mt-1">Manage public pricing tiers and packages.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Package
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {packages.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            No pricing packages found. Click "Add Package" to create one.
          </div>
        ) : (
          packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardContent className="p-6">
                {isEditing === pkg.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Package Name</label>
                      <Input 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({...editForm, name: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price (₹)</label>
                      <Input 
                        type="number"
                        value={editForm.price || 0} 
                        onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tax Info</label>
                      <Input 
                        value={editForm.tax || ''} 
                        onChange={e => setEditForm({...editForm, tax: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input 
                        value={editForm.description || ''} 
                        onChange={e => setEditForm({...editForm, description: e.target.value})} 
                      />
                    </div>
                    <div className="flex items-center space-x-4 pt-6">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={editForm.popular || false}
                          onChange={e => setEditForm({...editForm, popular: e.target.checked})}
                          className="rounded text-[#0C6D62]"
                        />
                        <span className="text-sm">Popular Badge</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <select 
                          value={editForm.status || 'active'}
                          onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-sm border-slate-300 rounded"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </label>
                    </div>
                    <div className="flex items-end justify-end space-x-2">
                      <Button variant="ghost" onClick={() => setIsEditing(null)}>Cancel</Button>
                      <Button onClick={() => handleSave(pkg.id)} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                        {pkg.popular && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Popular</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {pkg.status}
                        </span>
                      </div>
                      <div className="text-[#0C6D62] font-semibold text-xl mb-1">
                        ₹{pkg.price.toLocaleString()} <span className="text-sm text-slate-500 font-normal">{pkg.tax}</span>
                      </div>
                      <p className="text-slate-600 text-sm">{pkg.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditForm(pkg);
                        setIsEditing(pkg.id);
                      }}>
                        <Edit2 className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(pkg.id)}>
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
