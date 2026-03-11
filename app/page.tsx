import { SurveyCard } from "@/components/survey/survey-card"
import { VSLSection } from "@/components/survey/vsl-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import config from "@/lib/config"

export default function HomePage() {
  const stats = [
    { value: config.stat1Value, label: config.stat1Label },
    { value: config.stat2Value, label: config.stat2Label },
    { value: config.stat3Value, label: config.stat3Label },
  ]

  return (
    <main className="relative min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Header
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          logoUrl={config.logoUrl}
        />

        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6 lg:px-8">
          {/* Hero */}
          <div className="mx-auto text-center">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-[2.75rem] lg:leading-tight text-balance">
              {config.headline}
            </h1>
            <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-600">
              {config.subheadline}
            </p>

            {/* Trust indicators */}
            <div className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                    <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                    <strong>{stat.value}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Form */}
          <div className="mt-4 md:mt-6 mx-auto max-w-3xl">
            <SurveyCard phoneDisplay={config.phoneDisplay} phoneHref={config.phoneHref} />
          </div>

          {/* VSL (conditional on env vars) */}
          <div className="mt-6 md:mt-8 mx-auto max-w-4xl">
            <VSLSection />
          </div>
        </div>

        <Footer
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          privacyPolicyUrl={config.privacyPolicyUrl}
          termsUrl={config.termsUrl}
        />
      </div>
    </main>
  )
}
