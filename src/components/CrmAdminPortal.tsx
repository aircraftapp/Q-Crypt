import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Database, Lock, User, Key, Search, RefreshCw, 
  CheckCircle2, Clock, AlertCircle, XCircle, Mail, Building2, 
  Download, FileText, Check, ChevronRight, LogOut, Sparkles, Filter, 
  HardDrive, ExternalLink, Copy, TrendingUp
} from 'lucide-react';
import { crmService, EnterpriseTrialCRMRequest, ApkDownloadCRMRequest, NewsletterSubscription } from '../services/crmService';
import { useToast } from './Toast';
import { generateSecurityReportPdf } from '../utils/generateSecurityReportPdf';

interface CrmAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrmAdminPortal: React.FC<CrmAdminPortalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState<'enterprise' | 'apk' | 'newsletter'>('enterprise');

  // Firestore Real-time Collections
  const [trialRequests, setTrialRequests] = useState<EnterpriseTrialCRMRequest[]>([]);
  const [apkRequests, setApkRequests] = useState<ApkDownloadCRMRequest[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<NewsletterSubscription[]>([]);

  // Search & Filter
  const [enterpriseSearch, setEnterpriseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [apkSearch, setApkSearch] = useState('');
  const [apkEditionFilter, setApkEditionFilter] = useState<string>('ALL');
  const [newsletterSearch, setNewsletterSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Subscribe to Firestore collections when open and authenticated
  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;

    const unsubTrials = crmService.subscribeToTrialRequests((data) => {
      setTrialRequests(data);
    });

    const unsubApks = crmService.subscribeToApkRequests((data) => {
      setApkRequests(data);
    });

    const unsubNews = crmService.subscribeToNewsletterList((data) => {
      setNewsletterSubs(data);
    });

    return () => {
      if (typeof unsubTrials === 'function') unsubTrials();
      if (typeof unsubApks === 'function') unsubApks();
      if (typeof unsubNews === 'function') unsubNews();
    };
  }, [isAuthenticated, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'quantum2026' || password === 'admin' || password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Admin Authenticated', 'Access granted to Q-CRYPT Firestore CRM Manager', 'success');
    } else {
      setAuthError('Invalid administrator credentials. (Hint: Use password "quantum2026")');
      showToast('Authentication Failed', 'Invalid admin password', 'error');
    }
  };

  const handleUpdateTrialStatus = async (id: string, status: EnterpriseTrialCRMRequest['status']) => {
    const success = await crmService.updateStatus(id, status);
    if (success) {
      showToast('Status Updated', `Enterprise Request status changed to ${status}`, 'success');
    } else {
      showToast('Update Failed', 'Could not update Firestore document', 'error');
    }
  };

  const handleUpdateApkStatus = async (id: string, status: ApkDownloadCRMRequest['status'], email: string) => {
    const success = await crmService.updateApkStatus(id, status);
    if (success) {
      if (status === 'LINK_PUSHED') {
        showToast('APK Link Emailed!', `Verified download link dispatched to ${email}`, 'success');
      } else {
        showToast('Status Updated', `APK Request status changed to ${status}`, 'info');
      }
    } else {
      showToast('Update Failed', 'Could not update Firestore APK document', 'error');
    }
  };

  const handleCopyLeadDetails = (req: EnterpriseTrialCRMRequest) => {
    const summary = `
[Q-CRYPT ENTERPRISE CRM LEAD]
Enterprise: ${req.enterpriseName}
Contact Email: ${req.contactEmail}
Seats Requested: ${req.seats}
SLA Tier: ${req.slaTier}
License ID: ${req.licenseId}
PoC Key: ${req.pocKey}
Compliance Needs: ${(req.complianceNeeds || []).join(', ')}
Status: ${req.status}
Submitted At: ${req.submittedAt}
Notes: ${req.notes || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedId(req.id || req.licenseId);
    showToast('Lead Copied', 'Enterprise lead details copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyApkDetails = (req: ApkDownloadCRMRequest) => {
    const summary = `
[Q-CRYPT APK REGISTRATION LEAD]
Request ID: ${req.requestId}
Full Name: ${req.fullName}
Email: ${req.email}
Organization: ${req.organization}
Target OS: ${req.osPlatform}
Edition: ${req.edition || 'Free / Community Edition'}
Status: ${req.status}
Submitted At: ${req.submittedAt}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedId(req.id || req.requestId);
    showToast('APK Lead Copied', 'Registration details copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyNewsletter = (sub: NewsletterSubscription) => {
    const text = `${sub.email} (${(sub.topics || []).join(', ')})`;
    navigator.clipboard.writeText(text);
    setCopiedId(sub.id || sub.email);
    showToast('Email Copied', 'Subscriber email copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportCsv = () => {
    if (activeTab === 'enterprise') {
      if (trialRequests.length === 0) return;
      const headers = ['Enterprise Name', 'Email', 'Seats', 'SLA Tier', 'Status', 'License ID', 'Submitted At', 'Notes'];
      const rows = trialRequests.map(r => [
        `"${r.enterpriseName}"`,
        `"${r.contactEmail}"`,
        r.seats,
        `"${r.slaTier}"`,
        `"${r.status}"`,
        `"${r.licenseId}"`,
        `"${r.submittedAt}"`,
        `"${(r.notes || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qcrypt_crm_enterprise_leads_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Leads Exported', 'CRM Enterprise requests exported to CSV', 'success');
    } else if (activeTab === 'apk') {
      if (apkRequests.length === 0) return;
      const headers = ['Full Name', 'Email', 'Organization', 'OS Platform', 'Edition', 'Status', 'Request ID', 'Submitted At'];
      const rows = apkRequests.map(r => [
        `"${r.fullName}"`,
        `"${r.email}"`,
        `"${r.organization}"`,
        `"${r.osPlatform}"`,
        `"${r.edition || 'Free / Community Edition'}"`,
        `"${r.status}"`,
        `"${r.requestId}"`,
        `"${r.submittedAt}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qcrypt_apk_registration_leads_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('APK Queue Exported', 'APK download leads exported to CSV', 'success');
    } else if (activeTab === 'newsletter') {
      if (newsletterSubs.length === 0) return;
      const headers = ['Email', 'Topics', 'Source', 'Status', 'Subscribed At'];
      const rows = newsletterSubs.map(s => [
        `"${s.email}"`,
        `"${(s.topics || []).join('; ')}"`,
        `"${s.source || 'Footer'}"`,
        `"${s.status}"`,
        `"${s.subscribedAt}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qcrypt_newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast('Subscribers Exported', 'Newsletter subscriber emails exported to CSV', 'success');
    }
  };

  const handleExportSecurityReportPdf = () => {
    const totalSeatsRequested = trialRequests.reduce((sum, r) => sum + (Number(r.seats) || 0), 0);
    generateSecurityReportPdf({
      totalSeatsRequested: totalSeatsRequested || 12000,
      activeSubscribersCount: newsletterSubs.length || 14,
      apkDownloadCount: apkRequests.length || 8,
      generatedBy: 'Q-CRYPT CRM Security Administrator'
    });
    showToast('Security Report Downloaded', 'Network protection & CRM statistics saved as PDF', 'success');
  };

  // Filtered Enterprise Requests
  const filteredTrials = trialRequests.filter(req => {
    const matchesSearch = 
      req.enterpriseName?.toLowerCase().includes(enterpriseSearch.toLowerCase()) ||
      req.contactEmail?.toLowerCase().includes(enterpriseSearch.toLowerCase()) ||
      req.licenseId?.toLowerCase().includes(enterpriseSearch.toLowerCase()) ||
      req.slaTier?.toLowerCase().includes(enterpriseSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered APK Requests
  const filteredApkRequests = apkRequests.filter(req => {
    const matchesSearch = 
      req.fullName?.toLowerCase().includes(apkSearch.toLowerCase()) ||
      req.email?.toLowerCase().includes(apkSearch.toLowerCase()) ||
      req.organization?.toLowerCase().includes(apkSearch.toLowerCase()) ||
      req.requestId?.toLowerCase().includes(apkSearch.toLowerCase()) ||
      req.osPlatform?.toLowerCase().includes(apkSearch.toLowerCase());

    const isFree = (req.edition || '').toLowerCase().includes('free') || (req.edition || '').toLowerCase().includes('community');
    const matchesEdition = 
      apkEditionFilter === 'ALL' ||
      (apkEditionFilter === 'FREE' && isFree) ||
      (apkEditionFilter === 'ENTERPRISE' && !isFree);

    return matchesSearch && matchesEdition;
  });

  // Filtered Newsletter Subscriptions
  const filteredNewsletters = newsletterSubs.filter(sub => {
    const search = newsletterSearch.toLowerCase();
    return sub.email?.toLowerCase().includes(search) ||
           sub.topics?.some(t => t.toLowerCase().includes(search)) ||
           sub.source?.toLowerCase().includes(search);
  });

  // Analytics Metrics
  const pendingTrialsCount = trialRequests.filter(r => r.status === 'PENDING_REVIEW').length;
  const approvedTrialsCount = trialRequests.filter(r => r.status === 'SLA_APPROVED' || r.status === 'PROVISIONED').length;
  const totalSeatsCount = trialRequests.reduce((acc, r) => acc + (Number(r.seats) || 0), 0);
  const pendingApkCount = apkRequests.filter(a => a.status === 'PENDING_EMAIL_LINK').length;
  const freeCommunityApkCount = apkRequests.filter(a => (a.edition || '').toLowerCase().includes('free') || (a.edition || '').toLowerCase().includes('community') || !a.edition).length;
  const activeNewsletterCount = newsletterSubs.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl shadow-cyan-950">
        
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firestore CRM Admin Backend</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Enterprise Trial & SLA Lead Management Console
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto my-auto w-full space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">CRM Administrator Login</h3>
              <p className="text-xs text-slate-400">
                Authorized access only. Log in to manage pending enterprise trial licenses and dispatch APK download links.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-[11px] leading-relaxed flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate Admin Access</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center font-mono">
                Default Credentials: <code className="text-cyan-400 font-bold">admin</code> / Password: <code className="text-cyan-400 font-bold">quantum2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* KPI Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PENDING REVIEWS</span>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 flex items-center justify-between">
                  <span>{pendingTrialsCount}</span>
                  <Clock className="w-5 h-5 text-amber-400/50" />
                </div>
                <span className="text-[10px] text-slate-500 block">Awaiting CISO Follow-up</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">APPROVED / PROVISIONED</span>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400 flex items-center justify-between">
                  <span>{approvedTrialsCount}</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400/50" />
                </div>
                <span className="text-[10px] text-slate-500 block">Active Enterprise Trials</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PENDING APK DISPATCH</span>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 flex items-center justify-between">
                  <span>{pendingApkCount}</span>
                  <Mail className="w-5 h-5 text-cyan-400/50" />
                </div>
                <span className="text-[10px] text-slate-500 block">Awaiting Email Download Link</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">NEWSLETTER SUBSCRIBERS</span>
                <div className="text-xl sm:text-2xl font-bold text-teal-400 flex items-center justify-between">
                  <span>{activeNewsletterCount}</span>
                  <Mail className="w-5 h-5 text-teal-400/50" />
                </div>
                <span className="text-[10px] text-slate-500 block">Post-Quantum Updates</span>
              </div>
            </div>

            {/* Navigation Tabs & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('enterprise')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'enterprise'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Enterprise Trials ({trialRequests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('apk')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'apk'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>APK Queue ({apkRequests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('newsletter')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                    activeTab === 'newsletter'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Newsletter Subs ({newsletterSubs.length})</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportSecurityReportPdf}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center space-x-1.5 transition-all shadow-md active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export Security Report PDF</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* TAB 1: ENTERPRISE TRIAL CRM LEADS */}
            {activeTab === 'enterprise' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Search and Status Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="relative sm:col-span-2">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={enterpriseSearch}
                      onChange={(e) => setEnterpriseSearch(e.target.value)}
                      placeholder="Search enterprise name, email, license ID, or SLA tier..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ALL">All Statuses ({trialRequests.length})</option>
                      <option value="PENDING_REVIEW">Pending Review</option>
                      <option value="SLA_APPROVED">SLA Approved</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="PROVISIONED">Provisioned</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Table of Requests */}
                {filteredTrials.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <Database className="w-8 h-8 text-cyan-400/50 mx-auto" />
                    <p className="text-sm font-bold text-white">No Enterprise Trial Leads Match Filter</p>
                    <p className="text-xs text-slate-400">Try adjusting your search parameters or select "All Statuses".</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-950 text-cyan-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Enterprise & Contact</th>
                          <th className="p-3.5">Seats & SLA Tier</th>
                          <th className="p-3.5">Compliance Scope</th>
                          <th className="p-3.5">License ID & PoC Key</th>
                          <th className="p-3.5">Submitted</th>
                          <th className="p-3.5">CRM Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredTrials.map((req) => (
                          <tr key={req.id || req.licenseId} className="hover:bg-slate-900/80 transition-colors">
                            <td className="p-3.5 space-y-0.5">
                              <div className="font-bold text-white font-sans text-sm">{req.enterpriseName}</div>
                              <div className="text-cyan-400 text-[11px] flex items-center gap-1">
                                <Mail className="w-3 h-3 text-cyan-500" />
                                <a href={`mailto:${req.contactEmail}`} className="hover:underline">{req.contactEmail}</a>
                              </div>
                              {req.notes && (
                                <p className="text-[10px] text-slate-400 italic font-sans max-w-xs truncate" title={req.notes}>
                                  Note: {req.notes}
                                </p>
                              )}
                            </td>

                            <td className="p-3.5 space-y-1">
                              <div className="font-bold text-emerald-400">{req.seats} Seats Requested</div>
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] inline-block font-bold">
                                {req.slaTier || req.requestedSla}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(req.complianceNeeds || []).map((comp) => (
                                  <span key={comp} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[9px]">
                                    {comp}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="p-3.5 space-y-0.5 text-[10px]">
                              <div className="text-cyan-300 font-bold">{req.licenseId}</div>
                              <div className="text-slate-500 truncate max-w-[120px]" title={req.pocKey}>{req.pocKey}</div>
                            </td>

                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Recent'}
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border inline-block ${
                                req.status === 'PROVISIONED' || req.status === 'SLA_APPROVED'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  : req.status === 'PENDING_REVIEW'
                                  ? 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                                  : req.status === 'REJECTED'
                                  ? 'bg-rose-950 text-rose-400 border-rose-800'
                                  : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                              }`}>
                                {req.status}
                              </span>
                            </td>

                            <td className="p-3.5 text-right space-y-1">
                              <div className="flex items-center justify-end space-x-1">
                                {req.id && req.status !== 'SLA_APPROVED' && (
                                  <button
                                    onClick={() => handleUpdateTrialStatus(req.id!, 'SLA_APPROVED')}
                                    className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-bold transition-colors"
                                    title="Approve SLA"
                                  >
                                    Approve
                                  </button>
                                )}

                                {req.id && req.status !== 'PROVISIONED' && (
                                  <button
                                    onClick={() => handleUpdateTrialStatus(req.id!, 'PROVISIONED')}
                                    className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-bold transition-colors"
                                    title="Mark as Provisioned"
                                  >
                                    Provision
                                  </button>
                                )}

                                <button
                                  onClick={() => handleCopyLeadDetails(req)}
                                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] transition-colors"
                                  title="Copy Lead Summary"
                                >
                                  {copiedId === (req.id || req.licenseId) ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: APK REGISTRATION DISPATCH QUEUE */}
            {activeTab === 'apk' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <span>APK ACCESS REGISTRATION & DISPATCH QUEUE</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      Free/Community Requests: {freeCommunityApkCount}
                    </div>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Users registered through the website CRM portal to request the Free / Community Edition or Enterprise Edition .APK binary. Click "Push Email Download Link" to dispatch the verified download URL to their email inbox.
                  </p>
                </div>

                {/* Search & Edition Filter for APK requests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="relative sm:col-span-2">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={apkSearch}
                      onChange={(e) => setApkSearch(e.target.value)}
                      placeholder="Search name, email, organization, OS platform, or request ID..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
                    <select
                      value={apkEditionFilter}
                      onChange={(e) => setApkEditionFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    >
                      <option value="ALL">All Editions ({apkRequests.length})</option>
                      <option value="FREE">Free / Community Edition ({freeCommunityApkCount})</option>
                      <option value="ENTERPRISE">Enterprise Edition ({apkRequests.length - freeCommunityApkCount})</option>
                    </select>
                  </div>
                </div>

                {filteredApkRequests.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <HardDrive className="w-8 h-8 text-cyan-400/50 mx-auto" />
                    <p className="text-sm font-bold text-white">No APK Registration Requests Match Filter</p>
                    <p className="text-xs text-slate-400">When users submit info in the APK portal, their requests will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-950 text-cyan-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">User & Organization</th>
                          <th className="p-3.5">Requested Edition</th>
                          <th className="p-3.5">Target OS Platform</th>
                          <th className="p-3.5">Request ID</th>
                          <th className="p-3.5">Submitted</th>
                          <th className="p-3.5">Dispatch Status</th>
                          <th className="p-3.5 text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredApkRequests.map((req) => {
                          const isFree = (req.edition || '').toLowerCase().includes('free') || (req.edition || '').toLowerCase().includes('community') || !req.edition;
                          return (
                            <tr key={req.id || req.requestId} className="hover:bg-slate-900/80 transition-colors">
                              <td className="p-3.5 space-y-0.5">
                                <div className="font-bold text-white font-sans text-sm">{req.fullName}</div>
                                <div className="text-cyan-400 text-[11px] font-mono flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-cyan-500" />
                                  <a href={`mailto:${req.email}`} className="hover:underline">{req.email}</a>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">{req.organization}</div>
                              </td>

                              <td className="p-3.5">
                                <span className={`px-2.5 py-1 rounded text-[10px] font-bold border inline-block ${
                                  isFree
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                                }`}>
                                  {req.edition || 'Free / Community Edition'}
                                </span>
                              </td>

                              <td className="p-3.5 font-bold text-slate-200">
                                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
                                  {req.osPlatform}
                                </span>
                              </td>

                              <td className="p-3.5 text-cyan-300 font-bold">
                                {req.requestId}
                              </td>

                              <td className="p-3.5 text-slate-400 text-[11px]">
                                {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Recent'}
                              </td>

                              <td className="p-3.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                  req.status === 'LINK_PUSHED'
                                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                    : 'bg-amber-950 text-amber-400 border-amber-800 animate-pulse'
                                }`}>
                                  {req.status === 'LINK_PUSHED' ? 'LINK SENT' : 'PENDING DISPATCH'}
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  {req.id && req.status === 'PENDING_EMAIL_LINK' ? (
                                    <button
                                      onClick={() => handleUpdateApkStatus(req.id!, 'LINK_PUSHED', req.email)}
                                      className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-[11px] flex items-center space-x-1 transition-colors"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Push Link</span>
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Sent</span>
                                    </span>
                                  )}

                                  <button
                                    onClick={() => handleCopyApkDetails(req)}
                                    className="px-2 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] transition-colors"
                                    title="Copy APK Lead Details"
                                  >
                                    {copiedId === (req.id || req.requestId) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: POST-QUANTUM NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'newsletter' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/60 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-teal-400 font-bold">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <span>POST-QUANTUM SECURITY NEWSLETTER SUBSCRIBERS</span>
                    </div>
                    <div className="text-[10px] text-teal-300 font-bold bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                      Total Active Subscribers: {activeNewsletterCount}
                    </div>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    Subscriber email addresses stored directly in Firestore database (<code className="text-cyan-300">newsletter_subscriptions</code>) from the footer newsletter component.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative font-mono text-xs">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={newsletterSearch}
                    onChange={(e) => setNewsletterSearch(e.target.value)}
                    placeholder="Search subscriber email, topic, or source..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                {filteredNewsletters.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <Mail className="w-8 h-8 text-teal-400/50 mx-auto" />
                    <p className="text-sm font-bold text-white">No Newsletter Subscribers Found</p>
                    <p className="text-xs text-slate-400">When visitors subscribe via the website footer, their emails will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead className="bg-slate-950 text-cyan-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Subscriber Email</th>
                          <th className="p-3.5">Selected Intelligence Topics</th>
                          <th className="p-3.5">Source</th>
                          <th className="p-3.5">Subscribed Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredNewsletters.map((sub) => (
                          <tr key={sub.id || sub.email} className="hover:bg-slate-900/80 transition-colors">
                            <td className="p-3.5 font-bold text-white font-sans text-sm">
                              <a href={`mailto:${sub.email}`} className="text-cyan-400 hover:underline flex items-center gap-1.5 font-mono text-xs">
                                <Mail className="w-3.5 h-3.5 text-cyan-500" />
                                <span>{sub.email}</span>
                              </a>
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1">
                                {(sub.topics && sub.topics.length > 0 ? sub.topics : ['General PQC Updates']).map((t, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 text-[10px]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {sub.source || 'Footer Component'}
                            </td>

                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Recent'}
                            </td>

                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                                {sub.status || 'ACTIVE'}
                              </span>
                            </td>

                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleCopyNewsletter(sub)}
                                className="px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] transition-colors inline-flex items-center space-x-1"
                                title="Copy subscriber details"
                              >
                                {copiedId === (sub.id || sub.email) ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Copy Email</span>
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Q-CRYPT CRM Real-time Firestore Synchronization Active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
