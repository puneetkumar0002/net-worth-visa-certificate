import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Eye, Edit, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: string;
  applicantName: string;
  phone: string;
  email: string;
  country: string;
  visaType: string;
  estimatedNetWorth: number;
  status: string;
  paymentStatus: string;
  createdAt: any;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const appsRef = collection(db, 'applications');
        const q = query(appsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const apps = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            applicantName: data.applicantName || 'Unknown',
            phone: data.phone || '-',
            email: data.email || '-',
            country: data.country || '-',
            visaType: data.visaType || '-',
            estimatedNetWorth: data.estimatedNetWorth || 0,
            status: data.status || 'new',
            paymentStatus: data.paymentStatus || 'pending',
            createdAt: data.createdAt,
          };
        });
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'documents_pending': return 'bg-amber-100 text-amber-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium';
      case 'failed': return 'text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium';
      default: return 'text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs font-medium';
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
          <p className="text-slate-500 mt-1">Manage and track all customer applications.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Application ID / Date</th>
                    <th className="px-6 py-4 font-medium">Applicant Details</th>
                    <th className="px-6 py-4 font-medium">Visa & Net Worth</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Payment</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 font-mono">{app.id.substring(0, 8)}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {app.createdAt ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{app.applicantName}</div>
                        <div className="text-slate-500 text-xs mt-1">{app.email}</div>
                        <div className="text-slate-500 text-xs">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{app.country} ({app.visaType})</div>
                        <div className="text-slate-500 mt-1">Est. ${app.estimatedNetWorth.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPaymentStatusColor(app.paymentStatus)}>
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/admin/applications/${app.id}`)}
                          className="text-[#0C6D62] hover:text-[#0C6D62] hover:bg-[#0C6D62]/10"
                        >
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
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
