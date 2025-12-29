import useIsMobile from "../hooks/useIsMobile";

export default function HeaderPanel() {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? "8px" : "20px",
        left: isMobile ? "8px" : "20px",
        right: isMobile ? "8px" : "auto",
        background: "white",
        color: "#111",
        padding: isMobile ? "12px" : "16px 20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        zIndex: 2000,
        maxWidth: isMobile ? "unset" : "360px",
        fontSize: isMobile ? "13px" : "14px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: isMobile ? "16px" : "18px" }}>
        Women Safety Analytics – Chicago
      </h3>

      <p style={{ marginTop: "6px" }}>
        Identifying unsafe areas using crime hotspot detection
        and risk analysis based on Chicago crime data (2024–2025).
      </p>
    </div>
  );
}




