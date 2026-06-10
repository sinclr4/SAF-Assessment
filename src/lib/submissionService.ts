import { getContainer } from "./cosmosClient";
import { Submission, QuestionAnswer, SAFRequirementSnapshot } from "@/types/submission";
import { randomUUID } from "crypto";
import { SAF_REQUIREMENTS, SAF_VERSION } from "@/data/safRequirements";

export async function createSubmission(
  projectName: string,
  projectDescription: string,
  submittedBy: string
): Promise<Submission> {
  const container = await getContainer();
  const now = new Date().toISOString();
  
  // Create snapshot of current SAF requirements
  const safRequirementsSnapshot: SAFRequirementSnapshot[] = SAF_REQUIREMENTS.map(req => ({
    id: req.id,
    dimension: req.dimension,
    dimensionCode: req.dimensionCode,
    description: req.description,
  }));
  
  const submission: Submission = {
    id: randomUUID(),
    projectName,
    projectDescription,
    submittedBy,
    status: "in-progress",
    answers: {},
    createdAt: now,
    updatedAt: now,
    versionNumber: 0,
    safVersion: SAF_VERSION,
    parentVersionId: null,
    safRequirementsSnapshot,
  };
  const { resource } = await container.items.create(submission);
  return resource as Submission;
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const container = await getContainer();
  try {
    const { resource } = await container.item(id, id).read<Submission>();
    if (!resource) return null;
    
    // Handle backward compatibility for old records without versioning fields
    if (resource.versionNumber === undefined || resource.versionNumber === null) {
      resource.versionNumber = 0;
    }
    if (!resource.safVersion) {
      resource.safVersion = "legacy";
    }
    if (resource.parentVersionId === undefined) {
      resource.parentVersionId = null;
    }
    if (!resource.safRequirementsSnapshot) {
      resource.safRequirementsSnapshot = [];
    }
    
    return resource;
  } catch {
    return null;
  }
}

export async function listSubmissions(): Promise<Submission[]> {
  const container = await getContainer();
  const { resources } = await container.items
    .query<Submission>("SELECT * FROM c ORDER BY c.updatedAt DESC")
    .fetchAll();
  
  // Handle backward compatibility for old records without versioning fields
  return resources.map(resource => {
    if (resource.versionNumber === undefined || resource.versionNumber === null) {
      resource.versionNumber = 0;
    }
    if (!resource.safVersion) {
      resource.safVersion = "legacy";
    }
    if (resource.parentVersionId === undefined) {
      resource.parentVersionId = null;
    }
    if (!resource.safRequirementsSnapshot) {
      resource.safRequirementsSnapshot = [];
    }
    return resource;
  });
}

export async function saveAnswer(
  submissionId: string,
  answer: QuestionAnswer
): Promise<Submission | null> {
  const container = await getContainer();
  const submission = await getSubmission(submissionId);
  if (!submission) return null;
  
  // Prevent editing completed submissions
  if (submission.status === "completed") {
    throw new Error("Cannot edit a completed submission");
  }

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

export async function createNewVersion(
  sourceSubmissionId: string,
  projectName?: string,
  projectDescription?: string,
  submittedBy?: string
): Promise<Submission | null> {
  const container = await getContainer();
  const sourceSubmission = await getSubmission(sourceSubmissionId);
  if (!sourceSubmission) return null;

  const now = new Date().toISOString();
  
  // Create snapshot of current SAF requirements
  const safRequirementsSnapshot: SAFRequirementSnapshot[] = SAF_REQUIREMENTS.map(req => ({
    id: req.id,
    dimension: req.dimension,
    dimensionCode: req.dimensionCode,
    description: req.description,
  }));
  
  // Determine the version number
  // If source has a parentVersionId, get the root parent's version number
  const rootParentId = sourceSubmission.parentVersionId || sourceSubmissionId;
  const allVersions = await getSubmissionVersions(rootParentId);
  const maxVersion = Math.max(...allVersions.map(v => v.versionNumber), 0);
  
  // Copy answers but clear scores so questions show as "in-progress"
  const copiedAnswers: Record<string, QuestionAnswer> = {};
  Object.entries(sourceSubmission.answers).forEach(([key, answer]) => {
    copiedAnswers[key] = {
      ...answer,
      score: null, // Clear score so question appears as "in-progress"
      lastUpdated: now,
    };
  });
  
  const newSubmission: Submission = {
    id: randomUUID(),
    projectName: projectName || sourceSubmission.projectName,
    projectDescription: projectDescription !== undefined ? projectDescription : sourceSubmission.projectDescription,
    submittedBy: submittedBy || sourceSubmission.submittedBy,
    status: "in-progress",
    answers: copiedAnswers,
    createdAt: now,
    updatedAt: now,
    versionNumber: maxVersion + 1,
    safVersion: SAF_VERSION,
    parentVersionId: rootParentId, // Link to the root parent
    safRequirementsSnapshot,
  };
  
  const { resource } = await container.items.create(newSubmission);
  return resource as Submission;
}

export async function getSubmissionVersions(submissionId: string): Promise<Submission[]> {
  const container = await getContainer();
  
  // Get the original submission
  const originalSubmission = await getSubmission(submissionId);
  if (!originalSubmission) return [];
  
  // Determine the root parent ID
  const rootParentId = originalSubmission.parentVersionId || submissionId;
  
  // Query for all versions (including the root)
  const query = `
    SELECT * FROM c 
    WHERE c.id = @rootParentId OR c.parentVersionId = @rootParentId
    ORDER BY c.versionNumber ASC
  `;
  
  const { resources } = await container.items
    .query<Submission>({
      query,
      parameters: [{ name: "@rootParentId", value: rootParentId }],
    })
    .fetchAll();
  
  // Handle backward compatibility for old records without versioning fields
  return resources.map(resource => {
    if (resource.versionNumber === undefined || resource.versionNumber === null) {
      resource.versionNumber = 0;
    }
    if (!resource.safVersion) {
      resource.safVersion = "legacy";
    }
    if (resource.parentVersionId === undefined) {
      resource.parentVersionId = null;
    }
    if (!resource.safRequirementsSnapshot) {
      resource.safRequirementsSnapshot = [];
    }
    return resource;
  });
}

export async function deleteSubmission(
  submissionId: string
): Promise<boolean> {
  const container = await getContainer();
  const submission = await getSubmission(submissionId);
  if (!submission) return false;
  
  // Only allow deleting in-progress submissions
  if (submission.status === "completed") {
    throw new Error("Cannot delete a completed submission");
  }
  
  try {
    await container.item(submissionId, submissionId).delete();
    return true;
  } catch {
    return false;
  }
}
