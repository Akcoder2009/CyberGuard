"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldHalf, LayoutGrid, Users, GraduationCap, Radio } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Overview", icon: LayoutGrid },
  { href: "/incidents/inc_2026_0914", label: "Incidents", icon: Radio },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/cyberrange/mission_priya_phishing_01", label: "CyberRange", icon: GraduationCap },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex w-56 shrink-0 flex-col border-r border-line bg-surface px-3 py-4">
      <div className="flex items-center gap-2 px-2 py-2 mb-6">
        <ShieldHalf className="h-5 w-5 text-signal" strokeWidth={2} />
        <span className="font-semibold text-[15px] tracking-tight">CyberGuard</span>
      </div>

      <ul className="flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex items-center gap-2.5 rounded px-3 py-2 text-[13.5px] transition-colors",
                  active
                    ? "bg-overlay text-ink"
                    : "text-ink-dim hover:bg-overlay/60 hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto px-3 py-3 text-[11px] leading-relaxed text-ink-faint border-t border-line-soft">
        Simulated environment. No real credentials, phishing infrastructure,
        or malware are used anywhere in this platform.
      </div>
    </nav>
  );
}
