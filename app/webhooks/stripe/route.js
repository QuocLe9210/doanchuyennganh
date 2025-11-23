// app/api/webhooks/stripe/route.js
import Stripe from "stripe";
import { db } from "@/lib/db";
import { PAYMENT_RECORDS_TABLE } from "@/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { userId, plan } = session.metadata;

        // Lưu payment record
        await db.insert(PAYMENT_RECORDS_TABLE).values({
          customerId: session.customer,
          sessionId: session.id,
        });

        // Cập nhật user membership status
        // await db.update(USER_TABLE)
        //   .set({
        //     isMember: true,
        //     customerId: session.customer,
        //     plan: plan,
        //     subscriptionId: session.subscription
        //   })
        //   .where(eq(USER_TABLE.id, userId));

        console.log("Payment successful for user:", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Cập nhật user membership status to false
        // await db.update(USER_TABLE)
        //   .set({
        //     isMember: false,
        //     plan: null
        //   })
        //   .where(eq(USER_TABLE.customerId, customerId));

        console.log("Subscription cancelled for customer:", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.log("Payment failed:", invoice);
        // Có thể gửi email thông báo đến user
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log("Subscription updated:", subscription);
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
