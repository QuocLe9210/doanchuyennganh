import { db } from "@/configs/db";
import { STUDY_ENGLISH_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { createdBy } = await req.json();

    console.log("🔍 createdBy nhận được:", createdBy);

    const result = await db
      .select()
      .from(STUDY_ENGLISH_TABLE)
      .where(eq(STUDY_ENGLISH_TABLE.createdBy, createdBy));

    console.log("✅ Số lượng kết quả:", result.length);

    return NextResponse.json({ result: result });
  } catch (error) {
    console.error("❌ Error in POST:", error);
    return NextResponse.json(
      { error: error.message, result: [] },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams?.get("courseId");

    console.log("🔍 Fetching course with ID:", courseId);

    if (!courseId) {
      console.log("❌ No courseId provided");
      return NextResponse.json(
        { error: "courseId is required", result: null },
        { status: 400 }
      );
    }

    // Convert courseId to integer vì trong DB là serial (số nguyên)
    const courseIdInt = parseInt(courseId);

    if (isNaN(courseIdInt)) {
      console.log("❌ Invalid courseId format:", courseId);
      return NextResponse.json(
        { error: "courseId must be a number", result: null },
        { status: 400 }
      );
    }

    // Query theo cột 'id' (primary key) thay vì 'courseID'
    const result = await db
      .select()
      .from(STUDY_ENGLISH_TABLE)
      .where(eq(STUDY_ENGLISH_TABLE.id, courseIdInt));

    console.log("✅ Query executed");
    console.log("✅ Result count:", result?.length || 0);

    if (result && result.length > 0) {
      console.log("✅ Course found:", {
        id: result[0].id,
        courseID: result[0].courseID,
        courseName: result[0].courseLayout?.courseName,
      });
    } else {
      console.log("❌ No course found with id:", courseIdInt);
    }

    if (!result || result.length === 0) {
      return NextResponse.json({
        result: null,
        message: `No course found with ID: ${courseIdInt}`,
      });
    }

    return NextResponse.json({ result: result[0] });
  } catch (error) {
    console.error("❌ Error in GET /api/courses:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      {
        error: error.message,
        result: null,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
