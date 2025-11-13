import { db } from "@/configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_ENGLISH_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();

    console.log("📝 API called with:", { courseId, studyType });

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    if (studyType === "ALL") {
      // Get course information - search by ID (number)
      const courseById = await db
        .select()
        .from(STUDY_ENGLISH_TABLE)
        .where(eq(STUDY_ENGLISH_TABLE.id, parseInt(courseId)))
        .limit(1);

      console.log("📚 Course found by ID:", courseById);

      // If not found by ID, try by courseID field
      let course = courseById[0];
      if (!course) {
        const courseByCourseId = await db
          .select()
          .from(STUDY_ENGLISH_TABLE)
          .where(eq(STUDY_ENGLISH_TABLE.courseID, courseId))
          .limit(1);

        course = courseByCourseId[0];
        console.log("📚 Course found by courseID:", course);
      }

      // Get course notes - use the courseID field from the found course
      let notes = [];
      if (course && course.courseID) {
        notes = await db
          .select()
          .from(CHAPTER_NOTES_TABLE)
          .where(eq(CHAPTER_NOTES_TABLE.courseId, course.courseID));

        console.log("📝 Notes found:", notes.length);
      } else {
        console.log("⚠️ No course found, cannot fetch notes");
      }

      const result = {
        course: course || null,
        notes: notes || [],
        flashcard: null,
        quiz: null,
        qa: null,
      };

      return NextResponse.json(result);
    } else if (studyType === "notes") {
      // Bước 1: Tìm course để lấy courseID
      const courseResult = await db
        .select()
        .from(STUDY_ENGLISH_TABLE)
        .where(eq(STUDY_ENGLISH_TABLE.id, parseInt(courseId)))
        .limit(1);

      const course = courseResult[0];

      if (!course) {
        return NextResponse.json({ notes: [] });
      }

      console.log("📚 Found course:", course.courseID);

      // Bước 2: Tìm notes bằng courseID
      const notes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, course.courseID));

      console.log("📝 Notes found:", notes.length);

      return NextResponse.json({
        course: course,
        notes: notes || [],
      });
    }

    return NextResponse.json({ error: "Invalid study type" }, { status: 400 });
  } catch (error) {
    console.error("❌ Error in study-type API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
