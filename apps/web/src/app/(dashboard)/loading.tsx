import React from "react";

export default function DashboardLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", animation: "pulse 1.5s infinite ease-in-out" }}>
      {/* Header Skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ height: "28px", width: "35%", backgroundColor: "#ECEFF1", borderRadius: "6px" }} />
        <div style={{ height: "16px", width: "60%", backgroundColor: "#ECEFF1", borderRadius: "4px" }} />
      </div>

      {/* Grid Cards Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "100px",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              border: "1px solid #E2EAF0",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div style={{ height: "12px", width: "50%", backgroundColor: "#ECEFF1", borderRadius: "4px" }} />
            <div style={{ height: "24px", width: "30%", backgroundColor: "#ECEFF1", borderRadius: "4px" }} />
            <div style={{ height: "10px", width: "70%", backgroundColor: "#ECEFF1", borderRadius: "4px" }} />
          </div>
        ))}
      </div>

      {/* Content Skeleton */}
      <div
        style={{
          flex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          border: "1px solid #E2EAF0",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: "300px"
        }}
      >
        <div style={{ height: "20px", width: "40%", backgroundColor: "#ECEFF1", borderRadius: "4px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <div style={{ height: "40px", width: "100%", backgroundColor: "#ECEFF1", borderRadius: "8px" }} />
          <div style={{ height: "40px", width: "100%", backgroundColor: "#ECEFF1", borderRadius: "8px" }} />
          <div style={{ height: "40px", width: "100%", backgroundColor: "#ECEFF1", borderRadius: "8px" }} />
          <div style={{ height: "40px", width: "100%", backgroundColor: "#ECEFF1", borderRadius: "8px" }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `
      }} />
    </div>
  );
}
