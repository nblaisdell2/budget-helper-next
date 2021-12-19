import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import config from "./config/auth0-config.json";
import "tailwindcss/tailwind.css";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={config.redirectUri}
    >
      <Component {...pageProps} />
    </UserProvider>
  );
}
