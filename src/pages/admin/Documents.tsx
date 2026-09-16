import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function Documents() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // In a real app this would query a documents collection or documents subcollections
      const q = query(collection(db, 'documents'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
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
        <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
        <p className="text-slate-500 mt-1">Review, verify, or reject uploaded documents.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <FileText className="w-12 h-12 text-slate-300 mb-3" />
              No documents available for review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Document</th>
                    <th className="px-6 py-4 font-medium">Applicant / App ID</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{item.type || 'Identity Proof'}</div>
                            <div className="text-xs text-slate-500">{item.name || 'document.pdf'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.applicantName || 'John Doe'}</div>
                        <div className="text-xs text-slate-500 font-mono">{item.applicationId || 'APP-1234'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full capitalize`}>
                          {item.status || 'Pending Verification'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" /> Verify
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle className="w-4 h-4 mr-1" /> Reject
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
