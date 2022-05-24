import { createGlobalStyle } from "styled-components";

export const fontsizes = {
  title: "1.8rem",
  regular: "1.2rem",
  small: "1.2rem",
  tiny: "1rem",
  icon: "1.1rem",
};

export const screenWidths = {
  phone: "450px",
  tablet: "800px",
  laptop: "1366px",
};

export const GlobalStyles = createGlobalStyle`
    body {
        background: ${({ theme }) => theme.body};
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    div {
      display: flex;
    }

    h1, h2, h3, h4, a, p, li, label, input, textarea, span {
        font-family: 'Roboto', sans-serif;
        margin: 0;
        padding: 0;
    }

    button {
        font-family: 'Roboto', sans-serif;
    }

    /* width */
    ::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
      padding-right: 50px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 6px;
        border-right: 1px ${({ theme }) => theme.body} solid;

    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

export const lightTheme = {
  body: "#fff",
  text: "#121212",
  secondBackground: "#fff",
  thirdBackground: "#f5f5f5",
  primaryColor: "#000000",
  primaryShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.15)",
  secondaryShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.4)",
  primaryIconColor: "black",
  lowOpacityBorder: "rgba(0, 0, 0, 0.1) solid 1px",
};

export const darkTheme = {
  body: "#15202b",
  text: "#fff",
  secondBackground: "#22222c",
  thirdBackground: "#5951ff",
  primaryColor: "#fff",
  primaryShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.2)",
  secondaryShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.4)",
  primaryIconColor: "white",
  lowOpacityBorder: "rgba(255, 255, 255, 0.1) solid 1px",
};
