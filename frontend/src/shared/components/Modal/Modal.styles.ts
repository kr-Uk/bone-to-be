import { styled } from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(10, 10, 10, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  position: relative;
  z-index: 1001;
  /* The modal content controls the size */
`;
