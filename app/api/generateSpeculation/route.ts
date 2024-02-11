import { generateSpeculation } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  try {
    const response = await generateSpeculation(input);
    return new NextResponse(response);
  } catch (error) {
    console.log(error);
    return new NextResponse("error");
  }
}
