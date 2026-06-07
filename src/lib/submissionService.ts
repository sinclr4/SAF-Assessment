import { getContainer } from "./cosmosClient";
import { Submission, QuestionAnswer } from "@/types/submission";
import { randomUUID } from "crypto";

export async function createSubmission(
  projectName: string,
  projectDescription: string,
  submittedBy: string
): Promise<Submission> {
  const container = await getContainer();
  const now = new Date().toISOString();
  const submission: Submission = {
    id: randomUUID(),
    projectName,
    projectDescription,
    submittedBy,
    status: "in-progress",
    answers: {},
    createdAt: now,
    updatedAt: now,
  };
  const { resource } = await container.items.create(submission);
  return resource as Submission;
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const container = await getContainer();
  try {
    const { resource } = await container.item(id, id).read<Submission>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function listSubmissions(): Promise<Submission[]> {
  const container = await getContainer();
  const { resources } = await container.items
    .query<Submission>("SELECT * FROM c ORDER BY c.updatedAt DESC")
    .fetchAll();
  return resources;
}

export async function saveAnswer(
  submissionId: string,
  answer: QuestionAnswer
): Promise<Submission | null> {
  const container = await getContainer();
  const submission = await getSubmission(submissionId);
  if (!submission) return null;

  submission.answers[answer.requirementId] = {
    ...answer,
    lastUpdated: new Date().toISOString(),
  };
  submission.updatedAt = new Date().toISOString();

  const { resource } = await container
    .item(submissionId, submissionId)
    .replace(submission);
  return resource as Submission;
}

export async function completeSubmission(
  submissionId: string
): Promise<Submission | null> {
  const container = await getContainer();
  const submission = await getSubmission(submissionId);
  if (!submission) return null;

  submission.status = "completed";
  submission.updatedAt = new Date().toISOString();

  const { resource } = await container
    .item(submissionId, submissionId)
    .replace(submission);
  return resource as Submission;
}
