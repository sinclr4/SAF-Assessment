import { notFound } from "next/navigation";
import { getSubmission } from "@/lib/submissionService";
import SummaryView from "@/components/SummaryView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();
  return <SummaryView submission={submission} />;
}
