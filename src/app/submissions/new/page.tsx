"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSubmissionPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs: Record<string, string> = {};
    if (!projectName.trim()) errs.projectName = "Enter a project name";
    if (!submittedBy.trim()) errs.submittedBy = "Enter your name";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, projectDescription, submittedBy }),
      });
      if (!res.ok) throw new Error("Failed to create submission");
      const submission = await res.json();
      router.push(`/submissions/${submission.id}`);
    } catch {
      setErrors({ form: "There was a problem creating the assessment. Please try again." });
      setSubmitting(false);
    }
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <a href="/" className="nhsuk-back-link__link nhsuk-u-margin-bottom-4" style={{ display: "inline-block" }}>
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
          Back
        </a>

        <h1 className="nhsuk-heading-xl">Start a new assessment</h1>

        {hasErrors && (
          <div className="nhsuk-error-summary" aria-labelledby="error-summary-title" role="alert">
            <h2 className="nhsuk-error-summary__title" id="error-summary-title">
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

        <form onSubmit={handleSubmit} noValidate>
          <div className={`nhsuk-form-group${errors.projectName ? " nhsuk-form-group--error" : ""}`}>
            <label className="nhsuk-label" htmlFor="projectName">
              Project name
            </label>
            <span className="nhsuk-hint">
              The name of the solution or project being assessed
            </span>
            {errors.projectName && (
              <span className="nhsuk-error-message" id="projectName-error">
                <span className="nhsuk-u-visually-hidden">Error: </span>
                {errors.projectName}
              </span>
            )}
            <input
              className={`nhsuk-input nhsuk-input--width-three-quarters${errors.projectName ? " nhsuk-input--error" : ""}`}
              id="projectName"
              name="projectName"
              type="text"
              autoComplete="off"
              aria-describedby={errors.projectName ? "projectName-error" : undefined}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="projectDescription">
              Project description (optional)
            </label>
            <span className="nhsuk-hint">
              A brief summary of what the solution does
            </span>
            <textarea
              className="nhsuk-textarea"
              id="projectDescription"
              name="projectDescription"
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className={`nhsuk-form-group${errors.submittedBy ? " nhsuk-form-group--error" : ""}`}>
            <label className="nhsuk-label" htmlFor="submittedBy">
              Your name
            </label>
            <span className="nhsuk-hint">
              The person completing this assessment
            </span>
            {errors.submittedBy && (
              <span className="nhsuk-error-message" id="submittedBy-error">
                <span className="nhsuk-u-visually-hidden">Error: </span>
                {errors.submittedBy}
              </span>
            )}
            <input
              className={`nhsuk-input nhsuk-input--width-one-half${errors.submittedBy ? " nhsuk-input--error" : ""}`}
              id="submittedBy"
              name="submittedBy"
              type="text"
              autoComplete="name"
              aria-describedby={errors.submittedBy ? "submittedBy-error" : undefined}
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
            />
          </div>

          {errors.form && (
            <div className="nhsuk-error-message nhsuk-u-margin-bottom-4">
              <span className="nhsuk-u-visually-hidden">Error: </span>
              {errors.form}
            </div>
          )}

          <button
            className="nhsuk-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Start assessment"}
          </button>
        </form>
      </div>
    </div>
  );
}
