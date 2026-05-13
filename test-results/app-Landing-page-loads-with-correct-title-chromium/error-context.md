# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Landing page >> loads with correct title
- Location: e2e\app.spec.ts:4:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test"
  2   | 
  3   | test.describe("Landing page", () => {
  4   |   test("loads with correct title", async ({ page }) => {
> 5   |     await page.goto("/")
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  6   |     await expect(page).toHaveTitle(/Perfect Home/)
  7   |   })
  8   | 
  9   |   test("shows hero section with CTA button", async ({ page }) => {
  10  |     await page.goto("/")
  11  |     await expect(page.locator("h1")).toContainText("Floor Plan")
  12  |     const cta = page.getByRole("link", { name: /Analyze Your Floor Plan/i })
  13  |     await expect(cta).toBeVisible()
  14  |   })
  15  | 
  16  |   test("shows how it works section", async ({ page }) => {
  17  |     await page.goto("/")
  18  |     await expect(page.getByText(/Upload Floor Plan/)).toBeVisible()
  19  |     await expect(page.getByText(/AI Deep Diagnosis/)).toBeVisible()
  20  |     await expect(page.getByText(/Get Your Report/)).toBeVisible()
  21  |   })
  22  | 
  23  |   test("shows sample reports", async ({ page }) => {
  24  |     await page.goto("/")
  25  |     await expect(page.getByText(/Sample Reports/)).toBeVisible()
  26  |     const images = page.locator("img[alt^='Sample report']")
  27  |     await expect(images).toHaveCount(3)
  28  |   })
  29  | 
  30  |   test("language toggle switches to Chinese", async ({ page }) => {
  31  |     await page.goto("/")
  32  |     await page.getByText("中文").click()
  33  |     await expect(page.getByText("诊断你的户型")).toBeVisible()
  34  |   })
  35  | })
  36  | 
  37  | test.describe("Navigation", () => {
  38  |   test("navigates to analyze page", async ({ page }) => {
  39  |     await page.goto("/")
  40  |     await page.getByRole("link", { name: /Analyze/i }).first().click()
  41  |     await expect(page).toHaveURL("/analyze")
  42  |     await expect(page.locator("h1")).toContainText("Analyze")
  43  |   })
  44  | 
  45  |   test("navigates to pricing page", async ({ page }) => {
  46  |     await page.goto("/")
  47  |     await page.getByRole("link", { name: /Pricing/i }).first().click()
  48  |     await expect(page).toHaveURL("/pricing")
  49  |     await expect(page.getByText("Free")).toBeVisible()
  50  |   })
  51  | 
  52  |   test("navigates to how it works", async ({ page }) => {
  53  |     await page.goto("/")
  54  |     await page.getByRole("link", { name: /How It Works/i }).first().click()
  55  |     await expect(page).toHaveURL("/how-it-works")
  56  |     await expect(page.getByText("Step 1")).toBeVisible()
  57  |   })
  58  | })
  59  | 
  60  | test.describe("Analyze page", () => {
  61  |   test("shows upload area", async ({ page }) => {
  62  |     await page.goto("/analyze")
  63  |     await expect(page.getByText(/Upload Floor Plan/)).toBeVisible()
  64  |   })
  65  | 
  66  |   test("shows context form after selecting file", async ({ page }) => {
  67  |     await page.goto("/analyze")
  68  |     const fileChooserPromise = page.waitForEvent("filechooser")
  69  |     await page.getByText(/Upload Floor Plan/).click()
  70  |     const fileChooser = await fileChooserPromise
  71  |     await fileChooser.setFiles({
  72  |       name: "test.jpg",
  73  |       mimeType: "image/jpeg",
  74  |       buffer: Buffer.from("fake-image-data"),
  75  |     })
  76  |     await expect(page.getByText(/Door Direction/)).toBeVisible()
  77  |     await expect(page.getByText(/Start Diagnosis/)).toBeVisible()
  78  |   })
  79  | })
  80  | 
  81  | test.describe("Pricing page", () => {
  82  |   test("shows all plan tiers", async ({ page }) => {
  83  |     await page.goto("/pricing")
  84  |     await expect(page.getByText("Free")).toBeVisible()
  85  |     await expect(page.getByText("Pro Monthly")).toBeVisible()
  86  |     await expect(page.getByText("Extra Credits")).toBeVisible()
  87  |   })
  88  | })
  89  | 
  90  | test.describe("Auth page", () => {
  91  |   test("shows sign in options", async ({ page }) => {
  92  |     await page.goto("/auth/signin")
  93  |     await expect(page.getByText(/Google/)).toBeVisible()
  94  |     await expect(page.getByText(/GitHub/)).toBeVisible()
  95  |   })
  96  | })
  97  | 
  98  | test.describe("Dashboard", () => {
  99  |   test("redirects to sign in when not authenticated", async ({ page }) => {
  100 |     await page.goto("/dashboard")
  101 |     await expect(page).toHaveURL(/\/auth\/signin/)
  102 |   })
  103 | })
  104 | 
```