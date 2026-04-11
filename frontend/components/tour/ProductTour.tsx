"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOUR_STEPS } from "@/components/tour/tour-steps";
import { cn } from "@/lib/utils";

type ProductTourProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductTour({ open, onOpenChange }: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const step = TOUR_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === TOUR_STEPS.length - 1;
  const hasTarget = Boolean(step?.target);

  const clearHighlights = useCallback(() => {
    document.querySelectorAll("[data-tour-highlight]").forEach((el) => {
      el.removeAttribute("data-tour-highlight");
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    clearHighlights();
    if (!step?.target) return;

    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el instanceof HTMLElement) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      el.setAttribute("data-tour-highlight", "true");
    }

    return clearHighlights;
  }, [open, step?.target, stepIndex, clearHighlights]);

  useEffect(() => {
    if (!open) {
      clearHighlights();
      setStepIndex(0);
    }
  }, [open, clearHighlights]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const finish = useCallback(() => {
    clearHighlights();
    onOpenChange(false);
    setStepIndex(0);
  }, [clearHighlights, onOpenChange]);

  const handleSkip = () => {
    finish();
  };

  const handleNext = () => {
    if (isLast) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    setStepIndex((i) => Math.max(0, i - 1));
  };

  if (!mounted || !open) return null;

  const tooltip = (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-modal="true"
      role="dialog"
      aria-labelledby="tour-step-title"
    >
      {/* Block interaction with the app; transparent so spotlight remains visible */}
      <div className="absolute inset-0 bg-transparent pointer-events-auto" />

      {/* 
        Fixed panel with max-height + scroll so long steps never clip off-screen.
        Spotlight steps anchor to bottom; intro/outro center in the viewport.
      */}
      <div
        className={cn(
          "pointer-events-auto fixed z-[110] flex max-h-[min(88vh,40rem)] w-[min(calc(100vw-1.5rem),32rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl",
          hasTarget
            ? "bottom-6 left-1/2 -translate-x-1/2"
            : "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="tour-step-title"
                className="text-base font-semibold text-[#1e3a5f]"
              >
                {step.title}
              </h2>
              <div className="mt-2 text-sm">{step.content}</div>
              <p className="mt-3 text-[11px] text-slate-400">
                Step {stepIndex + 1} of {TOUR_STEPS.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-white px-5 py-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-slate-500"
          >
            Skip
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={isFirst}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="gap-1 bg-[#1e3a5f] hover:bg-[#2d4a6f]"
            >
              {isLast ? "Done" : "Next"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(tooltip, document.body);
}
