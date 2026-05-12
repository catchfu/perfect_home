"use client"

import Link from "next/link"
import { useLocale } from "@/hooks/use-localization"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageTransition, FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/animations"
import { ArrowRight, Upload, Search, FileText, Home } from "lucide-react"

export default function LandingPage() {
  const { t, locale } = useLocale()

  return (
    <PageTransition>
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4CEC4] bg-[#EDE8E1] px-4 py-1.5 text-xs text-[#6B6B6B]">
                <Home className="h-3 w-3" />
                {locale === "en" ? "AI-Powered Home Diagnostics" : "AI 户型诊断"}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero.title")}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-6 text-lg leading-relaxed text-[#6B6B6B] sm:text-xl">
                {t("hero.subtitle")}
              </p>
            </FadeIn>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/analyze">
                <Button size="lg">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#samples">
                <Button variant="outline" size="lg">
                  {t("hero.sample")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4CEC4] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl tracking-tight">
            {t("howItWorks.title")}
          </h2>
          <StaggerContainer className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: t("howItWorks.step1"),
                desc: t("howItWorks.step1desc"),
              },
              {
                icon: Search,
                title: t("howItWorks.step2"),
                desc: t("howItWorks.step2desc"),
              },
              {
                icon: FileText,
                title: t("howItWorks.step3"),
                desc: t("howItWorks.step3desc"),
              },
            ].map((step, i) => (
              <StaggerItem key={i}>
                <HoverCard>
                  <Card className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2C4A5A]/10">
                      <step.icon className="h-6 w-6 text-[#2C4A5A]" />
                    </div>
                    <h3 className="font-serif text-lg font-medium">{step.title}</h3>
                    <p className="mt-2 text-sm text-[#6B6B6B]">{step.desc}</p>
                  </Card>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section id="samples" className="border-t border-[#D4CEC4] bg-[#EDE8E1] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-serif text-3xl tracking-tight">
            {locale === "en" ? "Sample Reports" : "样例报告"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#6B6B6B]">
            {locale === "en"
              ? "Real diagnoses showing problems, causal chains, and actionable fixes."
              : "真实诊断案例，展示问题、因果链和可操作的改进方案。"}
          </p>
          <StaggerContainer className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <StaggerItem key={i}>
                <HoverCard>
                  <div className="group relative overflow-hidden rounded-lg border border-[#D4CEC4] bg-[#F5F0EB]">
                    <div className="aspect-[4/3] bg-[#EDE8E1] flex items-center justify-center">
                      <img
                        src={`/sample${i}.jpg`}
                        alt={`Sample report ${i}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-8 text-center">
            <Link href="/how-it-works">
              <Button variant="outline">
                {locale === "en" ? "See more examples" : "查看更多"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl tracking-tight">
              {locale === "en"
                ? "Ready to see what your floor plan is hiding?"
                : "准备好看看你家户型隐藏的问题了吗？"}
            </h2>
            <p className="mt-4 text-[#6B6B6B]">
              {locale === "en"
                ? "Upload your floor plan and get an honest, AI-powered diagnosis in minutes."
                : "上传户型图，几分钟内获取诚实的 AI 诊断报告。"}
            </p>
            <Link href="/analyze" className="mt-8 inline-block">
              <Button size="lg">
                {t("hero.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  )
}
