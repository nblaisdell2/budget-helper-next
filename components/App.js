import { useEffect, useState } from "react";
import BudgetHelper from "../pages/BudgetHelper";
import Header from "./Header";
import Axios from "axios";
import ynab_config from "../pages/config/ynab_oauth_config.json";
import { useUser } from "@auth0/nextjs-auth0";
import Router, { useRouter } from "next/router";

function App() {
  const [userDetails, setUserDetails] = useState({});
  const [ynabTokens, setYnabTokens] = useState({});
  const { user, isLoading } = useUser();
  const router = useRouter();

  const saveTokensLocal = (tokenData) => {
    let keys = Object.keys(tokenData);
    for (let i = 0; i < keys.length; i++) {
      sessionStorage.setItem(keys[i], tokenData[keys[i]]);
    }
  };

  const getRefreshToken = (ynabTokens) => {
    // First, check to see if the token has already expired
    // If it's still valid, no need to check for a refresh
    if (
      ynabTokens.expirationDate &&
      new Date() > new Date(ynabTokens.expirationDate)
    ) {
      // If we need a new access token, access the YNAB API to
      // request a new access token with the 'refreshToken' we were provided
      // the first time.
      console.log("  getting refresh token from YNAB");
      Axios.post("/api/ynab/get_access_token", {
        params: {
          client_id: ynab_config.CLIENT_ID,
          client_secret: ynab_config.CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: ynabTokens.refreshToken,
        },
      })
        .then((response) => {
          // Once we receive a new access/refresh token, we should save the results
          // in our state variable "ynabTokens"
          console.log("  Refreshing ynab tokens");
          console.log(response);

          let newExpirDate = new Date();
          let expireSeconds = response.data.expires_in;
          newExpirDate.setSeconds(newExpirDate.getSeconds() + expireSeconds);

          console.log(newExpirDate);

          let newTokens = {
            accessToken: response.data.access_token,
            expirationDate: newExpirDate.toISOString(),
            refreshToken: response.data.refresh_token,
          };
          setYnabTokens(newTokens);

          return { tokens: newTokens, expireSeconds: expireSeconds };
        })
        .then((data) => {
          // Lastly, if the user is logged in, we should also make this change
          // in the database
          if (user) {
            console.log("updating access token in DB after refresh");
            console.log(data.tokens);
            console.log(user);

            Axios.post("/api/db/update_ynab_access_token", {
              user_name: user.email,
              access_token: data.tokens.accessToken,
              expires_in: data.expireSeconds,
              refresh_token: data.tokens.refreshToken,
            }).catch((e) => {
              console.log(e);
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const getUser = () => {
    // If the user is logged in, attempt to pull their information from the database (email, monthly amount, ynab tokens, etc.)
    // Otherwise, use sessionStorage to just pull the ynab tokens
    console.log(user);

    if (user) {
      console.log("[APP]      Attempting to get User Details from DB.");

      Axios.post("/api/db/get_user_details/", {
        params: {
          user_name: "nblaisdell2@gmail.com",
        },
      })
        .then((response) => {
          console.log("response");
          console.log(response);

          if (response.data.length === 0) {
            console.log("[APP]      No user found.");
            addUser();
          } else {
            console.log(
              "[APP]      User found in DB! Setting details and token."
            );

            // If a user logs in, be sure to clear the sessionStorage so that when they
            // log out, it starts a new "session" of the BudgetHelper for an un-logged in user
            sessionStorage.clear();

            setUserDetails(response.data[0]);
            setYnabTokens({
              accessToken: response.data[0].AccessToken,
              expirationDate: response.data[0].ExpirationDate,
              refreshToken: response.data[0].RefreshToken,
            });
          }
        })
        .catch((e) => {
          console.log("Error");
          console.log(e);
        });
    } else {
      console.log("Attempting to read local storage...");
      let existingTokens = {
        accessToken: sessionStorage.getItem("accessToken"),
        expirationDate: sessionStorage.getItem("expirationDate"),
        refreshToken: sessionStorage.getItem("refreshToken"),
      };
      console.log(existingTokens);
      if (existingTokens.accessToken !== null) {
        setYnabTokens(existingTokens);
      }
    }
  };

  const addUser = () => {
    console.log("[APP]      adding user...");

    Axios.post("/api/db/add_user", {
      user_email: user.email,
      user_name: user.nickname,
    }).then((response) => {
      console.log("[APP]      User Added!");
    });
  };

  useEffect(() => {
    if (!isLoading) {
      console.log("[APP] App Initializing");

      if (router.asPath && router.asPath.substring(0, 6) == "/?code") {
        console.log(
          "  Got code: " +
            router.asPath.substring(7) +
            ". Getting access token from YNAB API"
        );

        Axios.post("/api/ynab/get_access_token", {
          params: {
            client_id: ynab_config.CLIENT_ID,
            client_secret: ynab_config.CLIENT_SECRET,
            redirect_uri: ynab_config.REDIRECT_URI,
            grant_type: "authorization_code",
            code: router.asPath.substring(7),
          },
        }).then((response) => {
          console.log("  Got access token!");
          let accessToken = response.data.access_token;
          let newExpirDate = new Date();
          newExpirDate.setSeconds(
            newExpirDate.getSeconds() + response.data.expires_in
          );

          console.log("  Setting cached YNAB tokens");
          setYnabTokens({
            accessToken: accessToken,
            expirationDate: newExpirDate.toISOString(),
            refreshToken: response.data.refresh_token,
          });

          if (user) {
            console.log(
              "User is logged in, so updating YNAB tokens in database, as well."
            );
            Axios.post("/api/db/add_ynab_access_token", {
              user_email: user.email,
              access_token: accessToken,
              expires_in: response.data.expires_in,
              refresh_token: response.data.refresh_token,
            });
          }

          Router.push("/");
        });
      }

      // const authCode = router.query.code;

      // console.log(authCode);

      console.log("[APP]   Getting User Details");
      getUser();
    }
  }, [isLoading]);

  useEffect(() => {
    if (Object.keys(ynabTokens).length !== 0) {
      console.log("Access Token Changed: " + ynabTokens.accessToken);

      // If the YNAB tokens are updated, and the user is not logged in, we should store
      // the tokens in sessionStorage, as well.
      if (
        !user &&
        ynabTokens.accessToken !== sessionStorage.getItem("accessToken")
      ) {
        console.log("Storing new tokens in local storage");
        saveTokensLocal(ynabTokens);
      }

      // Then, check to see if the tokens need to be refreshed, based on the expiration date
      // of the access token
      getRefreshToken(ynabTokens);
    }
  }, [ynabTokens]);

  //   if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header accessToken={ynabTokens.accessToken} />
      <BudgetHelper />
    </div>
  );
}

export default App;
