import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as d3 from 'd3';
import { 
  Globe, Radio, Cpu, ShieldCheck, Zap, RefreshCw, Activity, Compass, 
  MapPin, Plus, Sparkles, Award, Shield, Flame, AlertTriangle, CheckCircle2, 
  Info, X, ChevronRight, Sliders, Lock, ArrowRight, Server, Terminal, ShieldAlert,
  SlidersHorizontal, Eye, BellRing
} from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export interface NetworkNode {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America' | 'Middle East & Africa';
  coordinates: [number, number]; // [longitude, latitude]
  type: 'Primary Enclave' | 'Commercial KMS' | 'Air-Gapped Node';
  latencyMs: number;
  throughputMbps: number;
  hsmStatus: 'Hardware Attested' | 'FIPS 140-3 Validated';
  status: 'Online' | 'Synchronized';
  pqcAlgorithms: string[];
  activeNodesInRegion: number;
  quantumCategory: string;
  threatLevel: number; // 0 - 100
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
  {
    id: 'IAD-01',
    name: 'US East Defense Enclave',
    city: 'Washington D.C.',
    country: 'United States',
    region: 'North America',
    coordinates: [-77.0369, 38.9072],
    type: 'Primary Enclave',
    latencyMs: 1.12,
    throughputMbps: 12500,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)', 'SLH-DSA-SHAKE-256 (FIPS 205)'],
    activeNodesInRegion: 6,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 42,
    pawStamp: REGION_PAW_STAMPS['United States'],
  },
  {
    id: 'FRA-02',
    name: 'BSI Germany Sovereign Core',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    coordinates: [8.6821, 50.1109],
    type: 'Primary Enclave',
    latencyMs: 1.45,
    throughputMbps: 18200,
    hsmStatus: 'Hardware Attested',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'BSI Kyber-1024 Ratchet', 'ML-DSA-87 (FIPS 204)'],
    activeNodesInRegion: 8,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 68,
    pawStamp: REGION_PAW_STAMPS['Germany'],
  },
  {
    id: 'LUX-01',
    name: 'CSSF Luxembourg Financial Vault',
    city: 'Luxembourg City',
    country: 'Luxembourg',
    region: 'Europe',
    coordinates: [6.1319, 49.6116],
    type: 'Primary Enclave',
    latencyMs: 1.05,
    throughputMbps: 19500,
    hsmStatus: 'Hardware Attested',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'CSSF Sovereign PSF Lattice', 'ML-DSA-87 (FIPS 204)'],
    activeNodesInRegion: 8,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 35,
    pawStamp: REGION_PAW_STAMPS['Luxembourg'],
  },
  {
    id: 'BLR-01',
    name: 'India NASSCOM DeepTech Enclave',
    city: 'Bengaluru',
    country: 'India',
    region: 'Middle East & Africa',
    coordinates: [77.5946, 12.9716],
    type: 'Primary Enclave',
    latencyMs: 1.85,
    throughputMbps: 16800,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)', 'NASSCOM Lattice CoE'],
    activeNodesInRegion: 5,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 55,
    pawStamp: REGION_PAW_STAMPS['India'],
  },
  {
    id: 'TYO-04',
    name: 'APAC North Node',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia-Pacific',
    coordinates: [139.6917, 35.6895],
    type: 'Primary Enclave',
    latencyMs: 2.10,
    throughputMbps: 15400,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)', 'Stateful Hash XMSS'],
    activeNodesInRegion: 7,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 48,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'LHR-01',
    name: 'UK Financial Gateway',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    coordinates: [-0.1278, 51.5074],
    type: 'Commercial KMS',
    latencyMs: 1.28,
    throughputMbps: 11000,
    hsmStatus: 'Hardware Attested',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-65 (FIPS 204)'],
    activeNodesInRegion: 8,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 30,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'SIN-02',
    name: 'Southeast Asia Hub',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia-Pacific',
    coordinates: [103.8198, 1.3521],
    type: 'Commercial KMS',
    latencyMs: 2.45,
    throughputMbps: 9800,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'SLH-DSA-SHAKE-256'],
    activeNodesInRegion: 7,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 62,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'SYD-01',
    name: 'Oceania Secure Vault',
    city: 'Sydney',
    country: 'Australia',
    region: 'Asia-Pacific',
    coordinates: [151.2093, -33.8688],
    type: 'Air-Gapped Node',
    latencyMs: 3.10,
    throughputMbps: 8400,
    hsmStatus: 'Hardware Attested',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'SLH-DSA-SHA2-256'],
    activeNodesInRegion: 7,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 20,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'ZRH-01',
    name: 'Alpine Hardware Vault',
    city: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    coordinates: [8.5417, 47.3769],
    type: 'Air-Gapped Node',
    latencyMs: 0.95,
    throughputMbps: 21000,
    hsmStatus: 'Hardware Attested',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)', 'Air-Gapped Lattice HSM'],
    activeNodesInRegion: 8,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 15,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'DXB-01',
    name: 'MENA Gateway',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East & Africa',
    coordinates: [55.2708, 25.2048],
    type: 'Commercial KMS',
    latencyMs: 2.15,
    throughputMbps: 9200,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-65 (FIPS 204)'],
    activeNodesInRegion: 5,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 50,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'GRU-01',
    name: 'Latin America Hub',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'Latin America',
    coordinates: [-46.6333, -23.5505],
    type: 'Commercial KMS',
    latencyMs: 3.40,
    throughputMbps: 7600,
    hsmStatus: 'Hardware Attested',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-768 (FIPS 203)', 'ML-DSA-65 (FIPS 204)'],
    activeNodesInRegion: 3,
    quantumCategory: 'Category 3 (192-bit)',
    threatLevel: 40,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'YYZ-03',
    name: 'Canada Core',
    city: 'Toronto',
    country: 'Canada',
    region: 'North America',
    coordinates: [-79.3832, 43.6532],
    type: 'Primary Enclave',
    latencyMs: 1.32,
    throughputMbps: 13400,
    hsmStatus: 'FIPS 140-3 Validated',
    status: 'Online',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)'],
    activeNodesInRegion: 6,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 28,
    pawStamp: DEFAULT_PAW_STAMP,
  },
  {
    id: 'ICN-01',
    name: 'East Asia Tunnel',
    city: 'Seoul',
    country: 'South Korea',
    region: 'Asia-Pacific',
    coordinates: [126.9780, 37.5665],
    type: 'Commercial KMS',
    latencyMs: 2.05,
    throughputMbps: 14100,
    hsmStatus: 'Hardware Attested',
    status: 'Synchronized',
    pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)'],
    activeNodesInRegion: 7,
    quantumCategory: 'Category 5 (256-bit)',
    threatLevel: 45,
    pawStamp: DEFAULT_PAW_STAMP,
  },
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
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(INITIAL_NETWORK_NODES[2]); // Luxembourg
  const [isRegionPanelOpen, setIsRegionPanelOpen] = useState<boolean>(false);
  const [rotation, setRotation] = useState<[number, number]>([-15, -25]);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [nodeFilter, setNodeFilter] = useState<'ALL' | 'Primary Enclave' | 'Air-Gapped Node'>('ALL');
  const [showThreatHeatmap, setShowThreatHeatmap] = useState<boolean>(true);

  // Real-Time Threat Simulation State
  const [globalThreatScore, setGlobalThreatScore] = useState<number>(54);
  const [isSimulatingThreats, setIsSimulatingThreats] = useState<boolean>(false);
  const [alertThreshold, setAlertThreshold] = useState<number>(75);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);
  const [isSimulatingShorAttack, setIsSimulatingShorAttack] = useState<boolean>(false);

  // Threat score fluctuation when simulation is explicitly enabled
  useEffect(() => {
    if (!isSimulatingThreats) return;

    const interval = setInterval(() => {
      setGlobalThreatScore((prev) => {
        const delta = Math.floor(Math.random() * 15) - 6; // -6 to +8
        return Math.min(Math.max(prev + delta, 15), 98);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingThreats]);

  // Trigger Manual Threat Surge Test
  const handleTriggerThreatSurge = () => {
    const spikeScore = Math.floor(Math.random() * 15) + 82; // 82% - 96%
    setGlobalThreatScore(spikeScore);
    
    showToast(
      'Threat Spike Simulated',
      `Simulated ${spikeScore}% intercept load. Lattice ratchet engaged.`,
      'warning'
    );
  };

  // Function to add a new Quantum-Safe Region
  const handleAddNewRegion = () => {
    const candidateRegions = [
      { id: `LUX-0${nodes.length + 1}`, name: 'Luxembourg PSF Satellite Enclave #2', city: 'Esch-sur-Alzette', country: 'Luxembourg', region: 'Europe' as const, coords: [5.9806, 49.4958] as [number, number], stamp: REGION_PAW_STAMPS['Luxembourg'] },
      { id: `FRA-0${nodes.length + 1}`, name: 'BSI Germany Munich Sovereign Core #2', city: 'Munich', country: 'Germany', region: 'Europe' as const, coords: [11.5820, 48.1351] as [number, number], stamp: REGION_PAW_STAMPS['Germany'] },
      { id: `DEL-01`, name: 'India NASSCOM New Delhi Security Hub', city: 'New Delhi', country: 'India', region: 'Middle East & Africa' as const, coords: [77.2090, 28.6139] as [number, number], stamp: REGION_PAW_STAMPS['India'] },
      { id: `CDG-01`, name: 'France Sovereign Defense Vault', city: 'Paris', country: 'France', region: 'Europe' as const, coords: [2.3522, 48.8566] as [number, number], stamp: DEFAULT_PAW_STAMP },
    ];

    const nextRegion = candidateRegions[nodes.length % candidateRegions.length];

    const newNode: NetworkNode = {
      id: nextRegion.id,
      name: nextRegion.name,
      city: nextRegion.city,
      country: nextRegion.country,
      region: nextRegion.region,
      coordinates: nextRegion.coords,
      type: 'Primary Enclave',
      latencyMs: 1.15,
      throughputMbps: 22000,
      hsmStatus: 'FIPS 140-3 Validated',
      status: 'Online',
      pqcAlgorithms: ['ML-KEM-1024 (FIPS 203)', 'ML-DSA-87 (FIPS 204)'],
      activeNodesInRegion: 9,
      quantumCategory: 'Category 5 (256-bit)',
      threatLevel: 25,
      pawStamp: nextRegion.stamp || DEFAULT_PAW_STAMP,
    };

    setNodes((prev) => [newNode, ...prev]);
    setSelectedNode(newNode);
    setIsRegionPanelOpen(true);

    showToast(
      'New Region Added',
      `${newNode.city}, ${newNode.country} connected to mesh.`,
      'success'
    );
  };

  // World continent geometry generator & D3 rendering logic
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(width * 0.55, 480);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.selectAll('*').remove();

    // SVG Gradients Definition
    const defs = svg.append('defs');

    // Heat Gradient - Critical (Red)
    const radGradCritical = defs.append('radialGradient')
      .attr('id', 'heatGradCritical')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradCritical.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', '0.8');
    radGradCritical.append('stop').attr('offset', '50%').attr('stop-color', '#f97316').attr('stop-opacity', '0.4');
    radGradCritical.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', '0');

    // Heat Gradient - High Activity (Amber)
    const radGradHigh = defs.append('radialGradient')
      .attr('id', 'heatGradHigh')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradHigh.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0.75');
    radGradHigh.append('stop').attr('offset', '60%').attr('stop-color', '#fbbf24').attr('stop-opacity', '0.25');
    radGradHigh.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0');

    // Heat Gradient - Active PQC (Cyan)
    const radGradCyan = defs.append('radialGradient')
      .attr('id', 'heatGradCyan')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radGradCyan.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0.7');
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

    // Globe Layer
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
        .attr('style', 'filter: drop-shadow(0px 0px 18px rgba(6, 182, 212, 0.3));');
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

    // Sphere perimeter
    const sphere = { type: 'Sphere' } as const;
    gMap.append('path')
      .datum(sphere)
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#0284c7')
      .attr('stroke-width', 0.8)
      .attr('stroke-opacity', 0.3);

    // Draw Quantum Threat Heatmap Overlay
    if (showThreatHeatmap) {
      const gHeatmap = svg.append('g').attr('class', 'heatmap-layer');

      nodes.forEach((node) => {
        const coords = projection(node.coordinates);
        if (!coords) return;

        if (projectionType === 'orthographic') {
          const distance = d3.geoDistance(node.coordinates, [-rotation[0], -rotation[1]]);
          if (distance > Math.PI / 2) return;
        }

        let gradId = 'url(#heatGradCyan)';
        let baseRadius = 24;

        if (globalThreatScore >= 75 || ['Frankfurt', 'Luxembourg City', 'Washington D.C.'].includes(node.city)) {
          gradId = 'url(#heatGradCritical)';
          baseRadius = 42;
        } else if (['Bengaluru', 'Tokyo', 'Zurich', 'London'].includes(node.city)) {
          gradId = 'url(#heatGradHigh)';
          baseRadius = 32;
        }

        const heatGroup = gHeatmap.append('g')
          .attr('transform', `translate(${coords[0]}, ${coords[1]})`);

        heatGroup.append('circle')
          .attr('r', baseRadius)
          .attr('fill', gradId)
          .attr('pointer-events', 'none')
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', `${baseRadius}; ${baseRadius * 1.4}; ${baseRadius}`)
          .attr('dur', `${2 + (node.id.charCodeAt(0) % 3)}s`)
          .attr('repeatCount', 'indefinite');

        heatGroup.append('circle')
          .attr('r', baseRadius * 0.4)
          .attr('fill', gradId)
          .attr('pointer-events', 'none');
      });
    }

    // Draw Tunnel Connection Links
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
          // Tunnel line base
          gLinks.append('path')
            .attr('d', pathData)
            .attr('fill', 'none')
            .attr('stroke', '#06b6d4')
            .attr('stroke-width', 1.2)
            .attr('stroke-opacity', 0.4)
            .attr('stroke-dasharray', '4 4');
        }
      }
    });

    // Draw Node Markers & Pulsing Halos
    const gNodes = svg.append('g').attr('class', 'nodes-layer');

    const filteredNodes = nodes.filter(
      (n) => nodeFilter === 'ALL' || n.type === nodeFilter
    );

    filteredNodes.forEach((node) => {
      const coords = projection(node.coordinates);
      if (!coords) return;

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
          setIsRegionPanelOpen(true);
        });

      // Selection indicator pulse
      if (isSelected) {
        nodeGroup.append('circle')
          .attr('r', 16)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2)
          .attr('opacity', 0.9)
          .append('animate')
          .attr('attributeName', 'r')
          .attr('values', '6; 20; 6')
          .attr('dur', '2s')
          .attr('repeatCount', 'indefinite');
      }

      // Outer halo circle
      nodeGroup.append('circle')
        .attr('r', isSelected ? 8 : 5)
        .attr('fill', isSelected ? '#10b981' : isPawStampRegion ? '#f59e0b' : node.type === 'Primary Enclave' ? '#06b6d4' : '#a855f7')
        .attr('stroke', '#020617')
        .attr('stroke-width', 1.5);

      // Paw print icon for sovereign nodes
      if (isPawStampRegion) {
        nodeGroup.append('text')
          .attr('x', -14)
          .attr('y', -8)
          .text('🐾')
          .attr('font-size', '11px');
      }

      // Label text
      nodeGroup.append('text')
        .attr('x', 10)
        .attr('y', 4)
        .text(node.id)
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .attr('fill', isSelected ? '#10b981' : isPawStampRegion ? '#f59e0b' : '#94a3b8');
    });

  }, [projectionType, rotation, selectedNode, nodeFilter, nodes, showThreatHeatmap, globalThreatScore]);

  // Auto rotation loop for 3D Globe
  useEffect(() => {
    if (!isRotating || projectionType !== 'orthographic') return;

    const timer = setInterval(() => {
      setRotation((prev) => [(prev[0] + 0.4) % 360, prev[1]]);
    }, 50);

    return () => clearInterval(timer);
  }, [isRotating, projectionType]);

  // Calculate active projection for Framer Motion path traces overlay
  const projectedLinks = useMemo(() => {
    if (!containerRef.current) return [];
    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(width * 0.55, 480);

    let proj: d3.GeoProjection;
    if (projectionType === 'orthographic') {
      proj = d3.geoOrthographic()
        .scale(Math.min(width, height) * 0.42)
        .translate([width / 2, height / 2])
        .rotate([rotation[0], rotation[1], 0]);
    } else {
      proj = d3.geoMercator()
        .scale(width / 6.5)
        .translate([width / 2, height / 1.6]);
    }

    const pathGen = d3.geoPath().projection(proj);

    return TUNNEL_LINKS.map(([sId, tId], idx) => {
      const sNode = nodes.find(n => n.id === sId);
      const tNode = nodes.find(n => n.id === tId);

      if (!sNode || !tNode) return null;

      // In orthographic mode, check if both nodes or midpoint are on front side of globe
      if (projectionType === 'orthographic') {
        const sDist = d3.geoDistance(sNode.coordinates, [-rotation[0], -rotation[1]]);
        const tDist = d3.geoDistance(tNode.coordinates, [-rotation[0], -rotation[1]]);
        if (sDist > Math.PI / 2 && tDist > Math.PI / 2) return null;
      }

      const linkFeature: any = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [sNode.coordinates, tNode.coordinates]
        }
      };

      const pathStr = pathGen(linkFeature);
      const p1 = proj(sNode.coordinates);
      const p2 = proj(tNode.coordinates);

      return {
        id: `${sId}-${tId}-${idx}`,
        pathStr,
        p1,
        p2,
        sId,
        tId,
        algorithm: sNode.pqcAlgorithms[0] || 'ML-KEM-1024'
      };
    }).filter(Boolean);
  }, [nodes, projectionType, rotation]);

  const activeStamp = selectedNode.pawStamp || REGION_PAW_STAMPS[selectedNode.country] || DEFAULT_PAW_STAMP;

  return (
    <div className="pro-card pro-card-hover rounded-2xl p-6 border border-cyan-500/20 bg-slate-900/90 text-slate-100 shadow-2xl my-10 relative overflow-hidden">
      
      {/* REAL-TIME QUANTUM INTERCEPT TRAFFIC MONITOR HEADER */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 mb-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${
            globalThreatScore >= 75
              ? 'bg-red-950/90 border-red-500/50 text-red-400 animate-pulse'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400'
          }`}>
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                REAL-TIME QUANTUM INTERCEPT TRAFFIC MONITOR
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                globalThreatScore >= 75
                  ? 'bg-red-950 text-red-400 border border-red-800 animate-pulse'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {globalThreatScore >= 75 ? 'SURGE DETECTED - AUTO-RATCHET ACTIVE' : 'NOMINAL THREAT LEVEL'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Simulated eavesdropping traffic threshold set to <span className="font-mono text-cyan-400 font-bold">{alertThreshold}%</span>. Triggers real-time Toast alerts upon surge.
            </p>
          </div>
        </div>

        {/* Global Intercept Gauge & Simulation Controls */}
        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Intercept Index:</span>
            <div className="w-28 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
              <div 
                className={`h-full transition-all duration-500 ${
                  globalThreatScore >= 75 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                }`}
                style={{ width: `${globalThreatScore}%` }}
              />
            </div>
            <span className={`text-xs font-mono font-bold ${globalThreatScore >= 75 ? 'text-red-400' : 'text-cyan-400'}`}>
              {globalThreatScore}%
            </span>
          </div>

          <button
            onClick={handleTriggerThreatSurge}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Spike Threat (&gt;75%)</span>
          </button>
        </div>
      </div>

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

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SIMULATE QUANTUM THREAT TOGGLE (SHOR'S ALGORITHM) */}
          <button
            onClick={() => {
              const next = !isSimulatingShorAttack;
              setIsSimulatingShorAttack(next);
              showToast(
                next ? 'Threat Simulation Active' : 'Simulation Stopped',
                undefined,
                next ? 'warning' : 'info'
              );
            }}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
              isSimulatingShorAttack
                ? 'bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white border-red-400 shadow-red-500/30 animate-pulse'
                : 'bg-slate-950 text-red-400 border-red-500/30 hover:bg-red-950/40 hover:text-red-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingShorAttack ? 'text-yellow-300 animate-bounce' : 'text-red-400'}`} />
            <span>Simulate Quantum Threat {isSimulatingShorAttack ? '⚡ ON' : ''}</span>
          </button>

          {/* Threat Heatmap Overlay Toggle */}
          <button
            onClick={() => {
              const nextState = !showThreatHeatmap;
              setShowThreatHeatmap(nextState);
              showToast(
                nextState ? 'Heatmap Enabled' : 'Heatmap Hidden',
                undefined,
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
            <span>Heatmap: {showThreatHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {/* Add Quantum-Safe Region */}
          <button
            onClick={handleAddNewRegion}
            className="px-3.5 py-1.5 text-xs font-mono font-bold rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Region 🐕🛡️</span>
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
        
        {/* Left Column: D3 Map Container with Framer Motion Animated Path Traces Overlay */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-xl p-4 relative flex flex-col items-center justify-center min-h-[400px] overflow-hidden" ref={containerRef}>
          
          {/* ACTIVE SHOR'S ALGORITHM QUANTUM ATTACK BANNER OVERLAY */}
          {isSimulatingShorAttack && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-3 right-3 z-30 bg-slate-950/95 border-2 border-red-500 rounded-2xl p-3 shadow-2xl backdrop-blur-md space-y-1 text-center"
            >
              <div className="flex items-center justify-center space-x-2 text-red-400 font-mono text-xs font-black uppercase tracking-wider">
                <Zap className="w-4 h-4 text-red-400 animate-bounce" />
                <span>{t('map.shorActive')}</span>
                <Zap className="w-4 h-4 text-red-400 animate-bounce" />
              </div>
              <p className="text-[11px] text-slate-200 font-sans leading-tight">
                <span className="text-red-400 font-mono font-bold">{t('map.shorClassical')} </span>{t('map.shorClassicalDesc')} <br className="hidden sm:inline" />
                <span className="text-emerald-400 font-mono font-bold">{t('map.shorPqc')} </span>{t('map.shorPqcDesc')}
              </p>
            </motion.div>
          )}

          {/* Base D3 Map SVG */}
          <svg ref={svgRef} className="w-full h-auto cursor-grab active:cursor-grabbing" />

          {/* FRAMER MOTION ANIMATED PATH TRACES OVERLAY */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {projectedLinks.map((link, idx) => {
              if (!link || !link.pathStr) return null;

              // Determine if this connection is simulated as broken classical vs PQC lattice resilient
              const isBrokenClassical = isSimulatingShorAttack && idx % 3 === 0;

              return (
                <g key={`framer-link-${link.id}`}>
                  {/* Glowing Animated Path Trace */}
                  <motion.path
                    d={link.pathStr}
                    fill="none"
                    stroke={isBrokenClassical ? '#ef4444' : isSimulatingShorAttack ? '#10b981' : '#06b6d4'}
                    strokeWidth={isBrokenClassical ? 2.5 : isSimulatingShorAttack ? 2.2 : 1.8}
                    strokeOpacity={isBrokenClassical ? 0.9 : 0.7}
                    strokeDasharray={isBrokenClassical ? '3 3' : '6 6'}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: isBrokenClassical ? [-10, 10, -10] : -24 }}
                    transition={{
                      repeat: Infinity,
                      duration: isBrokenClassical ? 0.4 : 1.5,
                      ease: 'linear',
                    }}
                    style={{
                      filter: isBrokenClassical 
                        ? 'drop-shadow(0px 0px 8px #ef4444)' 
                        : isSimulatingShorAttack 
                          ? 'drop-shadow(0px 0px 10px #10b981)' 
                          : 'none'
                    }}
                  />

                  {/* Flowing Encrypted Quantum Packet Particle */}
                  {link.p1 && link.p2 && (
                    <motion.circle
                      r={isBrokenClassical ? 4 : 3.5}
                      fill={isBrokenClassical ? '#f87171' : '#10b981'}
                      initial={{
                        cx: link.p1[0],
                        cy: link.p1[1],
                        opacity: 0.8,
                      }}
                      animate={{
                        cx: [link.p1[0], (link.p1[0] + link.p2[0]) / 2, link.p2[0]],
                        cy: [link.p1[1], (link.p1[1] + link.p2[1]) / 2 - 12, link.p2[1]],
                        opacity: isBrokenClassical ? [0.8, 0.2, 0.9] : [0.2, 1, 0.2],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: isBrokenClassical ? 0.8 : 2.8 + (link.sId.charCodeAt(0) % 2),
                        ease: 'easeInOut',
                      }}
                      style={{ filter: isBrokenClassical ? 'drop-shadow(0px 0px 8px #ef4444)' : 'drop-shadow(0px 0px 8px #10b981)' }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Hint Banner */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-lg border border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> 
              Click node or region chip to reveal detailed PQC Algorithm Panel 🐾
            </span>
            <span className="text-emerald-400 font-bold hidden sm:inline">{nodes.length} Sovereign Nodes Operational</span>
          </div>
        </div>

        {/* Right Column: Selected Region & Paw-Print Stamp Summary */}
        <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-cyan-400" />
                Active Region Overview
              </span>
              <button
                onClick={() => setIsRegionPanelOpen(true)}
                className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Expand Panel</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Selected Region & Sovereign Enclave</span>
              <p className="text-base font-bold text-white font-mono mt-0.5">{selectedNode.id} — {selectedNode.name}</p>
              <p className="text-xs text-cyan-400 font-mono flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {selectedNode.city}, {selectedNode.country} ({selectedNode.region})
              </p>
            </div>

            {/* Deployed PQC Algorithms Chips */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">
                Deployed PQC Standards in Area:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.pqcAlgorithms.map((alg, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80 flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {alg}
                  </span>
                ))}
              </div>
            </div>

            {/* LOCALIZED PAW-PRINT STAMP CARD */}
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
                <span className="text-[10px] text-slate-400 font-mono block">Active Nodes</span>
                <span className="text-sm font-mono font-bold text-cyan-300">{selectedNode.activeNodesInRegion} Nodes</span>
              </div>
            </div>
          </div>

          {/* Region Quick Chips */}
          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block mb-2">Select Regional Enclave:</span>
            <div className="flex flex-wrap gap-1.5">
              {nodes.slice(0, 8).map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setIsRegionPanelOpen(true);
                  }}
                  className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedNode.id === node.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{node.id}</span>
                  {['Luxembourg', 'Germany', 'India', 'United States'].includes(node.country) && <span>🐾</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED REGION MODAL / OVERLAY PANEL */}
      <AnimatePresence>
        {isRegionPanelOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden font-sans"
            >
              {/* Panel Header */}
              <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-950 border border-cyan-500/40 rounded-2xl text-cyan-400">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                        REGIONAL SECURITY TELEMETRY
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        {selectedNode.quantumCategory}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                      {selectedNode.name} ({selectedNode.id})
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsRegionPanelOpen(false)}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                
                {/* Location & Nodes Count Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-xs font-mono text-slate-400 block">Region & Location</span>
                    <p className="text-sm font-bold text-white font-mono mt-1">{selectedNode.city}, {selectedNode.country}</p>
                    <span className="text-[11px] text-cyan-400 font-mono">{selectedNode.region} Zone</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-xs font-mono text-slate-400 block">Active Nodes in Region</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{selectedNode.activeNodesInRegion} Nodes</p>
                    <span className="text-[11px] text-slate-400 font-mono">100% Lattice Synchronized</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                    <span className="text-xs font-mono text-slate-400 block">Hardware Security</span>
                    <p className="text-sm font-bold text-amber-300 font-mono mt-1">{selectedNode.hsmStatus}</p>
                    <span className="text-[11px] text-slate-400 font-mono">CC EAL4+ Enclave Attestation</span>
                  </div>
                </div>

                {/* Specific PQC Algorithms Deployed in Region */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Specific PQC Algorithms Deployed in {selectedNode.region}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">NIST FIPS 203 & 204 Native</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedNode.pqcAlgorithms.map((alg, index) => (
                      <div key={index} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-mono font-bold text-white">{alg}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                          Active
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Performance & Security Telemetry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Network Latency:</span>
                      <span className="text-emerald-400 font-bold">{selectedNode.latencyMs} ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Mesh Throughput:</span>
                      <span className="text-cyan-300 font-bold">{(selectedNode.throughputMbps / 1000).toFixed(1)} Gbps</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Quantum Security Level:</span>
                      <span className="text-amber-300 font-bold">{selectedNode.quantumCategory}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>HNDL Intercept Risk:</span>
                      <span className="text-emerald-400 font-bold">0.0% (Immune)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Key Ratchet Interval:</span>
                      <span className="text-cyan-300 font-bold">Every 100 Messages</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Sovereignty Compliance:</span>
                      <span className="text-amber-300 font-bold">{selectedNode.pawStamp?.complianceStandard || 'FIPS Native'}</span>
                    </div>
                  </div>
                </div>

                {/* PAW-STAMP FULL DETAIL BANNER */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-amber-300 px-3 py-1 rounded-lg bg-amber-950 border border-amber-700">
                      {activeStamp.badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {activeStamp.complianceStandard}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white">{activeStamp.title}</h4>

                  <ul className="space-y-1.5 font-sans text-xs text-slate-300">
                    {activeStamp.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 shrink-0">🐾</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Panel Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Node ID: <strong className="text-white">{selectedNode.id}</strong></span>
                
                <button
                  onClick={() => setIsRegionPanelOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
                >
                  Close Region Panel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
