"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { CyberRangeMission } from "@/lib/types";

/**
 * MissionQuiz.tsx — Goal 6 (E)
 * Client-side quiz runner. On completion, posts the computed score to
 * POST /api/cyberrange/missions/{id}/complete, which the backend uses to
 * update the employee's risk score and recalculate org risk.
 */
export function MissionQuiz({ mission }: { mission: CyberRangeMission }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, startTransition] = useTransition();
  const [result, setResult] = useState<CyberRangeMission | null>(null);

  const question = mission.questions[step];
  const isLastQuestion = step === mission.questions.length - 1;

  const scoreAfter = useMemo(() => {
    const pct = correctCount / mission.questions.length;
    // Simple deterministic scoring model for the demo: base score plus up
    // to 30 points recovered based on quiz accuracy.
    return Math.min(100, Math.round(mission.score_before + pct * 30));
  }, [correctCount, mission.questions.length, mission.score_before]);

  function selectAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct_index) {
      setCorrectCount((c) => c + 1);
    }
  }

  function next() {
    if (isLastQuestion) {
      setFinished(true);
      startTransition(async () => {
        const { data } = await api.submitMissionScore(mission.id, scoreAfter);
        setResult(data);
      });
      return;
    }
    setStep((s) => s + 1);
    setSelected(null);
  }

  if (finished) {
    return (
      <div className="panel px-6 py-8 text-center">
        {submitting && !result ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="h-5 w-5 animate-spin text-signal" />
            <span className="text-[13px] text-ink-dim">Updating training record…</span>
          </div>
        ) : (
          <>
            <div className="text-[13px] text-ink-dim mb-1">Mission complete</div>
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="text-center">
                <div className="kpi-figure text-[26px] font-semibold text-critical">
                  {mission.score_before}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">before</div>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-faint" />
              <div className="text-center">
                <div className="kpi-figure text-[26px] font-semibold text-good">
                  {result?.score_after ?? scoreAfter}
                </div>
                <div className="text-[11px] text-ink-faint mt-1">after</div>
              </div>
            </div>
            <p className="text-[13px] text-ink-dim max-w-sm mx-auto leading-relaxed">
              Got {correctCount} of {mission.questions.length} right. This score feeds back into{" "}
              {mission.employee_id.replace("emp_", "").replace("_", " ")}
              &apos;s profile and the org risk score will recalculate.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="panel px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <span className="data-label">
          Question {step + 1} of {mission.questions.length}
        </span>
        <div className="flex gap-1">
          {mission.questions.map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1 w-6 rounded-full",
                i < step ? "bg-signal" : i === step ? "bg-ink-dim" : "bg-line"
              )}
            />
          ))}
        </div>
      </div>

      <p className="text-[15px] text-ink leading-relaxed mb-5">{question.prompt}</p>

      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          const isCorrect = i === question.correct_index;
          const isSelected = i === selected;
          const revealed = selected !== null;

          return (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              disabled={revealed}
              className={clsx(
                "w-full text-left px-4 py-3 rounded-md text-[13.5px] ring-1 transition-colors flex items-start gap-2.5",
                !revealed && "ring-line bg-overlay hover:bg-overlay/70",
                revealed && isCorrect && "ring-good/40 bg-good-dim text-good",
                revealed && isSelected && !isCorrect && "ring-critical/40 bg-critical-dim text-critical",
                revealed && !isCorrect && !isSelected && "ring-line bg-overlay/40 text-ink-faint"
              )}
            >
              {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
              {revealed && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 mt-0.5" />}
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4 px-4 py-3 rounded-md bg-overlay/60 text-[13px] text-ink-dim leading-relaxed">
          {question.explanation}
        </div>
      )}

      {selected !== null && (
        <button
          onClick={next}
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-signal hover:underline"
        >
          {isLastQuestion ? "Finish mission" : "Next question"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
