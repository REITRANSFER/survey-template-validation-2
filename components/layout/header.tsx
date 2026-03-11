import { Phone } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  companyName: string
  phoneDisplay: string
  phoneHref: string
  logoUrl: string
}

export function Header({ companyName, phoneDisplay, phoneHref, logoUrl }: HeaderProps) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo / Company Name */}
        <div className="flex items-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
              width={160}
              height={40}
              className="h-10 w-auto"
              unoptimized
            />
          ) : (
            <span className="text-lg font-bold text-[var(--accent)]">
              {companyName}
            </span>
          )}
        </div>

        {/* Phone CTA */}
        <a
          href={`tel:${phoneHref}`}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{phoneDisplay}</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </div>
    </header>
  )
}
