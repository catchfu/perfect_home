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
    orientation: "portrait-primary",
    categories: ["lifestyle", "tools", "home"],
    screenshots: [
      {
        src: "/sample1.jpg",
        sizes: "1170x832",
        type: "image/jpeg",
        form_factor: "wide",
      },
      {
        src: "/sample2.jpg",
        sizes: "1170x832",
        type: "image/jpeg",
        form_factor: "wide",
      },
      {
        src: "/sample3.jpg",
        sizes: "1170x832",
        type: "image/jpeg",
        form_factor: "narrow",
      },
      {
        src: "/sample4.jpg",
        sizes: "1170x832",
        type: "image/jpeg",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "New Analysis",
        short_name: "Analyze",
        description: "Upload a floor plan for diagnosis",
        url: "/analyze",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "My Reports",
        short_name: "Reports",
        description: "View your diagnosis history",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
