import { NextRequest, NextResponse } from "next/server";
import { createNewVersion } from "@/lib/submissionService";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id } = await context.params;
  
  try {
    const body = await request.json();
    const { projectName, projectDescription, submittedBy } = body;
    
    const newVersion = await createNewVersion(
      id,
      projectName,
      projectDescription,
      submittedBy
    );
    
    if (!newVersion) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(newVersion, { status: 201 });
  } catch (error) {
    console.error("Error creating new version:", error);
    return NextResponse.json(
      { error: "Failed to create new version" },
      { status: 500 }
    );
  }
}
