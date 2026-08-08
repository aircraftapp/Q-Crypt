import React from 'react';
import { 
  TrendingUp, FileText, Download, Building2, Users, DollarSign, PieChart, 
  ShieldCheck, CheckCircle2, ChevronRight, Lock, ExternalLink 
} from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

export const InvestorRelations: React.FC = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const generateAndDownloadPitchDeckPdf = () => {
    try {
      const doc = new jsPDF();
      
      // Page 1: Title & Executive Summary
      doc.setFillColor(8, 13, 26);
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(34, 211, 238); // Cyan
      doc.setFontSize(22);
      doc.text("Q-CRYPT - SERIES-A INVESTOR PITCH DECK", 15, 25);

      doc.setFontSize(12);
      doc.setTextColor(226, 232, 240);
      doc.text("Post-Quantum Mobile Security Infrastructure for Enterprise & Defense", 15, 35);
      doc.text("NIST FIPS 203 (ML-KEM-1024) & FIPS 204 (ML-DSA-87) Standardized", 15, 42);

      doc.setLineWidth(0.5);
      doc.setDrawColor(34, 211, 238);
      doc.line(15, 48, 195, 48);

      doc.setFontSize(14);
      doc.setTextColor(52, 211, 153); // Emerald
      doc.text("1. EXECUTIVE SUMMARY & MARKET OPPORTUNITY", 15, 60);

      doc.setFontSize(10);
      doc.setTextColor(203, 213, 225);
      const summaryText = 
        "Q-CRYPT is the world's leading NIST-certified post-quantum mobile messaging framework built for Android, " +
        "custom hardened Android OS with secure kernel, and Enterprise MDM environments. By implementing Module Lattice Key Encapsulation (ML-KEM-1024) " +
        "and Dilithium signatures (ML-DSA-87), Q-CRYPT protects mobile voice, chat, and data streams against passive " +
        "Harvest-Now-Decrypt-Later (HNDL) state surveillance tapping and future Quantum Computers (CRQCs).";
      const splitSummary = doc.splitTextToSize(summaryText, 180);
      doc.text(splitSummary, 15, 70);

      // Financial Metrics Table Box
      doc.setFillColor(15, 23, 42);
      doc.rect(15, 95, 180, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text("KEY FINANCIAL METRICS & TAM", 20, 107);

      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Total Addressable Market (TAM):", 20, 118);
      doc.setTextColor(34, 211, 238);
      doc.text("$42 Billion by 2030 (Global Enterprise PQC)", 95, 118);

      doc.setTextColor(148, 163, 184);
      doc.text("Enterprise Seat Pricing:", 20, 126);
      doc.setTextColor(52, 211, 153);
      doc.text("$120 / seat / year (88% Gross Margin)", 95, 126);

      doc.setTextColor(148, 163, 184);
      doc.text("Active Pilot Deployments:", 20, 134);
      doc.setTextColor(255, 255, 255);
      doc.text("24,500 Seats (+48% QoQ Growth)", 95, 134);

      // Section 2: Deployment Metrics & Security Standards
      doc.setFontSize(14);
      doc.setTextColor(52, 211, 153);
      doc.text("2. DEPLOYMENT & COMPLIANCE SPECIFICATION", 15, 160);

      doc.setFillColor(30, 41, 59);
      doc.rect(15, 170, 180, 24, 'F');
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("NIST FIPS 203 (ML-KEM-1024) & FIPS 204 (ML-DSA-87) Standardized Architecture", 20, 178);
      
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Fully compliant with Level 5 Post-Quantum Immunity requirements for defense and enterprise.", 20, 186);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Q-CRYPT Inc. Confidential Pitch Deck • Generated Real-Time", 15, 285);

      doc.save("Q-CRYPT_SeriesA_Investor_Pitch_Deck_v2.4.pdf");
      showToast(t('investor.pdfDownloaded') || 'Downloaded Official Investor Pitch Deck (PDF)', 'success');
    } catch (e) {
      console.warn("jsPDF fallback to server API download:", e);
      window.open('/api/download-pitch-deck-pdf', '_blank');
      showToast('Downloaded Investor Pitch Deck PDF', 'success');
    }
  };

  return (
    <section id="investor-relations" className="py-12 bg-slate-950 text-slate-100 relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-500/40 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>{t('investor.tag') || 'Series-A Investor Briefing'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('investor.title') || 'Investor Relations & Financial Deck'}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {t('investor.subtitle') || 'Post-Quantum Mobile Security Infrastructure for Enterprise & Defense • TAM $42 Billion'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={generateAndDownloadPitchDeckPdf}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-bold shadow-xl shadow-cyan-950 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>{t('investor.btnDownloadPdf') || 'Download Pitch Deck (PDF)'}</span>
            </button>
          </div>
        </div>

        {/* Investment Highlights Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>{t('investor.tam') || 'Global Market TAM'}</span>
              <PieChart className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-300 font-mono">$42 Billion</div>
            <p className="text-[11px] text-slate-400">PQC Mobile Security by 2030</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>{t('investor.arr') || 'ARR per Seat'}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">$120 / yr</div>
            <p className="text-[11px] text-emerald-300">88% Gross Margin Target</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>{t('investor.seats') || 'Active Pilot Seats'}</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">24,500 Seats</div>
            <p className="text-[11px] text-cyan-400">+48% QoQ Growth Rate</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>NIST Standard</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">FIPS 203 / 204</div>
            <p className="text-[11px] text-slate-400">Level 5 Quantum Immunity</p>
          </div>
        </div>

      </div>
    </section>
  );
};
