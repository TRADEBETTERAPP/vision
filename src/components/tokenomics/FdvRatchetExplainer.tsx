/**
 * FDV Ratchet Explainer with Worked Examples — VAL-TOKEN-005
 *
 * Explains the FDV ratchet in plain language and includes worked examples
 * covering threshold changes and permanent-lower-threshold behavior.
 */

import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { SourceCue, ConfidenceFrame } from "@/content";

const ratchetSource: SourceCue = {
  type: "canonical",
  label: "BETTER Docs",
  href: "https://docs.betteragent.ai",
  asOf: "2026-Q1",
  note: "The FDV ratchet is a live, on-chain mechanism.",
};

const ratchetCaveat: ConfidenceFrame = {
  caveat:
    "Exact FDV bands and threshold values are illustrative. Actual ratchet triggers depend on on-chain FDV calculations.",
};

interface RatchetStep {
  fdv: string;
  threshold: string;
  explanation: string;
  highlight?: boolean;
}

const WORKED_EXAMPLE: RatchetStep[] = [
  {
    fdv: "$10M",
    threshold: "100,000 BETTER",
    explanation:
      "Starting point: BETTER FDV is at $10M. The standard Terminal access threshold is 100,000 BETTER tokens.",
  },
  {
    fdv: "$25M (new ATH)",
    threshold: "75,000 BETTER",
    explanation:
      "BETTER FDV reaches $25M — a new all-time high band. The ratchet permanently lowers the access threshold to 75,000 BETTER.",
    highlight: true,
  },
  {
    fdv: "$50M (new ATH)",
    threshold: "50,000 BETTER",
    explanation:
      "FDV climbs to $50M — another new high. Threshold permanently drops to 50,000 BETTER.",
    highlight: true,
  },
  {
    fdv: "$30M (decline)",
    threshold: "50,000 BETTER",
    explanation:
      "FDV pulls back to $30M. The threshold stays at 50,000 BETTER — it never increases once lowered. This is the permanent ratchet in action.",
    highlight: true,
  },
  {
    fdv: "$15M (further decline)",
    threshold: "50,000 BETTER",
    explanation:
      "FDV drops further to $15M. The threshold remains at 50,000 BETTER. The ratchet is permanent and one-directional — downward only.",
  },
  {
    fdv: "$75M (new ATH)",
    threshold: "35,000 BETTER",
    explanation:
      "FDV reaches a new all-time high of $75M. The threshold drops again to 35,000 BETTER. Each new FDV band achieved permanently lowers access requirements.",
    highlight: true,
  },
];

export default function FdvRatchetExplainer() {
  return (
    <div data-testid="fdv-ratchet-explainer">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Permanent FDV Ratchet
      </h3>
      <p className="mb-2 text-sm text-secondary">
        The FDV ratchet is a one-way mechanism that permanently lowers the
        Terminal access threshold each time BETTER reaches a new fully diluted
        valuation (FDV) milestone. Once the threshold drops, it{" "}
        <span className="font-semibold text-accent">
          never increases again
        </span>
        , even if FDV later declines.
      </p>

      <div className="mb-4">
        <EvidenceHook source={ratchetSource} />
      </div>

      {/* How it works */}
      <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-accent">
          How It Works
        </h4>
        <ol className="list-inside list-decimal space-y-1 text-sm text-secondary">
          <li>
            BETTER&apos;s FDV reaches a{" "}
            <span className="font-semibold text-foreground">
              new all-time high band
            </span>{" "}
            (e.g. $25M, $50M, $75M).
          </li>
          <li>
            The access threshold{" "}
            <span className="font-semibold text-accent">permanently drops</span>{" "}
            to a lower number of tokens.
          </li>
          <li>
            If FDV later declines, the threshold{" "}
            <span className="font-semibold text-foreground">stays at the lower level</span>
            . It never increases.
          </li>
          <li>
            When FDV reaches the{" "}
            <span className="font-semibold text-foreground">
              next new ATH band
            </span>
            , the threshold drops again.
          </li>
        </ol>
      </div>

      {/* Worked Example */}
      <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
        Worked Example
      </h4>
      <div className="space-y-0" data-testid="ratchet-worked-example">
        {WORKED_EXAMPLE.map((step, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 border-l-2 py-3 pl-4 ${
              step.highlight
                ? "border-accent bg-accent/5"
                : "border-border"
            }`}
            data-testid="ratchet-step"
          >
            <div className="shrink-0 pt-0.5">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-terminal text-xs font-bold ${
                  step.highlight
                    ? "bg-accent text-background"
                    : "bg-surface text-muted"
                }`}
              >
                {index + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="font-terminal font-medium text-secondary">
                  FDV: {step.fdv}
                </span>
                <span className="font-terminal text-xs text-muted">→</span>
                <span
                  className={`font-terminal font-semibold ${
                    step.highlight ? "text-accent" : "text-foreground"
                  }`}
                >
                  Threshold: {step.threshold}
                </span>
              </div>
              <p className="mt-1 text-sm text-secondary">{step.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      <CaveatFrame confidence={ratchetCaveat} className="mt-4" />
    </div>
  );
}
