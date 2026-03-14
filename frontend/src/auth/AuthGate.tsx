import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/config/authConfig";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { instance, accounts, inProgress } = useMsal();

  useEffect(() => {
    if (accounts.length === 0 && inProgress === "none") {
      instance.loginRedirect(loginRequest);
    }
  }, [accounts, inProgress]);

  if (accounts.length === 0) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100%",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24
        }}
      >
        <img
          src="/img/aegis_logo.png"
          alt="Aegis Logo"
          style={{ width: 140 }}
        />

        <Spin
          indicator={
            <LoadingOutlined
              spin
              style={{
                fontSize: 40,
                color: "#fff"
              }}
            />
          }
        />

        <div
          style={{
            color: "#ccc",
            fontSize: 14
          }}
        >
          Authenticating...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}