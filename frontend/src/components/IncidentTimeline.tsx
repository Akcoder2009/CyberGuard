import type { SecurityEvent } from "@/lib/types";
import { clockTime, eventTypeLabels, severityStyles } from "@/lib/format";
import clsx from "clsx";

/**
 * IncidentTimeline.tsx — Goal 3 (D)
 * Renders the ordered chain of SecurityEvents for one incident.
 * Pure presentational component: pass it `incident.events` (already
 * chronologically ordered by the backend) and nothing else.
 */
export function IncidentTimeline({ events }: { events: SecurityEvent[] }) {
  return (
    <div className="panel px-5 py-5">
      <div className="data-label mb-4">Attack timeline</div>
      <ol className="relative">
        {events.map((event, i) => {
          const s = severityStyles[event.severity];
          const isLast = i === events.length - 1;
          return (
            <li key={event.id} className="relative pl-7 pb-6 last:pb-0">
              {!isLast && (
                <span className="absolute left-[7px] top-4 bottom-0 w-px bg-line" />
              )}
              <span
                className={clsx(
                  "absolute left-0 top-1 h-3.5 w-3.5 rounded-full ring-4 ring-surface",
                  s.text.replace("text-", "bg-")
                )}
              />
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[13.5px] font-medium text-ink">
                  {eventTypeLabels[event.type]}
                </span>
                <span className="font-mono text-[11px] text-ink-faint shrink-0">
                  {clockTime(event.timestamp)}
                </span>
              </div>
              <p className="text-[13px] text-ink-dim mt-0.5 leading-relaxed">
                {event.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={clsx("text-[11px] font-mono", s.text)}>
                  {s.label.toLowerCase()}
                </span>
                {event.source_ip && (
                  <span className="text-[11px] font-mono text-ink-faint">
                    · {event.source_ip}
                  </span>
                )}
                {event.contained && (
                  <span className="text-[11px] font-mono text-good">· contained</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
