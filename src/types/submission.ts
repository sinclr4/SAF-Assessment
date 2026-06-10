export type SubmissionStatus = "in-progress" | "completed";

export interface QuestionAnswer {
  requirementId: string;
  evidence: string;
  mitigations: string;
  score: number | null; // 0-5
  lastUpdated: string; // ISO date string
}

export interface SAFRequirementSnapshot {
  id: string;
  dimension: string;
  dimensionCode: string;
  description: string;
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
  
  // Versioning fields
  versionNumber: number; // Version number (1, 2, 3, etc.)
  safVersion: string; // Version identifier for SAF requirements (e.g., "1.0", "2024-06-10")
  parentVersionId: string | null; // ID of the submission this was versioned from
  safRequirementsSnapshot: SAFRequirementSnapshot[]; // Snapshot of SAF requirements at creation time
}
