import { generateLandscape } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { speculation } = await req.json();
  try {
    const response = await generateLandscape(speculation);
    return new NextResponse(response);
  } catch (error) {
    console.log(error);
  }
}
