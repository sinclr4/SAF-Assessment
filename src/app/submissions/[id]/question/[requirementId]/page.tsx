import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/submissionService";
import { SCORED_REQUIREMENTS } from "@/data/safRequirements";
import QuestionForm from "@/components/QuestionForm";

interface Props {
  params: Promise<{ id: string; requirementId: string }>;
}

export default async function QuestionPage({ params }: Props) {
  const { id, requirementId } = await params;

  const requirement = SCORED_REQUIREMENTS.find((r) => r.id === requirementId);
  if (!requirement) notFound();

  const submission = await getSubmission(id);
  if (!submission) notFound();

  return (
    <QuestionForm
      submissionId={id}
      requirementId={requirementId}
      submission={submission}
    />
  );
}
