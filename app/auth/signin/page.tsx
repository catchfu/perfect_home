"use client"

import { signIn } from "next-auth/react"
import { useLocale } from "@/hooks/use-localization"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SignInPage() {
  const { locale } = useLocale()
  const isEn = locale === "en"

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20">
      <Card className="w-full">
        <h1 className="mb-2 font-serif text-2xl font-medium">
          {isEn ? "Welcome" : "欢迎"}
        </h1>
        <p className="mb-8 text-sm text-[#6B6B6B]">
          {isEn
            ? "Sign in to save your reports and manage your account."
            : "登录以保存报告和管理账户。"}
        </p>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            {isEn ? "Continue with Google" : "使用 Google 登录"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            {isEn ? "Continue with GitHub" : "使用 GitHub 登录"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
