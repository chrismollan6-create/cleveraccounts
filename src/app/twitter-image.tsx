import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Clever Accounts - Expert Online Accounting Services UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 68,
            fontWeight: 700,
            marginBottom: 20,
            letterSpacing: "-1px",
          }}
        >
          Clever Accounts
        </div>
        <div
          style={{
            color: "#bfdbfe",
            fontSize: 30,
            marginBottom: 32,
          }}
        >
          Online Accounting Made Clever
        </div>
        <div
          style={{
            color: "#93c5fd",
            fontSize: 22,
            display: "flex",
            gap: "32px",
          }}
        >
          <span>From £42.50/month</span>
          <span>·</span>
          <span>10,000+ businesses</span>
          <span>·</span>
          <span>20 years experience</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
