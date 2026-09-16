import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { DataTable } from '../../components/ui/DataTable';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/badge';

import { LeadDetailsModal } from '../../components/admin/LeadDetailsModal';

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
  createdAt: any;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const leadsRef = collection(db, 'leads');
      const q = query(leadsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      })) as Lead[];
      
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', lead.id));
        setLeads(leads.filter(l => l.id !== lead.id));
        toast.success('Lead deleted successfully');
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const columns = [
    { 
      header: 'Name', 
      accessorKey: 'name' as keyof Lead,
      cell: (item: Lead) => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-500">{item.email}</div>
        </div>
      )
    },
    { 
      header: 'Country', 
      accessorKey: 'country' as keyof Lead 
    },
    { 
      header: 'Visa Type', 
      accessorKey: 'visaType' as keyof Lead 
    },
    { 
      header: 'Status', 
      accessorKey: 'status' as keyof Lead,
      cell: (item: Lead) => (
        <Badge className={
          item.status === 'new' ? 'bg-blue-100 text-blue-800' :
          item.status === 'completed' ? 'bg-green-100 text-green-800' :
          item.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
          'bg-amber-100 text-amber-800'
        }>
          {item.status.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
    { 
      header: 'Date', 
      accessorKey: 'createdAt' as keyof Lead,
      cell: (item: Lead) => item.createdAt ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(item.createdAt) : 'N/A'
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable 
        title="Lead Management"
        description="View and manage all customer enquiries"
        data={leads}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search leads by name, email or country..."
        onView={(lead) => setSelectedLead(lead)}
        onDelete={handleDelete}
      />

      {selectedLead && (
        <LeadDetailsModal 
          lead={selectedLead} 
          isOpen={!!selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={(updatedLead) => {
            setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            setSelectedLead(updatedLead);
          }} 
        />
      )}
    </div>
  );
}
