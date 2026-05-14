/**
 * Build Android APK via PWABuilder CloudAPK API.
 * No Java, Android SDK, or Bubblewrap needed.
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
  if (!url) throw new Error("PWA URL is required")

  console.log(`\nFetching manifest from: ${url}/manifest.webmanifest`)
  const manifestRes = await fetch(`${url}/manifest.webmanifest`)
  if (!manifestRes.ok) throw new Error(`Cannot fetch manifest (${manifestRes.status})`)
  const m = await manifestRes.json()

  const payload = {
    packageId: "com.perfecthome.app",
    host: url,
    pwaUrl: url,
    name: m.name || "Perfect Home",
    launcherName: m.short_name || "Perfect Home",
    appVersion: "1.0.0.0",
    appVersionCode: 1,
    backgroundColor: m.background_color || "#F5F0EB",
    themeColor: m.theme_color || "#2C4A5A",
    navigationColor: m.theme_color || "#2C4A5A",
    splashScreenFadeOutDuration: 300,
    display: m.display || "standalone",
    orientation: m.orientation || "portrait",
    startUrl: "/",
    iconUrl: `${url}/icons/icon-512.png`,
    maskableIconUrl: `${url}/icons/icon-512.png`,
    webManifestUrl: `${url}/manifest.webmanifest`,
    fallbackType: "customtabs",
    signingMode: "none",
    includeSourceCode: true,
    enableNotifications: false,
    features: {},
  }

  console.log(`\nBuilding APK for: ${m.name}`)
  console.log("Submitting to PWABuilder CloudAPK...\n")

  const res = await fetch("https://pwabuilder-cloudapk.azurewebsites.net/generateAppPackage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`CloudAPK error (${res.status}): ${text}`)
  }

  const fs = await import("node:fs")
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = `perfect-home-${Date.now()}.zip`
  fs.writeFileSync(filename, buffer)

  console.log(`✓ Saved: ${filename} (${(buffer.length / 1024 / 1024).toFixed(1)} MB)`)
  console.log("  Extract with: unzip", filename, "-d output/")
  console.log("  Contains: .apk (testing), .aab (Play Store), Readme.html")
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`)
  process.exit(1)
})
