import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, Users, Settings, FileText, Globe, MessageSquare, LogOut, FileBadge, 
  LayoutDashboard, Database, Image, UserCircle, Briefcase, FileCheck, Info,
  Search, Bell, ChevronDown, ChevronRight, Activity, DollarSign, ListOrdered, UserCog, Mail
} from 'lucide-react';
import { Button } from '../ui/button';
import clsx from 'clsx';

export default function AdminLayout() {
  const { signOut, user, adminData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [contentOpen, setContentOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isCurrent = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const mainNav = [
    { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { name: 'Applications', icon: FileText, path: '/admin/applications' },
    { name: 'Documents', icon: FileCheck, path: '/admin/documents' },
    { name: 'Customers', icon: Users, path: '/admin/customers' },
    { name: 'CA Review', icon: FileBadge, path: '/admin/ca-review' },
    { name: 'Certificates', icon: Image, path: '/admin/certificates' },
    { name: 'Payments', icon: DollarSign, path: '/admin/payments' },
    { name: 'Leads', icon: UserCircle, path: '/admin/leads' },
    { name: 'Support', icon: MessageSquare, path: '/admin/support' },
  ];

  const contentNav = [
    { name: 'Website Content', path: '/admin/content' },
    { name: 'Services', path: '/admin/services' },
    { name: 'Countries', path: '/admin/countries' },
    { name: 'Pricing', path: '/admin/pricing' },
    { name: 'FAQs', path: '/admin/faqs' },
    { name: 'Testimonials', path: '/admin/testimonials' },
    { name: 'Blog', path: '/admin/blog' },
    { name: 'SEO', path: '/admin/seo' },
  ];

  const otherNav = [
    { name: 'Admins & Roles', icon: UserCog, path: '/admin/admin-users' },
    { name: 'Activity Logs', icon: Activity, path: '/admin/activity-logs' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-[#F5F8FB] text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1830] text-slate-300 flex flex-col fixed inset-y-0 z-20 shadow-xl overflow-y-auto">
        <div className="h-16 flex items-center px-4 bg-[#081224] text-white font-bold text-sm border-b border-white/10 sticky top-0 z-10 shrink-0">
          Networth Certificate Visa
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-6">
          {/* Main Section */}
          <div className="space-y-1">
            {mainNav.map((item) => {
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={clsx(
                    "flex items-center px-3 py-2 rounded-md transition-colors text-sm font-medium",
                    active ? "bg-[#0C6D62] text-white" : "hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className={clsx("w-5 h-5 mr-3", active ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Content Section */}
          <div>
            <button 
              onClick={() => setContentOpen(!contentOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <div className="flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                CMS Content
              </div>
              {contentOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {contentOpen && (
              <div className="mt-2 space-y-1 pl-4 border-l border-white/10 ml-5">
                {contentNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={clsx(
                      "flex items-center px-3 py-2 rounded-md transition-colors text-sm",
                      isCurrent(item.path) ? "bg-white/10 text-white font-medium" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other Section */}
          <div className="space-y-1 pt-4 border-t border-white/10">
            {otherNav.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  "flex items-center px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isCurrent(item.path) ? "bg-[#0C6D62] text-white" : "hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={clsx("w-5 h-5 mr-3", isCurrent(item.path) ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#081224] shrink-0 sticky bottom-0">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#0C6D62] flex items-center justify-center text-white font-bold text-sm mr-3 shrink-0">
              {adminData?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm text-white font-medium truncate">{adminData?.name || 'Administrator'}</div>
              <div className="text-xs text-slate-400 capitalize">{adminData?.role?.replace('_', ' ') || 'Admin'}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
          <div className="flex items-center text-slate-500 font-medium">
            {mainNav.find(n => isCurrent(n.path))?.name || 
             contentNav.find(n => isCurrent(n.path))?.name ||
             otherNav.find(n => isCurrent(n.path))?.name || 
             'Admin Dashboard'}
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search app ID, name, email..." 
                className="pl-9 pr-4 py-2 border rounded-full text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0C6D62] w-72 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-[#0B1830] font-bold text-xs shrink-0 cursor-pointer">
              {adminData?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
