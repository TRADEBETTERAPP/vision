# Content Model

Source-of-truth guidance for structured content, roadmap nodes, token tiers, and scenario data.

**What belongs here:** Required branch families, shared fields, taxonomy expectations, scenario dimensions.

---

## Required roadmap branch families
- Product evolution
- Token utility and access tiers
- Revenue expansion
- Technical infrastructure
- Social / agent ecosystem expansion

## Shared content fields
Each roadmap or economics item should have typed fields for:
- stable id
- title
- maturity/status
- plain-language summary
- dependency or prerequisite notes
- unlock/outcome notes
- evidence/source or assumption cue
- confidence framing when future-facing

## Graph-shell model expectations
- The site shell should be driven by a typed graph model, not only stacked section data.
- Core BETTER surfaces such as identity, proof, roadmap, token policy, architecture, evidence, and risks should be representable as connected nodes or clusters with stable IDs.
- The model should support focal-node selection, orientation recovery, deep-linkable detail states, and clear parent/child or dependency relationships.
- The model should also support a guided investor route through the graph so users can traverse thesis, product, proof, moat, business model, roadmap gates, valuation logic, and appendix detail without leaving the workspace.
- `src/content/graph-nodes.ts` stores `related` links directionally per node. If a new surface should be traversable from an existing node's related-links UI, update both nodes' `related` arrays rather than only the new node.
- `src/components/graph/GraphExplorer.tsx` is expected to keep newly added surface components behind lazy-loading boundaries; adding a new graph surface directly to the initial bundle can violate the later polish/performance contract.

## Dependency conventions
- Narrative `ConfidenceFrame.dependencies` values are rendered directly to users, so they must stay as readable user-facing notes rather than internal IDs.
- Roadmap node `dependencies` are typed as stable roadmap-node IDs and should be resolved to readable labels in the UI.
- Architecture cost-band phase `dependencies` are typed as stable phase IDs in `src/content/types.ts`; keep them ID-backed rather than label-backed if future work touches that model.
- `SourceCue.note` is currently data-only metadata: `src/components/EvidenceHook.tsx` renders the source label, optional `asOf`, and href state, but not the note text itself. Updating a source note will not change visible evidence-hook copy unless the component rendering changes too.

## Narrative surface
- Narrative content is a first-class typed surface alongside roadmap, tokenomics, projections, and architecture content.
- Seed narrative blocks currently live in `src/content/narrative.ts` and drive the `hero`, `current_scope`, and `vision` surfaces.
- Narrative blocks should carry a stable id, surface, order, title, body, maturity/status, source cue, and confidence framing when future-facing.
- `src/components/CaveatFrame.tsx` renders `ConfidenceFrame.dependencies` directly to users, so dependency values must be readable user-facing notes rather than internal roadmap IDs.

## Scenario model dimensions
The scenario system should expose assumptions for:
- prediction-market growth
- Hyperliquid / HyperEVM adoption
- social-vault participation
- AI-agent tooling usage
- enterprise rails / B2B demand

## Token tier model dimensions
Each tier should capture:
- threshold and qualification basis
- access priority
- allocation priority
- preview priority
- agent limits
- fee advantage
- exclusive products or capabilities

## Token policy extensions
In addition to tier data, the content model should support:
- canonical contract facts with per-field provenance (contract address, minted supply, decimals, migration/source notes)
- first-vault qualification rules (minimum BETTER threshold, **totalVaultCapUsd** — not perWalletDepositCapUsd, oversubscription logic, worked examples)
- bidding model fields (bidding window duration, √ weight exponent, per-staker cap formula derived from total vault cap and √-weighted pool, minimum floor of $100)
- multi-vault progression model fields (social vault minimum of 25k BETTER, future vault caps as case-by-case, strategy/liquidity/risk parameters)
- modeled higher-tier whale-product gates (social vaults, personal AI-crafted vaults, related premium surfaces)
- referral-incentive policy fields (reward source, caps, anti-abuse framing, maturity/source cues)
- revenue-return pathways mapping major product offerings back into the broader BETTER ecosystem
- stake-to-vault-share estimation fields (user stake, total staked BETTER, modeled qualifying pool, estimated vault-cap share, deposit-cap interactions, worked examples)

## Execution and valuation model extensions
The content model should also support:
- execution-plan fields for each major roadmap step (workstreams, major dependency classes, proof gates, realistic bounded timing window, and confidence label using the public `Committed` / `Planned` / `Directional` vocabulary from `economics.md`)
- investor-facing stage summaries (why this stage matters, what gets unlocked, what still has to be proven)
- conservative valuation-corridor fields per stage (low/high corridor, comparable set, proof assumptions, and explicit non-promise framing)
