import { Sparkles } from "lucide-react";
import type { CopilotBriefing } from "@/lib/types";
import { containmentActionLabels } from "@/lib/format";

export function CopilotPanel({ briefing }: { briefing: CopilotBriefing }) {
  return (
    <div className="panel px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-signal" strokeWidth={1.75} />
        <span className="data-label">AI Security Copilot</span>
      </div>

      <Field label="What happened">{briefing.summary}</Field>
      <Field label="Why it's critical">{briefing.why_critical}</Field>
      <Field label="Likely entry point">{briefing.likely_entry_point}</Field>

      <div className="mt-4">
        <div className="text-[11px] font-mono text-ink-faint mb-1.5">Affected systems</div>
        <div className="flex flex-wrap gap-1.5">
          {briefing.affected_systems.map((s) => (
            <span
              key={s}
              className="text-[11px] font-mono px-2 py-1 rounded bg-overlay text-ink-dim ring-1 ring-line"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[11px] font-mono text-ink-faint mb-1.5">Recommended response</div>
        <ul className="text-[13px] text-ink-dim space-y-1 list-disc list-inside">
          {briefing.recommended_actions.map((a) => (
            <li key={a}>{containmentActionLabels[a]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="text-[11px] font-mono text-ink-faint mb-1">{label}</div>
      <p className="text-[13.5px] text-ink leading-relaxed">{children}</p>
    </div>
  );
}
