import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, AlertTriangle, ShieldCheck, RefreshCw, Filter, Search, 
  Download, Eye, Lock, Zap, Thermometer, Radio, Cpu, RotateCcw,
  CheckCircle2, Clock, Terminal, ChevronRight, FileText, Trash2
} from 'lucide-react';
import { useToast } from './Toast';

export interface TamperHistoryEvent {
  id: string;
  timestamp: string;
  category: 'PHYSICAL_SENSOR' | 'UNAUTHORIZED_ACCESS' | 'HARDWARE_RESET';
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  title: string;
  sourceSensor: string;
  hsmDeviceId: string;
  hsmDeviceName: string;
  actionTaken: string;
  zeroizationTriggered: boolean;
  status: 'MITIGATED' | 'LOGGED' | 'ACTIVE_ISOLATION' | 'ZEROIZED';
  rawTelemetrySnapshot: {
    temperatureC?: number;
    voltageV?: number;
    meshResistanceOhm?: number;
    photonCount?: number;
    failedAttemptsCount?: number;
    operatorPinSlot?: string;
    resetSource?: string;
  };
  details: string;
}

export const INITIAL_TAMPER_HISTORY_EVENTS: TamperHistoryEvent[] = [
  {
    id: 'TMP-2026-0821-01',
    timestamp: '2026-08-21T03:14:22.812Z',
    category: 'PHYSICAL_SENSOR',
    severity: 'CRITICAL',
    title: 'Active Serpentine Shield Drill Attempt',
    sourceSensor: 'Upper Enclosure Micro-Mesh Channel #4',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'High-speed crowbar discharge fired in 3.4µs; SRAM keys wiped',
    zeroizationTriggered: true,
    status: 'ZEROIZED',
    rawTelemetrySnapshot: {
      meshResistanceOhm: 48500, // jump from 50 Ohm nominal
      temperatureC: 26.4,
      voltageV: 3.31
    },
    details: 'Impedance spike detected on Layer 3 active barrier indicating microscopic drill or focused ion beam (FIB) decapsulation attempt. FIPS 140-3 §4.10 zeroization engaged automatically.'
  },
  {
    id: 'TMP-2026-0820-18',
    timestamp: '2026-08-20T18:42:09.150Z',
    category: 'UNAUTHORIZED_ACCESS',
    severity: 'HIGH',
    title: 'PKCS#11 Officer PIN Brute-Force Lockout',
    sourceSensor: 'PKCS#11 C_Login Auth Guard Enclave',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'Security Officer Slot 0x01 locked; exponential delay timer engaged (3600s)',
    zeroizationTriggered: false,
    status: 'MITIGATED',
    rawTelemetrySnapshot: {
      failedAttemptsCount: 5,
      operatorPinSlot: 'Slot 0x01 (SecOfficer)'
    },
    details: '5 consecutive invalid authentication tokens presented within a 12-second window from 192.168.10.42. PIN lockout threshold reached. Physical smartcard quorum required to unlock.'
  },
  {
    id: 'TMP-2026-0819-09',
    timestamp: '2026-08-19T09:15:33.400Z',
    category: 'PHYSICAL_SENSOR',
    severity: 'WARNING',
    title: 'Cryogenic Thermal Anomaly (Freeze Attack Defense)',
    sourceSensor: 'Internal Die Substrate Thermal Diode',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'Memory bus scrambled; cold-boot remanence protection armed',
    zeroizationTriggered: false,
    status: 'MITIGATED',
    rawTelemetrySnapshot: {
      temperatureC: -38.2, // Below -30C threshold
      voltageV: 3.29
    },
    details: 'Ambient temperature plummeted to -38.2°C at rate > 5°C/s (characteristic of liquid nitrogen / cold-boot SRAM remanence extraction attempt). Active SRAM inversion cycling enabled.'
  },
  {
    id: 'TMP-2026-0818-14',
    timestamp: '2026-08-18T14:02:11.905Z',
    category: 'HARDWARE_RESET',
    severity: 'INFO',
    title: 'POST Power-On Self-Test Cold Reset',
    sourceSensor: 'Power Management IC & Watchdog Timer',
    hsmDeviceId: 'opentitan-sot',
    hsmDeviceName: 'OpenTitan Silicon RoT',
    actionTaken: 'Cold boot executed; all 6 FIPS 140-3 known answer tests (KAT) passed',
    zeroizationTriggered: false,
    status: 'LOGGED',
    rawTelemetrySnapshot: {
      resetSource: 'Hardware Cold Boot Power Cycle',
      voltageV: 3.30
    },
    details: 'System initiated scheduled maintenance cold reboot. SHA3-512 firmware digest, ML-DSA-87 KAT, and ML-KEM-1024 KAT passed with zero faults.'
  },
  {
    id: 'TMP-2026-0816-22',
    timestamp: '2026-08-16T22:38:45.112Z',
    category: 'PHYSICAL_SENSOR',
    severity: 'CRITICAL',
    title: 'High-Voltage Transient Glitch Attack Detected',
    sourceSensor: 'Core Rail Voltage Glitch Monitor & Clamp',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'Internal voltage crowbar clamped rail in 1.1ns; instruction pipeline flushed',
    zeroizationTriggered: false,
    status: 'MITIGATED',
    rawTelemetrySnapshot: {
      voltageV: 4.85, // spike from 3.3V
      temperatureC: 24.1
    },
    details: '4.85V nanosecond pulse detected on VDD core rail (fault injection signature attempting to bypass cryptographic loop counter). Clock instantly stalled and instructions flushed.'
  },
  {
    id: 'TMP-2026-0815-08',
    timestamp: '2026-08-15T08:19:04.780Z',
    category: 'HARDWARE_RESET',
    severity: 'WARNING',
    title: 'Watchdog Microcode Timeout Reset',
    sourceSensor: 'Cryptographic Engine Watchdog Timer',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'Non-destructive pipeline reset executed; temporary state cleared',
    zeroizationTriggered: false,
    status: 'MITIGATED',
    rawTelemetrySnapshot: {
      resetSource: 'Watchdog Hardware Strobe Timeout (450ms)'
    },
    details: 'Lattice polynomial multiplication core exceeded execution budget due to unrecoverable bus contention. Watchdog performed sub-second pipeline reset.'
  },
  {
    id: 'TMP-2026-0812-16',
    timestamp: '2026-08-12T16:55:12.330Z',
    category: 'PHYSICAL_SENSOR',
    severity: 'HIGH',
    title: 'Optical De-capsulation Photodiode Trigger',
    sourceSensor: 'Silicon Die Embedded Ambient Light Sensors (ALS #1-4)',
    hsmDeviceId: 'nitrokey-nethsm',
    hsmDeviceName: 'Nitrokey NetHSM Quantum',
    actionTaken: 'High-level alarm triggered; ephemeral session keys immediately purged',
    zeroizationTriggered: false,
    status: 'ACTIVE_ISOLATION',
    rawTelemetrySnapshot: {
      photonCount: 4200, // Ambient photon flux detected on bare die
      temperatureC: 25.0
    },
    details: 'Light sensor detected photon breach inside opaque potting resin (laser ablation or packaging dissolution). Ephemeral session keys destroyed; master wrap key armed for zeroization.'
  }
];

export const HsmTamperHistoryView: React.FC = () => {
  const { showToast } = useToast();

  const [events, setEvents] = useState<TamperHistoryEvent[]>(INITIAL_TAMPER_HISTORY_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<TamperHistoryEvent | null>(INITIAL_TAMPER_HISTORY_EVENTS[0]);
  const [isSimulatingSensorTrip, setIsSimulatingSensorTrip] = useState<boolean>(false);

  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
      if (selectedSeverity !== 'ALL' && evt.severity !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          evt.id.toLowerCase().includes(q) ||
          evt.title.toLowerCase().includes(q) ||
          evt.sourceSensor.toLowerCase().includes(q) ||
          evt.details.toLowerCase().includes(q) ||
          evt.hsmDeviceName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedCategory, selectedSeverity, searchQuery]);

  const handleTriggerSimulatedSensorTrip = () => {
    setIsSimulatingSensorTrip(true);
    setTimeout(() => {
      const nowIso = new Date().toISOString();
      const newEvent: TamperHistoryEvent = {
        id: `TMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowIso,
        category: 'PHYSICAL_SENSOR',
        severity: 'CRITICAL',
        title: 'Microprobe Optical Decapsulation Laser Pulse',
        sourceSensor: 'Silicon Die Light Sensor Matrix #3',
        hsmDeviceId: 'nitrokey-nethsm',
        hsmDeviceName: 'Nitrokey NetHSM Quantum',
        actionTaken: 'Simulated fault detected; ephemeral registers scrambled in 1.4µs',
        zeroizationTriggered: false,
        status: 'MITIGATED',
        rawTelemetrySnapshot: {
          photonCount: 6800,
          temperatureC: 28.5,
          voltageV: 3.32
        },
        details: 'Simulated optical laser glitch injection triggered during testing. Silicon ambient light detector tripped and bus automatically engaged tamper isolation.'
      };

      setEvents(prev => [newEvent, ...prev]);
      setSelectedEvent(newEvent);
      setIsSimulatingSensorTrip(false);
      showToast('Simulated Sensor Trigger Logged', 'Optical sensor trip registered in Enclave Tamper History.', 'warning');
    }, 600);
  };

  const handleExportTamperLogs = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hsm-tamper-history-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = ['ID', 'Timestamp', 'Category', 'Severity', 'Title', 'Sensor', 'Device', 'Status', 'Zeroized'];
      const rows = events.map(e => [
        e.id,
        e.timestamp,
        e.category,
        e.severity,
        `"${e.title.replace(/"/g, '""')}"`,
        `"${e.sourceSensor.replace(/"/g, '""')}"`,
        `"${e.hsmDeviceName.replace(/"/g, '""')}"`,
        e.status,
        e.zeroizationTriggered ? 'YES' : 'NO'
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hsm-tamper-history-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast('Tamper Audit Exported', `Exported ${events.length} records in ${format.toUpperCase()} format.`, 'success');
  };

  return (
    <div id="enclave-tamper-history-view" className="space-y-6 animate-fadeIn">
      
      {/* Header & Sensor Stats Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>FIPS 140-3 §4.10 PHYSICAL SECURITY SENSORS & TAMPER AUDIT TRAIL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
              Enclave Tamper & Security Incident History
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Immutable forensic log of active mesh trips, voltage/thermal glitches, unauthorized login lockouts, and crowbar zeroization discharges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="simulate-sensor-trip-btn"
              onClick={handleTriggerSimulatedSensorTrip}
              disabled={isSimulatingSensorTrip}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{isSimulatingSensorTrip ? 'Injecting Fault...' : 'Simulate Sensor Trip'}</span>
            </button>

            <button
              id="export-tamper-json-btn"
              onClick={() => handleExportTamperLogs('json')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              id="export-tamper-csv-btn"
              onClick={() => handleExportTamperLogs('csv')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Physical Sensor Triggers</span>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {events.filter(e => e.category === 'PHYSICAL_SENSOR').length} <span className="text-xs font-normal text-slate-400">Events</span>
            </div>
            <div className="text-[10px] text-red-400 font-mono">
              Mesh, Voltage, Optical & Thermal
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Unauthorized Access Attempts</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-300">
              {events.filter(e => e.category === 'UNAUTHORIZED_ACCESS').length} <span className="text-xs font-normal text-slate-400">Lockouts</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              PKCS#11 Officer & User PIN
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>Hardware Reset History</span>
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {events.filter(e => e.category === 'HARDWARE_RESET').length} <span className="text-xs font-normal text-slate-400">Resets</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              Cold Boots, Watchdogs & Crowbars
            </div>
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {[
              { id: 'ALL', label: 'All Incidents' },
              { id: 'PHYSICAL_SENSOR', label: 'Physical Sensors' },
              { id: 'UNAUTHORIZED_ACCESS', label: 'Unauthorized Access' },
              { id: 'HARDWARE_RESET', label: 'Hardware Resets' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search sensor, ID, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Event List (Left) + Detailed Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Event List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between px-1">
            <span>Showing {filteredEvents.length} Recorded Events</span>
            <span>Click item to inspect forensic telemetry</span>
          </div>

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl font-mono text-xs text-slate-400">
                No tamper events matching current filter criteria.
              </div>
            ) : (
              filteredEvents.map(evt => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                            evt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                            evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            evt.severity === 'WARNING' ? 'bg-yellow-950 text-yellow-300 border border-yellow-800' :
                            'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}>
                            {evt.severity}
                          </span>

                          <span className="text-[10px] font-mono text-slate-400">
                            {evt.category.replace(/_/g, ' ')}
                          </span>

                          <span className="text-[10px] font-mono text-slate-500">•</span>
                          <span className="text-[10px] font-mono text-slate-400">{evt.id}</span>
                        </div>

                        <h4 className="font-bold text-sm text-white font-sans">
                          {evt.title}
                        </h4>

                        <div className="text-xs text-slate-400 font-mono">
                          Source: <span className="text-cyan-300">{evt.sourceSensor}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </div>
                        {evt.zeroizationTriggered && (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">
                            ZEROIZED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Forensic Inspector */}
        <div className="lg:col-span-5">
          {selectedEvent ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 sticky top-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-sm text-white font-sans">
                    Forensic Incident Inspector
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedEvent.id}
                </span>
              </div>

              {/* Event Title & Summary */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-mono">
                  Timestamp: <strong className="text-white">{selectedEvent.timestamp}</strong>
                </div>
                <h3 className="text-lg font-bold text-white font-sans">
                  {selectedEvent.title}
                </h3>
                <div className="text-xs font-mono text-cyan-300">
                  Target Device: {selectedEvent.hsmDeviceName}
                </div>
              </div>

              {/* Action Taken & Containment Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="text-[10px] uppercase text-slate-400 font-bold">
                  Enclave Action & Mitigation
                </div>
                <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{selectedEvent.actionTaken}</span>
                </div>
                <div className="text-slate-400 text-[11px] pt-1">
                  Status: <strong className="text-white">{selectedEvent.status}</strong> • Zeroization: <strong className={selectedEvent.zeroizationTriggered ? 'text-red-400' : 'text-emerald-400'}>{selectedEvent.zeroizationTriggered ? 'TRIGGERED' : 'DISARMED'}</strong>
                </div>
              </div>

              {/* Raw Telemetry Sensor Snapshot */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Sensor Telemetry Snapshot At Trip Time
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs font-mono">
                  {selectedEvent.rawTelemetrySnapshot.meshResistanceOhm !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Mesh Resistance:</span>
                      <strong className="text-red-400">{selectedEvent.rawTelemetrySnapshot.meshResistanceOhm.toLocaleString()} Ω</strong>
                    </div>
                  )}
                  {selectedEvent.rawTelemetrySnapshot.temperatureC !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Die Temperature:</span>
                      <strong className={selectedEvent.rawTelemetrySnapshot.temperatureC < 0 ? 'text-cyan-300' : 'text-white'}>
                        {selectedEvent.rawTelemetrySnapshot.temperatureC}°C
                      </strong>
                    </div>
                  )}
                  {selectedEvent.rawTelemetrySnapshot.voltageV !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Core Rail Voltage:</span>
                      <strong className={selectedEvent.rawTelemetrySnapshot.voltageV > 4.0 ? 'text-red-400' : 'text-white'}>
                        {selectedEvent.rawTelemetrySnapshot.voltageV} V
                      </strong>
                    </div>
                  )}
                  {selectedEvent.rawTelemetrySnapshot.photonCount !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Photodiode Flux:</span>
                      <strong className="text-amber-400">{selectedEvent.rawTelemetrySnapshot.photonCount} lux</strong>
                    </div>
                  )}
                  {selectedEvent.rawTelemetrySnapshot.failedAttemptsCount !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Failed PIN Attempts:</span>
                      <strong className="text-red-400">{selectedEvent.rawTelemetrySnapshot.failedAttemptsCount} (Threshold Exceeded)</strong>
                    </div>
                  )}
                  {selectedEvent.rawTelemetrySnapshot.resetSource !== undefined && (
                    <div className="p-2 rounded bg-slate-900/80 col-span-2">
                      <span className="text-[10px] text-slate-400 block">Reset Source:</span>
                      <strong className="text-cyan-300">{selectedEvent.rawTelemetrySnapshot.resetSource}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Description / Forensic Analysis */}
              <div className="space-y-1 text-xs font-mono">
                <div className="text-[10px] uppercase text-slate-400 font-bold">
                  Technical Forensic Analysis
                </div>
                <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {selectedEvent.details}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl font-mono text-xs text-slate-400">
              Select an incident from the list to inspect forensics.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
