import { createGlobalStyle } from "styled-components";
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
