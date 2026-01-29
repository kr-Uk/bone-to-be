import styled, { css } from "styled-components";

type ShapeAnimationProps = {
  $floatAnimation?: { toString(): string };
  $duration?: string;
  $timingFunction?: string;
};

const applyFloatAnimation = ({
  $floatAnimation,
  $duration,
  $timingFunction,
}: ShapeAnimationProps) =>
  $floatAnimation && $duration
    ? css`
        animation: ${$floatAnimation} ${$duration} ${$timingFunction ?? "ease-in-out"} infinite;
      `
    : undefined;

const BoneShape = styled.div`
  position: absolute;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  filter: drop-shadow(0 1.25rem 2.5rem rgba(152, 16, 250, 0.25));
  will-change: transform;
  pointer-events: none;
  z-index: 1;
`;

export const StraightShape = styled(BoneShape)<ShapeAnimationProps>`
  width: 12.5rem;
  height: 18.75rem;
  right: 15%;
  top: 10%;
  border-radius: 0.25rem;
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.purple[200]} 0%, ${theme.colors.brand} 100%)`};
  opacity: 0.45;
  ${({ $floatAnimation, $duration, $timingFunction }) =>
    applyFloatAnimation({ $floatAnimation, $duration, $timingFunction })};

  @media (max-width: 1024px) {
    width: 10.5rem;
    height: 15.5rem;
    right: 8%;
  }

  @media (max-width: 768px) {
    width: 8.5rem;
    height: 12.5rem;
    right: 4%;
    top: 6%;
  }
`;

export const WaveShape = styled(BoneShape)<ShapeAnimationProps>`
  width: 12.5rem;
  height: 16.25rem;
  left: 10%;
  bottom: 15%;
  clip-path: polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%, 40% 50%);
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.purple[200]} 0%, ${theme.colors.purple[700]} 100%)`};
  opacity: 0.4;
  ${({ $floatAnimation, $duration, $timingFunction }) =>
    applyFloatAnimation({ $floatAnimation, $duration, $timingFunction })};

  @media (max-width: 1024px) {
    width: 10rem;
    height: 13rem;
    left: 6%;
  }

  @media (max-width: 768px) {
    width: 7.75rem;
    height: 10.25rem;
    left: 4%;
    bottom: 10%;
  }
`;

export const NaturalShape = styled(BoneShape)<ShapeAnimationProps>`
  width: 11.25rem;
  height: 11.25rem;
  left: 50%;
  top: 50%;
  margin-left: -18.75rem;
  margin-top: -9.375rem;
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
  background: ${({ theme }) =>
    `linear-gradient(135deg, ${theme.colors.purple[200]} 0%, ${theme.colors.purple[700]} 100%)`};
  opacity: 0.35;
  ${({ $floatAnimation, $duration, $timingFunction }) =>
    applyFloatAnimation({ $floatAnimation, $duration, $timingFunction })};

  @media (max-width: 1024px) {
    margin-left: -14rem;
    margin-top: -7.5rem;
  }

  @media (max-width: 768px) {
    width: 8.5rem;
    height: 8.5rem;
    margin-left: -11rem;
    margin-top: -6.5rem;
  }
`;
