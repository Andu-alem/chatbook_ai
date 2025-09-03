import type { Route } from "./+types/home"
import { FeaturesSection } from "~/components/features-section"
import { CTASection } from "~/components/cta-section"
import { FooterSection } from "~/components/footer-section"
import { Header } from "~/components/landing-header"
import { HeroSection } from "~/components/hero-section"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TalkBookAI - Home" },
    {
      name: "description",
      content:
        "TalkBookAI lets you chat with your books. Ask questions, get summaries, and explore your library with AI-powered conversations.",
    },
  ]
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
