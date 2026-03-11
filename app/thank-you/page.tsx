import { CheckCircle2, Phone } from "lucide-react"
import config from "@/lib/config"

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fire Facebook Lead event on client */}
      <script dangerouslySetInnerHTML={{
        __html: `try { if (window.fbq) window.fbq('track', 'Lead'); } catch(e) {}`
      }} />

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
          href={`tel:${config.phoneHref}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Phone className="h-5 w-5" />
          {config.phoneDisplay}
        </a>

        <p className="mt-12 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
        </p>
      </div>
    </main>
  )
}
