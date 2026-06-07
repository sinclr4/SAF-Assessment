export type SubmissionStatus = "in-progress" | "completed";

export interface QuestionAnswer {
  requirementId: string;
  evidence: string;
  mitigations: string;
  score: number | null; // 0-5
  lastUpdated: string; // ISO date string
}

export interface Submission {
  id: string; // Cosmos partition key
  projectName: string;
  projectDescription: string;
  submittedBy: string;
  status: SubmissionStatus;
  answers: Record<string, QuestionAnswer>; // keyed by requirementId
  createdAt: string;
  updatedAt: string;
}
