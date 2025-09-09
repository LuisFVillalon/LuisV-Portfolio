// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Narrowing helpers
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function pickString(o: Record<string, unknown>, key: string): string | undefined {
  const v = o[key];
  return typeof v === "string" ? v : undefined;
}

function getErrorMessage(err: unknown): string {
  // Strings
  if (typeof err === "string") return err;

  // Error instances
  if (err instanceof Error) return err.message || err.name || "Unexpected error";

  // Plain objects (possible Resend error shapes)
  if (isRecord(err)) {
    // common fields
    const msg =
      pickString(err, "message") ||
      (isRecord(err.error) && pickString(err.error, "message")) || // nested: { error: { message } }
      pickString(err, "name") ||
      (isRecord(err.error) && pickString(err.error, "name"));

    if (msg) return msg;
  }

  return "Unexpected error";
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

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,   // e.g. onboarding@resend.dev
      to: [process.env.TO_EMAIL!],     // your edu inbox
      subject: `New contact form message from ${name}`,
      replyTo: email,
      html: `
        <h2>New contact</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      // Resend returns an object; convert to string
      return NextResponse.json({ ok: false, error: getErrorMessage(error) }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: getErrorMessage(err) }, { status: 500 });
  }
}
