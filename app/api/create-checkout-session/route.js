// app/api/create-checkout-session/route.js
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, billingCycle } = await req.json();

    // Validate input
    if (!plan || !billingCycle) {
      return Response.json(
        { error: "Plan and billing cycle are required" },
        { status: 400 }
      );
    }

    // Price mapping
    const priceMap = {
      pro_monthly: "price_1SWUmN8fC91jnCMwXhaIdq5s", // Replace with your actual price ID
      pro_yearly: "price_1SWUmN8fC91jnCMwXhaIdq5s", // Replace with your actual price ID
      premium_monthly: "price_1SWUmN8fC91jnCMwXhaIdq5s", // Replace with your actual price ID
      premium_yearly: "price_1SWUmN8fC91jnCMwXhaIdq5s", // Replace with your actual price ID
    };

    const priceKey = `${plan}_${billingCycle}`;
    const priceId = priceMap[priceKey];

    if (!priceId) {
      return Response.json(
        { error: "Invalid plan or billing cycle" },
        { status: 400 }
      );
    }

    // Lấy base URL (fallback nếu không có env variable)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: sessionClaims?.email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/upgrade?success=true`,
      cancel_url: `${baseUrl}/dashboard/upgrade?canceled=true`,
      metadata: {
        userId: userId,
        plan: plan,
      },
    });

    // Trả về URL thay vì sessionId
    return Response.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
