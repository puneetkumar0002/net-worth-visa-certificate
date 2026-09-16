import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, User, MapPin, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, UploadCloud, FileBadge } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'applications', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setApp({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Application not found.");
          navigate('/admin/applications');
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id, navigate]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'applications', id), {
        status: newStatus
      });
      setApp((prev: any) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/applications')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Application {app.id.substring(0, 8)}</h2>
            <p className="text-slate-500 text-sm">
              Submitted on {app.createdAt ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <select 
            value={app.status || 'new'} 
            onChange={(e) => handleUpdateStatus(e.target.value)}
            disabled={saving}
            className="border-slate-300 rounded-md text-sm shadow-sm focus:ring-[#0C6D62] focus:border-[#0C6D62]"
          >
            <option value="new">New</option>
            <option value="documents_pending">Documents Pending</option>
            <option value="under_review">Under Review (CA)</option>
            <option value="correction_required">Correction Required</option>
            <option value="completed">Completed / Ready</option>
          </select>
          <Button className="bg-[#0B1830] hover:bg-[#0B1830]/90">
            Generate Certificate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-slate-500" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Full Name</div>
                  <div className="font-medium">{app.applicantName}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Email Address</div>
                  <div className="font-medium">{app.email}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Phone Number</div>
                  <div className="font-medium">{app.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Date of Birth</div>
                  <div className="font-medium">{app.dob || 'Not provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-500" />
                Visa Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Destination Country</div>
                  <div className="font-medium">{app.country}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Visa Type</div>
                  <div className="font-medium">{app.visaType}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 mb-1">Estimated Net Worth</div>
                  <div className="font-medium text-[#0C6D62] text-lg">${(app.estimatedNetWorth || 0).toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-500" />
                Uploaded Documents
              </CardTitle>
              <Button variant="outline" size="sm">Request Documents</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {app.documents && app.documents.length > 0 ? (
                  app.documents.map((doc: any, idx: number) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-slate-400 mr-3" />
                        <div>
                          <div className="font-medium">{doc.name || 'Document'}</div>
                          <div className="text-xs text-slate-500">{doc.type || 'PDF'} • {doc.size || 'Unknown size'}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-blue-600">View</Button>
                        <Button variant="ghost" size="sm" className="text-green-600">Verify</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    <UploadCloud className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No documents uploaded yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                  app.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {app.paymentStatus || 'pending'}
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-600">Amount</span>
                <span className="font-bold text-lg">₹{(app.amount || 0).toLocaleString()}</span>
              </div>
              <Button className="w-full" variant="outline">
                View Invoice
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg">CA Assignment</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {app.assignedCA ? (
                <div>
                  <div className="text-sm text-slate-500 mb-1">Assigned To</div>
                  <div className="font-medium flex items-center">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    {app.assignedCA}
                  </div>
                  <Button variant="link" className="text-[#0C6D62] p-0 h-auto mt-4">Change Assignment</Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-500 mb-4">This application has not been assigned to a CA yet.</p>
                  <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200">
                    Assign to CA
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg flex items-center">
                <FileBadge className="w-5 h-5 mr-2 text-slate-500" />
                Certificate
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              {app.certificateUrl ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="font-medium text-green-700">Certificate Issued</div>
                  <Button variant="outline" className="w-full">Download Certificate</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="text-slate-500 text-sm">Not issued yet</div>
                  <Button className="w-full" disabled={app.status !== 'completed'}>
                    Upload Certificate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
