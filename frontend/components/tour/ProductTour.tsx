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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
      aria-modal="true"
      role="dialog"
      aria-labelledby="tour-step-title"
    >
      {/* Block interaction with the app; transparent so spotlight remains visible */}
      <div className="absolute inset-0 bg-transparent pointer-events-auto" />

      <div
        className={cn(
          "pointer-events-auto relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl",
          hasTarget &&
            "sm:fixed sm:bottom-10 sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:translate-y-0"
        )}
      >
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
            <div className="mt-2">{step.content}</div>
            <p className="mt-3 text-[11px] text-slate-400">
              Step {stepIndex + 1} of {TOUR_STEPS.length}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
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
