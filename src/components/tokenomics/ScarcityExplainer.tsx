/**
 * Scarcity & Oversubscription Explainer — VAL-TOKEN-004
 *
 * Clearly explains how whale-first priority resolves oversubscription
 * for vaults, previews, and premium capacity.
 */

import CaveatFrame from "@/components/CaveatFrame";
import EvidenceHook from "@/components/EvidenceHook";
import type { SourceCue, ConfidenceFrame } from "@/content";

const scarcitySource: SourceCue = {
  type: "scenario_based",
  label: "BETTER Tokenomics",
  note: "Scarcity mechanics are part of the whale-first tier design.",
};

const scarcityCaveat: ConfidenceFrame = {
  caveat:
    "Specific capacity limits, queue mechanics, and tier-weighted allocation formulas are under active design. The principles below represent the intended whale-first priority model.",
  dependencies: [
    "Whale-First Tier Ladder",
    "Social Vaults & vBETTER",
  ],
};

interface ScarcityRule {
  title: string;
  scenario: string;
  resolution: string;
}

const SCARCITY_RULES: ScarcityRule[] = [
  {
    title: "Vault Capacity",
    scenario:
      "A new social vault opens with $2M capacity and $5M in pending deposits.",
    resolution:
      "Deposits are processed in tier-priority order: Apex Whale → Whale → Standard → Lite → Explorer. Within the same tier, deposits are processed first-come, first-served. Lower tiers may be partially filled or waitlisted if higher-tier demand exhausts capacity.",
  },
  {
    title: "Strategy Preview Slots",
    scenario:
      "A new strategy preview has 50 early-access slots with 200 interested users.",
    resolution:
      "Slots are offered to the highest preview-priority tiers first. Apex Whales get first access, then Whales, then Standard holders. Explorer and Lite tiers are ineligible for preview access.",
  },
  {
    title: "Agent Slot Availability",
    scenario:
      "System-wide agent capacity is constrained during high-demand periods.",
    resolution:
      "Agent slot limits per tier (0 / 1 / 2 / 5 / 10) ensure whale-tier users always have more headroom. During peak demand, tier-based priority determines who retains active agent slots.",
  },
  {
    title: "OTC & Premium Channel Access",
    scenario:
      "An OTC facilitation round has limited slots for a strategic token transaction.",
    resolution:
      "Only Apex Whale tier qualifies. If demand exceeds supply, allocation uses a combination of tenure, historical activity, and allocation-priority scores.",
  },
];

export default function ScarcityExplainer() {
  return (
    <div data-testid="scarcity-explainer">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Oversubscription &amp; Scarcity Rules
      </h3>
      <p className="mb-4 text-sm text-secondary">
        When vault space, preview slots, or premium capacity is scarce,
        whale-first priority determines how access is allocated. The rules
        below show how each scarcity scenario resolves.
      </p>

      <div className="mb-4">
        <EvidenceHook source={scarcitySource} />
      </div>

      <div className="space-y-4">
        {SCARCITY_RULES.map((rule) => (
          <div
            key={rule.title}
            className="rounded-lg border border-border bg-surface p-4"
            data-testid="scarcity-rule"
          >
            <h4 className="mb-2 font-semibold text-foreground">{rule.title}</h4>
            <div className="space-y-2">
              <div>
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent-warn">
                  Scenario
                </span>
                <p className="mt-0.5 text-sm text-secondary">{rule.scenario}</p>
              </div>
              <div>
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
                  Resolution
                </span>
                <p className="mt-0.5 text-sm text-secondary">{rule.resolution}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CaveatFrame confidence={scarcityCaveat} className="mt-4" />
    </div>
  );
}
