import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import config from "./config/auth0-config.json";
import "tailwindcss/tailwind.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider
      domain={config.domain}
      clientId={config.clientId}
      redirectUri={config.redirectUri}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Arima+Madurai:wght@500&family=Cinzel:wght@600&family=Raleway:wght@100&display=swap"
          rel="stylesheet"
        />
        {/* <link rel="stylesheet" href="styles.css" /> */}
      </Head>
      <Component {...pageProps} />
    </UserProvider>
  );
}
