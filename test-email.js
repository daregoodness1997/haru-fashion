// Test Brevo email configuration
require("dotenv").config({ path: ".env" });

console.log("📧 Testing Brevo Email Configuration...\n");
console.log("Email Settings:");
console.log(
  "- BREVO_API_KEY:",
  process.env.BREVO_API_KEY ? "***SET***" : "❌ NOT SET"
);
console.log(
  "- BREVO_SENDER_EMAIL:",
  process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || "❌ NOT SET"
);
console.log(
  "- BREVO_SENDER_NAME:",
  process.env.BREVO_SENDER_NAME || "Shunapee Fashion House"
);
console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("- SUPPORT_EMAIL:", process.env.SUPPORT_EMAIL);
console.log("");

async function testEmail() {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_SENDER_EMAIL =
      process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;
    const BREVO_SENDER_NAME =
      process.env.BREVO_SENDER_NAME || "Shunapee Fashion House";
    const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }

    if (!BREVO_SENDER_EMAIL) {
      throw new Error(
        "BREVO_SENDER_EMAIL or EMAIL_USER is not set in environment variables"
      );
    }

    console.log("� Testing Brevo API connection...\n");

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [
          {
            email: BREVO_SENDER_EMAIL, // Send to yourself for testing
          },
        ],
        subject: "Test Email from Shunapee Fashion House",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>✅ Brevo Email Configuration Successful!</h2>
            <p>This is a test email from your Shunapee Fashion House application using Brevo API.</p>
            <p>If you received this, your Brevo email service is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(
        `Brevo API error: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Test email sent successfully via Brevo!");
    console.log("Message ID:", data.messageId);
    console.log("\n✨ Brevo email system is working correctly!");
  } catch (error) {
    console.error("❌ Email test failed:");
    console.error(error.message);

    if (error.message.includes("BREVO_API_KEY")) {
      console.log("\n💡 API Key missing. Please:");
      console.log("  1. Sign up at https://www.brevo.com/");
      console.log(
        "  2. Get your API key from Settings → SMTP & API → API Keys"
      );
      console.log("  3. Add BREVO_API_KEY to your .env file");
    } else if (
      error.message.includes("Unauthorized") ||
      error.message.includes("401")
    ) {
      console.log("\n💡 Authentication failed. Please check:");
      console.log("  1. Your BREVO_API_KEY is correct");
      console.log("  2. The API key hasn't expired");
      console.log("  3. Generate a new API key from Brevo dashboard if needed");
    } else if (error.message.includes("Sender email")) {
      console.log("\n💡 Sender email issue. Please check:");
      console.log("  1. BREVO_SENDER_EMAIL is set correctly");
      console.log("  2. The sender email is verified in Brevo dashboard");
      console.log("  3. Go to Brevo → Senders & IPs → Senders to verify");
    }
  }
}

testEmail();
