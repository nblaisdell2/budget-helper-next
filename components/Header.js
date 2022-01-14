import ynab_config from "../pages/config/ynab_oauth_config.json";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

function Header(props) {
  const { isLoading, user } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let signIn;
  let loggedInAs;
  let connectToYNAB;
  if (user) {
    signIn = (
      <a className="hover:underline" href="/api/auth/logout">
        Logout
      </a>
    );

    loggedInAs = <h2>User: {user.nickname || user.email}</h2>;

    if (
      props.accessToken === null ||
      props.accessToken === undefined ||
      props.accessToken === "undefined"
    ) {
      connectToYNAB = (
        <a
          className="hover:underline"
          href={`https://app.youneedabudget.com/oauth/authorize?client_id=${ynab_config.CLIENT_ID}&redirect_uri=${ynab_config.REDIRECT_URI}&response_type=code`}
        >
          Connect to YNAB
        </a>
      );
    }
  } else {
    signIn = (
      <a className="hover:underline" href="/api/auth/login">
        Login
      </a>
    );

    if (
      props.accessToken === null ||
      props.accessToken === undefined ||
      props.accessToken === "undefined"
    ) {
      connectToYNAB = (
        <a
          className="hover:underline"
          href={`https://app.youneedabudget.com/oauth/authorize?client_id=${ynab_config.CLIENT_ID}&redirect_uri=${ynab_config.REDIRECT_URI}&response_type=code`}
        >
          Connect to YNAB
        </a>
      );
    }
  }

  return (
    <header className="flex flex-row justify-between">
      <div className="flex items-center mx-2">
        <Image
          src="/evercent_logo.png"
          className=" object-contain"
          width={120}
          height={120}
          alt="My Logo"
        />
        <h2 className="ml-4 text-5xl font-extrabold">Budget Helper</h2>
      </div>

      <nav className="flex">
        <div className="flex items-center space-x-10">
          <a className="hover:underline" href="/">
            Budget Helper
          </a>
          <a className="hover:underline" href="/YNABTutorial">
            Tutorial
          </a>
          {connectToYNAB}
          {signIn}
          {loggedInAs}
        </div>
      </nav>
    </header>
  );
}

export default Header;
