import useIsMobile from "../hooks/useIsMobile";

export default function RiskLegend() {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "70px" : "20px",
        left: "20px",
        right: isMobile ? "20px" : "auto",
        background: "white",
        color:"#111",
        padding: "10px 14px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        zIndex: 1500,
        fontSize: "13px",
        display: "flex",
        justifyContent: isMobile ? "space-around" : "block",
        gap: "10px",
      }}
    >
      {!isMobile && <b>Risk Levels</b>}

      {[
        { color: "red", label: "High" },
        { color: "orange", label: "Medium" },
        { color: "green", label: "Low" },
      ].map((r) => (
        <div
          key={r.label}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              background: r.color,
              borderRadius: "50%",
            }}
          />
          {r.label}
        </div>
      ))}
    </div>
  );
}



