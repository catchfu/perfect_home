import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test("loads with correct title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Perfect Home/)
  })

  test("shows hero section with CTA button", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Floor Plan")
    const cta = page.getByRole("link", { name: /Analyze Your Floor Plan/i })
    await expect(cta).toBeVisible()
  })

  test("shows how it works section", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText(/Upload Floor Plan/)).toBeVisible()
    await expect(page.getByText(/AI Deep Diagnosis/)).toBeVisible()
    await expect(page.getByText(/Get Your Report/)).toBeVisible()
  })

  test("shows sample reports", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "Sample Reports" })).toBeVisible()
    const images = page.locator("img[alt^='Sample report']")
    await expect(images).toHaveCount(3)
  })

  test("language toggle switches to Chinese", async ({ page }) => {
    await page.goto("/")
    await page.getByText("中文").click()
    await expect(page.getByRole("button", { name: "诊断你的户型" }).first()).toBeVisible()
  })
})

test.describe("Navigation", () => {
  test("navigates to analyze page", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /Analyze/i }).first().click()
    await expect(page).toHaveURL("/analyze")
    await expect(page.locator("h1")).toContainText("Analyze")
  })

  test("navigates to pricing page", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /Pricing/i }).first().click()
    await expect(page).toHaveURL("/pricing")
    await expect(page.getByRole("heading", { name: "Free" })).toBeVisible()
  })

  test("navigates to how it works", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("link", { name: /How It Works/i }).first().click()
    await expect(page).toHaveURL("/how-it-works")
    await expect(page.getByText("Step 1")).toBeVisible()
  })
})

test.describe("Analyze page", () => {
  test("shows upload area", async ({ page }) => {
    await page.goto("/analyze")
    await expect(page.getByText(/Upload Floor Plan/)).toBeVisible()
  })

  test("shows context form after selecting file", async ({ page }) => {
    await page.goto("/analyze")
    const fileChooserPromise = page.waitForEvent("filechooser")
    await page.getByText(/Upload Floor Plan/).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles({
      name: "test.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("fake-image-data"),
    })
    await expect(page.getByText(/Door Direction/)).toBeVisible()
    await expect(page.getByText(/Start Diagnosis/)).toBeVisible()
  })
})

test.describe("Pricing page", () => {
  test("shows all plan tiers", async ({ page }) => {
    await page.goto("/pricing")
    await expect(page.getByRole("heading", { name: "Free" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "10 Extra Credits" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "30 Extra Credits" })).toBeVisible()
  })
})

test.describe("Auth page", () => {
  test("shows sign in options", async ({ page }) => {
    await page.goto("/auth/signin")
    await expect(page.getByText(/Google/)).toBeVisible()
    await expect(page.getByText(/GitHub/)).toBeVisible()
  })
})

test.describe("Dashboard", () => {
  test("redirects to sign in when not authenticated", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/auth\/signin/)
  })
})
