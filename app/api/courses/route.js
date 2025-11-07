import { db } from "@/configs/db";
import { STUDY_ENGLISH_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { createdBy } = await req.json();

  console.log("🔍 createdBy nhận được:", createdBy);

  const result = await db
    .select()
    .from(STUDY_ENGLISH_TABLE)
    .where(eq(STUDY_ENGLISH_TABLE.createdBy, createdBy));

  console.log("✅ Số lượng kết quả:", result.length);

  return NextResponse.json({ result: result });
}
