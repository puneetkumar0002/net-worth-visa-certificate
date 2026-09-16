import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { FileBadge, Download, Mail } from 'lucide-react';

export default function Certificates() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, 'certificates'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
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
        <h2 className="text-2xl font-bold text-slate-900">Issued Certificates</h2>
        <p className="text-slate-500 mt-1">Manage and download finalized Net Worth Certificates.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center">
              <FileBadge className="w-12 h-12 text-slate-300 mb-3" />
              No certificates have been issued yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Certificate ID</th>
                    <th className="px-6 py-4 font-medium">Applicant</th>
                    <th className="px-6 py-4 font-medium">Issue Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 font-mono">{item.certId || item.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{item.applicantName}</div>
                        <div className="text-xs text-slate-500 font-mono">App: {item.applicationId}</div>
                      </td>
                      <td className="px-6 py-4">
                        {item.issueDate ? new Date(item.issueDate.toDate()).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-[#0C6D62]">
                          <Download className="w-4 h-4 mr-1" /> Download
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Mail className="w-4 h-4 mr-1" /> Resend
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
