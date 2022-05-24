import { ThemeProvider } from "styled-components";
import Head from "next/head";
import Layout from "../components/layout";
import { useDarkMode } from "../utils/useDarkMode";
import { Toggle } from "../components/formui/toggle";
import { GlobalStyles, lightTheme, darkTheme } from "../utils/globalStyles";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";

function App({ Component, pageProps }) {
  const [theme, toggleTheme] = useDarkMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;
  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
          rel="stylesheet"
        />
        <link rel="Website icon" href="/icons/favicon.png" />
      </Head>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <Layout
          themeToggler={
            <Toggle theme={theme} toggleTheme={toggleTheme}>
              HJHJH
            </Toggle>
          }
        >
          <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.asPath} />
          </AnimatePresence>
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default App;
