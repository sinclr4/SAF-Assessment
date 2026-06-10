import { notFound } from "next/navigation";
import { getSubmission, getSubmissionVersions } from "@/lib/submissionService";
import NewVersionForm from "@/components/NewVersionForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewVersionPage({ params }: Props) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  // Calculate the next version number
  const rootParentId = submission.parentVersionId || id;
  const allVersions = await getSubmissionVersions(rootParentId);
  const maxVersion = Math.max(...allVersions.map(v => v.versionNumber ?? 0), 0);
  const nextVersionNumber = maxVersion + 1;

  return <NewVersionForm sourceSubmission={submission} nextVersionNumber={nextVersionNumber} />;
}
