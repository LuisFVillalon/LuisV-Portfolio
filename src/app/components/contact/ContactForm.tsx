'use client';

import React, { useState } from 'react';
import { AlertCircle, Check, Copy, Loader2, Send } from 'lucide-react';
import { primaryButtonClass } from '../home/BentoTile';
import { CONTACT_EMAIL } from '../../lib/contact';

interface FormData {
    fullName: string;
    email: string;
    message: string;
}
interface FormErrors {
    fullName?: string;
    email?: string;
    message?: string;
}

const EMPTY_FORM: FormData = { fullName: '', email: '', message: '' };
const FALLBACK_ERROR = 'Failed to send message. Please try again.';

function validateForm(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.fullName.trim()) errors.fullName = 'Full name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address';
    if (!data.message.trim()) errors.message = 'Message is required';
    return errors;
}

function toErrorMessage(e: unknown): string {
    if (!e) return FALLBACK_ERROR;
    if (typeof e === 'string') return e;
    if (e instanceof Error) return e.message;
    if (typeof e === 'object') {
        const obj = e as Record<string, unknown>;
        if (typeof obj.error === 'string') return obj.error;
        if (typeof obj.message === 'string') return obj.message;
        if (typeof obj.name === 'string') return obj.name;
    }
    return FALLBACK_ERROR;
}

const fieldBase = `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0A0A23] placeholder:text-[#9a9aa3]
    transition-colors focus:outline-none focus:ring-2 focus:ring-[#006400]/40`;
const fieldOk = 'border-[#0A0A23]/15 focus:border-[#006400]';
const fieldBad = 'border-[#dc2626] bg-[#fef2f2] focus:border-[#dc2626] focus:ring-[#dc2626]/30';
const labelClass = 'mb-1.5 block font-sans text-[13px] font-bold text-[#0A0A23]';
const errorTextClass = 'mt-1 text-xs font-bold text-[#b91c1c]';

/** Contact form: posts { name, email, message } to /api/contact. */
export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    // Server/network failures are form-level, kept apart from the per-field errors.
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateForm(formData);
        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        try {
            setIsSending(true);
            setErrors({});
            setSubmitError(null);

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (res.ok) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setFormData(EMPTY_FORM);
                    setIsSubmitted(false);
                }, 3000);
            } else {
                const err = await res.json().catch(() => ({}));
                setSubmitError(toErrorMessage(err));
            }
        } catch (err: unknown) {
            setSubmitError(toErrorMessage(err));
        } finally {
            setIsSending(false);
        }
    };

    if (isSubmitted) {
        return (
            <div role="status" className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-[#e6f6ec] px-4 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15803d] text-white">
                    <Check className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="font-sans text-xl font-extrabold text-[#0c6b33]">Message sent!</p>
                <p className="text-sm text-[#333333]">Thank you for reaching out. I&apos;ll get back to you soon!</p>
            </div>
        );
    }

    const inputField = (name: 'fullName' | 'email', label: string, type: string, placeholder: string, autoComplete: string) => (
        <div className="min-w-0">
            <label htmlFor={`contact-${name}`} className={labelClass}>
                {label}
            </label>
            <input
                id={`contact-${name}`}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                aria-invalid={Boolean(errors[name])}
                aria-describedby={errors[name] ? `contact-${name}-error` : undefined}
                className={`${fieldBase} ${errors[name] ? fieldBad : fieldOk}`}
            />
            {errors[name] && (
                <p id={`contact-${name}-error`} className={errorTextClass}>
                    {errors[name]}
                </p>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-3.5">
            {inputField('fullName', 'Full name', 'text', 'Your name', 'name')}
            {inputField('email', 'Email', 'email', 'you@company.com', 'email')}

            <div className="flex flex-1 flex-col">
                <label htmlFor="contact-message" className={labelClass}>
                    Message
                </label>
                <textarea
                    id="contact-message"
                    name="message"
                    rows={7}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What role or project do you have in mind?"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={`${fieldBase} flex-1 resize-none ${errors.message ? fieldBad : fieldOk}`}
                />
                {errors.message && (
                    <p id="contact-message-error" className={errorTextClass}>
                        {errors.message}
                    </p>
                )}
            </div>

            {submitError && (
                <div role="alert" className="flex gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-sm text-[#7f1d1d]">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                    <p>
                        <span className="font-sans font-bold">{submitError}</span> You can also email me directly at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold underline underline-offset-2">
                            {CONTACT_EMAIL}
                        </a>
                        .
                    </p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSending}
                aria-busy={isSending}
                className={`${primaryButtonClass} justify-center py-2.5 text-base disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0`}
            >
                {isSending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4" aria-hidden="true" /> Send message
                    </>
                )}
            </button>
        </form>
    );
}

/** One-click copy of the email address, announcing "Copied" to screen readers. */
export function CopyEmailButton() {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
        } catch {
            // Clipboard API unavailable or blocked: fall back to a temporary textarea copy.
            const textArea = document.createElement('textarea');
            textArea.value = CONTACT_EMAIL;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg border-2 border-white/70 px-3 py-1.5 font-sans text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#0A0A23]"
        >
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
        </button>
    );
}
