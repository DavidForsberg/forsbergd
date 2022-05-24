import { useState } from "react";
import styled from "styled-components";
import Header from "../header";
import ResponsiveMenu from "../header/navmenu/responsivemenu";
import SocialMediaView from "../SocialMediaView";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  @media only screen and (max-width: 1100px) {
    height: auto;
  }
`;

const MainPage = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  overflow-y: auto;
  overflow-x: hidden;
  @media only screen and (max-width: 1100px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftView = styled(motion.div)`
  width: ${({ $animWidth }) => $animWidth};
  height: 100%;
  @media only screen and (max-width: 1100px) {
    width: 100%;
    height: 50vh;
    padding-top: 10vh;
  }
  @media only screen and (max-width: 800px) {
    height: 70vh;
  }
`;

const RightView = styled(motion.div)`
  width: ${({ $animWidth }) => $animWidth};
  height: 100%;
  overflow-y: auto;
  @media only screen and (max-width: 1100px) {
    width: 100%;
    height: auto;
  }
`;

const Layout = ({ children, themeToggler }) => {
  const [isMenuToggled, toggleMenu] = useState(false);
  const router = useRouter();
  const splitUrl = router.asPath.split("/");
  const isPostUrl =
    splitUrl &&
    splitUrl[1] &&
    splitUrl[1] === "posts" &&
    splitUrl[2] &&
    splitUrl[2].length > 0;
  const isPortfolioUrl = splitUrl.length > 1 && splitUrl[1] === "portfolio";

  return (
    <Wrapper>
      <Header
        toggleMenu={() => toggleMenu(!isMenuToggled)}
        themeToggler={themeToggler}
      />
      {isMenuToggled ? (
        <ResponsiveMenu toggleMenu={() => toggleMenu(!isMenuToggled)} />
      ) : (
        <MainPage>
          <AnimatePresence exitBeforeEnter>
            {!isPostUrl && !isPortfolioUrl && (
              <>
                <LeftView
                  key="leftview"
                  exit={{ translateX: -1000, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  initial={{ translateX: -1000, opacity: 0 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  $animWidth="50%"
                >
                  <SocialMediaView />
                </LeftView>
                <RightView
                  key="rightview"
                  exit={{ translateX: 1000, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0 }}
                  initial={{ translateX: 1000, opacity: 0 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  $animWidth="50%"
                >
                  <>{children}</>
                </RightView>
              </>
            )}
            {isPortfolioUrl && (
              <>
                <LeftView
                  key="leftview_portfolio"
                  transition={{ duration: 0.5 }}
                  initial={{ translateX: -200, opacity: 0 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  $animWidth="10%"
                >
                  <SocialMediaView small />
                </LeftView>
                <RightView
                  key="rightview_portfolio"
                  transition={{ duration: 0.7, delay: 0 }}
                  initial={{ translateX: 1000, opacity: 0 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  style={{ width: "90%" }}
                >
                  {children}
                </RightView>
              </>
            )}
            {isPostUrl && (
              <motion.div
                key="post"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </MainPage>
      )}
    </Wrapper>
  );
};

export default Layout;
