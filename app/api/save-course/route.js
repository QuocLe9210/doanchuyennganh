// ============================================
// FILE: app/api/save-course/route.js
// ============================================

import { db } from "@/configs/db";
import { STUDY_ENGLISH_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { courseData, userId } = body;

    // Validate input
    if (!courseData || !userId) {
      return NextResponse.json(
        {
          error: "Thiếu thông tin: courseData hoặc userId",
        },
        { status: 400 }
      );
    }

    // Generate unique course ID
    const courseID = `course_${Date.now()}_${uuidv4().slice(0, 8)}`;

    // Prepare data for database
    const courseRecord = {
      courseID: courseID,
      courseType: courseData.metadata?.studyType || "Study Material",
      topic: courseData.metadata?.topic || courseData.courseName,
      difficultyLevel: courseData.difficulty || "Easy",
      courseLayout: courseData, // Lưu toàn bộ course data dạng JSON
      createdBy: userId,
      status: "Generated", // Đã tạo xong
    };

    console.log("💾 Saving course to database:", {
      courseID,
      topic: courseRecord.topic,
      userId,
    });

    // Insert into database
    const result = await db
      .insert(STUDY_ENGLISH_TABLE)
      .values(courseRecord)
      .returning();

    console.log("✅ Course saved successfully:", result[0].id);

    return NextResponse.json({
      success: true,
      message: "Khóa học đã được lưu thành công",
      data: {
        id: result[0].id,
        courseID: courseID,
        courseType: courseRecord.courseType,
        topic: courseRecord.topic,
      },
    });
  } catch (error) {
    console.error("❌ Save course error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể lưu khóa học vào database",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint để lấy danh sách khóa học của user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Query courses by user
    const courses = await db
      .select()
      .from(STUDY_ENGLISH_TABLE)
      .where(eq(STUDY_ENGLISH_TABLE.createdBy, userId));

    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("❌ Get courses error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy danh sách khóa học",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
