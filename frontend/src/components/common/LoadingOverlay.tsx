import React from "react";
import { Spin } from "antd";

interface Props {
  loading: boolean;
  children: React.ReactNode;
  tip?: string;
}

const LoadingOverlay: React.FC<Props> = ({ loading, children, tip }) => {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20
          }}
        >
          <Spin size="large" tip={tip || "Loading..."} />
        </div>
      )}

      {children}
    </div>
  );
};

export default LoadingOverlay;