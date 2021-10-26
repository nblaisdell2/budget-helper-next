import { UserProvider } from "@auth0/nextjs-auth0";
import config from "./config/auth0-config.json";

import "tailwindcss/tailwind.css";
import App from "./components/App";

function Home() {
  return (
    <div className="mx-20 my-5">
      {/* <Header accessToken={ynabTokens.accessToken} /> */}
      <UserProvider
        domain={config.domain}
        clientId={config.clientId}
        redirectUri="http://localhost:3000"
      >
        <App />
      </UserProvider>
    </div>
  );
}

export default Home;
