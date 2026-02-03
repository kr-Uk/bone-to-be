import { createGlobalStyle } from "styled-components";
import "aos/dist/aos.css";
import "pretendard/dist/web/variable/pretendardvariable.css";

export const GlobalStyle = createGlobalStyle`
  /* CSS Reset & Normalize */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    margin: 0;
    font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.background};
  }

  /* =========================================
     SCROLLBAR V2: Dynamic Capsule
     ========================================= */

  /* 1. 스크롤바 전체 영역 (클릭 감지 범위 확보) */
  ::-webkit-scrollbar {
    width: 14px;  /* 마우스가 닿기 편하도록 넓게 잡음 */
  }

  /* 2. 스크롤바 트랙 (완전 투명) */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 3. 스크롤바 핸들 (평소 상태: 얇고 은은함) */
  ::-webkit-scrollbar-thumb {
    /* 핵심: border를 사용하여 실제 보이는 영역을 축소시킴 */
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 99px;
    border: 5px solid transparent; /* 투명 테두리로 핸들 두께를 얇게 만듦 */
    background-clip: content-box; /* 배경색을 테두리 안쪽으로만 제한 */
    transition: background-color 0.3s, border-width 0.3s;
  }

  /* 4. 스크롤바 핸들 호버 (활성 상태: 확장 & 브랜드 컬러) */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #9810FA; /* 브랜드 컬러 */
    border: 2px solid transparent; /* 테두리를 얇게 줄여서 핸들을 뚱뚱하게 만듦 */
    box-shadow: inset 0 0 10px rgba(0,0,0,0.5); /* 내부 그림자로 입체감 */
  }


  /* Remove default button styles */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
  }

  button:disabled {
    cursor: not-allowed;
  }

  /* Remove default input/textarea styles */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Remove default link styles */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Make images responsive */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* Remove default heading margins */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: inherit;
    font-size: inherit;
  }

  /* Remove default paragraph margins */
  p {
    margin: 0;
  }

  /* Remove default fieldset/legend styles */
  fieldset {
    border: none;
    padding: 0;
    margin: 0;
  }

  legend {
    padding: 0;
  }

  /* Remove default table styles */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Remove default HR styles */
  hr {
    border: none;
    height: 0;
    margin: 0;
  }

  /* Prevent font size inflation on mobile */
  html {
    -webkit-text-size-adjust: 100%;
  }

  /* Improve consistency of default fonts */
  code, kbd, samp, pre {
    font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  }

  /* Remove default blockquote styles */
  blockquote {
    margin: 0;
    padding: 0;
  }

  /* Remove default dialog styles */
  dialog {
    padding: 0;
  }

`;
