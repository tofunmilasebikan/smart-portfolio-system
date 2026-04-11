"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TourInvitePopupProps = {
  onStartTour: () => void;
  /** Hide the card while the guided tour is open */
  tourActive?: boolean;
};

const SHOW_DELAY_MS = 900;

export function TourInvitePopup({
  onStartTour,
  tourActive = false,
}: TourInvitePopupProps) {
  const [visible, setVisible] = useState(false);

  /** Show on every mount (each page load / navigation to this page). No localStorage. */
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (tourActive) setVisible(false);
  }, [tourActive]);

  if (!visible || tourActive) return null;

  const dismiss = () => setVisible(false);

  const handleStart = () => {
    setVisible(false);
    onStartTour();
  };

  return (
    <div
      className="tour-invite-pop fixed bottom-6 right-6 z-[90] max-w-[min(100vw-2rem,20rem)]"
      role="dialog"
      aria-labelledby="tour-invite-title"
      aria-describedby="tour-invite-desc"
    >
      <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200/80 bg-gradient-to-br from-white via-sky-50/90 to-indigo-50/80 p-4 shadow-xl shadow-sky-200/40 ring-1 ring-white/60">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-full p-1 text-slate-400 transition hover:bg-white/80 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex gap-3 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2
              id="tour-invite-title"
              className="text-sm font-semibold text-[#1e3a5f]"
            >
              New here?
            </h2>
            <p id="tour-invite-desc" className="mt-1 text-xs text-slate-600 leading-snug">
              Take a quick tour to learn the terminology and what this
              dashboard does—totally optional.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleStart}
                className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white text-xs h-8"
              >
                Take a tour
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={dismiss}
                className="text-xs h-8 border-slate-200 bg-white/70"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
