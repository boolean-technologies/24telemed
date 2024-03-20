import { createGlobalStyle } from "styled-components";
import { makeVariant } from "../styles";

export const CssBaseline = createGlobalStyle`
  html {
    line-height: 1.15;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }
  body {
    margin: 0;
    color: ${({ theme }) => theme.typography.defaultColor};
    background-color: ${({ theme }) => theme.palette.background.main};
    ${makeVariant}
    &::backdrop {
        background-color: ${({ theme }) => theme.palette.background.main};
    }
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  *:not(input) {
    user-select: none;
  }  
`;
