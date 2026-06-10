import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubmission } from "@/lib/submissionService";
import {
  SCORED_REQUIREMENTS,
  SAF_DIMENSIONS,
  getRequirementsByDimension,
} from "@/data/safRequirements";
import { Submission } from "@/types/submission";
import VersionActions from "@/components/VersionActions";

const TOTAL = SCORED_REQUIREMENTS.length;

function getTaskStatus(
  submission: Submission,
  requirementId: string
): "completed" | "in-progress" | "not-started" {
  const answer = submission.answers[requirementId];
  if (!answer) return "not-started";
  if (answer.score !== null) return "completed";
  if (answer.evidence || answer.mitigations) return "in-progress";
  return "not-started";
}

function TaskStatusTag({ status }: { status: "completed" | "in-progress" | "not-started" }) {
  if (status === "completed")
    return <strong className="nhsuk-tag nhsuk-tag--green">Completed</strong>;
  if (status === "in-progress")
    return <strong className="nhsuk-tag nhsuk-tag--yellow">In progress</strong>;
  return <strong className="nhsuk-tag nhsuk-tag--grey">Not started</strong>;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SubmissionPage({ params }: Props) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  // Use the snapshot of SAF requirements from the submission
  // This ensures that even if requirements change in the future, 
  // we still show the questions that existed when this version was created
  const requirementsToUse = (submission.safRequirementsSnapshot && submission.safRequirementsSnapshot.length > 0) 
    ? submission.safRequirementsSnapshot 
    : SCORED_REQUIREMENTS;
  
  const byDimension = getRequirementsByDimension(requirementsToUse);
  const answeredCount = requirementsToUse.filter(
    (r) => submission.answers[r.id]?.score !== null && submission.answers[r.id]?.score !== undefined
  ).length;
  const progress = Math.round((answeredCount / requirementsToUse.length) * 100);
  const dimensionScores = SAF_DIMENSIONS.map((dimension) => {
    const requirements = byDimension.get(dimension) ?? [];
    const totalScore = requirements.reduce(
      (sum, req) => sum + (submission.answers[req.id]?.score ?? 0),
      0
    );
    const maxScore = requirements.length * 5;
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    return {
      dimension,
      totalScore,
      maxScore,
      percentage,
    };
  });

  return (
    <div className="nhsuk-grid-row">
      <div className="nhsuk-grid-column-full">
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
          Back to all assessments
        </a>

        <div className="nhsuk-grid-row nhsuk-u-margin-bottom-4">
          <div className="nhsuk-grid-column-two-thirds">
            <h1 className="nhsuk-heading-xl nhsuk-u-margin-bottom-1">
              {submission.projectName}
            </h1>
            {submission.projectDescription && (
              <p className="nhsuk-body nhsuk-u-margin-bottom-2">
                {submission.projectDescription}
              </p>
            )}
            <p className="nhsuk-body-s nhsuk-u-secondary-text-color">
              Submitted by: {submission.submittedBy} &nbsp;|&nbsp; Last updated:{" "}
              {new Date(submission.updatedAt).toLocaleDateString("en-GB")}
            </p>
          </div>
          <div className="nhsuk-grid-column-one-third">
            <div className="nhsuk-card nhsuk-u-margin-bottom-0">
              <div className="nhsuk-card__content">
                <h2 className="nhsuk-card__heading nhsuk-heading-s">
                  Progress
                </h2>
                <p className="nhsuk-body">
                  <strong>{answeredCount}</strong> of <strong>{requirementsToUse.length}</strong>{" "}
                  questions answered ({progress}%)
                </p>
                {submission.status === "completed" ? (
                  <>
                    <strong className="nhsuk-tag nhsuk-tag--green nhsuk-u-margin-bottom-3">
                      Completed
                    </strong>
                    <div className="nhsuk-u-margin-top-3">
                      <Link
                        href={`/submissions/${id}/summary`}
                        className="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-bottom-0"
                      >
                        View summary
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <strong className="nhsuk-tag nhsuk-tag--yellow nhsuk-u-margin-bottom-3">
                      In progress
                    </strong>
                    <div className="nhsuk-u-margin-top-3">
                      {answeredCount === requirementsToUse.length ? (
                        <Link
                          href={`/submissions/${id}/summary`}
                          className="nhsuk-button nhsuk-u-margin-bottom-0"
                        >
                          Review and complete
                        </Link>
                      ) : (
                        <Link
                          href={`/submissions/${id}/summary`}
                          className="nhsuk-button nhsuk-button--secondary nhsuk-u-margin-bottom-0"
                        >
                          View summary
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <h2 className="nhsuk-heading-m">Section scores</h2>
        <table className="nhsuk-table nhsuk-u-margin-bottom-6" role="table">
          <caption className="nhsuk-table__caption nhsuk-u-visually-hidden">
            Section score percentages
          </caption>
          <thead className="nhsuk-table__head">
            <tr className="nhsuk-table__row" role="row">
              <th scope="col" className="nhsuk-table__header">
                Section
              </th>
              <th scope="col" className="nhsuk-table__header">
                Score
              </th>
              <th scope="col" className="nhsuk-table__header">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="nhsuk-table__body">
            {dimensionScores.map((item) => (
              <tr key={item.dimension} className="nhsuk-table__row" role="row">
                <td className="nhsuk-table__cell">{item.dimension}</td>
                <td className="nhsuk-table__cell">
                  {item.totalScore} / {item.maxScore}
                </td>
                <td className="nhsuk-table__cell">{item.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <VersionActions submission={submission} />

        <h2 className="nhsuk-heading-l">Assessment questions</h2>
        <p className="nhsuk-body">
          Work through each dimension below. Your answers are saved automatically
          after each question.
        </p>

        <ol className="nhsuk-task-list">
          {SAF_DIMENSIONS.map((dimension) => {
            const requirements = byDimension.get(dimension) ?? [];
            const completedInDimension = requirements.filter(
              (r) => getTaskStatus(submission, r.id) === "completed"
            ).length;

            return (
              <li key={dimension} className="nhsuk-task-list__item">
                <h3 className="nhsuk-heading-m nhsuk-u-margin-bottom-2">
                  {dimension}
                  <span className="nhsuk-body-s nhsuk-u-secondary-text-color nhsuk-u-margin-left-3">
                    {completedInDimension}/{requirements.length} completed
                  </span>
                </h3>
                <ul className="nhsuk-list nhsuk-u-margin-bottom-4">
                  {requirements.map((req) => {
                    const taskStatus = getTaskStatus(submission, req.id);
                    return (
                      <li
                        key={req.id}
                        className="nhsuk-task-list__item nhsuk-u-margin-bottom-2"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #d8dde0",
                          paddingBottom: "12px",
                        }}
                      >
                        <span style={{ flex: 1, marginRight: "16px" }}>
                          <strong className="nhsuk-body-s nhsuk-u-secondary-text-color">
                            {req.id}
                          </strong>
                          <br />
                          <Link
                            href={`/submissions/${id}/question/${req.id}`}
                            className="nhsuk-link"
                          >
                            {req.description.length > 120
                              ? req.description.slice(0, 117) + "…"
                              : req.description}
                          </Link>
                        </span>
                        <span style={{ whiteSpace: "nowrap" }}>
                          <TaskStatusTag status={taskStatus} />
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
