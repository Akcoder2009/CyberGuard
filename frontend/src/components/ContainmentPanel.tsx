"use client";

import { useState, useTransition } from "react";
import { Lock, RefreshCw, Ban, ShieldOff, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";
import { containmentActionLabels } from "@/lib/format";
import type { ContainmentAction } from "@/lib/types";

const actions: { action: ContainmentAction; icon: React.ComponentType<{ className?: string }> }[] = [
  { action: "lock_account", icon: Lock },
  { action: "revoke_sessions", icon: RefreshCw },
  { action: "block_ip", icon: Ban },
  { action: "restrict_api", icon: ShieldOff },
];

/**
 * ContainmentPanel.tsx — Goal 5 (D)
 * Calls POST /api/incidents/{id}/contain for each action. All effects are
 * simulated on the backend (no real network/IAM calls) — see the
 * "no offensive infrastructure" note in the project brief.
 */
export function ContainmentPanel({ incidentId }: { incidentId: string }) {
  const [done, setDone] = useState<Set<ContainmentAction>>(new Set());
  const [pending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<ContainmentAction | null>(null);

  function runAction(action: ContainmentAction) {
    setPendingAction(action);
    startTransition(async () => {
      await api.containIncident(incidentId, action);
      setDone((prev) => new Set(prev).add(action));
      setPendingAction(null);
    });
  }

  return (
    <div className="panel px-5 py-5">
      <div className="data-label mb-4">Containment</div>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ action, icon: Icon }) => {
          const isDone = done.has(action);
          const isPending = pending && pendingAction === action;
          return (
            <button
              key={action}
              onClick={() => runAction(action)}
              disabled={isDone || pending}
              className={clsx(
                "flex items-center gap-2 rounded px-3 py-2.5 text-[12.5px] font-medium ring-1 transition-colors text-left",
                isDone
                  ? "bg-good-dim text-good ring-good/30 cursor-default"
                  : "bg-overlay text-ink ring-line hover:bg-overlay/70 disabled:opacity-60"
              )}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : isDone ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Icon className="h-3.5 w-3.5 shrink-0" />
              )}
              {containmentActionLabels[action]}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-ink-faint mt-3.5 leading-relaxed">
        All containment actions are simulated for this demo environment.
      </p>
    </div>
  );
}
