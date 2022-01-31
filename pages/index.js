import App from "../components/App";

function Home() {
  return (
    <>
      <div className=" z-10">
        <style jsx global>{`
          body {
            background-color: #d1f5ff;
          }
        `}</style>
        <App />
      </div>
    </>
  );
}

export default Home;
