// Test email configuration
require("dotenv").config({ path: ".env" });
const nodemailer = require("nodemailer");

console.log("📧 Testing Email Configuration...\n");
console.log("Email Settings:");
console.log("- HOST:", process.env.EMAIL_HOST);
console.log("- PORT:", process.env.EMAIL_PORT);
console.log("- USER:", process.env.EMAIL_USER);
console.log(
  "- PASSWORD:",
  process.env.EMAIL_PASSWORD ? "***SET***" : "❌ NOT SET"
);
console.log("- ADMIN:", process.env.ADMIN_EMAIL);
console.log("- SUPPORT:", process.env.SUPPORT_EMAIL);
console.log("");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true, // Log information to console
});

async function testEmail() {
  try {
    console.log("🔍 Verifying connection...\n");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    console.log("📤 Sending test email...\n");
    const info = await transporter.sendMail({
      from: `"Haru Fashion Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test Email from Haru Fashion",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Email Configuration Successful!</h2>
          <p>This is a test email from your Haru Fashion application.</p>
          <p>If you received this, your email service is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("\n✨ Email system is working correctly!");
  } catch (error) {
    console.error("❌ Email test failed:");
    console.error(error);

    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication failed. Please check:");
      console.log("  1. Email username is correct");
      console.log("  2. Password/App Password is correct");
      console.log("  3. For Zoho: Enable IMAP/POP access in settings");
    } else if (error.code === "ECONNECTION") {
      console.log("\n💡 Connection failed. Please check:");
      console.log("  1. SMTP host is correct");
      console.log("  2. Port is correct (465 for SSL, 587 for TLS)");
      console.log("  3. Internet connection is working");
    }
  }
}

testEmail();
