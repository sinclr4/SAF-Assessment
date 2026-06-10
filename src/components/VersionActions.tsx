"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Submission } from "@/types/submission";

interface Props {
  submission: Submission;
}

export default function VersionActions({ submission }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<Submission[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  function handleCreateVersion() {
    router.push(`/submissions/${submission.id}/new-version`);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete this assessment. Please try again.");
      setDeleting(false);
    }
  }

  async function loadVersions() {
    setLoadingVersions(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submission.id}/versions`);
      if (!res.ok) throw new Error("Failed to load versions");
      const data = await res.json();
      setVersions(data);
      setShowVersions(true);
    } catch (err) {
      setError("Failed to load version history. Please try again.");
    } finally {
      setLoadingVersions(false);
    }
  }

  return (
    <div className="nhsuk-u-margin-bottom-4">
      <h2 className="nhsuk-heading-m">Version management</h2>
      
      <div className="nhsuk-inset-text">
        <p className="nhsuk-body-s">
          <strong>Version {submission.versionNumber}</strong> 
          {submission.parentVersionId && submission.versionNumber > 0 && " (created from a previous assessment)"}
        </p>
        <p className="nhsuk-body-s nhsuk-u-secondary-text-color">
          SAF Version: {submission.safVersion}
        </p>
      </div>

      {error && (
        <div className="nhsuk-error-summary" aria-labelledby="error-summary-title" role="alert">
          <h2 className="nhsuk-error-summary__title" id="error-summary-title">
            There is a problem
          </h2>
          <div className="nhsuk-error-summary__body">
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="nhsuk-button-group">
        {submission.status === "completed" && (
          <button
            className="nhsuk-button nhsuk-button--secondary"
            onClick={handleCreateVersion}
          >
            Create new version
          </button>
        )}

        <button
          className="nhsuk-button nhsuk-button--secondary"
          onClick={loadVersions}
          disabled={loadingVersions || showVersions}
        >
          {loadingVersions ? "Loading…" : showVersions ? "Versions shown below" : "View version history"}
        </button>
        
        {submission.status === "in-progress" && (
          <button
            className="nhsuk-button"
            onClick={handleDelete}
            disabled={deleting}
            style={{ backgroundColor: "#d5281b", borderColor: "#d5281b" }}
          >
            {deleting ? "Deleting…" : "Delete this version"}
          </button>
        )}
      </div>

      {showVersions && versions.length > 0 && (
        <div className="nhsuk-u-margin-top-4">
          <h3 className="nhsuk-heading-s">Version history</h3>
          <table className="nhsuk-table">
            <thead className="nhsuk-table__head">
              <tr className="nhsuk-table__row">
                <th scope="col" className="nhsuk-table__header">Version</th>
                <th scope="col" className="nhsuk-table__header">Status</th>
                <th scope="col" className="nhsuk-table__header">Created</th>
                <th scope="col" className="nhsuk-table__header">Last Updated</th>
                <th scope="col" className="nhsuk-table__header">SAF Version</th>
                <th scope="col" className="nhsuk-table__header">Actions</th>
              </tr>
            </thead>
            <tbody className="nhsuk-table__body">
              {versions.map((version) => (
                <tr 
                  key={version.id} 
                  className="nhsuk-table__row"
                  style={version.id === submission.id ? { backgroundColor: "#f0f4f5" } : {}}
                >
                  <td className="nhsuk-table__cell">
                    <strong>v{version.versionNumber}</strong>
                    {version.id === submission.id && " (current)"}
                  </td>
                  <td className="nhsuk-table__cell">
                    {version.status === "completed" ? (
                      <strong className="nhsuk-tag nhsuk-tag--green">Completed</strong>
                    ) : (
                      <strong className="nhsuk-tag nhsuk-tag--yellow">In progress</strong>
                    )}
                  </td>
                  <td className="nhsuk-table__cell">
                    {new Date(version.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="nhsuk-table__cell">
                    {new Date(version.updatedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="nhsuk-table__cell">{version.safVersion}</td>
                  <td className="nhsuk-table__cell">
                    {version.id !== submission.id && (
                      <a href={`/submissions/${version.id}`} className="nhsuk-link">
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
