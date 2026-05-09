"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, RotateCcw, Loader2, Copy, Check, Terminal, Zap } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentEvent = {
  type:
    | "init" | "wallet" | "fund" | "request" | "payment_required"
    | "payment" | "confirmed" | "retry" | "success" | "result"
    | "error" | "done";
  message?: string;
  address?: string;
  network?: string;
  amount?: number | string;
  confirmed?: boolean;
  header?: string;
  recipient?: string;
  url?: string;
  method?: string;
  signature?: string;
  status?: number;
  data?: Record<string, unknown>;
  query?: string;
  ts?: number;
};

type TerminalLine = {
  ts: number;
  tag: string;
  tagColor: string;
  message: string;
  textColor: string;
};

type SessionInfo = {
  address: string;
  network: string;
  txCount: number;
  balance: string;
};

type ResultInfo = {
  data: Record<string, unknown>;
  query: string;
  signature: string;
  network: string;
  amount: string;
};

// ─── Step tracker ────────────────────────────────────────────────────────────

type StepId = "init" | "fund" | "request" | "payment" | "confirm" | "done";

const FLOW_STEPS: { id: StepId; label: string }[] = [
  { id: "init",    label: "INIT"  },
  { id: "fund",    label: "FUND"  },
  { id: "request", label: "REQ"   },
  { id: "payment", label: "402→PAY" },
  { id: "confirm", label: "CONF"  },
  { id: "done",    label: "200 OK" },
];

function eventToStep(type: AgentEvent["type"]): StepId | null {
  switch (type) {
    case "init":
    case "wallet":             return "init";
    case "fund":               return "fund";
    case "request":
    case "payment_required":   return "request";
    case "payment":            return "payment";
    case "confirmed":
    case "retry":              return "confirm";
    case "success":
    case "result":             return "done";
    default:                   return null;
  }
}

const STEP_ORDER: StepId[] = ["init", "fund", "request", "payment", "confirm", "done"];

function StepTracker({ activeStep, status }: {
  activeStep: StepId | null;
  status: "idle" | "running" | "done" | "error";
}) {
  const activeIdx = activeStep ? STEP_ORDER.indexOf(activeStep) : -1;

  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {FLOW_STEPS.map((step, i) => {
        const idx = STEP_ORDER.indexOf(step.id);
        const isActive = idx === activeIdx;
        const isDone = idx < activeIdx || (status === "done" && idx <= activeIdx);
        const isError = status === "error" && isActive;

        return (
          <div key={step.id} className="flex items-center shrink-0">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-semibold transition-all duration-300 ${
                isError
                  ? "text-red-400 bg-red-500/10"
                  : isActive
                  ? "text-white bg-zinc-700"
                  : isDone
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-zinc-700"
              }`}
            >
              {isDone && !isActive && <span className="text-[8px]">✓</span>}
              {step.label}
            </div>
            {i < FLOW_STEPS.length - 1 && (
              <div
                className={`w-4 h-px mx-0.5 transition-colors duration-500 ${
                  idx < activeIdx ? "bg-emerald-500/40" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { id: "sol",      label: "SOL market data",       sub: "price · volume · change"   },
  { id: "analytics",label: "Analytics report",       sub: "sessions · conversion · revenue" },
  { id: "ml",       label: "ML inference",           sub: "prediction · confidence"   },
  { id: "research", label: "Gated research data",    sub: "papers · citations · trend" },
] as const;

const NETWORKS = ["devnet", "testnet"] as const;
type Network = (typeof NETWORKS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tagConfig(type: AgentEvent["type"]): { tag: string; tagColor: string; textColor: string } {
  switch (type) {
    case "init":
    case "wallet":
      return { tag: "INIT",  tagColor: "text-zinc-500",   textColor: "text-zinc-400"   };
    case "fund":
      return { tag: "FUND",  tagColor: "text-emerald-400", textColor: "text-emerald-300" };
    case "request":
      return { tag: "REQ",   tagColor: "text-yellow-400",  textColor: "text-yellow-200"  };
    case "payment_required":
      return { tag: "402",   tagColor: "text-yellow-400",  textColor: "text-yellow-200"  };
    case "payment":
      return { tag: "PAY",   tagColor: "text-purple-400",  textColor: "text-purple-200"  };
    case "confirmed":
      return { tag: "CONF",  tagColor: "text-purple-400",  textColor: "text-purple-200"  };
    case "retry":
      return { tag: "RETRY", tagColor: "text-sky-400",     textColor: "text-sky-200"     };
    case "success":
      return { tag: "OK",    tagColor: "text-emerald-400", textColor: "text-emerald-300" };
    case "result":
      return { tag: "DATA",  tagColor: "text-zinc-400",    textColor: "text-white"       };
    case "error":
      return { tag: "ERR",   tagColor: "text-red-400",     textColor: "text-red-300"     };
    default:
      return { tag: "INFO",  tagColor: "text-zinc-600",    textColor: "text-zinc-500"    };
  }
}

function truncateAddress(addr: string, head = 4, tail = 4): string {
  if (!addr || addr.length < head + tail + 3) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

// ─── Terminal line ────────────────────────────────────────────────────────────

function TerminalLineRow({ line }: { line: TerminalLine }) {
  return (
    <div className="flex items-start gap-3 font-mono text-xs leading-relaxed">
      <span className="text-zinc-700 shrink-0 w-14 text-right tabular-nums">
        +{line.ts}ms
      </span>
      <span className={`shrink-0 w-[52px] font-bold ${line.tagColor}`}>
        [{line.tag}]
      </span>
      <span className={`${line.textColor} break-all`}>{line.message}</span>
    </div>
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────

function ResultCard({ result, signature }: { result: ResultInfo; signature: string | null }) {
  const [copied, setCopied] = useState(false);

  const copySig = () => {
    if (!signature) return;
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-950/20 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-emerald-500/15 flex items-center justify-between bg-emerald-950/30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            200 OK - Agent received premium data
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-600">
          <span className="text-purple-400">{result.amount} SOL</span>
          <span>·</span>
          <span>{result.network}</span>
          {signature && (
            <>
              <span>·</span>
              <button
                onClick={copySig}
                className="flex items-center gap-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                title="Copy tx signature"
              >
                <span>{signature.slice(0, 6)}…{signature.slice(-4)}</span>
                {copied
                  ? <Check className="w-2.5 h-2.5 text-emerald-400" />
                  : <Copy className="w-2.5 h-2.5" />
                }
              </button>
            </>
          )}
        </div>
      </div>
      {/* Body */}
      <div className="p-4">
        <pre className="font-mono text-xs text-emerald-300/90 whitespace-pre-wrap overflow-auto leading-relaxed">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AutonDemo() {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[0].id);
  const [network, setNetwork]   = useState<Network>("devnet");
  const [status, setStatus]     = useState<"idle" | "running" | "done" | "error">("idle");
  const [lines, setLines]       = useState<TerminalLine[]>([]);
  const [session, setSession]   = useState<SessionInfo | null>(null);
  const [result, setResult]     = useState<ResultInfo | null>(null);
  const [lastSig, setLastSig]   = useState<string>("");
  const [activeStep, setActiveStep] = useState<StepId | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((event: AgentEvent) => {
    const cfg = tagConfig(event.type);
    setLines((prev) => [
      ...prev,
      { ts: event.ts ?? 0, tag: cfg.tag, tagColor: cfg.tagColor, message: event.message ?? "", textColor: cfg.textColor },
    ]);
    const step = eventToStep(event.type);
    if (step) setActiveStep(step);
  }, []);

  const runAgent = useCallback(async () => {
    if (status === "running") return;

    setLines([]);
    setSession(null);
    setResult(null);
    setLastSig("");
    setActiveStep(null);
    setStatus("running");

    const preset = PRESETS.find((p) => p.id === selectedPreset);
    const query  = preset?.label ?? PRESETS[0].label;

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, network }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";
      let txCount   = 0;
      let paymentSig = "";

      let reading = true;
      outer: while (reading) {
        const { done, value } = await reader.read();
        if (done) { reading = false; break; }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let event: AgentEvent;
          try { event = JSON.parse(raw); } catch { continue; }

          if (event.type === "done") { setStatus("done"); break outer; }

          addLine(event);

          if (event.type === "wallet" && event.address) {
            setSession({ address: event.address, network: event.network ?? network, txCount: 0, balance: "2.000 SOL" });
          }
          if (event.type === "confirmed" && event.signature) {
            txCount++;
            paymentSig = event.signature;
            setLastSig(event.signature);
            setSession((p) => p ? { ...p, txCount, balance: "1.999 SOL" } : p);
          }
          if (event.type === "result" && event.data) {
            setResult({ data: event.data, query: event.query ?? query, signature: paymentSig, network, amount: "0.001" });
          }
          if (event.type === "error") { setStatus("error"); break outer; }
        }
      }

      setStatus((s) => s === "running" ? "done" : s);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      addLine({ type: "error", message: err instanceof Error ? err.message : "Unknown error", ts: 0 });
      setStatus("error");
    }
  }, [status, selectedPreset, network, addLine]);

  const terminalBorder =
    status === "running" ? "border-zinc-700 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]" :
    status === "done"    ? "border-emerald-500/30" :
    status === "error"   ? "border-red-500/30" :
                           "border-zinc-800";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3">

      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Query selector */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 overflow-hidden">
          <div className="px-3 py-2.5 border-b border-zinc-800/60">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Agent Query
            </span>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                disabled={status === "running"}
                className={`w-full text-left px-3 py-2.5 rounded-md transition-all border ${
                  selectedPreset === preset.id
                    ? "border-zinc-600 bg-zinc-800 text-white"
                    : "border-transparent text-zinc-500 hover:border-zinc-800 hover:bg-zinc-800/40 hover:text-zinc-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-1 rounded-full shrink-0 ${selectedPreset === preset.id ? "bg-purple-400" : "bg-zinc-700"}`} />
                  <span className="text-xs font-mono font-medium leading-snug">
                    {preset.label}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-700 font-mono pl-3 mt-0.5">
                  {preset.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Network + Run */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 flex flex-col gap-3">
          <div>
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              Network
            </span>
            <div className="flex gap-2 mt-2">
              {NETWORKS.map((net) => (
                <button
                  key={net}
                  onClick={() => setNetwork(net)}
                  disabled={status === "running"}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-mono font-semibold transition-all border ${
                    network === net
                      ? "border-zinc-600 bg-zinc-800 text-white"
                      : "border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
                  } disabled:opacity-50`}
                >
                  {net}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runAgent}
            disabled={status === "running"}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              status === "running"
                ? "bg-zinc-800/60 text-zinc-500 cursor-not-allowed"
                : status === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                : "bg-white text-black hover:bg-zinc-100 active:scale-[0.98]"
            }`}
          >
            {status === "running" ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</>
            ) : status === "done" ? (
              <><RotateCcw className="w-3.5 h-3.5" /> Run Again</>
            ) : status === "error" ? (
              <><RotateCcw className="w-3.5 h-3.5" /> Retry</>
            ) : (
              <><Play className="w-3.5 h-3.5" /> Run Agent</>
            )}
          </button>
        </div>

        {/* Session info */}
        {session && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-zinc-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                Session
              </span>
              {status === "running" && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500">active</span>
                </div>
              )}
              {status === "done" && (
                <span className="text-[10px] font-mono text-zinc-700">complete</span>
              )}
            </div>
            <div className="p-3 space-y-2">
              {[
                { k: "Wallet",  v: truncateAddress(session.address), color: "text-zinc-300" },
                { k: "Balance", v: session.balance,                  color: "text-emerald-400" },
                { k: "Txns",    v: String(session.txCount),          color: "text-purple-400" },
                { k: "Network", v: session.network,                  color: "text-zinc-500" },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-700 font-mono">{row.k}</span>
                  <span className={`text-[11px] font-mono ${row.color}`}>{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SDK hint */}
        <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/20 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap className="w-3 h-3 text-zinc-600" />
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">SDK</span>
          </div>
          <pre className="font-mono text-[10px] text-zinc-600 leading-relaxed">
            <span className="text-sky-500/70">await </span>
            <span className="text-emerald-500/70">mppFetch</span>
            <span className="text-zinc-600">(url);</span>
          </pre>
          <p className="text-[10px] text-zinc-700 mt-1.5 leading-snug">
            One call. Wallet, airdrop, payment, retry - all automatic.
          </p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">

        {/* Terminal */}
        <div className={`rounded-lg border ${terminalBorder} bg-zinc-950 overflow-hidden flex flex-col transition-all duration-500`}>

          {/* Terminal chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/50" />
              </div>
              <div className="flex items-center gap-1.5 ml-1">
                <Terminal className="w-3 h-3 text-zinc-700" />
                <span className="text-[11px] font-mono text-zinc-600">
                  auton · {network}
                </span>
              </div>
            </div>

            {/* Step tracker */}
            <StepTracker activeStep={activeStep} status={status} />
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto space-y-1.5"
            style={{ minHeight: "360px", maxHeight: "480px" }}
          >
            {lines.length === 0 && status === "idle" && (
              <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
                <Terminal className="w-7 h-7 text-zinc-800" />
                <div className="text-center">
                  <p className="text-xs font-mono text-zinc-700">
                    Select a query and click Run Agent
                  </p>
                  <p className="text-[10px] font-mono text-zinc-800 mt-1">
                    Streams live - wallet · airdrop · 402 · payment · 200
                  </p>
                </div>
              </div>
            )}

            {lines.map((line, i) => (
              <TerminalLineRow key={i} line={line} />
            ))}

            {status === "running" && (
              <div className="flex items-center gap-3 font-mono text-xs pt-0.5">
                <span className="text-zinc-800 w-14 text-right">···</span>
                <span className="text-emerald-500/60 animate-pulse">▋</span>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        {result && <ResultCard result={result} signature={lastSig || null} />}
      </div>
    </div>
  );
}
