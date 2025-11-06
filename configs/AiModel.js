// ============================================
// FILE: scripts/AiModel.js (For Testing Only)
// ============================================
// To run: node scripts/AiModel.js
// Install: npm install @google/generative-ai

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";

// ============================================
// CONFIG
// ============================================
const CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  logFile: path.join(process.cwd(), "api-history.json"),
  maxHistorySize: 100,
};

// ============================================
// LOGGER CLASS
// ============================================
class APILogger {
  constructor(logPath) {
    this.logPath = logPath;
  }

  async log(data) {
    try {
      let history = await this.read();
      history.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...data,
      });
      if (history.length > CONFIG.maxHistorySize) {
        history = history.slice(-CONFIG.maxHistorySize);
      }
      await fs.writeFile(this.logPath, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error("⚠️ Failed to log:", error.message);
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.logPath, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getStats() {
    const history = await this.read();
    const successful = history.filter((h) => h.success);
    const failed = history.filter((h) => !h.success);

    return {
      total: history.length,
      successful: successful.length,
      failed: failed.length,
      avgDuration:
        successful.reduce((a, b) => a + b.duration, 0) / successful.length || 0,
      totalTokens: successful.reduce((a, b) => a + (b.tokens?.total || 0), 0),
      lastError: failed.length > 0 ? failed[failed.length - 1].error : null,
    };
  }

  async clear() {
    try {
      await fs.writeFile(this.logPath, JSON.stringify([], null, 2));
      console.log("✅ History cleared!");
    } catch (error) {
      console.error("❌ Failed to clear history:", error.message);
    }
  }
}

// ============================================
// MAIN FUNCTION
// ============================================
async function main() {
  const logger = new APILogger(CONFIG.logFile);
  const startTime = Date.now();

  try {
    // Validate API key
    if (!CONFIG.apiKey) {
      throw new Error(
        "❌ API Key not found! Set GEMINI_API_KEY environment variable.\n" +
          "Example: export GEMINI_API_KEY='your-api-key'"
      );
    }

    console.log("🚀 Starting AI test...\n");

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(CONFIG.apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 1.0,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Test prompt - CHANGE THIS TO YOUR PROMPT
    const prompt = `Tài liệu học Tiếng Anh cho người mới bắt đầu, bao gồm:
- Ngữ pháp cơ bản
- Từ vựng thiết yếu
- Các cụm từ thông dụng
- Phương pháp học hiệu quả

Tạo outline ngắn gọn với 3 chương học.`;

    console.log("🤖 Calling Gemini API...");

    // Generate with streaming
    const result = await model.generateContentStream(prompt);

    let fullText = "";
    let chunkCount = 0;

    // Stream output
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      chunkCount++;
      process.stdout.write(chunkText);
    }

    const duration = Date.now() - startTime;

    // Get final response for metadata
    const finalResponse = await result.response;
    const usageMetadata = finalResponse.usageMetadata;

    // Success logging
    await logger.log({
      model: "gemini-2.0-flash-exp",
      prompt: prompt.substring(0, 100) + "...",
      success: true,
      duration,
      chunkCount,
      responseLength: fullText.length,
      tokens: usageMetadata
        ? {
            prompt: usageMetadata.promptTokenCount,
            response: usageMetadata.candidatesTokenCount,
            total: usageMetadata.totalTokenCount,
          }
        : null,
    });

    // Display results
    console.log("\n\n" + "=".repeat(50));
    console.log("✅ Request completed successfully!");
    console.log("=".repeat(50));
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📝 Response length: ${fullText.length} characters`);
    console.log(`📦 Chunks received: ${chunkCount}`);

    if (usageMetadata) {
      console.log(`📊 Tokens used: ${usageMetadata.totalTokenCount}`);
      console.log(`   - Prompt: ${usageMetadata.promptTokenCount}`);
      console.log(`   - Response: ${usageMetadata.candidatesTokenCount}`);
    }

    // Show stats
    console.log("\n" + "=".repeat(50));
    console.log("📈 API USAGE STATISTICS");
    console.log("=".repeat(50));
    const stats = await logger.getStats();
    console.log(`Total calls: ${stats.total}`);
    console.log(`Successful: ${stats.successful} ✅`);
    console.log(`Failed: ${stats.failed} ❌`);
    console.log(`Average duration: ${stats.avgDuration.toFixed(0)}ms`);
    console.log(`Total tokens used: ${stats.totalTokens.toLocaleString()}`);

    if (stats.lastError) {
      console.log(`Last error: ${stats.lastError}`);
    }

    return fullText;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Error logging
    await logger.log({
      model: "gemini-2.0-flash-exp",
      success: false,
      duration,
      error: error.message,
      errorType: error.constructor.name,
    });

    console.error("\n" + "=".repeat(50));
    console.error("❌ ERROR OCCURRED");
    console.error("=".repeat(50));
    console.error(`Type: ${error.constructor.name}`);
    console.error(`Message: ${error.message}`);
    console.error(`Duration before error: ${duration}ms`);

    // Common error fixes
    if (
      error.message.includes("API key") ||
      error.message.includes("API_KEY")
    ) {
      console.error("\n💡 Fix: Set your API key:");
      console.error("   export GEMINI_API_KEY='your-api-key-here'");
    } else if (error.message.includes("quota")) {
      console.error("\n💡 Fix: You've exceeded your API quota");
      console.error("   Check your quota at: https://aistudio.google.com");
    } else if (error.message.includes("rate limit")) {
      console.error("\n💡 Fix: Too many requests. Wait a moment and try again");
    }

    process.exit(1);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

async function viewHistory() {
  const logger = new APILogger(CONFIG.logFile);
  const history = await logger.read();

  console.log("\n📜 API CALL HISTORY");
  console.log("=".repeat(50));

  if (history.length === 0) {
    console.log("No history found.");
    return;
  }

  history.slice(-10).forEach((entry, index) => {
    console.log(`\n[${index + 1}] ${entry.timestamp}`);
    console.log(`Status: ${entry.success ? "✅ Success" : "❌ Failed"}`);
    console.log(`Duration: ${entry.duration}ms`);
    if (entry.tokens) {
      console.log(`Tokens: ${entry.tokens.total}`);
    }
    if (entry.error) {
      console.log(`Error: ${entry.error}`);
    }
  });

  const stats = await logger.getStats();
  console.log("\n" + "=".repeat(50));
  console.log(
    `Total: ${stats.total} | Success: ${stats.successful} | Failed: ${stats.failed}`
  );
}

async function clearHistory() {
  const logger = new APILogger(CONFIG.logFile);
  await logger.clear();
}

// ============================================
// RUN
// ============================================
const command = process.argv[2];

if (command === "history") {
  viewHistory();
} else if (command === "clear") {
  clearHistory();
} else {
  main();
}

export { main, viewHistory, clearHistory, APILogger };
