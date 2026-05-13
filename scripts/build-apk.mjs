/**
 * Build Android APK via PWABuilder CloudAPK service (no SDK required).
 *
 * Usage:
 *   node scripts/build-apk.mjs
 *   PWA_URL=https://perfect-home-chi.vercel.app node scripts/build-apk.mjs
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
  const url = (PWA_URL || (await prompt("Enter your deployed PWA URL: "))).replace(/\/+$/, "")
  if (!url) {
    console.error("Error: PWA URL is required")
    process.exit(1)
  }

  const manifestUrl = `${url}/manifest.webmanifest`
  console.log(`\nFetching manifest from: ${manifestUrl}`)

  const manifestRes = await fetch(manifestUrl)
  if (!manifestRes.ok) {
    throw new Error(`Cannot fetch manifest (${manifestRes.status}). Is your PWA deployed?`)
  }
  const manifest = await manifestRes.json()

  const payload = {
    url: manifestUrl,
    host: url,
    name: manifest.name || "Perfect Home",
    shortName: manifest.short_name || "Perfect Home",
    appPackage: "com.perfecthome.app",
    appVersion: "1.0.0.0",
    appVersionCode: 1,
    backgroundColor: manifest.background_color || "#F5F0EB",
    themeColor: manifest.theme_color || "#2C4A5A",
    navigationColor: manifest.theme_color || "#2C4A5A",
    splashScreenBackgroundColor: manifest.background_color || "#F5F0EB",
    display: manifest.display || "standalone",
    orientation: manifest.orientation || "portrait",
    iconUrl: `${url}/icons/icon-512.png`,
    maskableIconUrl: `${url}/icons/icon-512.png`,
    launchUrl: "/",
    signingMode: "unsigned",
    fallbackType: "customtab",
    isFullScopeUrl: true,
    isPackageIdOk: true,
    includeSourceApp: true,
    features: {},
    additionalTrustedOrigins: [],
  }

  console.log(`\nSubmitting to CloudAPK for: ${manifest.name}`)
  console.log("This takes 1-2 minutes...\n")

  const buildRes = await fetch("https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!buildRes.ok) {
    const text = await buildRes.text()
    throw new Error(`CloudAPK error (${buildRes.status}): ${text}`)
  }

  const result = await buildRes.json()
  const downloadUrl = result.downloadUrl || result.zipUrl

  if (!downloadUrl) {
    console.error("Unexpected response:", JSON.stringify(result, null, 2))
    throw new Error("No download URL in response")
  }

  console.log(`Downloading from: ${downloadUrl}`)

  const apkRes = await fetch(downloadUrl)
  if (!apkRes.ok) throw new Error("Failed to download APK package")

  const fs = await import("node:fs")
  const buffer = Buffer.from(await apkRes.arrayBuffer())
  const filename = `perfect-home-${Date.now()}.zip`
  fs.writeFileSync(filename, buffer)

  console.log(`\n✓ Saved: ${filename}`)
  console.log(`  Size: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`)
  console.log("\nThe zip contains both .apk (testing) and .aab (Play Store).")
}

main().catch((err) => {
  console.error(`\n✗ Error: ${err.message}`)
  process.exit(1)
})
