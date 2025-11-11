import {
  USER_TABLE,
  STUDY_ENGLISH_TABLE,
  CHAPTER_NOTES_TABLE,
} from "@/configs/schema";
import { inngest } from "./client";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    console.log("🎯 Inngest function triggered");
    console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

    const result = await step.run("create-new-user", async () => {
      try {
        const user = event.data.user;

        console.log("👤 Processing user:", user);
        console.log("📧 Email check:", user?.primaryEmailAddress?.emailAddress);

        // Kiểm tra chi tiết hơn
        if (!user) {
          console.error("❌ No user object");
          return { success: false, message: "No user object" };
        }

        if (!user.primaryEmailAddress) {
          console.error("❌ No primaryEmailAddress");
          return { success: false, message: "No primaryEmailAddress" };
        }

        const email = user.primaryEmailAddress.emailAddress;
        if (!email) {
          console.error("❌ No email found");
          return { success: false, message: "No email found" };
        }

        console.log("✅ Email found:", email);

        // Check existing user
        const existingUser = await db
          .select()
          .from(USER_TABLE)
          .where(eq(USER_TABLE.email, email));

        console.log("🔍 Existing user check:", existingUser);

        if (existingUser?.length === 0) {
          console.log("➕ Creating new user...");

          const userResp = await db
            .insert(USER_TABLE)
            .values({
              userName: user.fullName || "Unknown",
              email: email,
              isMember: false,
            })
            .returning({ id: USER_TABLE.id });

          console.log("✅ New user created:", userResp);

          return {
            success: true,
            message: "User đã được tạo",
            userId: userResp[0].id,
          };
        }

        console.log("ℹ️ User already exists");
        return {
          success: true,
          message: "User đã tồn tại",
          userId: existingUser[0].id,
        };
      } catch (error) {
        console.error("❌ Error in create-new-user:", error);
        throw error;
      }
    });

    console.log("🏁 Final result:", result);
    return result;
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course-notes" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    console.log("📚 GenerateNotes function triggered");
    console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

    const { course } = event.data;

    // Validate input
    if (!course) {
      console.error("❌ No course data provided");
      return { success: false, message: "No course data provided" };
    }

    if (!course.courseID) {
      console.error("❌ No courseID provided");
      return { success: false, message: "No courseID provided" };
    }

    // Step 1: Fetch course details from database
    const courseDetails = await step.run("fetch-course-details", async () => {
      try {
        console.log("🔍 Fetching course:", course.courseID);

        const courseData = await db
          .select()
          .from(STUDY_ENGLISH_TABLE)
          .where(eq(STUDY_ENGLISH_TABLE.courseID, course.courseID));

        if (!courseData || courseData.length === 0) {
          throw new Error("Course not found");
        }

        console.log("✅ Course found:", courseData[0].topic);
        return courseData[0];
      } catch (error) {
        console.error("❌ Error fetching course:", error);
        throw error;
      }
    });

    // Step 2: Update course status to "Generating"
    await step.run("update-status-generating", async () => {
      try {
        await db
          .update(STUDY_ENGLISH_TABLE)
          .set({ status: "Generating" })
          .where(eq(STUDY_ENGLISH_TABLE.courseID, course.courseID));

        console.log("✅ Status updated to Generating");
      } catch (error) {
        console.error("⚠️ Error updating status:", error);
      }
    });

    // Step 3: Generate notes for each chapter
    const courseLayout = courseDetails.courseLayout;
    const chapters = courseLayout?.chapters || [];

    console.log(`📖 Generating notes for ${chapters.length} chapters`);

    const notesResults = [];

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const chapterId = `chapter_${chapter.chapterNumber}`;

      // Generate notes with AI for each chapter
      const chapterNotes = await step.run(
        `generate-chapter-${chapter.chapterNumber}-notes`,
        async () => {
          try {
            console.log(`🤖 Generating notes for: ${chapter.chapterName}`);

            // Initialize Gemini AI
            if (!process.env.GEMINI_API_KEY) {
              throw new Error("GEMINI_API_KEY not configured");
            }

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
              model: "gemini-2.0-flash", // Match với route.js
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
              },
            });

            // Create prompt for chapter notes
            const prompt = `Tạo nội dung chi tiết cho chương học sau:

**Tên chương:** ${chapter.chapterName}
**Mục tiêu:** ${chapter.objective}
**Độ khó:** ${courseDetails.difficultyLevel}
**Chủ đề:** ${courseDetails.topic}

**Các bài học trong chương:**
${chapter.lessons
  .map((lesson, idx) => `${idx + 1}. ${lesson.lessonName}`)
  .join("\n")}

YÊU CẦU:
1. Viết nội dung chi tiết cho từng bài học (500-800 từ mỗi bài)
2. Bao gồm:
   - Giải thích lý thuyết rõ ràng
   - Ví dụ thực tế có dịch nghĩa
   - Các lưu ý quan trọng
   - Tips học tập
3. Sử dụng format Markdown để dễ đọc
4. Viết bằng tiếng Việt, ví dụ bằng tiếng Anh

Trả về nội dung hoàn chỉnh, chi tiết cho chương học này.`;

            // Generate content
            const result = await model.generateContent(prompt);
            const response = result.response;
            const notesText = response.text();

            console.log(
              `✅ Generated ${notesText.length} characters for chapter ${chapter.chapterNumber}`
            );

            return {
              chapterId,
              chapterNumber: chapter.chapterNumber,
              chapterName: chapter.chapterName,
              notes: notesText,
              generatedAt: new Date().toISOString(),
              tokens: response.usageMetadata?.totalTokenCount || 0,
            };
          } catch (error) {
            console.error(
              `❌ Error generating notes for chapter ${chapter.chapterNumber}:`,
              error
            );
            return {
              chapterId,
              chapterNumber: chapter.chapterNumber,
              chapterName: chapter.chapterName,
              notes: "Error generating notes",
              error: error.message,
            };
          }
        }
      );

      // Step 4: Save chapter notes to database
      await step.run(
        `save-chapter-${chapter.chapterNumber}-notes`,
        async () => {
          try {
            if (chapterNotes.error) {
              console.log(
                `⚠️ Skipping save for chapter ${chapter.chapterNumber} due to generation error`
              );
              return;
            }

            await db.insert(CHAPTER_NOTES_TABLE).values({
              courseId: course.courseID,
              chapterId: chapterNotes.chapterId,
              note: chapterNotes.notes,
            });

            console.log(`💾 Saved notes for chapter ${chapter.chapterNumber}`);
          } catch (error) {
            console.error(
              `❌ Error saving notes for chapter ${chapter.chapterNumber}:`,
              error
            );
          }
        }
      );

      notesResults.push(chapterNotes);

      // Add delay between API calls to avoid rate limiting
      if (i < chapters.length - 1) {
        await step.sleep(`wait-before-chapter-${i + 2}`, "2s");
      }
    }

    // Step 5: Update course status to "Ready"
    await step.run("update-status-ready", async () => {
      try {
        await db
          .update(STUDY_ENGLISH_TABLE)
          .set({ status: "Ready" })
          .where(eq(STUDY_ENGLISH_TABLE.courseID, course.courseID));

        console.log("✅ Course status updated to Ready");
      } catch (error) {
        console.error("❌ Error updating final status:", error);
      }
    });

    // Final result
    const finalResult = {
      success: true,
      message: "Notes generated successfully",
      courseID: course.courseID,
      chaptersProcessed: chapters.length,
      totalTokens: notesResults.reduce((sum, r) => sum + (r.tokens || 0), 0),
      results: notesResults.map((r) => ({
        chapterNumber: r.chapterNumber,
        chapterName: r.chapterName,
        success: !r.error,
        notesLength: r.notes?.length || 0,
      })),
    };

    console.log("🏁 GenerateNotes completed:", finalResult);
    return finalResult;
  }
);
