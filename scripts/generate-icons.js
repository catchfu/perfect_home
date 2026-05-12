const sharp = require("sharp")
const path = require("path")
const fs = require("fs")

const dir = path.join(__dirname, "..", "public", "icons")
fs.mkdirSync(dir, { recursive: true })

const sizes = [192, 512]

async function main() {
  for (const s of sizes) {
    const svg = `<svg width="${s}" height="${s}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#2C4A5A"/>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" fill="white" stroke="white" stroke-width="0.5"/>
    </svg>`

    await sharp(Buffer.from(svg)).resize(s, s).png().toFile(path.join(dir, `icon-${s}.png`))
    console.log("Generated icon-" + s + ".png")
  }
}

main().catch(console.error)
