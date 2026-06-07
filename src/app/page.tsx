import Link from "next/link";
import { listSubmissions } from "@/lib/submissionService";
import { Submission } from "@/types/submission";
import SubmissionsTable from "@/components/SubmissionsTable";

export const dynamic = "force-dynamic";

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
            <SubmissionsTable submissions={submissions} />
          )}
        </div>
      </div>
    </>
  );
}
