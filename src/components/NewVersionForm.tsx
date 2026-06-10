"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Submission } from "@/types/submission";

interface Props {
  sourceSubmission: Submission;
  nextVersionNumber: number;
}

export default function NewVersionForm({ sourceSubmission, nextVersionNumber }: Props) {
  const router = useRouter();
  const [projectName, setProjectName] = useState(sourceSubmission.projectName);
  const [projectDescription, setProjectDescription] = useState(
    sourceSubmission.projectDescription || ""
  );
  const [submittedBy, setSubmittedBy] = useState(sourceSubmission.submittedBy);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!projectName.trim()) {
      errs.projectName = "Enter a project name";
    }
    if (!submittedBy.trim()) {
      errs.submittedBy = "Enter who is submitting this assessment";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setCreating(true);
    setErrors({});
    try {
      const res = await fetch(`/api/submissions/${sourceSubmission.id}/version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName.trim(),
          projectDescription: projectDescription.trim(),
          submittedBy: submittedBy.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to create version");
      const newVersion = await res.json();
      router.push(`/submissions/${newVersion.id}`);
    } catch (err) {
      setErrors({ form: "Failed to create a new version. Please try again." });
      setCreating(false);
    }
  }

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <a
          href={`/submissions/${sourceSubmission.id}`}
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
          Back to assessment
        </a>

        <h1 className="nhsuk-heading-xl">Create new version {nextVersionNumber}</h1>
        
        <div className="nhsuk-inset-text">
          <p className="nhsuk-body">
            You are creating version {nextVersionNumber} of this assessment. All evidence and mitigations will be
            copied, but scores will be cleared for re-assessment.
          </p>
        </div>

        {Object.keys(errors).length > 0 && (
          <div
            className="nhsuk-error-summary"
            aria-labelledby="error-summary-title"
            role="alert"
          >
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
          <div
            className={`nhsuk-form-group${
              errors.projectName ? " nhsuk-form-group--error" : ""
            }`}
          >
            <label className="nhsuk-label" htmlFor="projectName">
              Project name
            </label>
            {errors.projectName && (
              <span className="nhsuk-error-message" id="projectName-error">
                <span className="nhsuk-u-visually-hidden">Error: </span>
                {errors.projectName}
              </span>
            )}
            <input
              className={`nhsuk-input${
                errors.projectName ? " nhsuk-input--error" : ""
              }`}
              id="projectName"
              name="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              aria-describedby={errors.projectName ? "projectName-error" : undefined}
            />
          </div>

          <div className="nhsuk-form-group">
            <label className="nhsuk-label" htmlFor="projectDescription">
              Project description (optional)
            </label>
            <textarea
              className="nhsuk-textarea"
              id="projectDescription"
              name="projectDescription"
              rows={5}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div
            className={`nhsuk-form-group${
              errors.submittedBy ? " nhsuk-form-group--error" : ""
            }`}
          >
            <label className="nhsuk-label" htmlFor="submittedBy">
              Submitted by
            </label>
            <span className="nhsuk-hint">
              Your name or email address
            </span>
            {errors.submittedBy && (
              <span className="nhsuk-error-message" id="submittedBy-error">
                <span className="nhsuk-u-visually-hidden">Error: </span>
                {errors.submittedBy}
              </span>
            )}
            <input
              className={`nhsuk-input${
                errors.submittedBy ? " nhsuk-input--error" : ""
              }`}
              id="submittedBy"
              name="submittedBy"
              type="text"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              aria-describedby={errors.submittedBy ? "submittedBy-error" : undefined}
            />
          </div>

          <button
            className="nhsuk-button"
            type="submit"
            disabled={creating}
          >
            {creating ? "Creating version…" : "Create new version"}
          </button>
        </form>
      </div>
    </div>
  );
}
