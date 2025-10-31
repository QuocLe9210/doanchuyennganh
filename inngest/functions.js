import { USER_TABLE } from "@/configs/schema";
import { inngest } from "./client";
import { db } from "@/configs/db";
import { eq } from "drizzle-orm";

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
