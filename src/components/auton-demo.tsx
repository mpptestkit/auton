"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Loader2,
  ExternalLink,
  Terminal,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type AgentEvent = {
  type:
    | "init"
    | "wallet"
    | "fund"
    | "request"
    | "payment_required"
    | "payment"
    | "confirmed"
    | "retry"
    | "success"
    | "result"
    | "error"
    | "done";
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

// ─── Presets ─────────────────────────────────────────────────────────────────

const PRESETS = [
  { id: "sol", label: "Get current SOL market data" },
  { id: "analytics", label: "Fetch premium analytics report" },
  { id: "ml", label: "Query ML inference endpoint" },
  { id: "research", label: "Retrieve gated research data" },
] as const;

const NETWORKS = ["devnet", "testnet"] as const;
type Network = (typeof NETWORKS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tagConfig(type: AgentEvent["type"]): {
  tag: string;
  tagColor: string;
  textColor: string;
} {
  switch (type) {
    case "init":
    case "wallet":
      return {
        tag: type === "wallet" ? "INIT" : "INIT",
        tagColor: "text-zinc-500",
        textColor: "text-zinc-400",
      };
    case "fund":
      return {
        tag: "FUND",
        tagColor: "text-emerald-400",
        textColor: "text-emerald-300",
      };
    case "request":
      return {
        tag: "REQ",
        tagColor: "text-yellow-400",
        textColor: "text-yellow-200",
      };
    case "payment_required":
      return {
        tag: "402",
        tagColor: "text-yellow-400",
        textColor: "text-yellow-200",
      };
    case "payment":
      return {
        tag: "PAY",
        tagColor: "text-purple-400",
        textColor: "text-purple-200",
      };
    case "confirmed":
      return {
        tag: "CONF",
        tagColor: "text-purple-400",
        textColor: "text-purple-200",
      };
    case "retry":
      return {
        tag: "RETRY",
        tagColor: "text-sky-400",
        textColor: "text-sky-200",
      };
    case "success":
      return {
        tag: "OK",
        tagColor: "text-emerald-400",
        textColor: "text-emerald-300",
      };
    case "result":
      return {
        tag: "DATA",
        tagColor: "text-zinc-400",
        textColor: "text-white",
      };
    case "error":
      return {
        tag: "ERR",
        tagColor: "text-red-400",
        textColor: "text-red-300",
      };
    default:
      return {
        tag: "INFO",
        tagColor: "text-zinc-500",
        textColor: "text-zinc-400",
      };
  }
}

function formatTs(ms: number): string {
  return `+${ms}ms`;
}

function truncateAddress(addr: string, head = 4, tail = 4): string {
  if (!addr || addr.length < head + tail + 3) return addr;
  return addr.slice(0, head) + "..." + addr.slice(-tail);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TerminalLineRow({ line }: { line: TerminalLine }) {
  return (
    <div className="flex items-start gap-3 font-mono text-xs leading-relaxed animate-fade-in">
      <span className="text-zinc-600 shrink-0 w-16 text-right">
        {formatTs(line.ts)}
      </span>
      <span className={`shrink-0 w-12 font-semibold ${line.tagColor}`}>
        [{line.tag}]
      </span>
      <span className={line.textColor}>{line.message}</span>
    </div>
  );
}

function ResultCard({
  result,
  signature,
}: {
  result: ResultInfo;
  signature: string | null;
}) {
  const explorerUrl = signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=${result.network}`
    : null;

  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-sm font-medium text-white">
          Agent received premium data
        </span>
        <span className="text-xs text-emerald-400 font-mono">200 OK</span>
      </div>
      <div className="p-4">
        <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-auto">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </div>
      <div className="px-4 py-3 border-t border-zinc-800 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-zinc-500">Paid</span>
        <span className="text-xs text-purple-400 font-mono">
          {result.amount} SOL
        </span>
        <span className="text-xs text-zinc-600">·</span>
        <span className="text-xs text-zinc-500">{result.network}</span>
        {explorerUrl && (
          <>
            <span className="text-xs text-zinc-600">·</span>
            <span className="font-mono text-[11px] text-zinc-600">
              {signature!.slice(0, 8)}…{signature!.slice(-6)}
            </span>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-200 transition-colors ml-auto"
            >
              View on Explorer
              <ExternalLink className="w-3 h-3" />
            </a>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Demo Component ───────────────────────────────────────────────────────

export function AutonDemo() {
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[0].id);
  const [network, setNetwork] = useState<Network>("devnet");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
    "idle"
  );
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [result, setResult] = useState<ResultInfo | null>(null);
  const [lastSig, setLastSig] = useState<string>("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((event: AgentEvent) => {
    const cfg = tagConfig(event.type);
    const message = event.message ?? "";
    setLines((prev) => [
      ...prev,
      {
        ts: event.ts ?? 0,
        tag: cfg.tag,
        tagColor: cfg.tagColor,
        message,
        textColor: cfg.textColor,
      },
    ]);
  }, []);

  const runAgent = useCallback(async () => {
    if (status === "running") return;

    // Reset state
    setLines([]);
    setSession(null);
    setResult(null);
    setLastSig("");
    setStatus("running");

    const preset = PRESETS.find((p) => p.id === selectedPreset);
    const query = preset?.label ?? PRESETS[0].label;

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, network }),
        signal: abort.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let txCount = 0;
      let paymentSig = "";

      let reading = true;
      while (reading) {
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
          try {
            event = JSON.parse(raw);
          } catch {
            continue;
          }

          if (event.type === "done") {
            setStatus("done");
            break;
          }

          addLine(event);

          // Side effects per event type
          if (event.type === "wallet" && event.address) {
            setSession({
              address: event.address,
              network: event.network ?? network,
              txCount: 0,
              balance: "2.000 SOL",
            });
          }

          if (event.type === "confirmed" && event.signature) {
            txCount += 1;
            paymentSig = event.signature;
            setLastSig(event.signature);
            setSession((prev) =>
              prev ? { ...prev, txCount, balance: "1.999 SOL" } : prev
            );
          }

          if (event.type === "result" && event.data) {
            setResult({
              data: event.data,
              query: event.query ?? query,
              signature: paymentSig,
              network,
              amount: "0.001",
            });
          }

          if (event.type === "error") {
            setStatus("error");
            break;
          }
        }
      }

      if (status !== "error") setStatus("done");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      addLine({
        type: "error",
        message: err instanceof Error ? err.message : "Unknown error",
        ts: 0,
      });
      setStatus("error");
    }
  }, [status, selectedPreset, network, addLine]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* ── Left panel ── */}
      <div className="flex flex-col gap-4">
        {/* Query selector */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Agent Query
          </p>
          <div className="flex flex-col gap-2">
            {PRESETS.map((preset) => (
              <label
                key={preset.id}
                className={`flex items-start gap-3 p-2.5 rounded-md cursor-pointer transition-colors border ${
                  selectedPreset === preset.id
                    ? "border-zinc-700 bg-zinc-800/60"
                    : "border-transparent hover:border-zinc-800 hover:bg-zinc-800/30"
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  value={preset.id}
                  checked={selectedPreset === preset.id}
                  onChange={() => setSelectedPreset(preset.id)}
                  className="mt-0.5 accent-white"
                />
                <span className="text-sm text-zinc-300 font-mono leading-snug">
                  &ldquo;{preset.label}&rdquo;
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Network selector */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Network
          </p>
          <div className="flex gap-2">
            {NETWORKS.map((net) => (
              <button
                key={net}
                onClick={() => setNetwork(net)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-mono font-medium transition-colors border ${
                  network === net
                    ? "border-zinc-600 bg-zinc-800 text-white"
                    : "border-zinc-800 bg-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={runAgent}
          disabled={status === "running"}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            status === "running"
              ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-zinc-100 active:bg-zinc-200"
          }`}
        >
          {status === "running" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Agent running...
            </>
          ) : status === "done" || status === "error" ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Run Again
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Agent
            </>
          )}
        </button>

        {/* Session info */}
        {session && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Session
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">Wallet</span>
                <span className="text-xs font-mono text-zinc-300">
                  {truncateAddress(session.address)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">Balance</span>
                <span className="text-xs font-mono text-emerald-400">
                  {session.balance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">Transactions</span>
                <span className="text-xs font-mono text-purple-400">
                  {session.txCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">Network</span>
                <span className="text-xs font-mono text-zinc-400">
                  {session.network}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel: terminal ── */}
      <div className="flex flex-col">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col min-h-[420px]">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Terminal className="w-3.5 h-3.5 text-zinc-600" />
              <span className="text-xs text-zinc-600 font-mono">
                agent · {network}
              </span>
            </div>
            {status === "running" && (
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-mono">
                  live
                </span>
              </div>
            )}
            {status === "done" && (
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <span className="text-xs text-zinc-600 font-mono">done</span>
              </div>
            )}
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-y-auto terminal-scroll space-y-1.5"
            style={{ minHeight: "340px", maxHeight: "520px" }}
          >
            {lines.length === 0 && status === "idle" && (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <Terminal className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-600 font-mono">
                  Select a query and click Run Agent
                </p>
                <p className="text-xs text-zinc-700 font-mono mt-1">
                  Watch the agent pay for premium data in real-time
                </p>
              </div>
            )}
            {lines.map((line, i) => (
              <TerminalLineRow key={i} line={line} />
            ))}
            {status === "running" && (
              <div className="flex items-center gap-3 font-mono text-xs pt-1">
                <span className="text-zinc-700 w-16 text-right">···</span>
                <span className="text-zinc-700">
                  <span className="inline-block animate-pulse">▋</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Result card */}
        {result && (
          <ResultCard result={result} signature={lastSig} />
        )}
      </div>
    </div>
  );
}
