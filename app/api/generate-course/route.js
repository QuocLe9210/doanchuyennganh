import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_ENGLISH_TABLE } from "@/configs/schema";
import { v4 as uuidv4 } from "uuid";
import { inngest } from "@/inngest/client";

// ============================================
// POST - Generate Course và Save vào Database
// ============================================
export async function POST(req) {
  const startTime = Date.now();

  try {
    // 1. Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY not found");
      return NextResponse.json(
        {
          error: "API key chưa được cấu hình",
          errorType: "config",
        },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { studyType, topic, difficultyLevel, userId } = body;

    console.log("📝 Request:", { studyType, topic, difficultyLevel, userId });

    // 3. Validate required fields
    if (!studyType || !topic || !difficultyLevel) {
      return NextResponse.json(
        {
          error: "Thiếu thông tin bắt buộc",
          missing: {
            studyType: !studyType,
            topic: !topic,
            difficultyLevel: !difficultyLevel,
          },
        },
        { status: 400 }
      );
    }

    // 4. Initialize Gemini AI
    console.log("🤖 Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 1.0,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    // 5. Create prompt
    const prompt = createPrompt(studyType, topic, difficultyLevel);

    // 6. Generate content from AI
    console.log("🤖 Calling Gemini API...");
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const duration = Date.now() - startTime;

    console.log(`✅ Generated in ${duration}ms`);

    // 7. Parse JSON response
    let courseData;
    try {
      // Try to extract JSON from markdown code block
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        courseData = JSON.parse(jsonMatch[1]);
      } else {
        courseData = JSON.parse(text);
      }
    } catch (parseError) {
      console.error("⚠️ JSON parse error:", parseError.message);
      console.log("Raw response:", text.substring(0, 500));

      // Create fallback structure
      courseData = {
        courseName: `Khóa học ${studyType}: ${topic}`,
        description: "Khóa học được tạo bởi AI",
        difficulty: difficultyLevel,
        chapters: [],
        error: "Không thể parse JSON từ AI response",
        rawResponse: text.substring(0, 1000),
      };
    }

    // 8. Add metadata
    courseData.metadata = {
      generatedAt: new Date().toISOString(),
      duration,
      studyType,
      topic,
      difficultyLevel,
      model: "gemini-2.0-flash",
    };

    // 9. Save to Database (if userId provided)
    let savedCourse = null;
    if (userId && userId !== "guest") {
      try {
        console.log("💾 Saving to database...");

        // Generate unique courseID
        const courseID = `course_${Date.now()}_${uuidv4().slice(0, 8)}`;

        // Prepare database record
        const courseRecord = {
          courseID: courseID,
          courseType: studyType,
          topic: topic,
          difficultyLevel: difficultyLevel,
          courseLayout: courseData,
          createdBy: userId,
          status: "Generating",
        };

        // Insert into database
        const dbResult = await db
          .insert(STUDY_ENGLISH_TABLE)
          .values(courseRecord)
          .returning();

        savedCourse = {
          id: dbResult[0].id,
          courseID: courseID,
        };

        console.log("✅ Saved to database:", savedCourse);

        // 10. Trigger Inngest function to generate notes
        try {
          console.log("🔔 Triggering GenerateNotes function...");
          await inngest.send({
            name: "notes.generate",
            data: {
              course: {
                courseID: courseID,
              },
            },
          });
          console.log("✅ GenerateNotes triggered successfully");
        } catch (inngestError) {
          console.error("⚠️ Inngest trigger failed:", inngestError.message);
          // Don't fail the request, notes can be generated later
        }
      } catch (dbError) {
        console.error("⚠️ Database save failed:", dbError.message);
        console.error("Stack:", dbError.stack);
        savedCourse = {
          error: "Database save failed",
          message: dbError.message,
        };
      }
    } else {
      console.log("ℹ️ No userId provided, skipping database save");
    }

    // 11. Return success response
    return NextResponse.json({
      success: true,
      data: courseData,
      saved: savedCourse,
      stats: {
        duration,
        tokens: response.usageMetadata?.totalTokenCount || 0,
        model: "gemini-2.0-flash",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error("❌ API Error:", error);
    console.error("Error stack:", error.stack);

    // Determine error type
    let errorMessage = error.message;
    let errorType = "unknown";

    if (
      error.message.includes("API key") ||
      error.message.includes("API_KEY")
    ) {
      errorType = "auth";
      errorMessage = "API key không hợp lệ hoặc chưa được cấu hình";
    } else if (
      error.message.includes("quota") ||
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      errorType = "quota";
      errorMessage = "Đã vượt quá giới hạn API quota";
    } else if (
      error.message.includes("rate limit") ||
      error.message.includes("RATE_LIMIT")
    ) {
      errorType = "rate_limit";
      errorMessage = "Quá nhiều yêu cầu, vui lòng thử lại sau";
    } else if (
      error.message.includes("timeout") ||
      error.message.includes("DEADLINE_EXCEEDED")
    ) {
      errorType = "timeout";
      errorMessage = "Yêu cầu mất quá nhiều thời gian";
    } else if (error.message.includes("fetch")) {
      errorType = "network";
      errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra internet";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorType,
        duration,
        timestamp: new Date().toISOString(),
        debug:
          process.env.NODE_ENV === "development"
            ? {
                originalError: error.message,
                stack: error.stack,
              }
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Test API Status
// ============================================
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Generate Course API is running",
    endpoint: "/api/generate-course",
    method: "POST",
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
    databaseConfigured: !!process.env.NEXT_PUBLIC_DATABASE_CONNECTION,
    requiredFields: ["studyType", "topic", "difficultyLevel"],
    optionalFields: ["userId"],
    features: [
      "Generate course with AI",
      "Auto-save to database (if userId provided)",
      "Trigger Inngest to generate chapter notes",
      "JSON response format",
    ],
    example: {
      studyType: "Study Material",
      topic: "Thì hiện tại đơn",
      difficultyLevel: "Beginner",
      userId: "user@example.com",
    },
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createPrompt(studyType, topic, difficultyLevel) {
  const promptTemplates = {
    Exam: `Tạo một bộ đề thi Tiếng Anh về "${topic}" với độ khó ${difficultyLevel}.`,
    "Study Material": `Tạo tài liệu học tập Tiếng Anh về "${topic}" với độ khó ${difficultyLevel}.`,
    Flashcard: `Tạo bộ flashcard Tiếng Anh về "${topic}" với độ khó ${difficultyLevel}.`,
  };

  const basePrompt =
    promptTemplates[studyType] ||
    `Tạo khóa học Tiếng Anh ${studyType} về "${topic}" với độ khó ${difficultyLevel}.`;

  return `${basePrompt}

YÊU CẦU CHI TIẾT:

1. **Cấu trúc khóa học hoàn chỉnh** với:
   - Tên khóa học hấp dẫn (tiếng Anh)
   - Mô tả ngắn gọn (2-3 câu, tiếng Anh)
   - Ít nhất 2-3 chương học

2. **Mỗi chương** phải có:
   - Tên chương rõ ràng
   - 2-4 bài học cụ thể
   - Mục tiêu học tập

  

3. **Mỗi bài học** bao gồm:
   - Tên bài học
   - Nội dung chi tiết (ngữ pháp/từ vựng/kỹ năng)
   - 3-5 ví dụ thực tế có dịch nghĩa
   - 3-5 câu hỏi trắc nghiệm để kiểm tra

4. **Câu hỏi trắc nghiệm** format:
   - Câu hỏi rõ ràng
   - 4 đáp án (A, B, C, D)
   - Đáp án đúng
   - Giải thích ngắn gọn

5. **Độ khó ${difficultyLevel}**:
${getDifficultyGuide(difficultyLevel)}

TRẢ VỀ FORMAT JSON SAU (CHỈ JSON, KHÔNG thêm markdown hay text):

{
  "courseName": "Tên khóa học (tiếng Anh)",
  "description": "Mô tả khóa học (tiếng Anh)",
  "difficulty": "${difficultyLevel}",
  "duration": "Thời lượng (VD: 4 weeks, 6 weeks)",
  "chapters": [
    {
      "chapterNumber": 1,
      "chapterName": "Tên chương",
      "objective": "Mục tiêu của chương",
      "lessons": [
        {
          "lessonNumber": 1,
          "lessonName": "Tên bài học",
          "content": "Nội dung chi tiết bài học",
          "examples": [
            {
              "english": "Câu tiếng Anh",
              "vietnamese": "Dịch tiếng Việt",
              "explanation": "Giải thích ngắn"
            }
          ],
          "quiz": [
            {
              "question": "Câu hỏi",
              "options": ["A. Đáp án A", "B. Đáp án B", "C. Đáp án C", "D. Đáp án D"],
              "correctAnswer": "A",
              "explanation": "Giải thích đáp án đúng"
            }
          ]
        }
      ]
    }
  ],
  "tips": ["Mẹo học tập 1", "Mẹo học tập 2", "Mẹo học tập 3"]
}`;
}

function getDifficultyGuide(level) {
  const guides = {
    Beginner: `
   - Sử dụng từ vựng cơ bản, phổ biến
   - Ngữ pháp đơn giản (hiện tại đơn, quá khứ đơn)
   - Câu ngắn, dễ hiểu
   - Giải thích chi tiết mọi khái niệm`,

    Intermediate: `
   - Từ vựng đa dạng hơn, bao gồm idioms
   - Ngữ pháp phức tạp (các thì hoàn thành, câu điều kiện)
   - Câu dài hơn, có mệnh đề phụ
   - Ít giải thích chi tiết hơn, tập trung vào thực hành`,

    Advanced: `
   - Từ vựng nâng cao, học thuật
   - Ngữ pháp phức tạp (đảo ngữ, rút gọn)
   - Câu phức tạp, nhiều mệnh đề
   - Yêu cầu tư duy phản biện cao`,

    Easy: `
   - Sử dụng từ vựng cơ bản, phổ biến
   - Ngữ pháp đơn giản (hiện tại đơn, quá khứ đơn)
   - Câu ngắn, dễ hiểu
   - Giải thích chi tiết mọi khái niệm`,

    Medium: `
   - Từ vựng đa dạng hơn, bao gồm idioms
   - Ngữ pháp phức tạp (các thì hoàn thành, câu điều kiện)
   - Câu dài hơn, có mệnh đề phụ
   - Ít giải thích chi tiết hơn, tập trung vào thực hành`,

    Hard: `
   - Từ vựng nâng cao, học thuật
   - Ngữ pháp phức tạp (đảo ngữ, rút gọn)
   - Câu phức tạp, nhiều mệnh đề
   - Yêu cầu tư duy phản biện cao`,
  };

  return guides[level] || guides.Intermediate;
}
