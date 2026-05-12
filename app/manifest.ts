import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Perfect Home — Floor Plan Diagnostics",
    short_name: "Perfect Home",
    description: "AI-powered home layout diagnosis that exposes problems — not sugar-coats them.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0EB",
    theme_color: "#2C4A5A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
