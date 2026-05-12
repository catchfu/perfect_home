import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F5F0EB",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#2C4A5A">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={{ fontSize: "36px", color: "#2C4A5A", fontFamily: "serif" }}>
            Perfect Home
          </span>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#2C2C2C",
            textAlign: "center",
            lineHeight: 1.2,
            margin: "0 0 16px",
            fontFamily: "serif",
          }}
        >
          Honest Floor Plan
          <br />
          Diagnostics
        </h1>
        <p
          style={{
            fontSize: "24px",
            color: "#6B6B6B",
            textAlign: "center",
            margin: 0,
          }}
        >
          AI-powered analysis. Problems only. No fluff.
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
