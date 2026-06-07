"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Submission } from "@/types/submission";
import { SCORED_REQUIREMENTS } from "@/data/safRequirements";

const TOTAL_QUESTIONS = SCORED_REQUIREMENTS.length;
const MAX_TOTAL_SCORE = TOTAL_QUESTIONS * 5;

function overallScore(submission: Submission): {
  score: number;
  maxScore: number;
  percentage: number;
} {
  const score = SCORED_REQUIREMENTS.reduce(
    (sum, req) => sum + (submission.answers[req.id]?.score ?? 0),
    0
  );
  const percentage = Math.round((score / MAX_TOTAL_SCORE) * 100);
  return { score, maxScore: MAX_TOTAL_SCORE, percentage };
}

function StatusTag({ status }: { status: Submission["status"] }) {
  const colour = status === "completed" ? "nhsuk-tag--green" : "nhsuk-tag--yellow";
  const label = status === "completed" ? "Completed" : "In progress";
  return <strong className={`nhsuk-tag ${colour}`}>{label}</strong>;
}

type FilterStatus = "all" | "completed" | "in-progress";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && sub.status === "completed") ||
        (statusFilter === "in-progress" && sub.status === "in-progress");

      // Search filter (case-insensitive)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        sub.projectName.toLowerCase().includes(searchLower) ||
        sub.submittedBy.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [submissions, statusFilter, searchTerm]);

  return (
    <>
      {/* Filter controls */}
      <div className="nhsuk-form-group">
        <fieldset className="nhsuk-fieldset">
          <legend className="nhsuk-fieldset__legend nhsuk-fieldset__legend--s">
            Filter by status
          </legend>
          <div className="nhsuk-radios nhsuk-radios--inline">
            <div className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id="status-all"
                name="status"
                type="radio"
                value="all"
                checked={statusFilter === "all"}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              />
              <label className="nhsuk-label nhsuk-radios__label" htmlFor="status-all">
                All
              </label>
            </div>
            <div className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id="status-completed"
                name="status"
                type="radio"
                value="completed"
                checked={statusFilter === "completed"}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              />
              <label className="nhsuk-label nhsuk-radios__label" htmlFor="status-completed">
                Completed
              </label>
            </div>
            <div className="nhsuk-radios__item">
              <input
                className="nhsuk-radios__input"
                id="status-in-progress"
                name="status"
                type="radio"
                value="in-progress"
                checked={statusFilter === "in-progress"}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              />
              <label className="nhsuk-label nhsuk-radios__label" htmlFor="status-in-progress">
                In progress
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="nhsuk-form-group">
        <label className="nhsuk-label" htmlFor="search">
          Search by project name or submitter
        </label>
        <input
          className="nhsuk-input nhsuk-input--width-20"
          id="search"
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
        />
      </div>

      {/* Results count */}
      <p className="nhsuk-body-s nhsuk-u-margin-bottom-4">
        Showing {filteredSubmissions.length} of {submissions.length} assessment
        {submissions.length === 1 ? "" : "s"}
      </p>

      {/* Table */}
      {filteredSubmissions.length === 0 ? (
        <p className="nhsuk-body">No assessments match your filters.</p>
      ) : (
        <table className="nhsuk-table" role="table">
          <caption className="nhsuk-table__caption nhsuk-u-visually-hidden">
            Existing SAF assessments
          </caption>
          <thead className="nhsuk-table__head">
            <tr role="row">
              <th scope="col" className="nhsuk-table__header">
                Project name
              </th>
              <th scope="col" className="nhsuk-table__header">
                Submitted by
              </th>
              <th scope="col" className="nhsuk-table__header">
                Product score
              </th>
              <th scope="col" className="nhsuk-table__header">
                Status
              </th>
              <th scope="col" className="nhsuk-table__header">
                Last updated
              </th>
              <th scope="col" className="nhsuk-table__header">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {filteredSubmissions.map((sub) => {
              const score = overallScore(sub);
              return (
                <tr key={sub.id} className="nhsuk-table__row" role="row">
                  <td className="nhsuk-table__cell">
                    <strong>{sub.projectName}</strong>
                  </td>
                  <td className="nhsuk-table__cell">{sub.submittedBy}</td>
                  <td className="nhsuk-table__cell">
                    {score.score} / {score.maxScore} ({score.percentage}%)
                  </td>
                  <td className="nhsuk-table__cell">
                    <StatusTag status={sub.status} />
                  </td>
                  <td className="nhsuk-table__cell">
                    {new Date(sub.updatedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="nhsuk-table__cell">
                    <Link
                      href={
                        sub.status === "completed"
                          ? `/submissions/${sub.id}/summary`
                          : `/submissions/${sub.id}`
                      }
                      className="nhsuk-link"
                    >
                      {sub.status === "completed" ? "View summary" : "Continue"}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
