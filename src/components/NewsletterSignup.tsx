import React, { useState } from 'react';
import { Mail, Shield, CheckCircle2, Sparkles, Lock, ArrowRight, Bell, AlertTriangle } from 'lucide-react';
import { crmService } from '../services/crmService';
import { useToast } from './Toast';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'NIST PQC Vulnerabilities',
    'FIPS 203 Lattice Encryption Updates',
    'Mobile Hardware Enclave Briefs'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribedDocId, setSubscribedDocId] = useState<string | null>(null);
  const { showToast } = useToast();

  const availableTopics = [
    { id: 'NIST PQC Vulnerabilities', label: 'NIST PQC Breach & Vulnerability Alerts' },
    { id: 'FIPS 203 Lattice Encryption Updates', label: 'FIPS 203 Kyber/Dilithium Spec Updates' },
    { id: 'Mobile Hardware Enclave Briefs', label: 'Knox / Titan M2 Enclave Engineering' }
  ];

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topicId));
      } else {
        showToast('Selection Required', 'Please select at least one intelligence topic.', 'warning');
      }
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('Invalid Email', 'Please enter a valid official email address.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const docId = await crmService.submitNewsletterSubscription(cleanEmail, selectedTopics);
      setSubscribedDocId(docId);
      setSubscribed(true);
      setEmail('');
      showToast('Subscription Confirmed!', 'You have successfully subscribed to Post-Quantum Security updates.', 'success');
    } catch (error) {
      console.error('Newsletter submission failed:', error);
      showToast('Subscription Error', 'Failed to save subscription in Firestore. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Glow background accent */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Information & Badge */}
        <div className="lg:col-span-5 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>POST-QUANTUM SECURITY INTELLIGENCE</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Subscribe to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300">Post-Quantum Security</span> Briefs
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Stay ahead of quantum computing threats. Receive verified cryptographic vulnerability alerts, NIST FIPS 203/204 lattice transition guidelines, and Q-CRYPT mobile security research directly to your inbox.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Spam Guarantee</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Stored in Firestore DB</span>
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Form or Success State */}
        <div className="lg:col-span-7">
          {subscribed ? (
            <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/50 space-y-4 text-center sm:text-left animate-fadeIn">
              <div className="flex items-center space-x-3 text-emerald-400 font-bold font-mono">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base font-sans">Subscription Confirmed!</h4>
                  <p className="text-xs text-emerald-300 font-mono">Record ID: {subscribedDocId || 'Verified in Firestore'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Thank you for subscribing to <span className="text-cyan-400 font-bold">Post-Quantum Security</span> updates. Your preferences have been saved to our secure Firestore database, and you will receive incoming intelligence alerts as new PQC vulnerabilities emerge.
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Topics Selected: {selectedTopics.length}</span>
                </div>
                <button
                  onClick={() => setSubscribed(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-mono font-bold border border-slate-700 transition-colors"
                >
                  Subscribe Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-4">
              
              {/* Topic Selectors */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Select Intelligence Topics</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {availableTopics.map(topic => {
                    const isSelected = selectedTopics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-start space-x-2 ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-500/70 text-cyan-200 shadow-md shadow-cyan-950/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded mt-0.5 border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />}
                        </div>
                        <span className="text-[11px] font-medium leading-snug">{topic.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email Input & Submit Button */}
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your security or work email address..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm font-sans focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm font-mono flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950/50 transition-all disabled:opacity-50 shrink-0"
                >
                  {submitting ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe to Updates</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-mono">
                * Stored securely in your project's Firestore database (<code className="text-cyan-400">newsletter_subscriptions</code>). Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
