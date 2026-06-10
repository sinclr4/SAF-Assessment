import { NextRequest, NextResponse } from "next/server";
import { getSubmissionVersions } from "@/lib/submissionService";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  
  try {
    const versions = await getSubmissionVersions(id);
    
    if (versions.length === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(versions, { status: 200 });
  } catch (error) {
    console.error("Error getting versions:", error);
    return NextResponse.json(
      { error: "Failed to get versions" },
      { status: 500 }
    );
  }
}
