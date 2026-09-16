import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Users, FileText, FileCheck, FileBadge, Image, DollarSign, 
  ArrowUpRight, AlertCircle, Clock, UserX, AlertTriangle, FileWarning, CheckCircle
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, getCountFromServer, where } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    newApplications: 0,
    documentsPending: 0,
    underVerification: 0,
    caReviewPending: 0,
    certificatesReady: 0,
    completedApplications: 0,
    paymentPending: 0,
    totalRevenue: 0,
    newLeads: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would query these stats from Firestore
    // For now, we simulate loading the dashboard stats to structure the UI properly
    const timer = setTimeout(() => {
      setStats({
        totalApplications: 248,
        newApplications: 12,
        documentsPending: 34,
        underVerification: 18,
        caReviewPending: 7,
        certificatesReady: 5,
        completedApplications: 152,
        paymentPending: 14,
        totalRevenue: 45200,
        newLeads: 28
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const statCards = [
    { title: "Total Applications", value: stats.totalApplications, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "New Applications", value: stats.newApplications, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Documents Pending", value: stats.documentsPending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { title: "Under Verification", value: stats.underVerification, icon: FileCheck, color: "text-cyan-500", bg: "bg-cyan-50" },
    { title: "CA Review Pending", value: stats.caReviewPending, icon: FileBadge, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Certificates Ready", value: stats.certificatesReady, icon: Image, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Completed", value: stats.completedApplications, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { title: "Payment Pending", value: stats.paymentPending, icon: DollarSign, color: "text-orange-500", bg: "bg-orange-50" },
    { title: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "New Leads", value: stats.newLeads, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  const needsAttention = [
    { title: "Applications waiting for documents", count: 12, icon: FileWarning, priority: "high" },
    { title: "Unassigned applications", count: 5, icon: UserX, priority: "medium" },
    { title: "Documents awaiting verification", count: 18, icon: Clock, priority: "high" },
    { title: "Failed payments", count: 3, icon: AlertTriangle, priority: "high" },
    { title: "Certificates ready to issue", count: 5, icon: FileBadge, priority: "medium" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back. Here's what's happening with your applications today.</p>
      </div>

      {/* Needs Attention Section */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-red-900">Needs Attention</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {needsAttention.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex flex-col cursor-pointer hover:border-red-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${item.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-xl font-bold text-slate-900">{item.count}</span>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-tight mt-auto">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
