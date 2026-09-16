import React from 'react';
import { X, Phone, Mail, MessageSquare, Calendar, Globe, FileText, Landmark, FileBadge, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  visaType: string;
  certificateType: string;
  status: string;
  propertyValue?: string;
  bankValue?: string;
  fdValue?: string;
  investmentValue?: string;
  goldValue?: string;
  businessValue?: string;
  otherAssets?: string;
  liabilities?: string;
  preferredContact?: string;
  message?: string;
  createdAt: Date;
}

interface LeadDetailsModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => void;
}

export function LeadDetailsModal({ lead, isOpen, onClose, onUpdate }: LeadDetailsModalProps) {
  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: string) => {
    try {
      const leadRef = doc(db, 'leads', lead.id);
      await updateDoc(leadRef, { status: newStatus });
      onUpdate({ ...lead, status: newStatus });
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const statusOptions = [
    'new', 'contacted', 'follow_up', 'documents_pending', 'documents_received', 
    'under_review', 'certificate_preparing', 'certificate_prepared', 
    'completed', 'cancelled', 'not_interested'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
              <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(lead.createdAt)}</span>
              <Badge className={
                lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                lead.status === 'completed' ? 'bg-green-100 text-green-800' :
                lead.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                'bg-amber-100 text-amber-800'
              }>
                {lead.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Contact & Visa Info */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <a href={`tel:${lead.phone}`} className="flex items-center text-sm text-slate-700 hover:text-[#0C6D62] transition-colors group">
                    <Phone className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#0C6D62]" /> {lead.phone}
                  </a>
                  <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-slate-700 hover:text-green-600 transition-colors group">
                    <MessageSquare className="w-4 h-4 mr-3 text-slate-400 group-hover:text-green-600" /> WhatsApp
                  </a>
                  <a href={`mailto:${lead.email}`} className="flex items-center text-sm text-slate-700 hover:text-blue-600 transition-colors group">
                    <Mail className="w-4 h-4 mr-3 text-slate-400 group-hover:text-blue-600" /> {lead.email}
                  </a>
                  <div className="flex items-center text-sm text-slate-700 pt-2 border-t mt-2">
                    <span className="text-slate-500 mr-2">Prefers:</span> 
                    <span className="capitalize font-medium">{lead.preferredContact || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Visa Requirements</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <Globe className="w-4 h-4 mr-3 text-slate-400" /> 
                    <span className="text-slate-500 mr-2">Country:</span> 
                    <span className="font-semibold">{lead.country}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <FileBadge className="w-4 h-4 mr-3 text-slate-400" /> 
                    <span className="text-slate-500 mr-2">Visa:</span> 
                    <span className="font-semibold">{lead.visaType}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <FileText className="w-4 h-4 mr-3 text-slate-400" /> 
                    <span className="text-slate-500 mr-2">Cert Type:</span> 
                    <span className="font-semibold">{lead.certificateType}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Update Status</h3>
                <select 
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C6D62]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Assets & Message */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                  <Landmark className="w-4 h-4 mr-2 text-[#0C6D62]" /> Financial Assets Declared
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Property Value</div>
                    <div className="font-semibold text-slate-800">{lead.propertyValue || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Bank Balance</div>
                    <div className="font-semibold text-slate-800">{lead.bankValue || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Fixed Deposits</div>
                    <div className="font-semibold text-slate-800">{lead.fdValue || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Investments</div>
                    <div className="font-semibold text-slate-800">{lead.investmentValue || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Gold Assets</div>
                    <div className="font-semibold text-slate-800">{lead.goldValue || 'Not specified'}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Business Assets</div>
                    <div className="font-semibold text-slate-800">{lead.businessValue || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Other Assets</div>
                    <div className="font-semibold text-slate-800">{lead.otherAssets || 'Not specified'}</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <div className="text-xs text-red-500 mb-1">Liabilities / Loans</div>
                    <div className="font-semibold text-red-800">{lead.liabilities || 'Not specified'}</div>
                  </div>
                </div>
              </div>

              {lead.message && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-[#0C6D62]" /> Additional Message
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {lead.message}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
            <Button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold">
              <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp Lead
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
