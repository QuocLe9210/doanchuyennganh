import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import {
  CHAPTER_NOTES_TABLE,
  FLASHCARDS_TABLE,
  STUDY_ENGLISH_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { courseId, studyType } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    if (!studyType) {
      return NextResponse.json(
        { error: "studyType is required" },
        { status: 400 }
      );
    }

    console.log(
      `[API] Request - courseId: ${courseId}, studyType: ${studyType}`
    );

    // ===========================================================
    // BƯỚC 1: Lấy courseID từ study_english table
    // ===========================================================
    const courseRecord = await db
      .select()
      .from(STUDY_ENGLISH_TABLE)
      .where(eq(STUDY_ENGLISH_TABLE.id, parseInt(courseId)))
      .limit(1);

    if (!courseRecord || courseRecord.length === 0) {
      console.error(`[API] Course not found with id: ${courseId}`);
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const actualCourseId = courseRecord[0].courseID;
    console.log(`[API] Found courseID: ${actualCourseId}`);

    // ===========================================================
    // XỬ LÝ "ALL" - Trả về tất cả study materials
    // ===========================================================
    if (studyType === "ALL") {
      try {
        // Lấy notes
        const notesResult = await db
          .select()
          .from(CHAPTER_NOTES_TABLE)
          .where(eq(CHAPTER_NOTES_TABLE.courseId, actualCourseId));

        console.log(`[API] Notes: ${notesResult.length} items`);

        // Lấy flashcards
        const flashcardsResult = await db
          .select()
          .from(FLASHCARDS_TABLE)
          .where(eq(FLASHCARDS_TABLE.courseId, actualCourseId));

        console.log(`[API] Flashcards: ${flashcardsResult.length} items`);

        const response = {
          course: courseRecord[0], // Thêm course data vào response
          notes: notesResult.map((item) => ({
            chapterId: item.chapterId || "Untitled Chapter",
            note: item.note || "",
            id: item.id,
          })),
          flashcards: flashcardsResult.map((item) => ({
            id: item.id,
            front: item.front || "",
            back: item.back || "",
            difficulty: item.difficulty,
            createdAt: item.createdAt,
          })),
          quiz: [],
          qa: [],
        };

        console.log("[API] Response ready:", {
          courseId: courseRecord[0].id,
          courseName: courseRecord[0].courseLayout?.courseName,
          notesCount: response.notes.length,
          flashcardsCount: response.flashcards.length,
        });

        return NextResponse.json(response);
      } catch (error) {
        console.error("[API] Error in ALL handler:", error);
        return NextResponse.json({
          notes: [],
          flashcards: [],
          quiz: [],
          qa: [],
          error: error.message,
        });
      }
    }

    // ===========================================================
    // XỬ LÝ NOTES
    // ===========================================================
    if (studyType === "notes") {
      const notesResult = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, actualCourseId));

      console.log(`[API] Found ${notesResult.length} notes`);

      return NextResponse.json({
        notes: notesResult.map((item) => ({
          chapterId: item.chapterId || "Untitled Chapter",
          note: item.note || "",
          id: item.id,
        })),
      });
    }

    // ===========================================================
    // XỬ LÝ FLASHCARDS
    // ===========================================================
    if (studyType === "flashcard") {
      // Kiểm tra flashcards đã có chưa
      const existingFlashcards = await db
        .select()
        .from(FLASHCARDS_TABLE)
        .where(eq(FLASHCARDS_TABLE.courseId, actualCourseId));

      console.log(
        `[API] Found ${existingFlashcards.length} existing flashcards`
      );

      if (existingFlashcards && existingFlashcards.length > 0) {
        return NextResponse.json({
          flashcards: existingFlashcards.map((item) => ({
            id: item.id,
            front: item.front || "",
            back: item.back || "",
            difficulty: item.difficulty,
            createdAt: item.createdAt,
          })),
        });
      }

      // Generate từ notes
      const notesResult = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, actualCourseId));

      console.log(
        `[API] Found ${notesResult.length} notes to generate flashcards`
      );

      if (!notesResult || notesResult.length === 0) {
        return NextResponse.json({
          flashcards: [
            {
              front: "Chưa có nội dung học",
              back: "Vui lòng tạo notes trước khi sử dụng flashcards",
            },
          ],
        });
      }

      const flashcards = generateFlashcardsFromNotes(notesResult);

      // Lưu vào database
      try {
        for (const card of flashcards) {
          await db.insert(FLASHCARDS_TABLE).values({
            courseId: actualCourseId,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty || "medium",
          });
        }
        console.log(`[API] Saved ${flashcards.length} flashcards to database`);
      } catch (error) {
        console.error("[API] Error saving flashcards:", error);
      }

      return NextResponse.json({
        flashcards: flashcards,
      });
    }

    return NextResponse.json(
      { error: `Invalid studyType: ${studyType}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in study-type API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

function generateFlashcardsFromNotes(notes) {
  const flashcards = [];

  notes.forEach((noteItem) => {
    const content = noteItem.note || "";
    const chapterName = noteItem.chapterId || "Chapter";

    if (!content || content.trim().length === 0) {
      return;
    }

    const lines = content.split("\n").filter((line) => line.trim().length > 0);

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^#{1,6}\s+/)) {
        const heading = trimmedLine.replace(/^#{1,6}\s+/, "").trim();
        const nextLine = lines[index + 1];

        if (heading.length > 5 && heading.length < 150) {
          if (nextLine && !nextLine.match(/^#{1,6}\s+/)) {
            flashcards.push({
              front: `${chapterName}: ${heading}`,
              back: nextLine.trim(),
              difficulty: "medium",
            });
          }
        }
      }

      if (trimmedLine.includes(":")) {
        const parts = trimmedLine.split(/[:]/);
        if (parts.length === 2) {
          const term = parts[0].trim().replace(/^[-*•]\s+/, "");
          const definition = parts[1].trim();

          if (term.length > 3 && term.length < 100 && definition.length > 10) {
            flashcards.push({
              front: term,
              back: definition,
              difficulty: "easy",
            });
          }
        }
      }

      const match = trimmedLine.match(/^(.+?)\s+là\s+(.+)$/);
      if (match) {
        const term = match[1].trim().replace(/^[-*•]\s+/, "");
        const definition = match[2].trim();

        if (term.length > 3 && term.length < 100 && definition.length > 10) {
          flashcards.push({
            front: `${term} là gì?`,
            back: definition,
            difficulty: "easy",
          });
        }
      }

      if (trimmedLine.match(/^[-*•]\s+/)) {
        const bulletContent = trimmedLine.replace(/^[-*•]\s+/, "").trim();

        if (bulletContent.includes(":")) {
          const [term, desc] = bulletContent.split(":");
          if (
            term.length > 3 &&
            term.length < 100 &&
            desc &&
            desc.length > 10
          ) {
            flashcards.push({
              front: term.trim(),
              back: desc.trim(),
              difficulty: "medium",
            });
          }
        } else if (bulletContent.length > 30 && bulletContent.length < 200) {
          flashcards.push({
            front: `${chapterName}: Điểm chính`,
            back: bulletContent,
            difficulty: "medium",
          });
        }
      }
    });
  });

  const uniqueFlashcards = [];
  const seenFronts = new Set();

  for (const card of flashcards) {
    if (!seenFronts.has(card.front)) {
      seenFronts.add(card.front);
      uniqueFlashcards.push(card);
    }
  }

  return uniqueFlashcards.slice(0, 50);
}

export async function GET(req) {
  return NextResponse.json({
    message: "Study Type API",
    supportedTypes: ["notes", "flashcard", "ALL"],
    usage:
      "POST /api/study-type with body: { courseId: <study_english.id>, studyType }",
  });
}
