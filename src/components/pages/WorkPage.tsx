import React, { useState } from 'react';
import { NavigationPage } from '../../types';
import { 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Gauge, 
  Sparkles, 
  Terminal, 
  Play, 
  ShieldCheck, 
  RefreshCw,
  Clock,
  TrendingUp,
  Activity,
  Check
} from 'lucide-react';

interface WorkPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ onNavigate }) => {
  const [activeDemo, setActiveDemo] = useState<'saas' | 'ecommerce' | 'latency'>('saas');

  // SaaS Demo State
  const [saasFilter, setSaasFilter] = useState<'all' | 'us' | 'eu' | 'apac'>('all');
  const [saasVolume, setSaasVolume] = useState<number>(250000);

  // E-commerce Demo State
  const [cartItems, setCartItems] = useState<number>(2);
  const [cartSubtotal, setCartSubtotal] = useState<number>(189);
  const [isSimulatingCheckout, setIsSimulatingCheckout] = useState<boolean>(false);
  const [checkoutComplete, setCheckoutComplete] = useState<boolean>(false);

  // Latency inspector state
  const [pingRunning, setPingRunning] = useState<boolean>(false);
  const [latencyResults, setLatencyResults] = useState<Array<{ region: string; time: number; status: string }>>([
    { region: 'us-east (Virginia)', time: 24, status: '200 OK' },
    { region: 'eu-west (Frankfurt)', time: 31, status: '200 OK' },
    { region: 'apac-southeast (Singapore)', time: 58, status: '200 OK' },
    { region: 'af-south (Johannesburg)', time: 72, status: '200 OK' }
  ]);

  const handleSimulateCheckout = () => {
    setIsSimulatingCheckout(true);
    setCheckoutComplete(false);
    setTimeout(() => {
      setIsSimulatingCheckout(false);
      setCheckoutComplete(true);
      setTimeout(() => setCheckoutComplete(false), 4000);
    }, 450);
  };

  const handleRunPing = () => {
    setPingRunning(true);
    setTimeout(() => {
      setLatencyResults([
        { region: 'us-east (Virginia)', time: Math.floor(18 + Math.random() * 12), status: '200 OK' },
        { region: 'eu-west (Frankfurt)', time: Math.floor(25 + Math.random() * 10), status: '200 OK' },
        { region: 'apac-southeast (Singapore)', time: Math.floor(45 + Math.random() * 15), status: '200 OK' },
        { region: 'af-south (Johannesburg)', time: Math.floor(65 + Math.random() * 15), status: '200 OK' }
      ]);
      setPingRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Page Header: Credibility & Tangible Proof */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
          Proof of Engineering Competence
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
          Reference Architectures & Interactive Demos
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          As a modern digital engineering agency, we don’t hide behind ambiguous case studies. We provide <strong>live, interactive test environments</strong> demonstrating our code performance, low latency, and architectural standards upfront.
        </p>
      </div>

      {/* INTERACTIVE PRODUCTION DEMO PLAYGROUND */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Demo Selector Tabs */}
        <div className="bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Test Chamber
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveDemo('saas')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer ${
                activeDemo === 'saas'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              1. SaaS Query Engine
            </button>
            <button
              type="button"
              onClick={() => setActiveDemo('ecommerce')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer ${
                activeDemo === 'ecommerce'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              2. Headless Commerce Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveDemo('latency')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-all cursor-pointer ${
                activeDemo === 'latency'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              3. Edge CDN & Latency
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {/* DEMO 1: HIGH-DENSITY SAAS ENGINE */}
          {activeDemo === 'saas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    High-Density SaaS Telemetry Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Simulates virtualized table rendering and sub-10ms dataset aggregation across 250,000+ records.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    Simulated Latency: 4.8ms
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                    Geo Partition
                  </label>
                  <div className="flex rounded-md shadow-sm border border-slate-300 overflow-hidden bg-white">
                    {(['all', 'us', 'eu', 'apac'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSaasFilter(r)}
                        className={`flex-1 py-1 text-center font-mono uppercase text-[10px] cursor-pointer ${
                          saasFilter === r ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                    Sample Volume ({saasVolume.toLocaleString()} rows)
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="50000"
                    value={saasVolume}
                    onChange={(e) => setSaasVolume(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                    Indexing Strategy
                  </label>
                  <div className="font-mono text-slate-800 font-semibold py-1">
                    B-Tree In-Memory Cache
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-slate-500 mb-1">
                    Lighthouse Vitals
                  </label>
                  <div className="text-emerald-600 font-bold font-mono py-1 flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    INP &lt; 50ms (Zero Lag)
                  </div>
                </div>
              </div>

              {/* Simulated Records Grid */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Event ID</th>
                      <th className="py-2.5 px-4">Origin Node</th>
                      <th className="py-2.5 px-4">Payload Size</th>
                      <th className="py-2.5 px-4">Processing Time</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4].map((i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 text-indigo-700 font-bold">#EV-092{i}</td>
                        <td className="py-2.5 px-4 text-slate-800">{saasFilter.toUpperCase()}-node-{i}</td>
                        <td className="py-2.5 px-4 text-slate-600">{(2.4 * i).toFixed(1)} kB</td>
                        <td className="py-2.5 px-4 text-emerald-600 font-bold">{(1.8 + i * 0.4).toFixed(1)}ms</td>
                        <td className="py-2.5 px-4 text-slate-600">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                            PARSED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEMO 2: HEADLESS COMMERCE FLOW */}
          {activeDemo === 'ecommerce' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    Sub-Second Headless Checkout Simulator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Experience instant cart computation, optimistic UI updates, and frictionless payment initialization.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Shopify Storefront API Protocol
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="text-xs font-mono font-bold text-indigo-600 uppercase">
                    Sample Product #1
                  </div>
                  <h4 className="font-heading font-bold text-base text-slate-900">
                    Precision Swiss Watch Case
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-slate-900 text-lg">$189.00</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCartItems(cartItems + 1);
                        setCartSubtotal(cartSubtotal + 189);
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded cursor-pointer"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase">
                    Cart Architecture State
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Total Items:</span>
                      <strong className="font-mono">{cartItems}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <strong className="font-mono">${cartSubtotal}.00</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className="text-emerald-600 font-mono font-bold">FREE (Edge Sync)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateCheckout}
                    disabled={isSimulatingCheckout}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded transition-colors cursor-pointer"
                  >
                    {isSimulatingCheckout ? 'Verifying with Stripe Edge...' : 'Execute Instant Checkout'}
                  </button>

                  {checkoutComplete && (
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded text-center text-xs font-mono animate-fade-in font-bold">
                      ✓ Order dispatched in 420ms!
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="font-mono font-bold uppercase text-slate-700">
                    Why NexGrid Commerce Wins:
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• Zero layout shift during add-to-cart</li>
                    <li>• Instant localized currency conversions</li>
                    <li>• Direct Stripe Payment Intents proxy</li>
                    <li>• 45% higher conversion over legacy WooCommerce</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* DEMO 3: LATENCY & EDGE CDN INSPECTOR */}
          {activeDemo === 'latency' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    Global Edge CDN Latency Benchmark
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Real-time response verification from edge nodes worldwide.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRunPing}
                  disabled={pingRunning}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${pingRunning ? 'animate-spin' : ''}`} />
                  <span>Run Live Health Ping</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {latencyResults.map((node, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 uppercase">
                      {node.region}
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-slate-900">
                      {node.time} ms
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{node.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOUNDING PARTNER PROGRAM INCENTIVE */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30">
            Cohort 1 Enrollment
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight">
            The NexGrid Founding Partner Program
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            As an emerging high-caliber agency, our reputation depends on delivering world-class results for our inaugural client partners. For our first cohort of business engagements:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl space-y-2">
            <div className="font-heading font-bold text-lg text-white">Direct CTO Attention</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every line of code is directly authored and inspected by principal engineering leadership.
            </p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl space-y-2">
            <div className="font-heading font-bold text-lg text-white">Lighthouse Performance Bond</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We contractually guarantee 90+ to 99+ Lighthouse performance scores before production sign-off.
            </p>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl space-y-2">
            <div className="font-heading font-bold text-lg text-white">Preferential Retainer Terms</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lock in foundational rates on our Scale & Performance Retainer for up to 24 months.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            Apply for Founding Partner Sprint →
          </button>
        </div>
      </section>
    </div>
  );
};
