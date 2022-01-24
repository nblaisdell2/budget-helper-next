import App from "../components/App";

function Home() {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:wght@700&family=Arima+Madurai:wght@500&family=Cinzel:wght@600&family=Raleway:wght@100&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="styles.css" />
      </head>
      <div className="mx-20 my-5">
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
