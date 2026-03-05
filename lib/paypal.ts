import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

export function paypalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  }

  const env = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
  return new checkoutNodeJssdk.core.PayPalHttpClient(env);
}
