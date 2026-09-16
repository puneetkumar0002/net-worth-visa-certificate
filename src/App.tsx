import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { Button } from './components/ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import VisaCountries from './pages/public/VisaCountries';
import PublicDocuments from './pages/public/Documents';
import About from './pages/public/About';
import NetWorthCertificate from './pages/public/NetWorthCertificate';
import GenericPage from './pages/public/GenericPage';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminApplicationDetail from './pages/admin/ApplicationDetail';
import AdminLeads from './pages/admin/Leads';
import AdminServices from './pages/admin/Services';
import AdminCountries from './pages/admin/Countries';
import AdminDocuments from './pages/admin/Documents';
import AdminCustomers from './pages/admin/Customers';
import AdminPayments from './pages/admin/Payments';
import Settings from './pages/admin/Settings';
import Pricing from './pages/admin/Pricing';
import FAQs from './pages/admin/FAQs';
import Testimonials from './pages/admin/Testimonials';
import AdminUsers from './pages/admin/AdminUsers';
import WebsiteContent from './pages/admin/WebsiteContent';
import CAReview from './pages/admin/CAReview';
import Certificates from './pages/admin/Certificates';
import Support from './pages/admin/Support';
import Blog from './pages/admin/Blog';
import SEO from './pages/admin/SEO';
import ActivityLogs from './pages/admin/ActivityLogs';
import GenericAdminPage from './pages/admin/GenericAdminPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#0C6D62] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Verifying admin access...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/admin/login" replace />;
  
  if (user && !isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            You do not have permission to access the admin panel. Your account is not an active administrator.
          </p>
          <Button 
            onClick={() => signOut()}
            className="w-full bg-[#0B1830] hover:bg-[#0B1830]/90 h-12"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="visa-countries" element={<VisaCountries />} />
        <Route path="documents" element={<PublicDocuments />} />
        <Route path="about" element={<About />} />
        <Route path="net-worth-certificate" element={<NetWorthCertificate />} />
        <Route path="property-valuation" element={<GenericPage title="Property Valuation" description="Professional valuation of residential, commercial, agricultural and ancestral property." />} />
        <Route path="investment-valuation" element={<GenericPage title="Investment Valuation" description="Certification and valuation of mutual funds, shares, demat holdings, PPF, bonds and other investments." />} />
        <Route path="privacy-policy" element={<GenericPage title="Privacy Policy" description="Your privacy is critically important to us. This privacy policy explains how we collect, use, and protect your personal information." />} />
        <Route path="terms" element={<GenericPage title="Terms & Conditions" description="These terms and conditions outline the rules and regulations for the use of our services and website." />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Core Operations */}
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:id" element={<AdminApplicationDetail />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="ca-review" element={<CAReview />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="support" element={<Support />} />
        
        {/* Website CMS */}
        <Route path="content" element={<WebsiteContent />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="countries" element={<AdminCountries />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="faqs" element={<FAQs />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blog" element={<Blog />} />
        <Route path="seo" element={<SEO />} />
        
        {/* Settings & System */}
        <Route path="admin-users" element={<AdminUsers />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="settings" element={<Settings />} />
        
        <Route path="*" element={<GenericAdminPage title="Not Found" description="The requested admin page does not exist." />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <SiteSettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}
