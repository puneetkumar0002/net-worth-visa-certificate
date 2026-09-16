import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export default function Customers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'customers'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <p className="text-slate-500 mt-1">Manage customer profiles and history.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Applications</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{item.email}</div>
                        <div className="text-slate-500 text-xs">{item.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.applications || 0}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full capitalize">
                          {item.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
