# AgentEscrow

**Trustless payments for autonomous work.**

AgentEscrow is a simple native-BOT escrow for AI-agent services on BOT Chain.

## MVP flow

1. Client creates a job and deposits BOT.
2. Agent accepts the job.
3. Agent submits completed work.
4. Client approves the submission.
5. The smart contract releases BOT to the agent.
6. Open jobs can be cancelled, and eligible expired jobs can be refunded.

## Stack

- Solidity 0.8.24
- Foundry
- Next.js / React / TypeScript
- viem + wagmi
- BOT Chain

## BOT Chain networks

| Network | Chain ID | Native token | RPC |
| --- | ---: | --- | --- |
| Testnet | 968 | BOT | https://rpc.bohr.life |
| Mainnet | 677 | BOT | https://rpc.botchain.ai |

## Smart contract

The contract is in `contracts/src/AgentEscrow.sol`.

Lifecycle:

`Open → Accepted → Submitted → Completed`

Additional terminal states are `Cancelled` and `Expired`.

## Test contracts

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit
forge test -vv
```

## Testnet deployment

Never commit a private key. Copy the example locally:

```bash
cd contracts
cp .env.example .env
```

Add a funded testnet deployer key to `.env`, or configure `PRIVATE_KEY` as a GitHub Codespaces secret.

Then deploy and verify:

```bash
source .env

forge script script/DeployBotchain.s.sol:DeployBotchain \
  --rpc-url $BOTCHAIN_RPC_URL \
  --broadcast \
  --verify \
  --verifier blockscout \
  --verifier-url $BOTCHAIN_VERIFIER_URL \
  --slow
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The initial UI includes the dashboard, open jobs, my jobs, job detail, escrow status, and transaction-history routes. Wallet/contract actions can be wired to the deployed contract address after testnet deployment.

## Design

- Background: `#0B1622`
- Surface: `#14263A`
- Primary: `#D9B44A`
- Secondary: `#3E7CB1`

## Secrets

The root `.gitignore` excludes environment files, private keys, Foundry build/broadcast artifacts, dependencies, Next.js build output, logs, and editor files. Only `.env.example` should be committed.
