"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Submission } from "@/types/submission";
import {
  SCORED_REQUIREMENTS,
  SAF_DIMENSIONS,
  getRequirementsByDimension,
} from "@/data/safRequirements";

interface Props {
  submission: Submission;
}

const SCORE_LABELS: Record<number, string> = {
  0: "0 – Not considered",
  1: "1 – Initial awareness",
  2: "2 – Partially addressed",
  3: "3 – Largely addressed",
  4: "4 – Fully addressed",
  5: "5 – Exemplary",
};

export default function SummaryView({ submission }: Props) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byDimension = getRequirementsByDimension(SCORED_REQUIREMENTS);
  const answeredCount = SCORED_REQUIREMENTS.filter(
    (r) => submission.answers[r.id]?.score !== null && submission.answers[r.id]?.score !== undefined
  ).length;
  const totalScore = SCORED_REQUIREMENTS.reduce(
    (sum, r) => sum + (submission.answers[r.id]?.score ?? 0),
    0
  );
  const maxScore = SCORED_REQUIREMENTS.length * 5;

  async function handleComplete() {
    setCompleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) throw new Error("Failed to complete submission");
      router.push(`/submissions/${submission.id}/complete`);
    } catch {
      setError("There was a problem completing the assessment. Please try again.");
      setCompleting(false);
    }
  }

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-full">
        <a
          href={`/submissions/${submission.id}`}
          className="nhsuk-back-link__link nhsuk-u-margin-bottom-4"
          style={{ display: "inline-block" }}
        >
          <svg
            className="nhsuk-icon nhsuk-icon__chevron-left"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
            height="24"
            width="24"
          >
            <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z" />
          </svg>
          Back to overview
        </a>

        <h1 className="nhsuk-heading-xl">Review your assessment</h1>
        <p className="nhsuk-body-l">
          {submission.projectName} &nbsp;
          <span className="nhsuk-u-secondary-text-color">
            (assessed by {submission.submittedBy})
          </span>
        </p>

        {/* Score summary panel */}
        <div className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-bottom-6">
          <p className="nhsuk-panel__body">
            <strong>
              Total score: {totalScore} / {maxScore}
            </strong>
            <br />
            {answeredCount} of {SCORED_REQUIREMENTS.length} questions scored
          </p>
        </div>

        {/* Per-dimension answers */}
        {SAF_DIMENSIONS.map((dimension) => {
          const reqs = byDimension.get(dimension) ?? [];
          const dimScore = reqs.reduce(
            (sum, r) => sum + (submission.answers[r.id]?.score ?? 0),
            0
          );
          return (
            <section key={dimension} className="nhsuk-u-margin-bottom-6">
              <h2 className="nhsuk-heading-l nhsuk-u-margin-bottom-1">
                {dimension}
              </h2>
              <p className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-bottom-3">
                Score: {dimScore} / {reqs.length * 5}
              </p>

              {reqs.map((req) => {
                const answer = submission.answers[req.id];
                return (
                  <details className="nhsuk-details nhsuk-u-margin-bottom-2" key={req.id}>
                    <summary className="nhsuk-details__summary">
                      <span className="nhsuk-details__summary-text">
                        <strong>{req.id}</strong> &nbsp;
                        {answer?.score !== null && answer?.score !== undefined ? (
                          <strong className="nhsuk-tag nhsuk-tag--green nhsuk-u-margin-left-2">
                            Score: {answer.score}
                          </strong>
                        ) : (
                          <strong className="nhsuk-tag nhsuk-tag--grey nhsuk-u-margin-left-2">
                            Not scored
                          </strong>
                        )}
                        &nbsp; {req.description.slice(0, 80)}
                        {req.description.length > 80 ? "…" : ""}
                      </span>
                    </summary>
                    <div className="nhsuk-details__text">
                      <p className="nhsuk-body">
                        <strong>Requirement:</strong> {req.description}
                      </p>
                      <dl className="nhsuk-summary-list">
                        <div className="nhsuk-summary-list__row">
                          <dt className="nhsuk-summary-list__key">Score</dt>
                          <dd className="nhsuk-summary-list__value">
                            {answer?.score !== null && answer?.score !== undefined
                              ? SCORE_LABELS[answer.score]
                              : "—"}
                          </dd>
                          <dd className="nhsuk-summary-list__actions">
                            {submission.status !== "completed" && (
                              <a
                                href={`/submissions/${submission.id}/question/${req.id}`}
                                className="nhsuk-link"
                              >
                                Change<span className="nhsuk-u-visually-hidden"> answer for {req.id}</span>
                              </a>
                            )}
                          </dd>
                        </div>
                        <div className="nhsuk-summary-list__row">
                          <dt className="nhsuk-summary-list__key">Evidence</dt>
                          <dd className="nhsuk-summary-list__value">
                            {answer?.evidence || <em>None provided</em>}
                          </dd>
                        </div>
                        <div className="nhsuk-summary-list__row">
                          <dt className="nhsuk-summary-list__key">
                            Mitigations
                          </dt>
                          <dd className="nhsuk-summary-list__value">
                            {answer?.mitigations || <em>None provided</em>}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </details>
                );
              })}
            </section>
          );
        })}

        {error && (
          <div
            className="nhsuk-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
          >
            <h2
              className="nhsuk-error-summary__title"
              id="error-summary-title"
            >
              There is a problem
            </h2>
            <div className="nhsuk-error-summary__body">
              <p>{error}</p>
            </div>
          </div>
        )}

        {submission.status !== "completed" && (
          <div className="nhsuk-button-group nhsuk-u-margin-top-4">
            <button
              className="nhsuk-button"
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? "Completing…" : "Mark as complete"}
            </button>
            <a
              href={`/submissions/${submission.id}`}
              className="nhsuk-link nhsuk-u-margin-left-4"
            >
              Return to overview without completing
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
