import Image from "next/image";
import { useEffect, useState } from "react";
import Sidebar from "react-sidebar";
import MySidebar from "./MySidebar";

function Header(props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarStyles, setSidebarStyles] = useState({
    sidebar: {
      background: "white",
    },
    root: {
      zIndex: -1,
    },
  });

  useEffect(() => {
    let newStyles = { ...sidebarStyles };
    if (sidebarOpen) {
      newStyles.root.zIndex = 10;
    } else {
      newStyles.root.zIndex = -1;
    }
    setSidebarStyles(newStyles);
  }, [sidebarOpen]);

  return (
    <header className="flex justify-end bg-blue-900 p-1 pr-6">
      <div
        className="hover:cursor-pointer flex items-center"
        onClick={() => setSidebarOpen(true)}
      >
        <h2 className="mr-2 text-3xl font-cinzel text-white">EverCent</h2>
        <Image
          src="/evercent_logo.png"
          className="object-contain"
          width={50}
          height={50}
          alt="My Logo"
        />
      </div>

      <div>
        <Sidebar
          sidebar={<MySidebar accToken={props.accessToken} />}
          children={<></>}
          open={sidebarOpen}
          onSetOpen={setSidebarOpen}
          styles={sidebarStyles}
          pullRight={true}
        />
      </div>
    </header>
  );
}

export default Header;
