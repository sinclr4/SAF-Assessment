import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/submissionService";
import { SCORED_REQUIREMENTS } from "@/data/safRequirements";
import QuestionForm from "@/components/QuestionForm";

interface Props {
  params: Promise<{ id: string; requirementId: string }>;
}

export default async function QuestionPage({ params }: Props) {
  const { id, requirementId } = await params;

  const submission = await getSubmission(id);
  if (!submission) notFound();

  // Use the snapshot of SAF requirements from the submission
  const requirementsToUse = (submission.safRequirementsSnapshot && submission.safRequirementsSnapshot.length > 0) 
    ? submission.safRequirementsSnapshot 
    : SCORED_REQUIREMENTS;
  const requirement = requirementsToUse.find((r) => r.id === requirementId);
  if (!requirement) notFound();

  return (
    <QuestionForm
      submissionId={id}
      requirementId={requirementId}
      submission={submission}
    />
  );
}
