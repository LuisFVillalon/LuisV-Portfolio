"use client";

import React, { useMemo, useState } from "react";
import Navbar from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import Footer from "../components/Footer";
import { Github, Linkedin, Mail, User, MessageSquare, Copy, Check } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  message: string;
}
interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string | null;
}

const ContactForm: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({ fullName: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const isFormValid = useMemo(() => {
    const v = validateForm();
    return Object.keys(v).length === 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fullName, formData.email, formData.message]);

const toErrorMessage = (e: unknown): string => {
  if (!e) return "Failed to send message. Please try again.";

  if (typeof e === "string") return e;

  if (e instanceof Error) return e.message;

  if (typeof e === "object" && e !== null) {
    const obj = e as Record<string, unknown>;
    if (typeof obj.error === "string") return obj.error;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.name === "string") return obj.name;
  }

  try {
    return JSON.stringify(e);
  } catch {
    return "Unexpected error";
  }
};


const handleSubmit = async (): Promise<void> => {
  const newErrors = validateForm();
  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }

  try {
    setIsSending(true);
    setErrors({});

    const res = await fetch("/api/contact", {   // <-- make sure this matches your API route path
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        message: formData.message,
      }),
    });

    if (res.ok) {
      setIsSubmitted(true);
      setTimeout(() => {
        setFormData({ fullName: "", email: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } else {
      const err = await res.json().catch(() => ({}));
      setErrors({ message: toErrorMessage(err) });
    }
  } catch (e: unknown) {
    setErrors({ message: toErrorMessage(e) });
  } finally {
    setIsSending(false);
  }
};


  if (isSubmitted) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-2xl border-2 border-green-500 m-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-green-600 mb-2 dm-serif-text-regular">Message Sent!</h2>
          <p className="text-gray-600 md:text-2xl">Thank you for reaching out. I&apos;ll get back to you soon!</p>
        </div>
      </div>
    );
  }

  const handleCopyEmail = async (): Promise<void> => {
    const email = "lvillalon1179@sdsu.edu";
    try {
      setIsCopied(true);
      await navigator.clipboard.writeText(email);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border-2 border-gray-200 my-8">
      {/* Header Section with Contact Info */}
      <div className="text-center mb-8">
        <h1 className="dm-serif-text-regular text-4xl font-bold text-gray-800 mb-2">Get In Touch</h1>
        <p className="text-gray-600 mb-2 text-lg">I&apos;d love to hear how I can be of service. Send me a message!</p>

        {/* Contact Info Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="md:text-lg flex items-center justify-center gap-2 mb-3">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 hover:bg-gray-200 py-2 px-2 rounded-lg transition-colors duration-200 group"
              title={isCopied ? "Copied!" : "Click to copy email"}
            >
              {isCopied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-blue-600 group-hover:text-blue-800" />}
              <span
                className={`font-medium transition-colors duration-200 ${
                  isCopied ? "text-green-600" : "text-gray-800 group-hover:text-blue-800"
                }`}
              >
                lvillalon1179@sdsu.edu
              </span>
            </button>
          </div>
          <div className="md:text-lg flex items-center justify-center gap-8">
            <a
              href="https://github.com/LuisFVillalon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/luis-villalon/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="md:text-xl dm-serif-text-regular block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 md:h-5 md:w-5 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`md:text-base w-full text-[#333333] px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="md:text-lg dm-serif-text-regular block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="w-4 h-4 md:h-5 md:w-5 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`md:text-xl text-[#333333] w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
              errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="md:text-lg dm-serif-text-regular block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 md:h-5 md:w-5 inline mr-1" />
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            className={`md:text-xl text-[#333333] w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none ${
              errors.message ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
            }`}
            placeholder="Enter your message here..."
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Form-level error (if any) */}
        {errors.message && typeof errors.message === "string" && !formData.message && (
          <p className="text-red-600 text-sm">{errors.message}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSending || !isFormValid}
          aria-busy={isSending}
          className={`w-full text-2xl p-2 m-2 rounded-md text-white shadow-lg transition-all duration-150 border-b-4 border-r-2 dm-serif-text-regular
            ${isSending || !isFormValid
              ? "bg-gray-400 cursor-not-allowed border-gray-600"
              : "hover:shadow-xl hover:-translate-y-1 active:scale-95 active:shadow-md border-[#004d00] active:border-b-2 active:translate-y-1"
            }`
          }
          style={
            isSending || !isFormValid
              ? undefined
              : { background: 'linear-gradient(to right, #22c55e, #3b82f6)' }
          }
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>
      </div>
    </div>
  );
};

export default function Contact(): React.ReactElement {
  return (
    <div className="font-[Monospace] flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <Wrapper>
        <ContactForm />
      </Wrapper>
      <Footer />
    </div>
  );
}
