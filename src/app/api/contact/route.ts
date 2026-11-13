// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Shown to visitors whenever sending fails; the real error is only logged server-side.
const GENERIC_ERROR =
  "Sorry, your message couldn't be sent right now. Please try again later or email me directly.";

// Escape visitor text before it is placed into the email HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Remove CR/LF so visitor text can't inject extra lines into the subject or headers.
function stripLineBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Please fill out all fields." }, { status: 400 });
    }

    const subjectName = stripLineBreaks(name);
    const replyTo = stripLineBreaks(email);

    // Created per request so a missing key fails this request (generic error)
    // instead of crashing module load and the production build.
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,   // e.g. onboarding@resend.dev
      to: [process.env.TO_EMAIL!],     // your edu inbox
      subject: `New contact form message from ${subjectName}`,
      replyTo,
      html: `
        <h2>New contact</h2>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Message:</b></p>
        <p>${escapeHtml(message)}</p>
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
