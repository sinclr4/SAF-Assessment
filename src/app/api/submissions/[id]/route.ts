import { NextRequest, NextResponse } from "next/server";
import {
  getSubmission,
  completeSubmission,
  deleteSubmission,
} from "@/lib/submissionService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const submission = await getSubmission(id);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(submission);
  } catch (error) {
    console.error("GET /api/submissions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.status === "completed") {
      const submission = await completeSubmission(id);
      if (!submission) {
        return NextResponse.json(
          { error: "Submission not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(submission);
    }

    return NextResponse.json(
      { error: "Unsupported patch operation" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PATCH /api/submissions/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await deleteSubmission(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Submission not found or could not be deleted" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/submissions/[id] error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete submission";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
