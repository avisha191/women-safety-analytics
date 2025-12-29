import { useState } from "react";
import useIsMobile from "../hooks/useIsMobile";

export default function InfoPanel() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "10px" : "90px",
        left: isMobile ? "10px" : "auto",
        right: "10px",
        background: "white",
        color:"#111",
        padding: "12px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 2000,
        width: isMobile ? "calc(100% - 20px)" : "260px",
        fontSize: "14px",
      }}
    >
      {isMobile && (
        <div
          onClick={() => setOpen(!open)}
          style={{
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: open ? "8px" : "0",
          }}
        >
          Risk Interpretation {open ? "▲" : "▼"}
        </div>
      )}

      {open && (
        <>
          {!isMobile && <b>Risk Interpretation</b>}
          <p style={{ marginTop: "6px" }}>
            Red areas indicate high crime density.
            Orange areas show moderate risk.
            Green areas are relatively safer.
          </p>
        </>
      )}
    </div>
  );
}





