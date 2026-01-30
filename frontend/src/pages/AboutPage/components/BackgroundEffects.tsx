import styled, { keyframes } from "styled-components";

const gridSlide = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 4rem 4rem; }
`;

const Grid = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  background-size: 4rem 4rem;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  animation: ${gridSlide} 60s linear infinite;
`;

const Glow = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 60vw;
  height: 60vw;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  filter: blur(20rem);
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
  background: ${({ theme }) => theme.colors.brand};
`;

export const BackgroundEffects = () => (
  <>
    <Grid />
    <Glow />
  </>
);
