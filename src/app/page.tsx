import { AutonDemo } from "@/components/auton-demo";
import { ExternalLink } from "lucide-react";

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-white tracking-widest text-sm">AUTON</span>
          <span className="px-1 py-px rounded text-[9px] font-mono bg-purple-500/10 text-purple-400/80 border border-purple-500/15 tracking-wider">β</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#demo" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">demo</a>
          <a href="#protocol" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">protocol</a>
          <a
            href="https://mpptestkit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            mpptestkit.com <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </nav>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-start">
          {/* Left: text */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">
                Live on Solana devnet
              </span>
            </div>

            <h1 className="font-mono font-bold text-5xl md:text-6xl text-white tracking-tight mb-4 leading-none">
              AUTON
            </h1>

            <p className="text-xl md:text-2xl text-zinc-300 font-medium mb-4 leading-snug max-w-xl">
              Agents that pay their own way.
            </p>

            <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mb-8">
              Each agent session generates an ephemeral Solana keypair, funds it
              via faucet airdrop, and pays per query using HTTP 402. No API
              keys. No accounts. No human in the loop.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { value: "< 3s", label: "full payment flow" },
                { value: "402", label: "HTTP standard" },
                { value: "$0", label: "on devnet" },
                { value: "1 line", label: "to integrate" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-mono font-bold text-white text-xl">
                    {s.value}
                  </div>
                  <div className="text-zinc-600 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#demo"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors"
              >
                <span>Run Demo</span>
                <span>→</span>
              </a>
              <a
                href="https://mpptestkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
              >
                Get the SDK
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Protocol visualization */}
          <div className="hidden lg:block shrink-0 w-72">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden text-xs font-mono">
              <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/60 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="ml-1 text-zinc-600">402 flow</span>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-yellow-400">GET</span>
                  <span className="text-zinc-400"> /api/premium</span>
                </div>
                <div className="pl-3 border-l border-zinc-800 space-y-1">
                  <div className="text-zinc-600">← 402 Payment Required</div>
                  <div className="text-zinc-700 text-[10px]">
                    Payment-Request: solana;
                  </div>
                  <div className="text-zinc-700 text-[10px] pl-2">
                    amount=&quot;0.001&quot;;
                  </div>
                  <div className="text-zinc-700 text-[10px] pl-2">
                    recipient=&quot;7xKm...&quot;
                  </div>
                </div>
                <div className="pl-3 border-l border-purple-800/50 space-y-1">
                  <div className="text-purple-400">⟳ SOL transfer</div>
                  <div className="text-zinc-700 text-[10px]">
                    0.001 SOL → 7xKm...
                  </div>
                  <div className="text-zinc-700 text-[10px]">confirmed ✓</div>
                </div>
                <div>
                  <span className="text-yellow-400">GET</span>
                  <span className="text-zinc-400"> /api/premium</span>
                </div>
                <div className="pl-3 border-l border-zinc-800 space-y-1">
                  <div className="text-zinc-600 text-[10px]">
                    Payment-Receipt: solana;
                  </div>
                  <div className="text-zinc-600 text-[10px] pl-2">
                    signature=&quot;3xKm7...&quot;
                  </div>
                </div>
                <div className="text-emerald-400">← 200 OK ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Demo Section ─────────────────────────────────────────────────────────────

function DemoSection() {
  return (
    <section id="demo" className="py-16 px-6 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                Interactive Demo
              </span>
            </div>
            <h2 className="text-xl font-semibold text-white">
              Watch an agent pay in real-time
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-700">
            <span className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900/60">devnet</span>
          </div>
        </div>
        <AutonDemo />
      </div>
    </section>
  );
}

// ─── Protocol Section ─────────────────────────────────────────────────────────

function ProtocolSection() {
  return (
    <section id="protocol" className="py-16 px-6 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Protocol
          </span>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Two headers. That&apos;s the protocol.
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-lg">
            The server sends a{" "}
            <code className="text-zinc-300 bg-zinc-800/60 px-1 py-0.5 rounded text-xs">
              Payment-Request
            </code>{" "}
            header with the 402. The client pays on-chain and retries with a{" "}
            <code className="text-zinc-300 bg-zinc-800/60 px-1 py-0.5 rounded text-xs">
              Payment-Receipt
            </code>
            . The server verifies the transaction. Done.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                01 · Request
              </span>
              <span className="text-xs font-mono text-yellow-400">GET</span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <div>
                <span className="text-yellow-400">GET</span>
                <span className="text-zinc-300"> /api/premium HTTP/1.1</span>
              </div>
              <div className="text-zinc-600">Host: api.example.com</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-lg border border-zinc-700 bg-zinc-900/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-700 bg-zinc-900/60 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                02 · Payment Required
              </span>
              <span className="text-xs font-mono text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded">
                402
              </span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <div className="text-zinc-500">HTTP/1.1 402 Payment Required</div>
              <div>
                <span className="text-sky-400">Payment-Request</span>
                <span className="text-zinc-500">:</span>
              </div>
              <div className="pl-2 text-zinc-400">solana;</div>
              <div className="pl-4 text-zinc-400">
                amount=<span className="text-emerald-400">&quot;0.001&quot;</span>;
              </div>
              <div className="pl-4 text-zinc-400">
                recipient=<span className="text-purple-400">&quot;7xKm...&quot;</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                03 · Paid + Retry
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                200
              </span>
            </div>
            <div className="p-4 font-mono text-xs space-y-1.5">
              <div>
                <span className="text-yellow-400">GET</span>
                <span className="text-zinc-300"> /api/premium HTTP/1.1</span>
              </div>
              <div>
                <span className="text-sky-400">Payment-Receipt</span>
                <span className="text-zinc-500">:</span>
              </div>
              <div className="pl-2 text-zinc-400">solana;</div>
              <div className="pl-4 text-zinc-400">
                signature=<span className="text-purple-400">&quot;3xKm7...&quot;</span>
              </div>
              <div className="mt-2 text-emerald-400">HTTP/1.1 200 OK ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Agent spawns",
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "bg-emerald-500/5",
      detail: [
        { label: "Action", value: "Keypair.generate()" },
        { label: "Faucet", value: "requestAirdrop(2 SOL)" },
        { label: "Result", value: "Funded wallet, no accounts" },
      ],
    },
    {
      num: "02",
      title: "Agent hits 402",
      accent: "text-yellow-400",
      border: "border-yellow-500/20",
      glow: "bg-yellow-500/5",
      detail: [
        { label: "Server", value: "402 + Payment-Request" },
        { label: "SDK", value: "Parses amount + recipient" },
        { label: "Tx", value: "SOL transfer → confirmed" },
      ],
    },
    {
      num: "03",
      title: "Agent gets data",
      accent: "text-sky-400",
      border: "border-sky-500/20",
      glow: "bg-sky-500/5",
      detail: [
        { label: "Header", value: "Payment-Receipt: solana;…" },
        { label: "Server", value: "Verifies tx on-chain" },
        { label: "Result", value: "200 OK, no humans needed" },
      ],
    },
  ];

  return (
    <section className="py-16 px-6 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Flow
          </span>
          <h2 className="mt-2 text-xl font-semibold text-white">
            How it works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`relative p-5 rounded-lg border ${step.border} ${step.glow}`}
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-2.5 text-zinc-700 text-sm font-mono z-10">
                  →
                </div>
              )}
              <div
                className={`font-mono text-3xl font-bold mb-3 ${step.accent} opacity-25`}
              >
                {step.num}
              </div>
              <h3 className="text-sm font-semibold text-white mb-4">
                {step.title}
              </h3>
              <div className="space-y-2">
                {step.detail.map((d) => (
                  <div key={d.label} className="flex justify-between gap-4">
                    <span className="text-xs text-zinc-600 shrink-0">
                      {d.label}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 text-right">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Code Section ─────────────────────────────────────────────────────────────

function CodeSection() {
  return (
    <section className="py-16 px-6 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            Integration
          </span>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Two functions. That&apos;s the integration.
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            No SDK sprawl. No config files. No billing dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Agent code */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-xs font-mono text-zinc-400">
                  agent.ts
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                Client · agent code
              </span>
            </div>
            <div className="p-4 bg-zinc-950">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-loose overflow-auto">
                <span className="text-zinc-600">{`// any LLM framework\n`}</span>
                <span className="text-sky-400">{`import`}</span>
                <span className="text-zinc-300">{` { `}</span>
                <span className="text-emerald-300">{`mppFetch`}</span>
                <span className="text-zinc-300">{` } `}</span>
                <span className="text-sky-400">{`from`}</span>
                <span className="text-amber-300">{` "mpp-test-sdk"`}</span>
                <span className="text-zinc-300">{`;\n\n`}</span>
                <span className="text-zinc-600">{`// wallet + airdrop + payment: all automatic\n`}</span>
                <span className="text-sky-400">{`const`}</span>
                <span className="text-zinc-300">{` res  = `}</span>
                <span className="text-sky-400">{`await`}</span>
                <span className="text-zinc-300">{` `}</span>
                <span className="text-emerald-300">{`mppFetch`}</span>
                <span className="text-zinc-300">{`(`}</span>
                <span className="text-amber-300">{`"https://api.example.com/premium"`}</span>
                <span className="text-zinc-300">{`);\n`}</span>
                <span className="text-sky-400">{`const`}</span>
                <span className="text-zinc-300">{` data = `}</span>
                <span className="text-sky-400">{`await`}</span>
                <span className="text-zinc-300">{` res.`}</span>
                <span className="text-emerald-300">{`json`}</span>
                <span className="text-zinc-300">{`();\n`}</span>
              </pre>
            </div>
            <div className="px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 font-mono">npm install</span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                mpp-test-sdk
              </span>
            </div>
          </div>

          {/* Server code */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="text-xs font-mono text-zinc-400">
                  server.ts
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                Server · Express middleware
              </span>
            </div>
            <div className="p-4 bg-zinc-950">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-loose overflow-auto">
                <span className="text-sky-400">{`import`}</span>
                <span className="text-zinc-300">{` { `}</span>
                <span className="text-emerald-300">{`createTestServer`}</span>
                <span className="text-zinc-300">{` } `}</span>
                <span className="text-sky-400">{`from`}</span>
                <span className="text-amber-300">{` "mpp-test-sdk"`}</span>
                <span className="text-zinc-300">{`;\n\n`}</span>
                <span className="text-sky-400">{`const`}</span>
                <span className="text-zinc-300">{` mpp = `}</span>
                <span className="text-emerald-300">{`createTestServer`}</span>
                <span className="text-zinc-300">{`();\n\n`}</span>
                <span className="text-zinc-300">{`app.`}</span>
                <span className="text-emerald-300">{`get`}</span>
                <span className="text-zinc-300">{`(`}</span>
                <span className="text-amber-300">{`"/api/premium"`}</span>
                <span className="text-zinc-300">{`,\n  mpp.`}</span>
                <span className="text-emerald-300">{`charge`}</span>
                <span className="text-zinc-300">{`({ amount: `}</span>
                <span className="text-amber-300">{`"0.001"`}</span>
                <span className="text-zinc-300">{` }),\n  `}</span>
                <span className="text-zinc-300">{`handler\n);`}</span>
              </pre>
            </div>
            <div className="px-4 py-2.5 border-t border-zinc-800 bg-zinc-900/40 flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 font-mono">verifies tx on-chain ·</span>
              <span className="text-[10px] text-zinc-600 font-mono">returns 402 / 403 / 200</span>
            </div>
          </div>
        </div>

        {/* Properties row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {[
            { label: "No wallet setup", sub: "ephemeral keypair, auto-generated" },
            { label: "No API key mgmt", sub: "receipt is the credential" },
            { label: "On-chain verified", sub: "tx confirmed before 200" },
            { label: "Framework agnostic", sub: "LangChain, AutoGen, plain fetch" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/20"
            >
              <p className="text-xs font-semibold text-zinc-300 mb-1">
                {item.label}
              </p>
              <p className="text-[11px] text-zinc-600 leading-snug">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Strip ────────────────────────────────────────────────────────────────

function CTAStrip() {
  return (
    <section className="py-16 px-6 border-t border-zinc-800/60">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="text-xl font-semibold text-white mb-2">
                Build agents that pay their own way.
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Open-source SDK. TypeScript, Python, and Go. No account
                required. Runs on devnet in 30 seconds. Production-ready on
                mainnet.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-sm text-zinc-300 select-all cursor-text">
                <span className="text-zinc-600">$</span>
                <span>npm i mpp-test-sdk</span>
              </div>
              <a
                href="https://mpptestkit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 transition-colors"
              >
                mpptestkit.com
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-zinc-500 text-sm tracking-widest">
            AUTON
          </span>
          <span className="text-zinc-800 text-xs">·</span>
          <span className="text-zinc-700 font-mono text-xs">
            by mpptestkit
          </span>
        </div>
        <div className="flex items-center gap-6">
          {[
            { label: "Playground", href: "https://mpptestkit.com" },
            { label: "npm", href: "https://npmjs.com/package/mpp-test-sdk" },
            { label: "Go SDK", href: "https://pkg.go.dev/github.com/mpptestkit/mpp-test-sdk-go" },
            { label: "PyPI", href: "https://pypi.org/project/mpp-test-sdk" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-700 hover:text-zinc-400 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Nav />
      <Hero />
      <DemoSection />
      <ProtocolSection />
      <HowItWorks />
      <CodeSection />
      <CTAStrip />
      <Footer />
    </main>
  );
}
