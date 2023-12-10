import { NextResponse } from "next/server";
import { createChapterSchema } from "@/validator/course";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { title, units } = createChapterSchema.parse(body);
    type outputUnits = {
      title: string;
      chapters: {
        youtube_search_query: string;
        chapter_title: string;
      }[];
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }
  }
}

export async function GET(req: Request, res: Response) {}
