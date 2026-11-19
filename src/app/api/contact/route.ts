// app/api/contact/route.ts
// Sends a visitor's message to Luis via Resend. Used by the contact form and by the
// AI assistant's "Message Luis" card (source: "chat"), which the visitor fills in and sends.
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ASSISTANT } from "@/app/lib/assistant/config";
import { underRateLimit, visitorId } from "@/app/lib/assistant/usage";
import { EMAIL_PATTERN, escapeHtml, stripLineBreaks } from "@/app/lib/email";

// Shown to visitors whenever sending fails; the real error is only logged server-side.
const GENERIC_ERROR =
  "Sorry, your message couldn't be sent right now. Please try again later or email me directly.";

const LIMITS = { name: 100, email: 200, message: 5000, context: 1500 };

export async function POST(req: Request) {
  try {
    const { name, email, message, source, context } = (await req.json()) as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
      source?: unknown;
      context?: unknown;
    };

    if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string" || !name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json({ ok: false, error: "Please fill out all fields." }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email.trim()) || email.length > LIMITS.email) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    }
    if (name.length > LIMITS.name || message.length > LIMITS.message) {
      return NextResponse.json(
        { ok: false, error: `Please keep your name under ${LIMITS.name} and your message under ${LIMITS.message} characters.` },
        { status: 400 },
      );
    }

    // Per-visitor limit (only enforced when the assistant's Redis store is configured).
    if (!(await underRateLimit("contact", visitorId(req), ASSISTANT.leadsPerHour, 60 * 60).catch(() => true))) {
      return NextResponse.json(
        { ok: false, error: "You've sent several messages already. Please try again in an hour or email me directly." },
        { status: 429 },
      );
    }

    const fromChat = source === "chat";
    const chatContext = fromChat && typeof context === "string" ? context.slice(0, LIMITS.context).trim() : "";
    const subjectName = stripLineBreaks(name);
    const replyTo = stripLineBreaks(email);

    // Created per request so a missing key fails this request (generic error)
    // instead of crashing module load and the production build.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,   // e.g. onboarding@resend.dev
      to: [process.env.TO_EMAIL!],     // your edu inbox
      subject: fromChat
        ? `New message via the portfolio AI assistant from ${subjectName}`
        : `New contact form message from ${subjectName}`,
      replyTo,
      html: `
        <h2>${fromChat ? "New message from the AI assistant chat" : "New contact"}</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b></p>
        <p>${escapeHtml(message)}</p>
        ${chatContext ? `<p><b>Questions they asked the assistant:</b></p><p style="white-space:pre-wrap">${escapeHtml(chatContext)}</p>` : ""}
      `,
    });

    if (error) {
      console.error("Contact form: Resend failed to send email", error);
      return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("Contact form: unexpected error", err);
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 500 });
  }
}
