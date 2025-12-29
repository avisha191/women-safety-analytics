import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet.heat";
import L from "leaflet";

import RiskLegend from "../components/RiskLegend";
import HeaderPanel from "../components/HeaderPanel";
import InfoPanel from "../components/InfoPanel";

/* ---------------- API BASE URL ---------------- */
const API_BASE = import.meta.env.VITE_API_URL;

/* ---------------- Fix Map Resize (IMPORTANT) ---------------- */
function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    // initial fix after mount
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

/* ---------------- Close Popups on Map Click ---------------- */
function ClosePopupsOnMapClick() {
  const map = useMap();

  useEffect(() => {
    const close = () => map.closePopup();
    map.on("click", close);
    return () => map.off("click", close);
  }, [map]);

  return null;
}

/* ---------------- Zoom to Active Cluster ---------------- */
function ZoomToCluster({ cluster }) {
  const map = useMap();

  useEffect(() => {
    if (!cluster) return;

    map.flyTo([cluster.Latitude, cluster.Longitude], 14, {
      duration: 0.8,
    });
  }, [cluster, map]);

  return null;
}

/* ---------------- Heatmap Layer ---------------- */
function HeatmapLayer({ points, show }) {
  const map = useMap();

  useEffect(() => {
    if (!show || points.length === 0) return;

    const heatPoints = points.map((p) => [
      p.Latitude,
      p.Longitude,
      1,
    ]);

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 13,
    });

    heatLayer.addTo(map);
    return () => map.removeLayer(heatLayer);
  }, [points, show, map]);

  return null;
}

/* ---------------- Risk Colors ---------------- */
const riskColors = {
  "High Risk": "red",
  "Medium Risk": "orange",
  "Low Risk": "green",
};

/* ---------------- Risk Explanation ---------------- */
function getRiskExplanation(level) {
  if (level === "High Risk")
    return "High crime density with significant night-time activity. Extra caution advised.";
  if (level === "Medium Risk")
    return "Moderate crime concentration. Awareness recommended, especially during late hours.";
  return "Low crime density compared to other areas. Generally safer zone.";
}

/* ---------------- Risk Score ---------------- */
function getRiskScore(level) {
  if (level === "High Risk") return 85;
  if (level === "Medium Risk") return 55;
  return 25;
}

/* ---------------- Main Component ---------------- */
export default function MapView() {
  const [centroids, setCentroids] = useState([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activeCluster, setActiveCluster] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/risk/centroids`)
      .then((res) => res.json())
      .then(setCentroids)
      .catch(console.error);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Heatmap Toggle */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          zIndex: 3000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          fontSize: "13px",
        }}
      >
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={() => setShowHeatmap(!showHeatmap)}
            style={{ marginRight: "6px" }}
          />
          Heatmap
        </label>
      </div>

      <MapContainer
        center={[41.88, -87.63]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 REQUIRED FOR RESPONSIVENESS */}
        <FixMapResize />

        <ClosePopupsOnMapClick />
        <ZoomToCluster cluster={activeCluster} />
        <HeatmapLayer points={centroids} show={showHeatmap} />

        {/* Cluster Markers */}
        {centroids.map((c) => {
          const isActive = activeCluster?.cluster === c.cluster;

          return (
            <CircleMarker
              key={c.cluster}
              center={[c.Latitude, c.Longitude]}
              radius={isActive ? 20 : 14}
              color={riskColors[c.risk_level]}
              fillColor={riskColors[c.risk_level]}
              fillOpacity={isActive ? 0.95 : 0.5}
              eventHandlers={{
                click: () => setActiveCluster(c),
              }}
            >
              <Popup
                autoPan
                autoPanPaddingTopLeft={[360, 40]}
                autoPanPaddingBottomRight={[40, 40]}
                closeOnClick
                keepInView
              >
                <div style={{ fontSize: "14px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: riskColors[c.risk_level],
                      color: "white",
                      fontSize: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    Risk Score: {getRiskScore(c.risk_level)}/100
                  </div>

                  <br />
                  <b>Cluster {c.cluster}</b>
                  <br />

                  <span
                    style={{
                      color: riskColors[c.risk_level],
                      fontWeight: "bold",
                    }}
                  >
                    {c.risk_level}
                  </span>

                  <p style={{ marginTop: "6px" }}>
                    {getRiskExplanation(c.risk_level)}
                  </p>

                  <hr />

                  <small>
                    Lat: {c.Latitude.toFixed(3)}
                    <br />
                    Lon: {c.Longitude.toFixed(3)}
                  </small>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Panels */}
      <HeaderPanel />
      <InfoPanel />
      <RiskLegend />
    </div>
  );
}

