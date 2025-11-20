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
    const courseLayout = courseRecord[0].courseLayout;
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

        // Lấy quiz từ courseLayout
        const quizQuestions = extractQuizFromCourseLayout(courseLayout);
        console.log(`[API] Quiz: ${quizQuestions.length} questions`);

        const response = {
          course: courseRecord[0],
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
          quiz: quizQuestions,
          qa: [],
        };

        console.log("[API] Response ready:", {
          courseId: courseRecord[0].id,
          notesCount: response.notes.length,
          flashcardsCount: response.flashcards.length,
          quizCount: response.quiz.length,
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

    // ===========================================================
    // XỬ LÝ QUIZ - LẤY TỪ COURSE_LAYOUT
    // ===========================================================
    if (studyType === "quiz") {
      const quizQuestions = extractQuizFromCourseLayout(courseLayout);

      console.log(`[API] Found ${quizQuestions.length} quiz questions`);

      if (quizQuestions.length === 0) {
        return NextResponse.json({
          questions: [
            {
              chapterId: "No Quiz Available",
              question: "Chưa có câu hỏi quiz",
              options: ["Vui lòng tạo quiz trong course layout"],
              correctAnswer: "",
              explanation: "No quiz available for this course",
            },
          ],
        });
      }

      return NextResponse.json({
        questions: quizQuestions,
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

// ===========================================================
// HELPER: Extract Quiz từ Course Layout
// ===========================================================
function extractQuizFromCourseLayout(courseLayout) {
  const allQuestions = [];

  try {
    // Parse nếu là string
    let layoutData = courseLayout;
    if (typeof courseLayout === "string") {
      try {
        layoutData = JSON.parse(courseLayout);
      } catch (e) {
        console.error("[API] Error parsing course_layout:", e);
        return [];
      }
    }

    // Kiểm tra structure - có thể là object hoặc array
    let chapters = [];

    if (layoutData && Array.isArray(layoutData)) {
      chapters = layoutData;
    } else if (
      layoutData &&
      layoutData.chapters &&
      Array.isArray(layoutData.chapters)
    ) {
      // Structure: { chapters: [...] }
      chapters = layoutData.chapters;
    } else {
      console.log("[API] Could not find chapters in courseLayout");
      return [];
    }

    console.log(`[API] Found ${chapters.length} chapters to process`);

    // Extract quiz từ mỗi chapter và lesson
    chapters.forEach((chapter, chapterIndex) => {
      const chapterName =
        chapter.chapterName ||
        chapter.chapterTitle ||
        `Chapter ${chapterIndex + 1}`;

      console.log(`[API] Processing chapter ${chapterIndex}: ${chapterName}`);

      // Kiểm tra quiz trực tiếp trong chapter
      if (chapter.quiz && Array.isArray(chapter.quiz)) {
        chapter.quiz.forEach((quizItem) => {
          allQuestions.push({
            chapterId: chapterName,
            question: quizItem.question || "",
            options: quizItem.options || [],
            correctAnswer: quizItem.correctAnswer || "",
            explanation: quizItem.explanation || "",
          });
        });
      }

      // Kiểm tra quiz trong lessons
      if (chapter.lessons && Array.isArray(chapter.lessons)) {
        console.log(
          `[API] Chapter ${chapterIndex} has ${chapter.lessons.length} lessons`
        );

        chapter.lessons.forEach((lesson, lessonIndex) => {
          const lessonName = lesson.lessonName || `Lesson ${lessonIndex + 1}`;

          if (lesson.quiz && Array.isArray(lesson.quiz)) {
            console.log(
              `[API] Found ${lesson.quiz.length} quiz items in lesson ${lessonIndex}`
            );

            lesson.quiz.forEach((quizItem) => {
              allQuestions.push({
                chapterId: `${chapterName} - ${lessonName}`,
                question: quizItem.question || "",
                options: quizItem.options || [],
                correctAnswer: quizItem.correctAnswer || "",
                explanation: quizItem.explanation || "",
              });
            });
          }
        });
      }
    });

    console.log(`[API] Total quiz questions extracted: ${allQuestions.length}`);
  } catch (error) {
    console.error("[API] Error extracting quiz:", error);
    console.error("[API] Stack trace:", error.stack);
  }

  return allQuestions;
}

// ===========================================================
// HELPER: Generate Flashcards từ Notes
// ===========================================================
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

      // 1. Tìm heading
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

      // 2. Tìm định nghĩa
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

      // 3. Tìm "A là B"
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

      // 4. Bullet points
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

  // Loại bỏ trùng lặp
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

// ===========================================================
// GET METHOD
// ===========================================================
export async function GET(req) {
  return NextResponse.json({
    message: "Study Type API",
    supportedTypes: ["notes", "flashcard", "quiz", "ALL"],
    usage:
      "POST /api/study-type with body: { courseId: <study_english.id>, studyType }",
    example: {
      courseId: 27,
      studyType: "quiz",
    },
  });
}
