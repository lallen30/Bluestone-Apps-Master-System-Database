import dotenv from "dotenv";
dotenv.config();

export const config = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  serviceId: process.env.SERVICE_ID!,
  port: Number(process.env.SERVICE_PORT || 4001),
  mode: process.env.SERVICE_MODE || "test",
  middlemanUrl: process.env.MIDDLEMAN_URL!,
};

if (!config.stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");
