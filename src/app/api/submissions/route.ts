import { NextRequest, NextResponse } from "next/server";
import {
  createSubmission,
  listSubmissions,
} from "@/lib/submissionService";

export async function GET() {
  try {
    const submissions = await listSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, projectDescription, submittedBy } = body;

    if (!projectName || !submittedBy) {
      return NextResponse.json(
        { error: "projectName and submittedBy are required" },
        { status: 400 }
      );
    }

    const submission = await createSubmission(
      projectName,
      projectDescription ?? "",
      submittedBy
    );
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
