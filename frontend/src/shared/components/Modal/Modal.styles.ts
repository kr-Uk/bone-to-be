import { styled } from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5); // Dimmed background
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
