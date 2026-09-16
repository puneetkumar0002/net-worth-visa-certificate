import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: any;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'adminUsers'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      setUsers(data);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async () => {
    try {
      const newItem = {
        email: 'newadmin@example.com',
        name: 'New Admin',
        role: 'admin',
        status: 'active',
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'adminUsers'), newItem);
      setUsers([...users, { id: docRef.id, ...newItem } as AdminUser]);
      setIsEditing(docRef.id);
      setEditForm(newItem);
    } catch (error) {
      toast.error('Failed to create admin user');
    }
  };

  const handleSave = async (id: string) => {
    try {
      await updateDoc(doc(db, 'adminUsers', id), editForm);
      toast.success('Changes saved successfully.');
      setUsers(users.map(p => p.id === id ? { ...p, ...editForm } as AdminUser : p));
      setIsEditing(null);
    } catch (error) {
      toast.error('Unable to save changes. Please try again.');
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'super_admin') {
      toast.error('Cannot delete a super admin.');
      return;
    }
    
    if (window.confirm("Are you sure you want to remove this admin access?")) {
      try {
        await deleteDoc(doc(db, 'adminUsers', id));
        setUsers(users.filter(p => p.id !== id));
        toast.success('Admin user removed.');
      } catch (error) {
        toast.error('Failed to remove admin user.');
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
          <h2 className="text-2xl font-bold text-slate-900">Admins & Roles</h2>
          <p className="text-slate-500 mt-1">Manage internal staff accounts and portal access.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-[#0B1830] hover:bg-[#0B1830]/90">
          <Plus className="w-4 h-4 mr-2" /> Add Admin
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {isEditing === user.id ? (
                        <div className="space-y-2">
                          <Input 
                            value={editForm.name || ''} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                            placeholder="Full Name"
                          />
                          <Input 
                            value={editForm.email || ''} 
                            onChange={e => setEditForm({...editForm, email: e.target.value})} 
                            placeholder="Email Address"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'super_admin' ? 'bg-[#0B1830] text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {user.role === 'super_admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name}</div>
                            <div className="text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing === user.id ? (
                        <select 
                          value={editForm.role || 'admin'}
                          onChange={e => setEditForm({...editForm, role: e.target.value})}
                          className="text-sm border-slate-300 rounded w-full"
                          disabled={user.role === 'super_admin'}
                        >
                          <option value="super_admin" disabled>Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="ca_reviewer">CA Reviewer</option>
                          <option value="support">Support</option>
                          <option value="accounts">Accounts</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === 'super_admin' ? 'bg-[#0B1830] text-white' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing === user.id ? (
                        <select 
                          value={editForm.status || 'active'}
                          onChange={e => setEditForm({...editForm, status: e.target.value as 'active' | 'inactive'})}
                          className="text-sm border-slate-300 rounded"
                          disabled={user.role === 'super_admin'}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setIsEditing(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => handleSave(user.id)} className="bg-[#0C6D62] hover:bg-[#0C6D62]/90">Save</Button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditForm(user);
                            setIsEditing(user.id);
                          }}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {user.role !== 'super_admin' && (
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.id, user.role)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
