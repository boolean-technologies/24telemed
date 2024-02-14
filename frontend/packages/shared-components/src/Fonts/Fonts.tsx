import { createGlobalStyle } from "styled-components";

import uniformBold from "./UniformRnd-Bold/font.woff";
import uniformBold2 from "./UniformRnd-Bold/font.woff2";
import uniformRegular from "./UniformRnd-Regular/font.woff";
import uniformRegular2 from "./UniformRnd-Regular/font.woff2";
import uniformExCondBold from "./UniformRndExCond-Bold/font.woff";
import uniformExCondBold2 from "./UniformRndExCond-Bold/font.woff2";

export const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Uniform Rounded';
    src: url(${uniformRegular2}) format('woff2'), url(${uniformRegular}) format('woff');
    font-display: fallback;
    font-weight: 400;
  }
  @font-face {
    font-family: 'Uniform Rounded';
    src: url(${uniformBold2}) format('woff2'), url(${uniformBold}) format('woff');
    font-display: fallback;
    font-weight: 700;
  }
  @font-face {
    font-family: 'Uniform Rounded Ex Cond';
    src: url(${uniformExCondBold2}) format('woff2'), url(${uniformExCondBold}) format('woff');
    font-display: fallback;
    font-weight: 700;
  }

  html {
    font-size: 16px;
  }
`;
