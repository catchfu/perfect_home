/**
 * Build Android APK via PWABuilder API (no SDK required).
 *
 * Usage:
 *   node scripts/build-apk.mjs                    # uses PERFECT_HOME_URL env or falls back to prompt
 *   PWA_URL=https://myapp.com node scripts/build-apk.mjs
 */

const PWA_URL = process.env.PWA_URL || process.env.PERFECT_HOME_URL

async function prompt(message) {
  const rl = await import("node:readline/promises")
  const i = rl.createInterface({ input: process.stdin, output: process.stdout })
  const answer = await i.question(message)
  i.close()
  return answer.trim()
}

async function main() {
  const url = PWA_URL || (await prompt("Enter your deployed PWA URL: "))
  if (!url) {
    console.error("Error: PWA URL is required")
    process.exit(1)
  }

  console.log(`\nBuilding APK for: ${url}`)
  console.log("Submitting to PWABuilder...\n")

  const buildRes = await fetch(
    `https://pwabuilder.com/api/v2/build?url=${encodeURIComponent(url)}`,
    { method: "POST" }
  )

  if (!buildRes.ok) {
    const text = await buildRes.text()
    throw new Error(`PWABuilder API error (${buildRes.status}): ${text}`)
  }

  const { id } = await buildRes.json()
  console.log(`Build started. ID: ${id}`)
  console.log("Waiting for completion...\n")

  for (let i = 1; i <= 30; i++) {
    await new Promise((r) => setTimeout(r, 5000))

    const statusRes = await fetch(`https://pwabuilder.com/api/v2/build/${id}`)
    const result = await statusRes.json()

    process.stdout.write(`  [${i}/30] ${result.status}\r`)

    if (result.status === "COMPLETE") {
      console.log("\n\nBuild complete! Downloading APK...")

      const apkRes = await fetch(`https://pwabuilder.com/api/v2/build/${id}/apk`)
      if (!apkRes.ok) throw new Error("Failed to download APK")

      const fs = await import("node:fs")
      const buffer = Buffer.from(await apkRes.arrayBuffer())
      const filename = `perfect-home-${Date.now()}.apk`
      fs.writeFileSync(filename, buffer)

      console.log(`✓ APK saved: ${filename}`)
      console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`)
      return
    }

    if (result.status === "FAILED") {
      console.log(`\n✗ Build failed: ${result.errorMessage || "Unknown error"}`)
      process.exit(1)
    }
  }

  console.log("\n✗ Build timed out (5 min)")
  process.exit(1)
}

main().catch((err) => {
  console.error(`\n✗ Error: ${err.message}`)
  process.exit(1)
})
