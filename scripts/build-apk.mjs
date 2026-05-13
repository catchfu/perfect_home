/**
 * Generate Android APK via PWABuilder API
 * No Android SDK or Java required.
 *
 * Usage: node scripts/build-apk.mjs
 *
 * Prerequisites:
 * - Your PWA must be deployed (update PWA_URL below)
 * - Must have a valid manifest.webmanifest
 */

const PWA_URL = process.env.PWA_URL || "https://perfecthome.app"

async function buildApk() {
  console.log(`Building APK for PWA at: ${PWA_URL}`)

  // Step 1: Request APK build from PWABuilder
  const buildRes = await fetch(
    `https://pwabuilder.com/api/v2/build?url=${encodeURIComponent(PWA_URL)}`,
    { method: "POST" }
  )

  if (!buildRes.ok) {
    const text = await buildRes.text()
    throw new Error(`PWABuilder API error: ${buildRes.status} ${text}`)
  }

  const { id, status } = await buildRes.json()
  console.log(`Build started. ID: ${id}, Status: ${status}`)

  // Step 2: Poll for completion
  let attempts = 0
  const maxAttempts = 30
  while (attempts < maxAttempts) {
    await new Promise((r) => setTimeout(r, 5000))
    attempts++

    const statusRes = await fetch(
      `https://pwabuilder.com/api/v2/build/${id}`
    )
    const result = await statusRes.json()

    console.log(`  Attempt ${attempts}/${maxAttempts}: ${result.status}`)

    if (result.status === "COMPLETE") {
      // Step 3: Download the APK
      const apkRes = await fetch(
        `https://pwabuilder.com/api/v2/build/${id}/apk`
      )
      if (!apkRes.ok) throw new Error("Failed to download APK")

      const fs = await import("fs")
      const buffer = Buffer.from(await apkRes.arrayBuffer())
      const filename = `perfect-home-${Date.now()}.apk`
      fs.writeFileSync(filename, buffer)
      console.log(`\nAPK saved: ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`)
      return
    }

    if (result.status === "FAILED") {
      throw new Error(`Build failed: ${result.errorMessage || "Unknown error"}`)
    }
  }

  throw new Error("Build timed out")
}

buildApk().catch((err) => {
  console.error("APK build failed:", err.message)
  process.exit(1)
})
