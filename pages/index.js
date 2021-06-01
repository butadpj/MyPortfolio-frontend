import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Loader from "../components/Loader";
import PWAInstallerAlert from "../components/PWAInstallerAlert";
import PortfolioView from "../views/PortfolioView";

import AOS from "aos";
import "aos/dist/aos.css";

import { SectionDataContext } from "../context/SectionDataContext";

const index = ({ home, about }) => {
  // const [isLoading, setIsLoading] = useState(true);

  const [state, dispatch] = useContext(SectionDataContext);

  useEffect(() => {
    let isMounted = true;
    let timer;
    // Show the loader for (n) milliseconds
    if (isMounted) {
      // Initialize AOS
      AOS.init({ duration: 800, offset: 100 });
      AOS.refresh();

      timer = setTimeout(() => {
        // setIsLoading(false);
        dispatch({ type: "DATA_INIT" });
      }, 1000);
    }

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="My personal web dev portfolio" />
        <meta
          name="keywords"
          content="Portfolio, Web development portfolio, I'm Paul, Paul John Butad's Portfolio"
        />
        <title>I'm Paul - Software Developer</title>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <PWAInstallerAlert />
      {state.isLoading ? (
        <Loader />
      ) : (
        <PortfolioView home={home} about={about} />
      )}
    </>
  );
};

export const getStaticProps = async () => {
  let fetchUrl = `${process.env.devHost}/api/`;
  let fetchApiVersion = "v1/";
  let fetchSectionUrls = ["home/", "about/"];
  try {
    // Single URL fetch
    // const res = await fetch(`http://127.0.0.1:8000/api/v1/home/`);
    // const home = await res.json();

    // Multiple URL fetch
    const responses = await Promise.all(
      fetchSectionUrls.map((sections) =>
        fetch(`${fetchUrl}${fetchApiVersion}${sections}`).then((res) =>
          res.json()
        )
      )
    );

    return {
      props: { home: responses[0], about: responses[1] },
      revalidate: 40, //seconds
    };
  } catch (err) {
    console.log(err);
  }

  return {
    props: {},
  };
};

export default index;
