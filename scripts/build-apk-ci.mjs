#!/usr/bin/env node
/**
 * Build Android APK non-interactively using Bubblewrap's programmatic API.
 * Usage: node build-apk-ci.mjs <pwa-url> <output-dir>
 */
import { execSync } from "child_process"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

const PWA_URL = process.argv[2] || "https://perfect-home-chi.vercel.app"
const OUTPUT_DIR = process.argv[3] || "android-build"

async function main() {
  console.log(`Building APK for: ${PWA_URL}`)

  // 1. Fetch manifest
  const manifestRes = await fetch(`${PWA_URL}/manifest.webmanifest`)
  const manifest = await manifestRes.json()

  const appName = manifest.name || "Perfect Home"
  const shortName = manifest.short_name || "Perfect Home"
  const bgColor = manifest.background_color || "#F5F0EB"
  const themeColor = manifest.theme_color || "#2C4A5A"

  mkdirSync(OUTPUT_DIR, { recursive: true })

  // 2. Create twa-manifest.json manually (skip bubblewrap init entirely)
  const twaManifest = {
    packageId: "com.perfecthome.app",
    host: PWA_URL,
    name: appName,
    shortName,
    launchUrl: "/",
    themeColor,
    backgroundColor: bgColor,
    display: "standalone",
    orientation: "portrait",
    startUrl: "/",
    iconUrl: `${PWA_URL}/icons/icon-512.png`,
    maskableIconUrl: `${PWA_URL}/icons/icon-512.png`,
    appVersion: "1.0.0",
    appVersionCode: 1,
    signing: {
      keyAlias: "perfecthome",
      keyPassword: "perfecthome",
      storePassword: "perfecthome",
    },
  }

  writeFileSync(join(OUTPUT_DIR, "twa-manifest.json"), JSON.stringify(twaManifest, null, 2))
  console.log("✓ twa-manifest.json created")

  // 3. Generate keystore
  if (!existsSync(join(OUTPUT_DIR, "perfecthome.keystore"))) {
    execSync(
      `keytool -genkey -v -keystore ${OUTPUT_DIR}/perfecthome.keystore ` +
      `-alias perfecthome -keyalg RSA -keysize 2048 -validity 10000 ` +
      `-storepass perfecthome -keypass perfecthome ` +
      `-dname "CN=Perfect Home, OU=Dev, O=Perfect Home, L=City, S=State, C=US"`,
      { stdio: "inherit" }
    )
    console.log("✓ Keystore generated")
  }

  // 4. Set up Bubblewrap project from twa-manifest
  console.log("\n--- Running bubblewrap init (programmatic) ---")
  execSync(
    `npx --yes @bubblewrap/cli init ` +
    `--manifest "${PWA_URL}/manifest.webmanifest" ` +
    `--directory "${OUTPUT_DIR}" ` +
    `--noJdk --noAndroidSdk`,  // Skip SDK management (we use installed ones)
    { stdio: "inherit", env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME || process.env.JAVA_HOME_17_X64 } }
  )

  // 5. Build
  console.log("\n--- Building APK ---")
  execSync(
    `npx @bubblewrap/cli build --directory "${OUTPUT_DIR}"`,
    { stdio: "inherit", env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME || process.env.JAVA_HOME_17_X64 } }
  )

  // 6. Show output
  console.log("\n--- Output ---")
  execSync(`find "${OUTPUT_DIR}" -type f \\( -name "*.apk" -o -name "*.aab" \\)`, { stdio: "inherit" })
}

main().catch((err) => {
  console.error("Build failed:", err.message)
  process.exit(1)
})
