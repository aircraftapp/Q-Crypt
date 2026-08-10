import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Globe, Radio, Cpu, ShieldCheck, Zap, RefreshCw, Activity, Compass, MapPin, Plus, Sparkles, Award, Shield, Flame } from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export interface NetworkNode {
  id: string;
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'Primary Enclave' | 'Commercial KMS' | 'Air-Gapped Node';
  latencyMs: number;
  throughputMbps: number;
  hsmStatus: 'Hardware Attested' | 'FIPS 140-3 Validated';
  status: 'Online' | 'Synchronized';
  pawStamp?: {
    title: string;
    badge: string;
    benefits: string[];
    complianceStandard: string;
  };
}

const REGION_PAW_STAMPS: Record<string, NetworkNode['pawStamp']> = {
  'Luxembourg': {
    title: 'CSSF Luxembourg Sovereign Financial Vault',
    badge: '🐾 PAW-STAMPED SOVEREIGN VAULT',
    complianceStandard: 'CSSF PSF & EU DORA Compliant',
    benefits: [
      '100% PSF financial data isolation with sovereign hardware keys',
      'Zero-backdoor EU cloud compliance & strict GDPR data residence',
      'Automated daily cryptographic health treats & instant audit verification 🦴',
    ],
  },
  'Germany': {
    title: 'BSI Germany Federal Sovereign Core',
    badge: '🐾 PAW-STAMPED BSI CORE',
    complianceStandard: 'BSI TR-02102-4 & IT-Grundschutz',
    benefits: [
      'BSI TR-02102-4 post-quantum ratcheting with Kyber-1024',
      'CC EAL4+ hardware enclave protection against Harvest-Now-Decrypt-Later',
      'Federal German government defense mesh routing 🛡️',
    ],
  },
  'India': {
    title: 'India NASSCOM DeepTech Enclave',
    badge: '🐾 PAW-STAMPED NASSCOM ENCLAVE',
    complianceStandard: 'NASSCOM Quantum CoE & CERT-In',
    benefits: [
      'NASSCOM Quantum Centre of Excellence verified lattice architecture',
      'CERT-In 6-hour incident auto-ratchet & threat neutralization',
      'Reserve Bank of India (RBI) cyber directive post-quantum compliant 🐾',
    ],
  },
  'United States': {
    title: 'US NSA CNSA 2.0 Defense Enclave',
    badge: '🐾 PAW-STAMPED DEFENSE SHIELD',
    complianceStandard: 'NSA CNSA 2.0 & NIST FIPS 203',
    benefits: [
      'NIST FIPS 203 ML-KEM-1024 category 5 quantum immunity',
      'Google Titan M2 / StrongBox hardware key binding',
      'FedRAMP High & DoD Impact Level 6 security perimeter 🛡️',
    ],
  },
};

const DEFAULT_PAW_STAMP = {
  title: 'Quantum-Safe Sovereign Node',
  badge: '🐾 PAW-STAMPED QUANTUM NODE',
  complianceStandard: 'NIST FIPS 203 & 204 Native',
  benefits: [
    'NIST ML-KEM-1024 lattice key encapsulation',
    'Hardware enclave root-of-trust key storage',
    'Zero metadata retention & ephemeral P2P relay 🦴',
  ],
};

const INITIAL_NETWORK_NODES: NetworkNode[] = [
  { id: 'IAD-01', name: 'US East Defense Enclave', city: 'Washington D.C.', country: 'United States', coordinates: [-77.0369, 38.9072], type: 'Primary Enclave', latencyMs: 1.12, throughputMbps: 12500, hsmStatus: 'FIPS 140-3 Validated', status: 'Online', pawStamp: REGION_PAW_STAMPS['United States'] },
  { id: 'FRA-02', name: 'BSI Germany Sovereign Core', city: 'Frankfurt', country: 'Germany', coordinates: [8.6821, 50.1109], type: 'Primary Enclave', latencyMs: 1.45, throughputMbps: 18200, hsmStatus: 'Hardware Attested', status: 'Synchronized', pawStamp: REGION_PAW_STAMPS['Germany'] },
  { id: 'LUX-01', name: 'CSSF Luxembourg Financial Vault', city: 'Luxembourg City', country: 'Luxembourg', coordinates: [6.1319, 49.6116], type: 'Primary Enclave', latencyMs: 1.05, throughputMbps: 19500, hsmStatus: 'Hardware Attested', status: 'Synchronized', pawStamp: REGION_PAW_STAMPS['Luxembourg'] },
  { id: 'BLR-01', name: 'India NASSCOM DeepTech Enclave', city: 'Bengaluru', country: 'India', coordinates: [77.5946, 12.9716], type: 'Primary Enclave', latencyMs: 1.85, throughputMbps: 16800, hsmStatus: 'FIPS 140-3 Validated', status: 'Online', pawStamp: REGION_PAW_STAMPS['India'] },
  { id: 'TYO-04', name: 'APAC North Node', city: 'Tokyo', country: 'Japan', coordinates: [139.6917, 35.6895], type: 'Primary Enclave', latencyMs: 2.10, throughputMbps: 15400, hsmStatus: 'FIPS 140-3 Validated', status: 'Online', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'LHR-01', name: 'UK Financial Gateway', city: 'London', country: 'United Kingdom', coordinates: [-0.1278, 51.5074], type: 'Commercial KMS', latencyMs: 1.28, throughputMbps: 11000, hsmStatus: 'Hardware Attested', status: 'Synchronized', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'SIN-02', name: 'Southeast Asia Hub', city: 'Singapore', country: 'Singapore', coordinates: [103.8198, 1.3521], type: 'Commercial KMS', latencyMs: 2.45, throughputMbps: 9800, hsmStatus: 'FIPS 140-3 Validated', status: 'Online', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'SYD-01', name: 'Oceania Secure Vault', city: 'Sydney', country: 'Australia', coordinates: [151.2093, -33.8688], type: 'Air-Gapped Node', latencyMs: 3.10, throughputMbps: 8400, hsmStatus: 'Hardware Attested', status: 'Synchronized', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'ZRH-01', name: 'Alpine Hardware Vault', city: 'Zurich', country: 'Switzerland', coordinates: [8.5417, 47.3769], type: 'Air-Gapped Node', latencyMs: 0.95, throughputMbps: 21000, hsmStatus: 'Hardware Attested', status: 'Online', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'DXB-01', name: 'MENA Gateway', city: 'Dubai', country: 'United Arab Emirates', coordinates: [55.2708, 25.2048], type: 'Commercial KMS', latencyMs: 2.15, throughputMbps: 9200, hsmStatus: 'FIPS 140-3 Validated', status: 'Synchronized', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'GRU-01', name: 'Latin America Hub', city: 'São Paulo', country: 'Brazil', coordinates: [-46.6333, -23.5505], type: 'Commercial KMS', latencyMs: 3.40, throughputMbps: 7600, hsmStatus: 'Hardware Attested', status: 'Online', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'YYZ-03', name: 'Canada Core', city: 'Toronto', country: 'Canada', coordinates: [-79.3832, 43.6532], type: 'Primary Enclave', latencyMs: 1.32, throughputMbps: 13400, hsmStatus: 'FIPS 140-3 Validated', status: 'Online', pawStamp: DEFAULT_PAW_STAMP },
  { id: 'ICN-01', name: 'East Asia Tunnel', city: 'Seoul', country: 'South Korea', coordinates: [126.9780, 37.5665], type: 'Commercial KMS', latencyMs: 2.05, throughputMbps: 14100, hsmStatus: 'Hardware Attested', status: 'Synchronized', pawStamp: DEFAULT_PAW_STAMP },
];

// Active tunnel links connecting global nodes
const TUNNEL_LINKS: [string, string][] = [
  ['IAD-01', 'FRA-02'],
  ['FRA-02', 'LUX-01'],
  ['LUX-01', 'LHR-01'],
  ['FRA-02', 'DXB-01'],
  ['DXB-01', 'BLR-01'],
  ['BLR-01', 'SIN-02'],
  ['IAD-01', 'YYZ-03'],
  ['IAD-01', 'GRU-01'],
  ['FRA-02', 'ZRH-01'],
  ['SIN-02', 'TYO-04'],
  ['SIN-02', 'SYD-01'],
  ['TYO-04', 'ICN-01'],
  ['TYO-04', 'IAD-01'],
];

export const GlobalNetworkMap: React.FC = () => {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [projectionType, setProjectionType] = useState<'orthographic' | 'mercator'>('orthographic');
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(INITIAL_NETWORK_NODES[2]); // Default to Luxembourg
  const [rotation, setRotation] = useState<[number, number]>([-15, -25]);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [nodeFilter, setNodeFilter] = useState<'ALL' | 'Primary Enclave' | 'Air-Gapped Node'>('ALL');
  const [showThreatHeatmap, setShowThreatHeatmap] = useState<boolean>(true);

  // Real-Time Notification: Function to add a new Quantum-Safe Region
  const handleAddNewRegion = () => {
    const candidateRegions = [
      { id: `LUX-0${nodes.length + 1}`, name: 'Luxembourg PSF Satellite Enclave #2', city: 'Esch-sur-Alzette', country: 'Luxembourg', coords: [5.9806, 49.4958] as [number, number], stamp: REGION_PAW_STAMPS['Luxembourg'] },
      { id: `FRA-0${nodes.length + 1}`, name: 'BSI Germany Munich Sovereign Core #2', city: 'Munich', country: 'Germany', coords: [11.5820, 48.1351] as [number, number], stamp: REGION_PAW_STAMPS['Germany'] },
      { id: `DEL-01`, name: 'India NASSCOM New Delhi Security Hub', city: 'New Delhi', country: 'India', coords: [77.2090, 28.6139] as [number, number], stamp: REGION_PAW_STAMPS['India'] },
      { id: `CDG-01`, name: 'France Sovereign Defense Vault', city: 'Paris', country: 'France', coords: [2.3522, 48.8566] as [number, number], stamp: DEFAULT_PAW_STAMP },
    ];

    const nextRegion = candidateRegions[nodes.length % candidateRegions.length];

    const newNode: NetworkNode = {
      id: nextRegion.id,
      name: nextRegion.name,
      city: nextRegion.city,
      country: nextRegion.country,
      coordinates: nextRegion.coords,
      type: 'Primary Enclave',
      latencyMs: 1.15,
      throughputMbps: 22000,
      hsmStatus: 'FIPS 140-3 Validated',
      status: 'Online',
      pawStamp: nextRegion.stamp || DEFAULT_PAW_STAMP,
    };

    setNodes((prev) => [newNode, ...prev]);
    setSelectedNode(newNode);

    // Announce via Toast with playful emojis
    showToast(
      `🐕🛡️ NEW QUANTUM-SAFE REGION ADDED! 🐾`,
      `Sovereign Enclave ${newNode.id} (${newNode.city}, ${newNode.country}) successfully joined our global Post-Quantum Database Mesh!`,
      'success'
    );
  };

  // World continent geometry generator for D3 SVG rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(width * 0.55, 480);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    // SVG Gradients Definition for Heatmap & Glow
    const defs = svg.append('defs');

    // Heat Gradient - Critical (Red)
    const radGradCritical = defs.append('radialGradient')
      .attr('id', 'heatGradCritical')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradCritical.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', '0.75');
    radGradCritical.append('stop').attr('offset', '50%').attr('stop-color', '#f97316').attr('stop-opacity', '0.35');
    radGradCritical.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', '0');

    // Heat Gradient - High Activity (Amber)
    const radGradHigh = defs.append('radialGradient')
      .attr('id', 'heatGradHigh')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradHigh.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0.7');
    radGradHigh.append('stop').attr('offset', '60%').attr('stop-color', '#fbbf24').attr('stop-opacity', '0.25');
    radGradHigh.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0');

    // Heat Gradient - Active PQC (Cyan)
    const radGradCyan = defs.append('radialGradient')
      .attr('id', 'heatGradCyan')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradCyan.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0.65');
    radGradCyan.append('stop').attr('offset', '60%').attr('stop-color', '#38bdf8').attr('stop-opacity', '0.2');
    radGradCyan.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0');

    // D3 Projection Setup
    let projection: d3.GeoProjection;

    if (projectionType === 'orthographic') {
      projection = d3.geoOrthographic()
        .scale(Math.min(width, height) * 0.42)
        .translate([width / 2, height / 2])
        .rotate([rotation[0], rotation[1], 0]);
    } else {
      projection = d3.geoMercator()
        .scale(width / 6.5)
        .translate([width / 2, height / 1.6]);
    }

    const pathGenerator = d3.geoPath().projection(projection);

    // Render Globe Sphere Background / Graticule
    const gMap = svg.append('g').attr('class', 'map-layer');

    if (projectionType === 'orthographic') {
      // Globe atmosphere glow
      gMap.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', Math.min(width, height) * 0.42)
        .attr('fill', '#060B18')
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.4)
        .attr('style', 'filter: drop-shadow(0px 0px 15px rgba(6, 182, 212, 0.25));');
    }

    // Graticule grid lines
    const graticule = d3.geoGraticule().step([20, 20]);
    gMap.append('path')
      .datum(graticule)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 0.6)
      .attr('stroke-opacity', 0.6);

    // Simplified World Continents polygons
    const sphere = { type: 'Sphere' } as const;
    gMap.append('path')
      .datum(sphere)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0.3);

    // Draw Quantum Threat Heatmap Overlay (D3 Radial Heat Hotspots)
    if (showThreatHeatmap) {
      const gHeatmap = svg.append('g').attr('class', 'heatmap-layer');

      nodes.forEach((node) => {
        const coords = projection(node.coordinates);
        if (!coords) return;

        // Hide back-of-globe hotspots in orthographic mode
        if (projectionType === 'orthographic') {
          const distance = d3.geoDistance(node.coordinates, [-rotation[0], -rotation[1]]);
          if (distance > Math.PI / 2) return;
        }

        // Determine heat gradient intensity based on node location/type
        let gradId = 'url(#heatGradCyan)';
        let baseRadius = 24;

        if (['Frankfurt', 'Luxembourg City', 'Washington D.C.'].includes(node.city)) {
          gradId = 'url(#heatGradCritical)';
          baseRadius = 40;
        } else if (['Bengaluru', 'Tokyo', 'Zurich', 'London'].includes(node.city)) {
          gradId = 'url(#heatGradHigh)';
          baseRadius = 32;
        }

        const heatGroup = gHeatmap.append('g')
          .attr('transform', `translate(${coords[0]}, ${coords[1]})`);

        // Outer pulsing heat radius
        heatGroup.append('circle')
          .attr('r', baseRadius)
          .attr('fill', gradId)
          .attr('pointer-events', 'none')
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', `${baseRadius}; ${baseRadius * 1.35}; ${baseRadius}`)
          .attr('dur', `${2 + (node.id.charCodeAt(0) % 3)}s`)
          .attr('repeatCount', 'indefinite');

        // Inner core heat
        heatGroup.append('circle')
          .attr('r', baseRadius * 0.4)
          .attr('fill', gradId)
          .attr('pointer-events', 'none');
      });
    }

    // Draw Quantum Lattice Tunnel Arcs
    const gLinks = svg.append('g').attr('class', 'links-layer');

    TUNNEL_LINKS.forEach(([sourceId, targetId]) => {
      const sourceNode = nodes.find((n) => n.id === sourceId);
      const targetNode = nodes.find((n) => n.id === targetId);

      if (sourceNode && targetNode) {
        const linkFeature: d3.GeoGeometryObjects | any = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [sourceNode.coordinates, targetNode.coordinates],
          },
        };

        const pathData = pathGenerator(linkFeature);

        if (pathData) {
          gLinks.append('path')
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', '#06b6d4')
            .attr('stroke-width', 1.2)
            .attr('stroke-opacity', 0.5)
            .attr('stroke-dasharray', '4 4');
        }
      }
    });

    // Draw Node Markers & Pulsing Halos + PAW-PRINT STAMPS!
    const gNodes = svg.append('g').attr('class', 'nodes-layer');

    const filteredNodes = nodes.filter(
      (n) => nodeFilter === 'ALL' || n.type === nodeFilter
    );

    filteredNodes.forEach((node) => {
      const coords = projection(node.coordinates);
      if (!coords) return;

      // In Orthographic mode, hide nodes on back of globe
      if (projectionType === 'orthographic') {
        const distance = d3.geoDistance(node.coordinates, [-rotation[0], -rotation[1]]);
        if (distance > Math.PI / 2) return;
      }

      const isSelected = selectedNode.id === node.id;
      const isPawStampRegion = ['Luxembourg', 'Germany', 'India', 'United States'].includes(node.country);

      const nodeGroup = gNodes.append('g')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .attr('class', 'cursor-pointer')
        .on('click', () => {
          setSelectedNode(node);
          showToast(
            `Selected ${node.name} 🐾`,
            `${node.id} • ${node.city}, ${node.country} (${node.pawStamp?.complianceStandard || 'Quantum-Safe'})`,
            'info'
          );
        });

      // Pulse ring for selected node
      if (isSelected) {
        nodeGroup.append('circle')
          .attr('r', 14)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2)
          .attr('opacity', 0.9)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '6; 18; 6')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      // Outer halo ring
      nodeGroup.append('circle')
        .attr('r', isSelected ? 7 : 5)
        .attr('fill', isSelected ? '#10b981' : isPawStampRegion ? '#f59e0b' : node.type === 'Primary Enclave' ? '#06b6d4' : '#a855f7')
        .attr('stroke', '#020617')
        .attr('stroke-width', 1.5);

      // Render Paw-Print Stamp icon for Luxembourg, Germany, India, US on map!
      if (isPawStampRegion) {
        nodeGroup.append('text')
          .attr('x', -14)
          .attr('y', -8)
          .text('🐾')
          .attr('font-size', '11px');
      }

      // Label
      nodeGroup.append('text')
        .attr('x', 10)
        .attr('y', 4)
        .text(node.id)
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .attr('fill', isSelected ? '#10b981' : isPawStampRegion ? '#f59e0b' : '#94a3b8');
    });

  }, [projectionType, rotation, selectedNode, nodeFilter, nodes, showThreatHeatmap]);

  // Auto rotation loop for 3D Globe
  useEffect(() => {
    if (!isRotating || projectionType !== 'orthographic') return;

    const timer = setInterval(() => {
      setRotation((prev) => [(prev[0] + 0.4) % 360, prev[1]]);
    }, 50);

    return () => clearInterval(timer);
  }, [isRotating, projectionType]);

  const activeStamp = selectedNode.pawStamp || REGION_PAW_STAMPS[selectedNode.country] || DEFAULT_PAW_STAMP;

  return (
    <div className="pro-card pro-card-hover rounded-2xl p-6 border border-cyan-500/20 bg-slate-900/90 text-slate-100 shadow-2xl my-10 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-950/90 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Globe className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {t('map.title')}
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {t('map.tag')}
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              {t('map.subtitle')}
            </p>
          </div>
        </div>

        {/* Projection Controls, Threat Heatmap Toggle, Add Region Button & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quantum Threat Heatmap Overlay Toggle Button */}
          <button
            onClick={() => {
              const nextState = !showThreatHeatmap;
              setShowThreatHeatmap(nextState);
              showToast(
                nextState ? 'Quantum Threat Heatmap Activated 💥' : 'Heatmap Overlay Hidden',
                nextState ? 'Visualizing real-time geographic nodes with peak PQC handshake volume & lattice activity.' : 'Overlay disabled.',
                'info'
              );
            }}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-lg ${
              showThreatHeatmap
                ? 'bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 text-amber-300 border-amber-500/50 shadow-amber-500/10'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showThreatHeatmap ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Threat Heatmap: {showThreatHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {/* Real-time Toast Trigger: Add Quantum-Safe Region */}
          <button
            onClick={handleAddNewRegion}
            className="px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Quantum-Safe Region 🐕🛡️</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setProjectionType('orthographic')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                projectionType === 'orthographic'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>

            <button
              onClick={() => setProjectionType('mercator')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 ${
                projectionType === 'mercator'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>2D Grid</span>
            </button>
          </div>

          {projectionType === 'orthographic' && (
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all ${
                isRotating
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {isRotating ? 'Pause Rotation' : 'Rotate Globe'}
            </button>
          )}
        </div>
      </div>

      {/* Main Map Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Column: D3 Map Container */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative flex flex-col items-center justify-center min-h-[380px] overflow-hidden" ref={containerRef}>
          <svg ref={svgRef} className="w-full h-auto cursor-grab active:cursor-grabbing" />

          {/* Interactive Hint Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Click node point to inspect active telemetry & Paw-Stamps 🐾
            </span>
            <span className="text-emerald-400 font-bold">{nodes.length} Sovereign Nodes Operational</span>
          </div>
        </div>

        {/* Right Column: Selected Node Details & Paw-Print Stamp Panel */}
        <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Node Telemetry & Paw-Print Stamp
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {selectedNode.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Node ID & Location</span>
              <p className="text-base font-bold text-white font-mono mt-0.5">{selectedNode.id} — {selectedNode.name}</p>
              <p className="text-xs text-cyan-400 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {selectedNode.city}, {selectedNode.country}
              </p>
            </div>

            {/* LOCALIZED PAW-PRINT STAMP CARD FOR LUXEMBOURG, GERMANY, INDIA, US */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/40 space-y-2 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-amber-300 px-2 py-0.5 rounded bg-amber-950 border border-amber-700 flex items-center gap-1">
                  {activeStamp.badge}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  {activeStamp.complianceStandard}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white font-sans">{activeStamp.title}</h4>

              <ul className="space-y-1 font-sans text-[11px] text-slate-300">
                {activeStamp.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">🐾</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono block">Latency</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{selectedNode.latencyMs} ms</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <span className="text-[10px] text-slate-400 font-mono block">Bandwidth</span>
                <span className="text-sm font-mono font-bold text-cyan-300">{(selectedNode.throughputMbps / 1000).toFixed(1)} Gbps</span>
              </div>
            </div>
          </div>

          {/* Quick node selector chips */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block mb-2">Select Primary Sovereign Region:</span>
            <div className="flex flex-wrap gap-1.5">
              {nodes.slice(0, 8).map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors flex items-center gap-1 ${
                    selectedNode.id === node.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{node.id}</span>
                  {['Luxembourg', 'Germany', 'India'].includes(node.country) && <span>🐾</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
