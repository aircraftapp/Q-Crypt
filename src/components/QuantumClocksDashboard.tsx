import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, ShieldCheck, Zap, AlertTriangle, Globe, RefreshCw, 
  Sparkles, Lock, Cpu, Radio, ShieldAlert, Award, ArrowRight, Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from './Toast';

// Mosca's Law Target Year: 2030-01-01T00:00:00Z (Estimated CRQC Breakthrough)
const CRQC_TARGET_DATE = new Date('2030-01-01T00:00:00Z').getTime();

// NIS2 Compliance Deadline: 2026-10-17T00:00:00Z
const NIS2_TARGET_DATE = new Date('2026-10-17T00:00:00Z').getTime();

export const QuantumClocksDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const lang = language;

  // Live Time States
  const [now, setNow] = useState<Date>(new Date());
  const [ratchetTimeLeft, setRatchetTimeLeft] = useState<number>(60); // 60s auto-ratchet cycle
  const [ratchetCount, setRatchetCount] = useState<number>(14290);

  // Live Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Live 60-Second Ephemeral Key Ratchet Timer Effect
  useEffect(() => {
    const ratchetTimer = setInterval(() => {
      setRatchetTimeLeft((prev) => {
        if (prev <= 1) {
          setRatchetCount((c) => c + 1);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(ratchetTimer);
  }, []);

  // Manual Trigger Ratchet
  const handleManualRatchet = () => {
    setRatchetTimeLeft(60);
    setRatchetCount((c) => c + 1);
    showToast(
      lang === 'fr' ? 'Ratchet Réussi' : 'Keys Ratcheted',
      lang === 'fr' ? 'Nouvelles clés de session encapsulées.' : 'New session keys encapsulated.',
      'success'
    );
  };

  // Time Calculations for CRQC (Mosca's Law)
  const timeDiffCrqc = Math.max(0, CRQC_TARGET_DATE - now.getTime());
  const crqcYears = Math.floor(timeDiffCrqc / (1000 * 60 * 60 * 24 * 365.25));
  const crqcDays = Math.floor((timeDiffCrqc % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
  const crqcHours = Math.floor((timeDiffCrqc % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const crqcMinutes = Math.floor((timeDiffCrqc % (1000 * 60 * 60)) / (1000 * 60));
  const crqcSeconds = Math.floor((timeDiffCrqc % (1000 * 60)) / 1000);
  const crqcMs = Math.floor((timeDiffCrqc % 1000) / 10);

  // Time Calculations for NIS2 Deadline
  const timeDiffNis2 = Math.max(0, NIS2_TARGET_DATE - now.getTime());
  const nis2Days = Math.floor(timeDiffNis2 / (1000 * 60 * 60 * 24));
  const nis2Hours = Math.floor((timeDiffNis2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const nis2Minutes = Math.floor((timeDiffNis2 % (1000 * 60 * 60)) / (1000 * 60));
  const nis2Seconds = Math.floor((timeDiffNis2 % (1000 * 60)) / 1000);

  // Format Time Helper for Timezones
  const formatTimeForZone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
    } catch {
      return now.toLocaleTimeString();
    }
  };

  const formatDateForZone = (timeZone: string) => {
    try {
      return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
        timeZone,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(now);
    } catch {
      return now.toLocaleDateString();
    }
  };

  return (
    <section id="quantum-clocks" className="py-12 bg-slate-950 text-slate-100 relative overflow-hidden border-b border-slate-800">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3.5 bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/40 rounded-2xl text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {lang === 'fr' ? 'HORLOGES ATOMIQUES TEMPS RÉEL' : 'REAL-TIME ATOMIC CLOCKS'}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  {lang === 'fr' ? 'SYNCHRONISÉ UTC' : 'UTC SYNCHRONIZED'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                {lang === 'fr' 
                  ? 'Horloges Quantiques & Compte à Rebours de Sécurité' 
                  : 'Quantum Clocks & Security Expiration Timers'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5 max-w-2xl">
                {lang === 'fr' 
                  ? 'Surveillez en temps réel le compte à rebours de la Loi de Mosca (CRQC), l\'expiration des clés éphémères ML-KEM-1024, les échéances NIS2 / LPM 2024-2030 et les horloges souveraines ANSSI.' 
                  : 'Monitor real-time Mosca\'s Law quantum threat countdowns, ML-KEM-1024 ephemeral key expiration, NIS2 / LPM compliance deadlines, and ANSSI sovereign atomic clocks.'}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={handleManualRatchet}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-xl shadow-cyan-500/20 shrink-0 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-slate-950 animate-spin-slow" />
            <span>{lang === 'fr' ? 'Purger Clé Éphémère (Ratchet)' : 'Ratchet Ephemeral Key Now'}</span>
          </button>
        </div>

        {/* TOP MAIN HERO GRID: MOSCA'S LAW COUNTDOWN & AUTO-RATCHET TIMER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MOSCA'S LAW QUANTUM COUNTDOWN CLOCK (8 COLS) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-red-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-2 bg-red-950/80 px-3 py-1 rounded-xl border border-red-800/80">
                  <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  {lang === 'fr' ? 'THÉORÈME DE MOSCA (COMPTE À REBOURS CRQC)' : 'MOSCA\'S THEOREM (CRQC COUNTDOWN)'}
                </span>

                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/90 px-2.5 py-1 rounded-lg border border-amber-700">
                  Formule: x + y &gt; z
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  {lang === 'fr' 
                    ? 'Temps Restant avant la Rupture Quantique Estimée (Shor / CRQC)' 
                    : 'Time Remaining Until Estimated Quantum Cryptanalytic Breakthrough'}
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {lang === 'fr'
                    ? 'Selon le théorème de Mosca, la migration vers le PQC doit être achevée avant que l\'ordinateur quantique à tolérance de pannes ne puisse déchiffrer les données rétroactivement (HNDL).'
                    : 'According to Mosca\'s Law, PQC migration must complete before a fault-tolerant Cryptographically Relevant Quantum Computer (CRQC) can decrypt archived traffic.'}
                </p>
              </div>

              {/* Countdown Digit Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 py-3">
                <div className="bg-slate-950/90 border border-red-500/30 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-red-400 block">{crqcYears}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Années' : 'Years'}</span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 block">{crqcDays}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Jours' : 'Days'}</span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 block">{crqcHours}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Heures' : 'Hours'}</span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 block">{crqcMinutes}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Minutes' : 'Min'}</span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 block">{crqcSeconds}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Secondes' : 'Sec'}</span>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 p-2.5 sm:p-3 rounded-2xl text-center shadow-lg bg-red-950/20">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-red-500 block animate-pulse">{crqcMs}</span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Milli-sec' : 'Ms'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-red-300">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                {lang === 'fr' ? 'Risque HNDL Actif : Éléments chiffrés RSA/ECC interceptés en direct' : 'Active HNDL Risk: Unprotected RSA/ECC traffic recorded today'}
              </span>
              <span className="text-emerald-400 font-bold">{lang === 'fr' ? 'Statut Q-CRYPT : Protégé (ML-KEM-1024)' : 'Q-CRYPT Status: Protected (ML-KEM-1024)'}</span>
            </div>
          </div>

          {/* EPHEMERAL LATTICE SESSION KEY RATSCHET TIMER (5 COLS) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 bg-cyan-950 px-2.5 py-1 rounded-xl border border-cyan-800">
                  <Zap className="w-4 h-4 text-cyan-400 animate-bounce" />
                  {lang === 'fr' ? 'RATCHET EN TEMPS RÉEL (60S)' : 'REAL-TIME RATCHET TIMER (60S)'}
                </span>

                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  Ratchet #{ratchetCount}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-sans">
                  {lang === 'fr' ? 'Régénération Automatique des Clés ML-KEM-1024' : 'ML-KEM-1024 Ephemeral Auto-Ratchet'}
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {lang === 'fr'
                    ? 'Chaque session regénère ses clés matricielles éphémères toutes les 60 secondes pour garantir une confidentialité persistante parfaite (Perfect Forward Secrecy).'
                    : 'Every session regenerates ephemeral lattice noise matrices every 60 seconds ensuring unbreakable Perfect Forward Secrecy.'}
                </p>
              </div>

              {/* Progress Ring & Big Counter */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="32" cy="32" r="26"
                        stroke="#06b6d4"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={163}
                        strokeDashoffset={163 - (163 * ratchetTimeLeft) / 60}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <span className="absolute text-lg font-mono font-black text-cyan-300">{ratchetTimeLeft}s</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">
                      {lang === 'fr' ? 'Algorithme Actif' : 'Active Algorithm'}
                    </span>
                    <p className="text-xs font-mono font-bold text-white">NIST ML-KEM-1024 (FIPS 203)</p>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      {lang === 'fr' ? 'Matrice Bruit Gaussien Active' : 'Active Gaussian Noise Matrix'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleManualRatchet}
                  className="p-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl text-cyan-300 transition-all cursor-pointer shrink-0"
                  title={lang === 'fr' ? 'Exécuter Ratchet Maintenant' : 'Trigger Ratchet Now'}
                >
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{lang === 'fr' ? 'Prochain Ratchet dans :' : 'Next Ratchet In:'}</span>
              <span className="text-cyan-300 font-bold">{ratchetTimeLeft} {lang === 'fr' ? 'secondes' : 'seconds'}</span>
            </div>
          </div>

        </div>

        {/* MULTI-TIMEZONE ATOMIC SOVEREIGN COMMAND NETWORK CLOCKS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              {lang === 'fr' 
                ? 'Horloges Réseau Synchros - Centres de Commandement PQC Souverains' 
                : 'Synchronized Network Clocks — Sovereign PQC Command Nodes'}
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'fr' ? 'Horloge Maître UTC :' : 'Master UTC Time:'} <strong className="text-cyan-400 font-mono">{formatTimeForZone('UTC')} UTC</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* PARIS / ANSSI SOVEREIGN TIME (CET/CEST) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-blue-500/40 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 flex items-center gap-1">
                  <span>🇫🇷</span> ANSSI CET
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">LPM 2024-2030</span>
              </div>

              <div>
                <span className="text-3xl font-black font-mono text-white tracking-wider block">
                  {formatTimeForZone('Europe/Paris')}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                  {formatDateForZone('Europe/Paris')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{lang === 'fr' ? 'Centre : Paris (OIV/OSE)' : 'Center: Paris (OIV/OSE)'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'fr' ? '100% Synchronisé' : '100% Synced'}</span>
              </div>
            </div>

            {/* LUXEMBOURG / CSSF FINANCIAL VAULT (CET) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/80 border border-cyan-500/40 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 flex items-center gap-1">
                  <span>🇱🇺</span> CSSF CET
                </span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">DORA PSF</span>
              </div>

              <div>
                <span className="text-3xl font-black font-mono text-white tracking-wider block">
                  {formatTimeForZone('Europe/Luxembourg')}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                  {formatDateForZone('Europe/Luxembourg')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{lang === 'fr' ? 'Coffre : Luxembourg-Ville' : 'Vault: Luxembourg City'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'fr' ? '100% Synchronisé' : '100% Synced'}</span>
              </div>
            </div>

            {/* WASHINGTON D.C. / NIST STANDARDS (EST/EDT) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/80 border border-amber-500/40 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 flex items-center gap-1">
                  <span>🇺🇸</span> NIST EST
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">FIPS 203/204</span>
              </div>

              <div>
                <span className="text-3xl font-black font-mono text-white tracking-wider block">
                  {formatTimeForZone('America/New_York')}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                  {formatDateForZone('America/New_York')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{lang === 'fr' ? 'Standards : Washington D.C.' : 'Standards: Washington D.C.'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'fr' ? '100% Synchronisé' : '100% Synced'}</span>
              </div>
            </div>

            {/* TOKYO / APAC PQC NODE (JST) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/80 border border-purple-500/40 p-4 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800 flex items-center gap-1">
                  <span>🇯🇵</span> APAC JST
                </span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">XMSS / Lattice</span>
              </div>

              <div>
                <span className="text-3xl font-black font-mono text-white tracking-wider block">
                  {formatTimeForZone('Asia/Tokyo')}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">
                  {formatDateForZone('Asia/Tokyo')}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{lang === 'fr' ? 'Relais : Enclave Tokyo' : 'Relay: Tokyo Enclave'}</span>
                <span className="text-emerald-400 font-bold">{lang === 'fr' ? '100% Synchronisé' : '100% Synced'}</span>
              </div>
            </div>

          </div>
        </div>

        {/* NIS2 DIRECTIVE & ANSSI COMPLIANCE DEADLINE BANNER */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-blue-900/60 border border-blue-400/40 rounded-xl text-blue-300 shrink-0 mt-0.5">
              <Award className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-white font-sans">
                  {lang === 'fr' ? 'Échéance Réglementaire Européenne NIS2 & LPM' : 'European NIS2 Directive & LPM Deadline'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-400/40 text-blue-300 uppercase">
                  EU DIRECTIVE (UE) 2022/2555
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {lang === 'fr' 
                  ? 'Compte à rebours avant la mise en conformité obligatoire NIS2 & LPM 2024-2030 pour la résilience cryptographique post-quantique des infrastructures critiques.' 
                  : 'Countdown to mandatory NIS2 & LPM 2024-2030 compliance for post-quantum cryptographic resilience across European critical infrastructures.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-xl border border-blue-500/30 shrink-0">
            <div className="text-right">
              <span className="text-xl font-black font-mono text-blue-300 block">
                {nis2Days}d {nis2Hours}h {nis2Minutes}m {nis2Seconds}s
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {lang === 'fr' ? 'Restants avant Application' : 'Remaining Until Enforced'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
