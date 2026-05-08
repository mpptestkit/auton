import { NextRequest } from "next/server";

export const runtime = "edge";

// Generate a realistic-looking fake Solana base58 address
function fakeSolanaAddress(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  const len = 32 + Math.floor(Math.random() * 12); // 32-43 chars
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function fakeSolanaSignature(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 87; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function truncate(addr: string, head = 4, tail = 4): string {
  return addr.slice(0, head) + "..." + addr.slice(-tail);
}

type MockResult =
  | {
      price: number;
      change_24h: string;
      volume: string;
      source: string;
    }
  | {
      sessions: number;
      conversion: string;
      revenue: string;
      model: string;
    }
  | {
      prediction: string;
      confidence: number;
      tokens_used: number;
      latency_ms: number;
    }
  | {
      papers: number;
      citations: number;
      trend: string;
      category: string;
    };

interface MockData {
  url: string;
  result: MockResult;
}

const MOCK_QUERIES: Record<string, MockData> = {
  sol: {
    url: "https://api.mpptestkit.com/premium/market/sol",
    result: {
      price: 185.42,
      change_24h: "+3.2%",
      volume: "$2.1B",
      source: "premium-feed",
    },
  },
  analytics: {
    url: "https://api.mpptestkit.com/premium/analytics",
    result: {
      sessions: 14820,
      conversion: "4.7%",
      revenue: "$42,100",
      model: "v3.1",
    },
  },
  ml: {
    url: "https://api.mpptestkit.com/premium/ml/inference",
    result: {
      prediction: "bullish",
      confidence: 0.847,
      tokens_used: 1024,
      latency_ms: 312,
    },
  },
  research: {
    url: "https://api.mpptestkit.com/premium/research",
    result: {
      papers: 47,
      citations: 8821,
      trend: "rising",
      category: "DeFi/AI",
    },
  },
};

function resolveQuery(query: string): MockData {
  const q = query.toLowerCase();
  if (q.includes("sol") || q.includes("market")) return MOCK_QUERIES.sol;
  if (q.includes("analytic")) return MOCK_QUERIES.analytics;
  if (q.includes("ml") || q.includes("inference") || q.includes("machine"))
    return MOCK_QUERIES.ml;
  return MOCK_QUERIES.research;
}

function send(controller: ReadableStreamDefaultController, event: object) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const query: string = body.query ?? "analytics";
  const network: string = body.network ?? "devnet";

  const mock = resolveQuery(query);
  const walletAddress = fakeSolanaAddress();
  const recipient = fakeSolanaAddress();
  const signature = fakeSolanaSignature();
  const amount = "0.001";
  const airdropAmount = 2;

  const stream = new ReadableStream({
    async start(controller) {
      const startTime = Date.now();

      const emit = (event: object) => {
        send(controller, { ...event, ts: Date.now() - startTime });
      };

      // Step 1: INIT — keypair generation
      emit({ type: "init", message: "Generating ephemeral Solana keypair..." });
      await sleep(200);

      emit({
        type: "wallet",
        address: walletAddress,
        network,
        message: `Keypair ready · ${truncate(walletAddress)}`,
      });
      await sleep(150);

      // Step 2: FUND — airdrop
      emit({
        type: "fund",
        message: `Requesting airdrop from ${network} faucet...`,
        amount: airdropAmount,
      });
      await sleep(600);

      emit({
        type: "fund",
        message: `Airdropped ${airdropAmount} SOL · ${truncate(walletAddress)}`,
        amount: airdropAmount,
        confirmed: true,
      });
      await sleep(200);

      // Step 3: Initial request
      emit({
        type: "request",
        url: mock.url,
        method: "GET",
        message: `→ GET ${mock.url}`,
      });
      await sleep(300);

      // Step 4: 402 response
      emit({
        type: "payment_required",
        header: `Payment-Request: solana; amount="${amount}"; recipient="${truncate(recipient, 4, 4)}"`,
        amount,
        recipient,
        message: `← 402 Payment Required`,
      });
      await sleep(200);

      // Step 5: Build and send payment
      emit({
        type: "payment",
        message: `Payment-Request: solana; amount="${amount}"; recipient="${truncate(recipient)}"`,
      });
      await sleep(200);

      emit({
        type: "payment",
        message: `Sending ${amount} SOL on ${network}...`,
      });
      await sleep(400);

      // Step 6: Confirmed
      emit({
        type: "confirmed",
        signature,
        message: `✓ Confirmed: ${truncate(signature, 5, 4)}`,
      });
      await sleep(200);

      // Step 7: Retry with receipt
      emit({
        type: "retry",
        url: mock.url,
        message: `↑ Retrying with Payment-Receipt header`,
      });
      await sleep(300);

      // Step 8: Success
      emit({
        type: "success",
        status: 200,
        message: `← 200 OK`,
      });
      await sleep(150);

      // Step 9: Result data
      emit({
        type: "result",
        data: mock.result,
        query,
        message: "Agent received premium data",
      });

      await sleep(50);

      emit({ type: "done" });

      controller.close();
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
