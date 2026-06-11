import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { BRANDS } from "@/lib/constants";
import { brandIdFromHost } from "@/lib/brand-host";

export const runtime = "edge";
export const alt = "Expert Online Accounting Services UK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const host = (await headers()).get("host") || "";
  const brand = BRANDS[brandIdFromHost(host)];
  const isClever = brand.id === "clever";

  const background = isClever
    ? "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)"
    : "linear-gradient(135deg, #1a2426 0%, #0f1a1c 100%)";
  const accent = isClever ? "#bfdbfe" : "#9cbf50";
  const sub = isClever ? "#93c5fd" : "#71c5d6";
  const stats = isClever
    ? ["From £42.50/month", "10,000+ businesses", "20 years experience"]
    : ["From £42.50/month", "Dedicated accountant", "Unlimited advice"];

  return new ImageResponse(
    (
      <div
        style={{
          background,
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
        <div style={{ color: "white", fontSize: 68, fontWeight: 700, marginBottom: 20, letterSpacing: "-1px" }}>
          {brand.name}
        </div>
        <div style={{ color: accent, fontSize: 30, marginBottom: 32 }}>{brand.tagline}</div>
        <div style={{ color: sub, fontSize: 22, display: "flex", gap: "32px" }}>
          <span>{stats[0]}</span>
          <span>·</span>
          <span>{stats[1]}</span>
          <span>·</span>
          <span>{stats[2]}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
