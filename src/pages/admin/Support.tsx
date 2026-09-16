import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { MessageSquare, Reply } from 'lucide-react';

export default function Support() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
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
        <h2 className="text-2xl font-bold text-slate-900">Support Tickets</h2>
        <p className="text-slate-500 mt-1">Manage customer inquiries and support requests.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              No support tickets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Ticket ID / Date</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 font-mono">{item.id.substring(0, 8)}</div>
                        <div className="text-xs text-slate-500">
                          {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.customerName}</div>
                        <div className="text-xs text-slate-500">{item.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.subject}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{item.message}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          item.status === 'open' ? 'bg-red-100 text-red-800' : 
                          item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status || 'Open'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Reply className="w-4 h-4 mr-1" /> Reply
                        </Button>
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
