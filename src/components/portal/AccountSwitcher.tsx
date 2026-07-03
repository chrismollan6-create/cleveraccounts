"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { setActiveAccount } from "@/lib/portal/actions";
import type { PortalCompany } from "@/lib/portal/memberships";

/**
 * Account switcher — shown in the sidebar only when a login has more than one
 * company (e.g. a director of two Ltd companies). Selecting a company calls the
 * setActiveAccount server action (which validates membership server-side) then
 * refreshes so every surface re-renders in the new company's scope.
 */
export default function AccountSwitcher({ companies }: { companies: PortalCompany[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const active = companies.find((c) => c.isActive) ?? companies[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Nothing to switch between — render nothing (single-company users see no UI).
  if (companies.length < 2) return null;

  function choose(accountSfId: string) {
    if (accountSfId === active?.accountSfId) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const res = await setActiveAccount(accountSfId);
      setOpen(false);
      if (res.ok) router.refresh();
    });
  }

  return (
    <div className="px-4 pt-4" ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={pending}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex w-full items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left transition hover:border-gray-300 disabled:opacity-60"
        >
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Building2 size={14} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-text">
              {active?.name}
            </span>
            <span className="block text-[10px] text-text-light">Switch company</span>
          </span>
          <ChevronsUpDown size={14} className="flex-shrink-0 text-text-light" />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <ul className="max-h-72 overflow-auto py-1" role="listbox">
              {companies.map((c) => (
                <li key={c.accountSfId} role="option" aria-selected={c.isActive}>
                  <button
                    type="button"
                    onClick={() => choose(c.accountSfId)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium text-text">
                        {c.name}
                      </span>
                      {c.status === "pending" && (
                        <span className="block text-[10px] text-amber-600">
                          Setup in progress
                        </span>
                      )}
                    </span>
                    {c.isActive && (
                      <Check size={14} className="flex-shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
