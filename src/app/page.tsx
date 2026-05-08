import { AutonDemo } from "@/components/auton-demo";
import { ExternalLink } from "lucide-react";

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-white tracking-tight text-lg">
            AUTON
          </span>
          <span className="text-zinc-700 font-mono text-sm">·</span>
          <span className="text-zinc-600 font-mono text-sm">
            by mpptestkit
          </span>
        </div>
        <a
          href="https://mpptestkit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          mpptestkit.com
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-8">
          <h1 className="font-mono font-bold text-4xl md:text-5xl text-white tracking-tight">
            AUTON
          </h1>
          <a
            href="#demo"
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm text-white hover:bg-zinc-800 transition-colors font-medium"
          >
            Run Demo
            <span className="text-zinc-400">→</span>
          </a>
        </div>

        <p className="text-2xl md:text-3xl font-semibold text-white mb-6 leading-snug max-w-2xl">
          Agents that pay their own way.
        </p>

        <p className="text-zinc-400 text-base leading-relaxed max-w-2xl mb-10">
          LLM-powered agents browse, reason, and act — but today they
          can&apos;t pay for the premium data they need without a human handing
          them an API key. HTTP 402 closes that gap. Each agent session
          generates an ephemeral Solana keypair, funds it, and pays per query.
        </p>

        {/* Insight pills */}
        <div className="flex flex-wrap gap-3">
          {[
            "Ephemeral Solana keypair per session",
            "Auto-funded via devnet faucet",
            "Pays per query, no accounts",
            "No key rotation ever",
          ].map((text) => (
            <div
              key={text}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-300"
            >
              <span className="text-purple-400 text-xs">◆</span>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Demo Section ─────────────────────────────────────────────────────────────

function DemoSection() {
  return (
    <section id="demo" className="py-16 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Live Demo
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Watch an agent pay in real-time
          </h2>
          <p className="text-zinc-500 text-sm">
            Ephemeral wallet · devnet airdrop · HTTP 402 payment · confirmed
            on-chain
          </p>
        </div>
        <AutonDemo />
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
      lines: [
        "Ephemeral keypair",
        "+ faucet airdrop",
        "No accounts",
      ],
      accent: "text-emerald-400",
    },
    {
      num: "02",
      title: "Agent pays",
      lines: [
        "HTTP 402 triggers",
        "SOL transfer",
        "No API keys",
      ],
      accent: "text-purple-400",
    },
    {
      num: "03",
      title: "Agent gets data",
      lines: [
        "Receipt verified",
        "on-chain → 200 OK",
        "No humans needed",
      ],
      accent: "text-sky-400",
    },
  ];

  return (
    <section className="py-16 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-10">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative p-6 rounded-lg border border-zinc-800 bg-zinc-900/30"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 text-zinc-700 text-lg font-mono z-10">
                  →
                </div>
              )}
              <div className={`font-mono text-4xl font-bold mb-4 ${step.accent} opacity-30`}>
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-white mb-3">
                {step.title}
              </h3>
              <div className="space-y-1">
                {step.lines.map((line) => (
                  <p key={line} className="text-sm text-zinc-500 font-mono">
                    {line}
                  </p>
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
    <section className="py-16 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Two functions. That&apos;s the integration.
        </h2>
        <p className="text-zinc-500 text-sm mb-8">
          No SDK sprawl. No config files. No billing dashboard.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Agent code */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                agent.ts
              </span>
              <span className="text-xs text-zinc-600">Agent Code</span>
            </div>
            <div className="p-4">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-auto">
                <span className="text-zinc-600">{`// Agent (any LLM framework)\n`}</span>
                <span className="text-sky-400">{`import`}</span>
                <span className="text-zinc-300">{` { `}</span>
                <span className="text-emerald-300">{`mppFetch`}</span>
                <span className="text-zinc-300">{` } `}</span>
                <span className="text-sky-400">{`from`}</span>
                <span className="text-yellow-300">{` "mpp-test-sdk"`}</span>
                <span className="text-zinc-300">{`;\n\n`}</span>
                <span className="text-zinc-600">{`// Agent autonomously fetches premium data\n`}</span>
                <span className="text-sky-400">{`const`}</span>
                <span className="text-zinc-300">{` res = `}</span>
                <span className="text-sky-400">{`await`}</span>
                <span className="text-zinc-300">{` `}</span>
                <span className="text-emerald-300">{`mppFetch`}</span>
                <span className="text-zinc-300">{`(`}</span>
                <span className="text-yellow-300">{`"https://api.example.com/premium"`}</span>
                <span className="text-zinc-300">{`);\n`}</span>
                <span className="text-sky-400">{`const`}</span>
                <span className="text-zinc-300">{` data = `}</span>
                <span className="text-sky-400">{`await`}</span>
                <span className="text-zinc-300">{` res.`}</span>
                <span className="text-emerald-300">{`json`}</span>
                <span className="text-zinc-300">{`();\n`}</span>
                <span className="text-zinc-600">{`// ↑ That's it. Wallet, faucet, payment — all automatic.`}</span>
              </pre>
            </div>
          </div>

          {/* Server code */}
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">
                server.ts
              </span>
              <span className="text-xs text-zinc-600">Server Code</span>
            </div>
            <div className="p-4">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed overflow-auto">
                <span className="text-zinc-600">{`// Server — Express / Next.js API route\n`}</span>
                <span className="text-sky-400">{`import`}</span>
                <span className="text-zinc-300">{` { `}</span>
                <span className="text-emerald-300">{`mppGate`}</span>
                <span className="text-zinc-300">{` } `}</span>
                <span className="text-sky-400">{`from`}</span>
                <span className="text-yellow-300">{` "mpp-test-sdk/server"`}</span>
                <span className="text-zinc-300">{`;\n\n`}</span>
                <span className="text-zinc-300">{`app.`}</span>
                <span className="text-emerald-300">{`get`}</span>
                <span className="text-zinc-300">{`(`}</span>
                <span className="text-yellow-300">{`"/premium/data"`}</span>
                <span className="text-zinc-300">{`, `}</span>
                <span className="text-emerald-300">{`mppGate`}</span>
                <span className="text-zinc-300">{`({ amount: `}</span>
                <span className="text-yellow-300">{`"0.001"`}</span>
                <span className="text-zinc-300">{` }), (req, res) => {\n  `}</span>
                <span className="text-zinc-600">{`// mppGate verified the Payment-Receipt on-chain\n  // If payment is missing → responds with 402 automatically\n  `}</span>
                <span className="text-zinc-300">{`res.`}</span>
                <span className="text-emerald-300">{`json`}</span>
                <span className="text-zinc-300">{`({ data: `}</span>
                <span className="text-yellow-300">{`"your premium content here"`}</span>
                <span className="text-zinc-300">{` });\n});`}</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Key callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            {
              label: "No wallet setup",
              desc: "mppFetch generates an ephemeral keypair automatically.",
            },
            {
              label: "No API key management",
              desc: "Payment receipt is verified on-chain. Receipt is the credential.",
            },
            {
              label: "Framework agnostic",
              desc: "Works with LangChain, AutoGen, CrewAI, or plain fetch().",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/20"
            >
              <p className="text-sm font-medium text-white mb-1">
                {item.label}
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {item.desc}
              </p>
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
    <section className="py-16 px-6 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Build agents that pay their own way.
            </h2>
            <p className="text-zinc-500 text-sm">
              Open-source SDK. No account required. Runs on devnet in 30
              seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 font-mono text-sm text-zinc-300">
              <span className="text-zinc-600">$</span>
              <span>npm i mpp-test-sdk</span>
            </div>
            <a
              href="https://mpptestkit.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
            >
              View Docs
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://mpptestkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              mpptestkit.com
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Nav />
      <Hero />
      <DemoSection />
      <HowItWorks />
      <CodeSection />
      <CTAStrip />
    </main>
  );
}
