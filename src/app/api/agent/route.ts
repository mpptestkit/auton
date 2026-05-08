import { NextRequest } from "next/server";
import {
  Keypair,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

// No edge runtime — @solana/web3.js requires Node.js

const RPC_URLS: Record<string, string> = {
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
};

function truncate(addr: string, head = 4, tail = 4): string {
  return addr.slice(0, head) + "..." + addr.slice(-tail);
}

type MockResult =
  | { price: number; change_24h: string; volume: string; source: string }
  | { sessions: number; conversion: string; revenue: string; model: string }
  | { prediction: string; confidence: number; tokens_used: number; latency_ms: number }
  | { papers: number; citations: number; trend: string; category: string };

interface MockData {
  url: string;
  result: MockResult;
}

const MOCK_QUERIES: Record<string, MockData> = {
  sol: {
    url: "https://api.mpptestkit.com/premium/market/sol",
    result: { price: 185.42, change_24h: "+3.2%", volume: "$2.1B", source: "premium-feed" },
  },
  analytics: {
    url: "https://api.mpptestkit.com/premium/analytics",
    result: { sessions: 14820, conversion: "4.7%", revenue: "$42,100", model: "v3.1" },
  },
  ml: {
    url: "https://api.mpptestkit.com/premium/ml/inference",
    result: { prediction: "bullish", confidence: 0.847, tokens_used: 1024, latency_ms: 312 },
  },
  research: {
    url: "https://api.mpptestkit.com/premium/research",
    result: { papers: 47, citations: 8821, trend: "rising", category: "DeFi/AI" },
  },
};

function resolveQuery(query: string): MockData {
  const q = query.toLowerCase();
  if (q.includes("sol") || q.includes("market")) return MOCK_QUERIES.sol;
  if (q.includes("analytic")) return MOCK_QUERIES.analytics;
  if (q.includes("ml") || q.includes("inference") || q.includes("machine")) return MOCK_QUERIES.ml;
  return MOCK_QUERIES.research;
}

function send(controller: ReadableStreamDefaultController, event: object) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query: string = body.query ?? "analytics";
  const network: string = body.network ?? "devnet";

  const mock = resolveQuery(query);
  const rpcUrl = RPC_URLS[network] ?? RPC_URLS.devnet;
  const connection = new Connection(rpcUrl, "confirmed");

  const agentKeypair = Keypair.generate();
  const serverKeypair = Keypair.generate();
  const walletAddress = agentKeypair.publicKey.toString();
  const serverAddress = serverKeypair.publicKey.toString();
  const payAmount = "0.001";
  const airdropSol = 1;

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now();

      const emit = (event: object) => {
        send(controller, { ...event, ts: Date.now() - startTime });
      };

      try {
        // Step 1: Keypair generation
        emit({ type: "init", message: "Generating ephemeral Solana keypair..." });

        emit({
          type: "wallet",
          address: walletAddress,
          network,
          message: `Keypair ready · ${truncate(walletAddress)}`,
        });

        // Step 2: Airdrop
        emit({
          type: "fund",
          message: `Requesting airdrop from ${network} faucet...`,
          amount: airdropSol,
        });

        const airdropSig = await connection.requestAirdrop(
          agentKeypair.publicKey,
          airdropSol * LAMPORTS_PER_SOL,
        );
        const { blockhash: ab, lastValidBlockHeight: alvbh } =
          await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature: airdropSig,
          blockhash: ab,
          lastValidBlockHeight: alvbh,
        });

        emit({
          type: "fund",
          message: `Airdropped ${airdropSol} SOL · ${truncate(walletAddress)}`,
          amount: airdropSol,
          confirmed: true,
        });

        // Step 3: Initial request to premium endpoint
        emit({
          type: "request",
          url: mock.url,
          method: "GET",
          message: `→ GET ${mock.url}`,
        });

        // Step 4: 402 Payment Required
        emit({
          type: "payment_required",
          header: `Payment-Request: solana; amount="${payAmount}"; recipient="${truncate(serverAddress, 4, 4)}"`,
          amount: payAmount,
          recipient: serverAddress,
          message: `← 402 Payment Required`,
        });

        // Step 5: Build and send payment tx
        emit({
          type: "payment",
          message: `Payment-Request: solana; amount="${payAmount}"; recipient="${truncate(serverAddress)}"`,
        });
        emit({
          type: "payment",
          message: `Sending ${payAmount} SOL on ${network}...`,
        });

        const { blockhash: bh } = await connection.getLatestBlockhash();
        const tx = new Transaction({
          feePayer: agentKeypair.publicKey,
          recentBlockhash: bh,
        }).add(
          SystemProgram.transfer({
            fromPubkey: agentKeypair.publicKey,
            toPubkey: serverKeypair.publicKey,
            lamports: Math.round(0.001 * LAMPORTS_PER_SOL),
          }),
        );

        const signature = await sendAndConfirmTransaction(
          connection,
          tx,
          [agentKeypair],
          { commitment: "confirmed" },
        );

        // Step 6: Confirmed with real signature
        emit({
          type: "confirmed",
          signature,
          message: `✓ Confirmed: ${truncate(signature, 5, 4)}`,
        });

        // Step 7: Retry with receipt header
        emit({
          type: "retry",
          url: mock.url,
          message: `↑ Retrying with Payment-Receipt header`,
        });

        // Step 8: 200 OK
        emit({ type: "success", status: 200, message: `← 200 OK` });

        // Step 9: Premium data result
        emit({
          type: "result",
          data: mock.result,
          query,
          network,
          message: "Agent received premium data",
        });

        emit({ type: "done" });
        controller.close();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        emit({ type: "error", message: `Agent error: ${msg}` });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
