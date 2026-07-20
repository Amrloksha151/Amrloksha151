import { neon } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";
import { Resend } from "resend";
import { generateContactPdf } from "../pdf/contactPdf.js";

const db = neon(env.DATABASE_URL);
const resend = new Resend(env.RESEND_API_KEY);

async function sendContactMessage(req, res) {
  try {
    const { name, email, phone, subject, message, cfTurnstileResponse } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!cfTurnstileResponse) {
      return res.status(400).json({ error: "Missing verification token" });
    }

    const formData = new FormData();
    formData.append("secret", env.TURNSTILE_SECRET_KEY);
    formData.append("response", cfTurnstileResponse);
    formData.append("remoteip", req.ip);

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData },
    );
    const verifyResult = await verifyRes.json();

    if (!verifyResult.success) {
      return res.status(403).json({ error: "Human verification failed. Please try again." });
    }

    const sanitized = {
      name: String(name).slice(0, 255),
      email: String(email).slice(0, 255),
      phone: phone ? String(phone).slice(0, 50) : null,
      subject: String(subject).slice(0, 500),
      message: String(message),
    };

    const rows = await db`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (${sanitized.name}, ${sanitized.email}, ${sanitized.phone}, ${sanitized.subject}, ${sanitized.message})
      RETURNING id, created_at
    `;

    const pdfBuffer = await generateContactPdf(sanitized);

    await resend.emails.send({
      from: env.CONTACT_EMAIL_FROM,
      to: env.CONTACT_EMAIL_TO,
      subject: `New message from [amrloksha151.me] ${sanitized.subject}`,
      html: `<p><strong>${sanitized.name}</strong> sent a message via the contact form.</p><p>See the attached PDF for details.</p>`,
      attachments: [
        {
          filename: `contact-${rows[0].id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return res.status(201).json({ data: { id: rows[0].id, created_at: rows[0].created_at } });
  } catch (err) {
    console.error("Contact message error:", err);
    return res.status(500).json({ error: "Failed to process contact message" });
  }
}

export default { sendContactMessage };
