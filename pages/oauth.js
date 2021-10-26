import React, { useEffect } from "react";
import Axios from "axios";
import ynab_config from "./config/ynab_oauth_config.json";
import { useUser } from "@auth0/nextjs-auth0";
import Router, { useRouter } from "next/router";

function OAuth(props) {
  const { user, isLoading } = useUser();

  const router = useRouter();
  const authCode = router.query.code;

  console.log(router.query);

  let accessToken;

  useEffect(() => {
    if (!isLoading) {
      console.log("Finished loading");

      Axios.post("/api/ynab/get_access_token", {
        params: {
          client_id: ynab_config.CLIENT_ID,
          client_secret: ynab_config.CLIENT_SECRET,
          redirect_uri: ynab_config.REDIRECT_URI,
          grant_type: "authorization_code",
          code: authCode,
        },
      }).then((response) => {
        accessToken = response.data.access_token;
        let newExpirDate = new Date();
        newExpirDate.setSeconds(
          newExpirDate.getSeconds() + response.data.expires_in
        );
        props.setYnabTokens({
          accessToken: accessToken,
          expirationDate: newExpirDate.toISOString(),
          refreshToken: response.data.refresh_token,
        });

        // if (user) {
        //   Axios.post("/add_ynab_access_token", {
        //     user_email: user.email,
        //     access_token: accessToken,
        //     expires_in: response.data.expires_in,
        //     refresh_token: response.data.refresh_token,
        //   });
        // }
      });

      Router.push("/");
    }
  }, [isLoading]);

  return <div></div>;
}

export default OAuth;
