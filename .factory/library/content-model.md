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

## Dependency conventions
- Narrative `ConfidenceFrame.dependencies` values are rendered directly to users, so they must stay as readable user-facing notes rather than internal IDs.
- Roadmap node `dependencies` are typed as stable roadmap-node IDs and should be resolved to readable labels in the UI.
- Architecture cost-band phase `dependencies` are typed as stable phase IDs in `src/content/types.ts`; keep them ID-backed rather than label-backed if future work touches that model.

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
- first-vault qualification rules (minimum BETTER threshold, deposit cap, oversubscription logic, worked examples)
- modeled higher-tier whale-product gates (social vaults, personal AI-crafted vaults, related premium surfaces)
- referral-incentive policy fields (reward source, caps, anti-abuse framing, maturity/source cues)
- revenue-return pathways mapping major product offerings back into the broader BETTER ecosystem
