import { Layers } from "lucide-react";

/**
 * Branded wordmark shown in the Studio top-left, replacing the default
 * project-title text. Purely cosmetic.
 */
export function StudioLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, lineHeight: 1 }}>
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(135deg, #1A7A9B, #136280)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Layers size={16} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: -0.2 }}>Clever Accounts</span>
        <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.55, textTransform: "uppercase", letterSpacing: 0.6 }}>
          Content Studio
        </span>
      </span>
    </div>
  );
}
