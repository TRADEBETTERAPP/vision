# Economics

Worker-facing economic facts and roadmap expansion guidance for BETTER.

**What belongs here:** Current canonical BETTER mechanics, roadmap expansion rules, projection framing guidance.

---

## Current BETTER facts from docs
- Terminal closed beta is the only clearly live BETTER product today
- Current live flow centers on signal discovery and one/two-click Polymarket copy trading
- Funding currently routes from Ethereum or Base into Polygon-ready balances
- BETTER uses an access gate with a permanent FDV ratchet
- Lite Mode halves the Terminal requirement and charges a 2% nominal per-fill fee
- BETTER uses a 2% buy tax and 2% sell tax on the Aerodrome LP path
- Vaults, `vBETTER`, B2B data lines, and model distribution are future-facing or in progress
- The new Base contract at `0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E` is the canonical contract surface for this mission
- Present minted supply as `709,001,940 BETTER` from the verified Base contract source; do not blend it with a 1B max-supply story on the main site
- Treat the current public allocation split as `40% public sale + liquidity / 20% team / 25% treasury / 5% OpenServ drop / 10% programmatic funding` unless a newer BETTER source overrides it during mission work
- Treat vault fees as the docs-backed `20%` performance fee on profit-only withdrawals with a wallet-level high-water mark unless a newer BETTER source overrides it during mission work

## Mission-specific roadmap expansion guidance
- Keep the roadmap aggressive, but do not blur current/live mechanics with planned/speculative mechanics
- Whale-first design is intentional
- For this mission, the Q1 2026 first-vault policy surface must make the `100,000 BETTER` minimum and the baseline `$25,000` **total vault cap across all users combined** explicit with worked examples
- Vault caps are total vault caps across all qualifying users; individual allocations within a vault are determined by the bidding model
- Beyond explicitly proven gates, the site may show an aggressive inferred whale ladder for social vaults, personal AI-crafted vaults, and related premium products, but those thresholds must read as modeled policy rather than current live rules
- Social vaults require a minimum of `25,000 BETTER` to qualify
- Future vault caps are determined on a case-by-case basis depending on strategy, liquidity, and risk parameters
- Add a sustainable referral-incentive model only if the surface also explains how rewards are funded, capped, and kept non-abusive
- Cover agent-native mechanics such as bonded agents, delegation, data bounties, premium API lanes, LLM credits, and exclusive whale products
- Cover revenue layers across consumer, pro, whale, and enterprise segments, and show how each major product family can feed value or revenue back into the broader BETTER ecosystem
- Distinguish canonical current values from scenario-based or illustrative future values

## Execution timing guidance
- The site should explain not just what ships next, but how each major stage gets delivered: internal build workstreams, external dependencies, proof gates, and realistic timing windows.
- AI-agent workflows and large model budgets can materially compress internal implementation cycles, but they do not eliminate the time needed for audits, legal review, venue integrations, partnerships, liquidity proving, or distribution ramp.
- Preferred public timing labels: `Committed`, `Planned`, and `Directional`, each with a proof gate and the main dependency that could extend the timeline.

## Valuation framing guidance
- Present **conservative stage-based valuation corridors**, not promised numbers.
- Tie each corridor to milestone proof gates such as live product proof, revenue proof, audited vault readiness, multi-venue readiness, or recurring software/data revenue.
- Use comparable categories such as prediction-market infrastructure, AI-native finance tools, and crypto data/software businesses to explain why the corridor changes from one stage to the next.

## Bidding model
- Vault allocation uses a **bidding model** with a **24-hour bidding window** before each vault opens
- Allocation weight is **√-weighted** (square-root of staked BETTER), so larger stakers get more capacity but with diminishing returns
- Each staker's allocation is subject to a **hard cap** derived from the total vault cap and the √-weighted pool
- There is a **$100 minimum floor** per allocation — no staker receives less than $100 if they qualify at all
- The bidding model replaces any earlier wallet-level deposit-cap concept; the total vault cap is the binding constraint and individual shares are computed from it

## Verified on-chain allocation data
- **Team allocation:** ~250M BETTER
- **Treasury allocation:** ~200M BETTER
- **SERV (OpenServ) allocation:** ~50M BETTER
- **LP allocation:** ~60.9M BETTER
- These figures are verified from on-chain data (Base contract + basescan + Dune queries) and supersede earlier percentage-based splits where they conflict
- Wallet-specific citation targets used in the token-allocation UI:
  - **LP / Liquidity:** `0x80e29ff551400fb8313af916a8fa164ca310c0d7` and `0x498581ff718922c3f8e6a244956af099b2652b2b`
  - **Programmatic Funding:** `0x2d407b5a24800a058b8f34b04e6b7b18ad0cae16` and `0x1b33f383e297f71c85ae55da5d42aea7a08f1a60`
  - **Airdrop / Migration verification source:** deployer `0x1bbdc95d322b8fd76e6a00e6c318dfb421d7d322` transfer history on Basescan
  - Source for these wallet targets: `/Users/test/dune_query_results.md`

## Vault-share modeling guidance
- The first-vault and modeled whale-vault surfaces should let users estimate how their staked BETTER compares to total staked BETTER and how that ratio maps to an estimated share of initial deposit capacity.
- Distinguish clearly between:
  - token stake as a percentage of the qualifying staked pool
  - modeled allocation weight or queue priority
  - estimated share of initial vault capacity
  - actual deposit cap rules
- Show worked examples for at least a minimum qualifying holder and a higher-tier whale case.
