import React, { useState } from 'react';
import { Smartphone, Shield, Check, X, Cpu, HardDrive, Info, Zap } from 'lucide-react';
import { HARDWARE_DEVICES } from '../data';
import { DeviceProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const HardwareCompatibility: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDevice, setSelectedDevice] = useState<DeviceProfile>(HARDWARE_DEVICES[0]);

  return (
    <section id="hardware-checker" className="py-16 md:py-24 bg-slate-950 text-slate-100 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-mono">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t('hardware.tag')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('hardware.title')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {t('hardware.subtitle')}
          </p>
        </div>

        {/* Interactive Device Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Device Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              {t('hw.selectModel')}
            </p>

            <div className="space-y-2">
              {HARDWARE_DEVICES.map((device) => {
                const isSelected = device.id === selectedDevice.id;
                return (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 text-white'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm leading-tight">{device.name}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1 font-mono">
                        <Cpu className="w-3 h-3 text-cyan-400" />
                        <span>{device.hardwareSecurityModule}</span>
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${device.badgeColor}`}>
                      {device.securityRating.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Security Feature Audit Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  {selectedDevice.brand} {t('hw.platform')}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedDevice.name}
                </h3>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${selectedDevice.badgeColor}`}>
                {selectedDevice.securityRating}
              </span>
            </div>

            {/* Hardware Module Info */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">{t('hw.secProcessor')}</span>
              <p className="text-xs text-cyan-300 font-mono font-semibold flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{selectedDevice.hardwareSecurityModule}</span>
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-300 font-mono">{t('hw.isolationAudit')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className={`p-3 rounded-lg border flex items-center space-x-3 text-xs ${
                  selectedDevice.features.strongBox
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  {selectedDevice.features.strongBox ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{t('hw.f1Title')}</p>
                    <p className="text-[10px] opacity-80">{t('hw.f1Sub')}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center space-x-3 text-xs ${
                  selectedDevice.features.quantumKeyIsolation
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  {selectedDevice.features.quantumKeyIsolation ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{t('hw.f2Title')}</p>
                    <p className="text-[10px] opacity-80">{t('hw.f2Sub')}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center space-x-3 text-xs ${
                  selectedDevice.features.physicalAntiTamper
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  {selectedDevice.features.physicalAntiTamper ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{t('hw.f3Title')}</p>
                    <p className="text-[10px] opacity-80">{t('hw.f3Sub')}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg border flex items-center space-x-3 text-xs ${
                  selectedDevice.features.memoryTaggingMTE
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  {selectedDevice.features.memoryTaggingMTE ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">{t('hw.f4Title')}</p>
                    <p className="text-[10px] opacity-80">{t('hw.f4Sub')}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Expert Analysis Notes */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1 font-mono">
              <span className="text-[10px] text-cyan-400 font-bold flex items-center space-x-1">
                <Info className="w-3.5 h-3.5" />
                <span>{t('hw.auditSummary')}</span>
              </span>
              <p className="text-slate-300 leading-relaxed pt-1">
                {selectedDevice.notes}
              </p>
            </div>

            {/* Rating Action Recommendation */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">{t('hw.recProfile')}</span>
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('hw.gradeA')}</span>
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
