import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CheckCircle, AlertTriangle, FileText } from 'lucide-react';

export default function CAReview() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'applications'), where('status', '==', 'under_review'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching CA queue:", error);
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
        <h2 className="text-2xl font-bold text-slate-900">CA Review Queue</h2>
        <p className="text-slate-500 mt-1">Applications waiting for Chartered Accountant review and sign-off.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <CheckCircle className="w-12 h-12 text-green-300 mb-3" />
              <p className="font-medium text-slate-700">All caught up!</p>
              <p className="text-sm">No applications are currently waiting for CA review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">App ID</th>
                    <th className="px-6 py-4 font-medium">Applicant Details</th>
                    <th className="px-6 py-4 font-medium">Net Worth</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 font-mono">{item.id.substring(0, 8)}</div>
                        <div className="text-xs text-slate-500 mt-1">Assigned: {item.assignedCA || 'Unassigned'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.applicantName}</div>
                        <div className="text-xs text-slate-500">{item.visaType} - {item.country}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#0C6D62]">
                        ${(item.estimatedNetWorth || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <FileText className="w-4 h-4 mr-1" /> Review Docs
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600 bg-green-50">
                          Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-amber-600">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Flag
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
