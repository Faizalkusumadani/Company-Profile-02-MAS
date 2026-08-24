"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Link } from "@/i18n/navigation";

// ─── Types ──────────────────────────────────────────────────────────────────
type ConsentCategory = "analytics" | "marketing";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = ConsentState & { timestamp: string; version: number };

const STORAGE_KEY = "reddmas_cookie_consent";
const CONSENT_VERSION = 1;

const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const CONSENT_EVENT = "reddmas-consent-change";

function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredConsent;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

let cachedRaw: string | null = null;
let cachedParsed: StoredConsent | null = null;

function getStoredConsentSnapshot(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedParsed = parseStoredConsent(raw);
  }
  return cachedParsed;
}

function getStoredConsentServerSnapshot(): StoredConsent | null {
  return null;
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
  };
}

function writeStoredConsent(consent: ConsentState) {
  const payload: StoredConsent = {
    ...consent,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// Unmounting <GoogleAnalytics> only removes the script tag — it does not
// retroactively clear cookies GA already set. When analytics consent is
// revoked, clean those up explicitly so no tracking cookie survives opt-out.
function clearGACookies(gaId?: string) {
  const names = [
    "_ga",
    "_gid",
    gaId ? `_ga_${gaId.replace("G-", "")}` : null,
  ].filter((name): name is string => Boolean(name));

  names.forEach((name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

// ─── Icons (inline, no extra dependency) ───────────────────────────────────
function CookieIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2a10 10 0 1 0 10 10c0-.5-.05-1-.14-1.47a2.5 2.5 0 0 1-3-3A2.5 2.5 0 0 1 15.5 4.1 10 10 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="12.3" cy="14.8" r="1.1" fill="currentColor" />
      <circle cx="15.8" cy="9.5" r="1" fill="currentColor" />
      <circle cx="9.5" cy="15.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Toggle switch ──────────────────────────────────────────────────────────
function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary ${
        checked ? "bg-reddmas-blue" : "bg-neutral-300 dark:bg-neutral-700"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
    </button>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const t = useTranslations("Cookies");

  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    getStoredConsentSnapshot,
    getStoredConsentServerSnapshot,
  );
  const appliedConsent = storedConsent ?? DEFAULT_CONSENT;
  const hasConsented = storedConsent !== null;

  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (hasConsented) return;
    // small delay so the banner slides in after first paint, not on load
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, [hasConsented]);

  const persist = useCallback(
    (next: ConsentState) => {
      // Revoking analytics consent should also scrub any GA cookies that
      // are already sitting in the browser, not just stop future ones.
      if (appliedConsent.analytics && !next.analytics) {
        clearGACookies(gaId);
      }
      writeStoredConsent(next);
      setVisible(false);
    },
    [appliedConsent.analytics, gaId],
  );

  const handleAcceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true });
  const handleRejectAll = () =>
    persist({ necessary: true, analytics: false, marketing: false });
  const handleSavePreferences = () => persist(draft);

  const toggleCategory = (category: ConsentCategory, value: boolean) => {
    setDraft((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <>
      {/* GA only mounts once the user has granted analytics consent */}
      {gaId && appliedConsent.analytics && <GoogleAnalytics gaId={gaId} />}

      {visible && (
        <div
          role="region"
          aria-label={t("ariaLabel")}
          className="fixed inset-x-0 bottom-0 z-100 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="w-full max-w-2xl origin-bottom rounded-2xl border border-neutral-200/80 bg-white/95 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/95">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-reddmas-blue/10 text-primary">
                  <CookieIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {t("title")}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {t("description")}{" "}
                    <Link
                      href="/kebijakan"
                      className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
                    >
                      {t("learnMore")}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Preferences panel */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  expanded
                    ? "mt-4 grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/60">
                    <div className="flex items-center justify-between gap-4 py-1.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {t("necessary.title")}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {t("necessary.description")}
                        </p>
                      </div>
                      <Toggle checked disabled label={t("necessary.title")} />
                    </div>

                    <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

                    <div className="flex items-center justify-between gap-4 py-1.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {t("analytics.title")}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {t("analytics.description")}
                        </p>
                      </div>
                      <Toggle
                        checked={draft.analytics}
                        onChange={(v) => toggleCategory("analytics", v)}
                        label={t("analytics.title")}
                      />
                    </div>

                    <div className="h-px bg-neutral-200 dark:bg-neutral-700" />

                    <div className="flex items-center justify-between gap-4 py-1.5">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {t("marketing.title")}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {t("marketing.description")}
                        </p>
                      </div>
                      <Toggle
                        checked={draft.marketing}
                        onChange={(v) => toggleCategory("marketing", v)}
                        label={t("marketing.title")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="inline-flex items-center gap-1 self-start rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {expanded ? t("hidePreferences") : t("managePreferences")}
                  <ChevronIcon open={expanded} />
                </button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    {t("rejectAll")}
                  </button>
                  {expanded ? (
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="rounded-lg bg-reddmas-blue px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary/30 transition-transform hover:brightness-110 active:scale-[0.98]"
                    >
                      {t("savePreferences")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="rounded-lg bg-reddmas-blue px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary/30 transition-transform hover:brightness-110 active:scale-[0.98]"
                    >
                      {t("acceptAll")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
