"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SAFRequirement, SCORED_REQUIREMENTS } from "@/data/safRequirements";
import { Submission } from "@/types/submission";

interface Props {
  submissionId: string;
  requirementId: string;
  submission: Submission;
}

const SCORE_LABELS: Record<number, string> = {
  0: "0 – Not considered / Not applicable",
  1: "1 – Initial awareness only",
  2: "2 – Partially addressed",
  3: "3 – Largely addressed with minor gaps",
  4: "4 – Fully addressed",
  5: "5 – Exemplary / exceeds expectations",
};

export default function QuestionForm({
  submissionId,
  requirementId,
  submission,
}: Props) {
  const router = useRouter();

  // Use the snapshot of SAF requirements from the submission
  const requirementsToUse = (submission.safRequirementsSnapshot && submission.safRequirementsSnapshot.length > 0) 
    ? submission.safRequirementsSnapshot 
    : SCORED_REQUIREMENTS;
  
  const requirement = requirementsToUse.find((r) => r.id === requirementId);
  const currentIndex = requirementsToUse.findIndex(
    (r) => r.id === requirementId
  );
  const prevReq: SAFRequirement | undefined =
    requirementsToUse[currentIndex - 1];
  const nextReq: SAFRequirement | undefined =
    requirementsToUse[currentIndex + 1];

  const existing = submission.answers[requirementId];

  const [evidence, setEvidence] = useState(existing?.evidence ?? "");
  const [mitigations, setMitigations] = useState(
    existing?.mitigations ?? ""
  );
  const [score, setScore] = useState<string>(
    existing?.score !== null && existing?.score !== undefined
      ? String(existing.score)
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-save on blur / field change with debounce
  useEffect(() => {
    setSaved(false);
  }, [evidence, mitigations, score]);

  if (!requirement) {
    return <p className="nhsuk-body">Requirement not found.</p>;
  }
  
  const isCompleted = submission.status === "completed";

  function validate() {
    const errs: Record<string, string> = {};
    if (!evidence.trim()) {
      errs.evidence = "Enter evidence";
    }
    if (score === "") {
      errs.score = "Select a score";
    }
    return errs;
  }

  async function saveAnswer(navigateTo?: string) {
    if (isCompleted) {
      setErrors({ form: "Cannot edit a completed submission" });
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(
        `/api/submissions/${submissionId}/answers`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requirementId,
            evidence,
            mitigations,
            score: score !== "" ? Number(score) : null,
          }),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      if (navigateTo) router.push(navigateTo);
    } catch {
      setErrors({ form: "There was a problem saving. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAndContinue(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    if (nextReq) {
      await saveAnswer(
        `/submissions/${submissionId}/question/${nextReq.id}`
      );
    } else {
      await saveAnswer(`/submissions/${submissionId}/summary`);
    }
  }

  async function handleSaveProgress(e: React.MouseEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    await saveAnswer(`/submissions/${submissionId}`);
  }

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        {/* Back link */}
        <a
          href={
            prevReq
              ? `/submissions/${submissionId}/question/${prevReq.id}`
              : `/submissions/${submissionId}`
          }
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
          {prevReq ? `Back to ${prevReq.id}` : "Back to overview"}
        </a>

        {/* Question header */}
        <span className="nhsuk-caption-l">
          {requirement.dimension} &nbsp;({currentIndex + 1} of{" "}
          {SCORED_REQUIREMENTS.length})
        </span>
        <h1 className="nhsuk-heading-m">Assessment question</h1>
        <p className="nhsuk-body nhsuk-u-secondary-text-color nhsuk-u-margin-bottom-1">
          {requirement.id}
        </p>
        <p className="nhsuk-body-l">{requirement.description}</p>
        
        {isCompleted && (
          <div className="nhsuk-inset-text nhsuk-u-margin-bottom-4">
            <span className="nhsuk-u-visually-hidden">Information: </span>
            <p className="nhsuk-body">
              This assessment has been completed and cannot be edited. 
              To make changes, create a new version from the overview page.
            </p>
          </div>
        )}

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
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
              <ul className="nhsuk-list nhsuk-error-summary__list">
                {Object.entries(errors).map(([field, msg]) => (
                  <li key={field}>
                    <a href={field !== "form" ? `#${field}` : "#"}>{msg}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveAndContinue} noValidate>
          {/* Evidence */}
          <div
            className={`nhsuk-form-group${
              errors.evidence ? " nhsuk-form-group--error" : ""
            }`}
          >
            <label className="nhsuk-label" htmlFor="evidence">
              Evidence (required)
            </label>
            <span className="nhsuk-hint">
              Describe the evidence that demonstrates this requirement is met.
              Include links to documentation, artefacts or decisions.
            </span>
            {errors.evidence && (
              <span className="nhsuk-error-message" id="evidence-error">
                <span className="nhsuk-u-visually-hidden">Error: </span>
                {errors.evidence}
              </span>
            )}
            <textarea
              className={`nhsuk-textarea${
                errors.evidence ? " nhsuk-textarea--error" : ""
              }`}
              id="evidence"
              name="evidence"
              rows={5}
              aria-describedby={errors.evidence ? "evidence-error" : undefined}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              disabled={isCompleted}
            />
          </div>

          {/* Mitigations */}
          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="mitigations">
              Mitigations
            </label>
            <span className="nhsuk-hint">
              If the requirement is not fully met, describe any mitigations,
              compensating controls, or plans to address the gap.
            </span>
            <textarea
              className="nhsuk-textarea"
              id="mitigations"
              name="mitigations"
              rows={5}
              value={mitigations}
              onChange={(e) => setMitigations(e.target.value)}
              disabled={isCompleted}
            />
          </div>

          {/* Score */}
          <div
            className={`nhsuk-form-group${
              errors.score ? " nhsuk-form-group--error" : ""
            }`}
          >
            <fieldset className="nhsuk-fieldset">
              <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--s">
                Score (required)
              </legend>
              <span className="nhsuk-hint">
                Rate how well this requirement is met (0 = not considered, 5 =
                exemplary).
              </span>
              {errors.score && (
                <span
                  className="nhsuk-error-message"
                  id="score-error"
                >
                  <span className="nhsuk-u-visually-hidden">Error: </span>
                  {errors.score}
                </span>
              )}
              <div
                className="nhsuk-radios"
                id="score"
                aria-describedby={errors.score ? "score-error" : undefined}
              >
                {[0, 1, 2, 3, 4, 5].map((val) => (
                  <div className="nhsuk-radios__item" key={val}>
                    <input
                      className="nhsuk-radios__input"
                      id={`score-${val}`}
                      name="score"
                      type="radio"
                      value={String(val)}
                      checked={score === String(val)}
                      onChange={() => setScore(String(val))}
                      disabled={isCompleted}
                    />
                    <label
                      className="nhsuk-label nhsuk-radios__label"
                      htmlFor={`score-${val}`}
                    >
                      {SCORE_LABELS[val]}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          {errors.form && (
            <p className="nhsuk-error-message">
              <span className="nhsuk-u-visually-hidden">Error: </span>
              {errors.form}
            </p>
          )}

          {saved && (
            <div className="nhsuk-inset-text nhsuk-u-margin-bottom-4">
              <span className="nhsuk-u-visually-hidden">Information: </span>
              <p className="nhsuk-body">Answer saved.</p>
            </div>
          )}

          {!isCompleted && (
            <div className="nhsuk-button-group">
              <button
                className="nhsuk-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving…"
                  : nextReq
                  ? "Save and continue"
                  : "Save and review"}
              </button>
              <button
                className="nhsuk-button nhsuk-button--secondary"
                type="button"
                disabled={saving}
                onClick={handleSaveProgress}
              >
                Save progress and return to overview
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Sidebar – progress */}
      <div className="nhsuk-grid-column-one-third">
        <div className="nhsuk-card">
          <div className="nhsuk-card__content">
            <h2 className="nhsuk-card__heading nhsuk-heading-s">
              Assessment overview
            </h2>
            <p className="nhsuk-body-s">
              <strong>{submission.projectName}</strong>
            </p>
            <p className="nhsuk-body-s nhsuk-u-secondary-text-color">
              Question {currentIndex + 1} of {requirementsToUse.length}
            </p>
            <a
              href={`/submissions/${submissionId}`}
              className="nhsuk-link nhsuk-body-s"
            >
              View all questions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
