import { useNavigate } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";

import bg404 from "./images/404_bg.png";
import float1 from "./images/float_1.png";
import float2 from "./images/float_2.png";
import float3 from "./images/float_3.png";
import float4 from "./images/float_4.png";
import float5 from "./images/float_5.png";
import float6 from "./images/float_6.png";
import float7 from "./images/float_7.png";
import text404 from "./images/text404.png";

type FloatPreset = "slow" | "mid" | "fast";

interface LayerConfig {
  id: string;
  src: string;
  alt: string;
  top: string;
  left: string;
  width: string;
  z: number;
  preset: FloatPreset;
  delay?: string;
  ariaHidden?: boolean;
}

const floatSlow = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50% { transform: translate3d(-1rem, -1.75rem, 0) rotate(2deg); }
  100% { transform: translate3d(0, 0, 0) rotate(0deg); }
`;

const floatMid = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(-2deg); }
  50% { transform: translate3d(1.25rem, 1.5rem, 0) rotate(3deg); }
  100% { transform: translate3d(0, 0, 0) rotate(-2deg); }
`;

const floatFast = keyframes`
  0% { transform: translate3d(0, 0, 0) rotate(1deg); }
  50% { transform: translate3d(1.75rem, -2rem, 0) rotate(-4deg); }
  100% { transform: translate3d(0, 0, 0) rotate(1deg); }
`;

const floatPresets = {
  slow: { keyframes: floatSlow, duration: "12s" },
  mid: { keyframes: floatMid, duration: "9s" },
  fast: { keyframes: floatFast, duration: "7s" },
} as const;

const layers: LayerConfig[] = [
  // TODO: 위치/크기 조정
  {
    id: "float-1",
    src: float1,
    alt: "",
    top: "2%",
    left: "6%",
    width: "clamp(3rem, 5vw, 4.25rem)",
    z: 2,
    preset: "slow",
    delay: "0.2s",
    ariaHidden: true,
  },
  {
    id: "float-2",
    src: float2,
    alt: "",
    top: "12%",
    left: "88%",
    width: "clamp(5rem, 10vw, 8rem)",
    z: 3,
    preset: "mid",
    delay: "0.6s",
    ariaHidden: true,
  },
  {
    id: "float-3",
    src: float3,
    alt: "",
    top: "48%",
    left: "2%",
    width: "clamp(2.25rem, 5vw, 3.5rem)",
    z: 1,
    preset: "fast",
    delay: "0.1s",
    ariaHidden: true,
  },
  {
    id: "float-4",
    src: float4,
    alt: "",
    top: "46%",
    left: "92%",
    width: "clamp(2.25rem, 4.5vw, 3.75rem)",
    z: 2,
    preset: "slow",
    delay: "1.2s",
    ariaHidden: true,
  },
  {
    id: "float-5",
    src: float5,
    alt: "",
    top: "78%",
    left: "8%",
    width: "clamp(2.5rem, 5vw, 4rem)",
    z: 2,
    preset: "mid",
    delay: "0.9s",
    ariaHidden: true,
  },
  {
    id: "float-6",
    src: float6,
    alt: "",
    top: "80%",
    left: "84%",
    width: "clamp(2.25rem, 4.5vw, 3.75rem)",
    z: 1,
    preset: "fast",
    delay: "0.4s",
    ariaHidden: true,
  },
  {
    id: "float-7",
    src: float7,
    alt: "",
    top: "90%",
    left: "70%",
    width: "clamp(2rem, 4vw, 3.25rem)",
    z: 1,
    preset: "slow",
    delay: "1.6s",
    ariaHidden: true,
  },
];

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Page>
      <Glow aria-hidden="true" />
      <Scene>
        <LayerWrap aria-hidden="true">
          {layers.map((layer) => (
            <LayerImage
              key={layer.id}
              src={layer.src}
              alt={layer.alt}
              $top={layer.top}
              $left={layer.left}
              $width={layer.width}
              $z={layer.z}
              $preset={layer.preset}
              $delay={layer.delay}
              aria-hidden={layer.ariaHidden}
            />
          ))}
        </LayerWrap>

        <Content aria-labelledby="notfound-title" aria-describedby="notfound-desc">
          <TextImg src={text404} alt="404" />
          <Title id="notfound-title">페이지를 찾을 수 없습니다</Title>
          <Description id="notfound-desc">
            요청하신 주소가 변경되었거나 삭제되었습니다.
            <br />
            홈으로 이동하거나 이전 페이지로 돌아가세요.
          </Description>
          <ButtonRow>
            <PrimaryButton type="button" onClick={handleGoHome}>
              홈으로
            </PrimaryButton>
            <GhostButton type="button" onClick={handleGoBack}>
              이전
            </GhostButton>
          </ButtonRow>
        </Content>
      </Scene>
    </Page>
  );
};

export default NotFound;

const Page = styled.main`
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 4rem 1.5rem;
  background-image:
    radial-gradient(circle at 20% 15%, rgba(152, 16, 250, 0.2), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(88, 16, 200, 0.25), transparent 55%), url(${bg404});
  background-size: auto, auto, cover;
  background-position: center, center, center;
  background-repeat: no-repeat;
  background-color: #05020d;
  color: ${({ theme }) => theme.colors.secondary};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(152, 16, 250, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(152, 16, 250, 0.12) 1px, transparent 1px);
    background-size: 2.75rem 2.75rem;
    opacity: 0.4;
    pointer-events: none;
  }
`;

const Glow = styled.div`
  position: absolute;
  inset: -20% 0 0 0;
  background: radial-gradient(circle at 50% 10%, rgba(124, 58, 237, 0.45), transparent 65%);
  pointer-events: none;
  z-index: 0;
`;

const Scene = styled.section`
  position: relative;
  width: min(92vw, 70rem);
  aspect-ratio: 16 / 9;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 2.5rem;
  z-index: 1;

  @media (max-width: 768px) {
    width: min(92vw, 36rem);
    aspect-ratio: 4 / 5;
    gap: 1.75rem;
  }
`;

const LayerWrap = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const TextImg = styled.img`
  width: min(70%, 34rem);
  margin: 0 auto 0.5rem;
  display: block;
  pointer-events: none;
  animation: ${floatSlow} 10s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LayerImage = styled.img<{
  $top: string;
  $left: string;
  $width: string;
  $z: number;
  $preset: FloatPreset;
  $delay?: string;
}>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $width }) => $width};
  z-index: ${({ $z }) => $z};
  pointer-events: none;
  ${({ $preset }) => css`
    animation: ${floatPresets[$preset].keyframes} ${floatPresets[$preset].duration} ease-in-out
      infinite;
  `};
  animation-delay: ${({ $delay }) => $delay ?? "0s"};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 5;
  text-align: center;
  display: grid;
  gap: 1rem;
  pointer-events: auto;
`;

const Title = styled.h1`
  font-size: clamp(1.75rem, 3.2vw, 2.75rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  margin: 0 auto;
  max-width: 36rem;
  color: ${({ theme }) => theme.colors.gray[200]};
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const buttonBase = css`
  border-radius: 4px;
  padding: 12px 24px;
  width: 6.5rem;
  height: 3rem;

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:focus-visible {
    outline: 0.2rem solid ${({ theme }) => theme.colors.purple[200]};
    outline-offset: 0.2rem;
  }

  &:hover {
    transform: translateY(-0.1rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PrimaryButton = styled.button`
  ${buttonBase};
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 0.75rem 2rem rgba(152, 16, 250, 0.35);
`;

const GhostButton = styled.button`
  ${buttonBase};
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(20, 12, 36, 0.65);
  color: ${({ theme }) => theme.colors.secondary};
`;
