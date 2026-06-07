import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/submissionService";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CompletePage({ params }: Props) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-two-thirds">
        <div className="nhsuk-panel nhsuk-panel--confirmation">
          <h1 className="nhsuk-panel__title">Assessment complete</h1>
          <div className="nhsuk-panel__body">
            {submission.projectName}
          </div>
        </div>

        <p className="nhsuk-body nhsuk-u-margin-top-6">
          Your SAF assessment has been saved and marked as complete.
        </p>

        <ul className="nhsuk-list">
          <li>
            <Link href={`/submissions/${id}/summary`} className="nhsuk-link">
              View your assessment summary
            </Link>
          </li>
          <li>
            <Link href="/" className="nhsuk-link">
              Return to all assessments
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
