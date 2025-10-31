import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📥 Received body:", JSON.stringify(body, null, 2));

    const { user } = body;
    console.log("👤 User data:", JSON.stringify(user, null, 2));
    console.log("📧 Email:", user?.primaryEmailAddress?.emailAddress);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user data received" },
        { status: 400 }
      );
    }

    // Trigger Inngest function
    const inngestResult = await inngest.send({
      name: "user.create",
      data: { user },
    });

    console.log("✅ Inngest triggered:", inngestResult);

    return NextResponse.json({
      success: true,
      message: "User creation triggered",
    });
  } catch (error) {
    console.error("❌ Error in create-user API:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
