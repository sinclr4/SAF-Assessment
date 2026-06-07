import { NextRequest, NextResponse } from "next/server";
import { saveAnswer } from "@/lib/submissionService";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { requirementId, evidence, mitigations, score } = body;

    if (!requirementId) {
      return NextResponse.json(
        { error: "requirementId is required" },
        { status: 400 }
      );
    }

    if (!String(evidence ?? "").trim()) {
      return NextResponse.json(
        { error: "evidence is required" },
        { status: 400 }
      );
    }

    if (score === null || score === undefined || score === "") {
      return NextResponse.json(
        { error: "score is required" },
        { status: 400 }
      );
    }

    if (Number(score) < 0 || Number(score) > 5) {
      return NextResponse.json(
        { error: "score must be between 0 and 5" },
        { status: 400 }
      );
    }

    const submission = await saveAnswer(id, {
      requirementId,
      evidence: String(evidence).trim(),
      mitigations: mitigations ?? "",
      score: Number(score),
      lastUpdated: new Date().toISOString(),
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("PUT /api/submissions/[id]/answers error:", error);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
