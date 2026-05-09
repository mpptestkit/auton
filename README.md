# Auton

> Agents that pay their own way.

A Next.js demo showing LLM agents that autonomously handle HTTP 402 Payment Required responses using real Solana transactions - no API keys, no billing, no humans in the loop.

Live at [agent.mpptestkit.com](https://agent.mpptestkit.com)

## What it demos

1. Agent generates an ephemeral Solana keypair
2. Requests an airdrop from the devnet/testnet faucet
3. Hits a premium API endpoint → receives `402 Payment Required`
4. Parses the `Payment-Request` header, sends a real SOL transfer on-chain
5. Retries the request with a `Payment-Receipt` header → receives `200 OK` + data
6. Every step streams live to the terminal UI via SSE

The payment transaction is real - you can verify it on [Solana Explorer](https://explorer.solana.com).

## Stack

- **Next.js 14** (App Router)
- **@solana/web3.js** - real devnet/testnet transactions
- **Tailwind CSS**
- **SSE** (Server-Sent Events) for real-time streaming

## Dev

```bash
npm install
npm run dev   # http://localhost:5174
```

## How the agent API works

`POST /api/agent` accepts:

```json
{ "query": "Get current SOL market data", "network": "devnet" }
```

It streams SSE events:

| type | description |
|---|---|
| `init` | Keypair generation started |
| `wallet` | Keypair ready, public key included |
| `fund` | Airdrop request / confirmation |
| `request` | Initial GET to premium endpoint |
| `payment_required` | 402 received, Payment-Request header parsed |
| `payment` | SOL transfer being built and sent |
| `confirmed` | On-chain confirmation + real tx signature |
| `retry` | Request retried with Payment-Receipt |
| `success` | 200 OK received |
| `result` | Premium data payload |
| `done` | Stream complete |
| `error` | Agent error with message |

## Supported queries

| Query | Endpoint |
|---|---|
| SOL market data | `/premium/market/sol` |
| Analytics report | `/premium/analytics` |
| ML inference | `/premium/ml/inference` |
| Research data | `/premium/research` |

## Networks

- `devnet` - default, fastest airdrop availability
- `testnet` - also supported, same flow
