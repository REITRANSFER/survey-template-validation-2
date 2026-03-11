"use client"

import { useEffect } from "react"
import { CheckCircle2, Phone } from "lucide-react"

const PHONE_DISPLAY = process.env.NEXT_PUBLIC_PHONE_DISPLAY || "(800) 000-0000"
const PHONE_HREF = process.env.NEXT_PUBLIC_PHONE_HREF || "8000000000"
const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Home Buyers"

export default function ThankYouPage() {
  useEffect(() => {
    // Fire Facebook Lead event
    try {
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead")
      }
    } catch {
      // Pixel not loaded
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Thank You!
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-lg">
          We&apos;ve received your information and will be in touch within{" "}
          <strong>24 hours</strong> with your cash offer.
        </p>

        <p className="mt-2 text-gray-500">
          Have questions in the meantime? Give us a call.
        </p>

        <a
          href={`tel:${PHONE_HREF}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Phone className="h-5 w-5" />
          {PHONE_DISPLAY}
        </a>

        <p className="mt-12 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </p>
      </div>
    </main>
  )
}
