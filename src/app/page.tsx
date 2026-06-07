import Link from "next/link";
import { listSubmissions } from "@/lib/submissionService";
import { Submission } from "@/types/submission";
import { SCORED_REQUIREMENTS } from "@/data/safRequirements";

const TOTAL_QUESTIONS = SCORED_REQUIREMENTS.length;

function progressPercent(submission: Submission): number {
  const answered = SCORED_REQUIREMENTS.filter(
    (r) => submission.answers[r.id]?.score !== null && submission.answers[r.id]?.score !== undefined
  ).length;
  return Math.round((answered / TOTAL_QUESTIONS) * 100);
}

function StatusTag({ status }: { status: Submission["status"] }) {
  const colour = status === "completed" ? "nhsuk-tag--green" : "nhsuk-tag--yellow";
  const label = status === "completed" ? "Completed" : "In progress";
  return <strong className={`nhsuk-tag ${colour}`}>{label}</strong>;
}

export default async function HomePage() {
  let submissions: Submission[] = [];
  let error: string | null = null;

  try {
    submissions = await listSubmissions();
  } catch (e) {
    error =
      "Could not connect to the database. Check your environment variables.";
    console.error(e);
  }

  return (
    <>
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <h1 className="nhsuk-heading-xl">
            Solution Architecture Framework Assessment
          </h1>
          <p className="nhsuk-body-l">
            Use this tool to assess your solution against the NHS England
            Solution Architecture Framework (SAF). You can save your progress
            and return at any time.
          </p>

          <Link
            href="/submissions/new"
            className="nhsuk-button"
            role="button"
          >
            Start a new assessment
          </Link>
        </div>
      </div>

      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-full">
          <hr className="nhsuk-section-break nhsuk-section-break--l nhsuk-section-break--visible" />
          <h2 className="nhsuk-heading-l">Existing assessments</h2>

          {error && (
            <div
              className="nhsuk-warning-callout"
              aria-label="Database connection issue"
            >
              <h3 className="nhsuk-warning-callout__label">
                <span role="text">
                  <span className="nhsuk-u-visually-hidden">
                    Important:{" "}
                  </span>
                  Database unavailable
                </span>
              </h3>
              <p>{error}</p>
            </div>
          )}

          {!error && submissions.length === 0 && (
            <p className="nhsuk-body">No assessments found. Start one above.</p>
          )}

          {!error && submissions.length > 0 && (
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
                    Progress
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
                {submissions.map((sub) => (
                  <tr key={sub.id} className="nhsuk-table__row" role="row">
                    <td className="nhsuk-table__cell">
                      <strong>{sub.projectName}</strong>
                    </td>
                    <td className="nhsuk-table__cell">{sub.submittedBy}</td>
                    <td className="nhsuk-table__cell">
                      {progressPercent(sub)}%
                    </td>
                    <td className="nhsuk-table__cell">
                      <StatusTag status={sub.status} />
                    </td>
                    <td className="nhsuk-table__cell">
                      {new Date(sub.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="nhsuk-table__cell">
                      <Link
                        href={`/submissions/${sub.id}`}
                        className="nhsuk-link"
                      >
                        {sub.status === "completed" ? "View" : "Continue"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
