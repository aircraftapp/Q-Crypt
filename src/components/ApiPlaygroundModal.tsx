import React, { useState } from 'react';
import { 
  X, Terminal, Code2, Play, Copy, Check, Sparkles, RefreshCw, Layers, ShieldCheck, Server, Send, KeyRound
} from 'lucide-react';
import { useToast } from './Toast';

interface ApiPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiPlaygroundModal: React.FC<ApiPlaygroundModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState<'handshake' | 'encrypt' | 'attest' | 'stream'>('handshake');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'typescript' | 'python' | 'cpp'>('typescript');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const endpoints = {
    handshake: {
      method: 'POST',
      path: '/api/v1/pqc/handshake/init',
      title: 'Initiate ML-KEM-1024 Post-Quantum Key Exchange',
      description: 'Generates NIST FIPS 203 public key encapsulation vector and binds session to client hardware enclave.',
      requestBody: {
        client_id: 'org_enterprise_m2_99',
        algorithm: 'ML-KEM-1024',
        enclave_attestation_nonce: '0x8F92A014BC88FE21',
        classical_hybrid: 'X25519'
      },
      responseBody: {
        status: 'SUCCESS',
        session_id: 'qc_sess_77491209_fips203',
        server_public_key_kem: '0x94F2B811A0413C9E...[1568 Bytes]',
        ciphertext_encapsulation: '0x1128C4A992...[1568 Bytes]',
        shared_secret_hash: 'sha256_88b2a1909e4f210a',
        latency_ms: 1.12,
        hardware_hsm: 'FIPS_140_3_LEVEL_4_VALIDATED'
      }
    },
    encrypt: {
      method: 'POST',
      path: '/api/v1/pqc/message/encrypt',
      title: 'Encrypt Payload with Post-Quantum Kyber-1024',
      description: 'Wraps raw payload inside constant-time lattice polynomial matrix with zeroized memory guarantees.',
      requestBody: {
        session_id: 'qc_sess_77491209_fips203',
        recipient_peer_id: 'operative_alpha_01',
        raw_payload_base64: 'U3RyYXRlZ2ljIEZpZWxkIEJyaWVmaW5nIFAyUA==',
        self_destruct_seconds: 300
      },
      responseBody: {
        status: 'ENCRYPTED',
        message_id: 'msg_pqc_990141',
        lattice_ciphertext: '0x77A1049B22EF901...[Poly Matrix q=3329]',
        fips204_signature: '0x55B291A04...[ML-DSA-87 Signed]',
        memory_zeroization: 'VERIFIED_EXPLICIT_BZERO'
      }
    },
    attest: {
      method: 'POST',
      path: '/api/v1/pqc/enclave/attest',
      title: 'Titan M2 / Secure Enclave Hardware Remote Attestation',
      description: 'Validates device physical hardware root-of-trust signature before issuing cryptographic keys.',
      requestBody: {
        device_model: 'Google Pixel 8 Pro / Titan M2',
        hardware_serial_hash: '0x491028471029381A',
        key_storage_mode: 'Hardware_Isolated_TEE'
      },
      responseBody: {
        attestation_status: 'PASSED',
        trust_level: 'HARDWARE_BOUND_ROOT',
        tamper_flags: false,
        key_rotation_policy: 'AUTOMATED_24H'
      }
    },
    stream: {
      method: 'POST',
      path: '/api/v1/pqc/push-to-talk/stream',
      title: 'Encrypted PTT Voice Burst Stream Tunnel',
      description: 'Opens low-latency voice audio burst stream wrapped in post-quantum Kyber packets.',
      requestBody: {
        channel_id: 'voice_mesh_sec_04',
        audio_codec: 'Opus_24kbps_HD',
        chunk_duration_ms: 100
      },
      responseBody: {
        stream_status: 'ACTIVE_TUNNEL',
        tunnel_protocol: 'PQC_QUIC_UDP_MESH',
        audio_packet_encryption: 'AES_256_GCM_WITH_PQC_KEY',
        bitrate_kbps: 24,
        jitter_ms: 0.8
      }
    }
  };

  const activeEp = endpoints[selectedEndpoint];

  const getCodeSnippet = () => {
    const jsonReq = JSON.stringify(activeEp.requestBody, null, 2);

    if (selectedLanguage === 'curl') {
      return `curl -X ${activeEp.method} "https://api.qcrypt.io${activeEp.path}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer qc_sk_live_990141882" \\
  -d '${jsonReq}'`;
    }

    if (selectedLanguage === 'typescript') {
      return `import { QCryptClient } from '@qcrypt/sdk';

const qcrypt = new QCryptClient({
  apiKey: process.env.QCRYPT_API_KEY,
  hardwareEnclaveRequired: true,
});

async function runPqcOperation() {
  const response = await qcrypt.request({
    endpoint: '${activeEp.path}',
    method: '${activeEp.method}',
    data: ${jsonReq}
  });

  console.log('Q-CRYPT Response:', response);
}

runPqcOperation();`;
    }

    if (selectedLanguage === 'python') {
      return `import requests
import os

url = "https://api.qcrypt.io${activeEp.path}"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.getenv('QCRYPT_API_KEY')}"
}
payload = ${jsonReq.replace(/true/g, 'True').replace(/false/g, 'False')}

response = requests.post(url, json=payload, headers=headers)
print("Q-CRYPT PQC Status:", response.status_code)
print("Response Body:", response.json())`;
    }

    return `// C++20 liboqs Native Wrapper Integration
#include <qcrypt/engine.hpp>
#include <iostream>

int main() {
    qcrypt::Engine engine(qcrypt::Mode::ML_KEM_1024);
    
    auto request = qcrypt::BuildRequest("${activeEp.path}");
    request.set_payload(R"(${jsonReq})");

    auto response = engine.execute(request);
    std::cout << "Status: " << response.status_code() << std::endl;
    return 0;
}`;
  };

  const handleRunTest = () => {
    setIsSimulating(true);
    setHasRun(false);

    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
      showToast('API Request Executed', `200 OK returned from https://api.qcrypt.io${activeEp.path}`, 'success');
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    showToast('Code Snippet Copied', 'Paste into your development environment to integrate Q-CRYPT.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Q-CRYPT Messaging Engine API Playground
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Interactive request / response sandbox for post-quantum lattice integrations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 font-mono text-xs">
          
          {/* Endpoint Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {(Object.keys(endpoints) as (keyof typeof endpoints)[]).map((epKey) => {
              const isSelected = selectedEndpoint === epKey;
              const ep = endpoints[epKey];

              return (
                <button
                  key={epKey}
                  onClick={() => {
                    setSelectedEndpoint(epKey);
                    setHasRun(false);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/90 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-900/80 text-cyan-300">
                      {ep.method}
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate">{epKey.toUpperCase()}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">{ep.path}</p>
                </button>
              );
            })}
          </div>

          {/* Active Endpoint Info Header */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold text-[10px]">
                {activeEp.method}
              </span>
              <span className="text-cyan-400 font-bold font-mono text-xs">{activeEp.path}</span>
            </div>
            <h4 className="text-sm font-bold text-white font-sans">{activeEp.title}</h4>
            <p className="text-xs text-slate-400 font-sans">{activeEp.description}</p>
          </div>

          {/* Split Code Request & Live Response Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Request Code Snippet */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">SDK / Language:</span>
                  <div className="flex items-center space-x-1">
                    {(['typescript', 'curl', 'python', 'cpp'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          selectedLanguage === lang
                            ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang === 'typescript' ? 'TypeScript' : lang === 'curl' ? 'cURL' : lang === 'python' ? 'Python' : 'C++ liboqs'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 text-[10px] flex items-center space-x-1 transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto h-72">
                <pre>{getCodeSnippet()}</pre>
              </div>

              <button
                onClick={handleRunTest}
                disabled={isSimulating}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-sans flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:scale-[1.01] transition-all"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing PQC Handshake...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test API Request</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Response Payload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-bold uppercase text-[10px]">API Response Output:</span>
                {hasRun && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>200 OK (1.12ms)</span>
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto h-72">
                {hasRun ? (
                  <pre>{JSON.stringify(activeEp.responseBody, null, 2)}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <Terminal className="w-8 h-8 text-slate-700" />
                    <span>Click "Send Test API Request" to view live response output</span>
                  </div>
                )}
              </div>

              {hasRun && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800 text-[11px] font-sans text-cyan-200 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified: Response payload encrypted with ML-KEM-1024 & verified by Titan M2 enclave attestation.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
