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
        const notesResult = await db
          .select()
          .from(CHAPTER_NOTES_TABLE)
          .where(eq(CHAPTER_NOTES_TABLE.courseId, actualCourseId));

        const flashcardsResult = await db
          .select()
          .from(FLASHCARDS_TABLE)
          .where(eq(FLASHCARDS_TABLE.courseId, actualCourseId));

        const quizQuestions = extractQuizFromCourseLayout(courseLayout);
        const qaItems = extractQAFromCourseLayout(courseLayout);

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
          qa: qaItems,
        };

        console.log("[API] Response ready:", {
          notesCount: response.notes.length,
          flashcardsCount: response.flashcards.length,
          quizCount: response.quiz.length,
          qaCount: response.qa.length,
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
      const existingFlashcards = await db
        .select()
        .from(FLASHCARDS_TABLE)
        .where(eq(FLASHCARDS_TABLE.courseId, actualCourseId));

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

      const notesResult = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(eq(CHAPTER_NOTES_TABLE.courseId, actualCourseId));

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

      try {
        for (const card of flashcards) {
          await db.insert(FLASHCARDS_TABLE).values({
            courseId: actualCourseId,
            front: card.front,
            back: card.back,
            difficulty: card.difficulty || "medium",
          });
        }
      } catch (error) {
        console.error("[API] Error saving flashcards:", error);
      }

      return NextResponse.json({ flashcards: flashcards });
    }

    // ===========================================================
    // XỬ LÝ QUIZ
    // ===========================================================
    if (studyType === "quiz") {
      const quizQuestions = extractQuizFromCourseLayout(courseLayout);

      if (quizQuestions.length === 0) {
        return NextResponse.json({
          questions: [
            {
              chapterId: "No Quiz Available",
              question: "Chưa có câu hỏi quiz",
              options: ["Vui lòng tạo quiz trong course layout"],
              correctAnswer: "",
              explanation: "",
            },
          ],
        });
      }

      return NextResponse.json({ questions: quizQuestions });
    }

    // ===========================================================
    // XỬ LÝ Q&A
    // ===========================================================
    if (studyType === "qa" || studyType === "Q&A") {
      const qaItems = extractQAFromCourseLayout(courseLayout);

      console.log(`[API] Found ${qaItems.length} Q&A items`);

      if (qaItems.length === 0) {
        return NextResponse.json({
          questions: [
            {
              chapterId: "No Q&A Available",
              question: "Chưa có câu hỏi",
              answer: "Vui lòng tạo nội dung Q&A trong course layout",
              explanation: "",
            },
          ],
        });
      }

      return NextResponse.json({ questions: qaItems });
    }

    return NextResponse.json(
      { error: `Invalid studyType: ${studyType}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in study-type API:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

// ===========================================================
// HELPER: Extract Quiz
// ===========================================================
function extractQuizFromCourseLayout(courseLayout) {
  const allQuestions = [];

  try {
    let layoutData = courseLayout;
    if (typeof courseLayout === "string") {
      try {
        layoutData = JSON.parse(courseLayout);
      } catch (e) {
        console.error("[API] Error parsing course_layout:", e);
        return [];
      }
    }

    let chapters = [];

    if (layoutData && Array.isArray(layoutData)) {
      chapters = layoutData;
    } else if (
      layoutData &&
      layoutData.chapters &&
      Array.isArray(layoutData.chapters)
    ) {
      chapters = layoutData.chapters;
    } else {
      return [];
    }

    chapters.forEach((chapter, chapterIndex) => {
      const chapterName =
        chapter.chapterName ||
        chapter.chapterTitle ||
        `Chapter ${chapterIndex + 1}`;

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

      if (chapter.lessons && Array.isArray(chapter.lessons)) {
        chapter.lessons.forEach((lesson, lessonIndex) => {
          const lessonName = lesson.lessonName || `Lesson ${lessonIndex + 1}`;

          if (lesson.quiz && Array.isArray(lesson.quiz)) {
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
  } catch (error) {
    console.error("[API] Error extracting quiz:", error);
  }

  return allQuestions;
}

// ===========================================================
// HELPER: Extract Q&A
// ===========================================================
function extractQAFromCourseLayout(courseLayout) {
  const allQA = [];

  try {
    let layoutData = courseLayout;
    if (typeof courseLayout === "string") {
      try {
        layoutData = JSON.parse(courseLayout);
      } catch (e) {
        console.error("[API] Error parsing course_layout:", e);
        return [];
      }
    }

    let chapters = [];

    if (layoutData && Array.isArray(layoutData)) {
      chapters = layoutData;
    } else if (
      layoutData &&
      layoutData.chapters &&
      Array.isArray(layoutData.chapters)
    ) {
      chapters = layoutData.chapters;
    } else {
      return [];
    }

    chapters.forEach((chapter, chapterIndex) => {
      const chapterName =
        chapter.chapterName ||
        chapter.chapterTitle ||
        `Chapter ${chapterIndex + 1}`;

      if (chapter.lessons && Array.isArray(chapter.lessons)) {
        chapter.lessons.forEach((lesson, lessonIndex) => {
          const lessonName = lesson.lessonName || `Lesson ${lessonIndex + 1}`;

          if (lesson.examples && Array.isArray(lesson.examples)) {
            lesson.examples.forEach((example) => {
              allQA.push({
                chapterId: `${chapterName} - ${lessonName}`,
                question: example.english || "",
                answer: example.vietnamese || "",
                explanation: example.explanation || "",
              });
            });
          }
        });
      }
    });

    console.log(`[API] Total Q&A items extracted: ${allQA.length}`);
  } catch (error) {
    console.error("[API] Error extracting Q&A:", error);
  }

  return allQA;
}

// ===========================================================
// HELPER: Generate Flashcards
// ===========================================================
function generateFlashcardsFromNotes(notes) {
  const flashcards = [];

  notes.forEach((noteItem) => {
    const content = noteItem.note || "";
    const chapterName = noteItem.chapterId || "Chapter";

    if (!content || content.trim().length === 0) return;

    const lines = content.split("\n").filter((line) => line.trim().length > 0);

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.match(/^#{1,6}\s+/)) {
        const heading = trimmedLine.replace(/^#{1,6}\s+/, "").trim();
        const nextLine = lines[index + 1];

        if (
          heading.length > 5 &&
          heading.length < 150 &&
          nextLine &&
          !nextLine.match(/^#{1,6}\s+/)
        ) {
          flashcards.push({
            front: `${chapterName}: ${heading}`,
            back: nextLine.trim(),
            difficulty: "medium",
          });
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

// ===========================================================
// GET METHOD
// ===========================================================
export async function GET(req) {
  return NextResponse.json({
    message: "Study Type API",
    supportedTypes: ["notes", "flashcard", "quiz", "qa", "ALL"],
    usage:
      "POST /api/study-type with body: { courseId: <study_english.id>, studyType }",
    example: { courseId: 40, studyType: "qa" },
  });
}
