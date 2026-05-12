import { ImageResponse } from "@vercel/og"

export const runtime = "edge"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

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
            marginBottom: "32px",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#2C4A5A">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span style={{ fontSize: "28px", color: "#2C4A5A", fontFamily: "serif" }}>
            Perfect Home
          </span>
        </div>
        <h1
          style={{
            fontSize: "48px",
            fontWeight: 600,
            color: "#2C2C2C",
            textAlign: "center",
            lineHeight: 1.3,
            margin: "0 0 24px",
            fontFamily: "serif",
          }}
        >
          Floor Plan Diagnosis Report
        </h1>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["Entrance", "Flow", "Rooms", "Lighting", "Storage"].map(
            (tag) => (
              <span
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: "999px",
                  background: "#2C4A5A",
                  color: "#F5F0EB",
                  fontSize: "18px",
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
        <p
          style={{
            fontSize: "20px",
            color: "#6B6B6B",
            textAlign: "center",
            marginTop: "32px",
          }}
        >
          AI-powered issue diagnosis · Priorities · Actionable fixes
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#8B8B8B",
            marginTop: "24px",
          }}
        >
          perfecthome.app/report/{id.slice(0, 8)}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
