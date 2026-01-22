import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import styled, { css, useTheme } from "styled-components";

import type { AppTheme } from "@/shared/styles/theme";

type BodyTypeKey = "STRAIGHT" | "WAVE" | "NATURAL";

type BodyTypeSection = {
  key: BodyTypeKey;
  labelEn: string;
  labelKo: string;
  headline: string;
  desc: string;
  cta: string;
  maleLabel: string;
  femaleLabel: string;
  maleImageSrc?: string;
  femaleImageSrc?: string;
};

const Wrap = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
`;

const Tall = styled.section`
  height: 320vh;
`;

const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  isolation: isolate;
`;

const Frame = styled.div`
  height: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxl};
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    padding-top: 6rem;
    padding-bottom: 4rem;
  }
`;

const Nav = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: flex-end;
  text-align: center;
  width: 16rem;
  padding-right: 0.75rem;
  z-index: 2;

  @media (max-width: 900px) {
    position: static;
    transform: none;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: flex-start;
    text-align: left;
    width: 100%;
    order: 1;
    padding-right: 0;
    margin: 0 0 2rem;
  }
`;

const NavItem = styled(motion.button)`
  border: 0;
  background: transparent;
  padding: 0;
  width: fit-content;
  text-align: right;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 0.45rem;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;
  color: ${({ theme }) => theme.colors.gray[400]};

  @media (max-width: 900px) {
    width: auto;
    text-align: left;
    gap: 0.4rem;
    justify-content: flex-start;
    margin-left: 0;
  }
`;

const Dot = styled(motion.span)`
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 9999px;
  flex: 0 0 auto;
`;

const NavText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  align-items: flex-end;
  text-align: right;

  @media (max-width: 900px) {
    align-items: flex-start;
    text-align: left;
  }
`;

const NavKo = styled.span`
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.semibold.lineHeight};
`;

const NavEn = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
`;

const Stage = styled.div`
  flex: 1 1 0;
  position: relative;
  height: 74vh;
  min-height: 40rem;
  order: 1;

  @media (max-width: 900px) {
    height: 68vh;
    min-height: 34rem;
    order: 2;
  }

  @media (max-width: 600px) {
    height: 64vh;
    min-height: 30rem;
  }
`;

const Layer = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
`;

const LayerInner = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 47rem);
  gap: ${({ theme }) => theme.spacing.xxxl};
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    padding-top: 2rem;
    padding-bottom: 1.5rem;
  }
`;

const CopyBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 36rem;
  padding-left: 0.5rem;
  padding-top: 4rem;
`;

const VisualBlock = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  margin-top: clamp(2rem, 4vw, 4.5rem);

  @media (max-width: 1024px) {
    margin-top: clamp(1.5rem, 4vw, 3.5rem);
  }

  @media (max-width: 768px) {
    margin-top: clamp(1rem, 3.5vw, 2.5rem);
  }
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  width: 37rem;
  transform: translateX(-1.25rem);

  @media (max-width: 1024px) {
    width: 32rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    transform: none;
    grid-template-columns: 1fr;
  }
`;

const GenderCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 0.9rem;
  padding: 1rem;
  height: 27.75rem;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    height: 24rem;
  }

  @media (max-width: 768px) {
    height: 20rem;
  }
`;

const GenderImageFrame = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.7rem;
  border: 0.0625rem dashed ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const GenderImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 0.7rem;
  object-fit: cover;
  display: block;
`;

const GenderLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const ScrollWash = styled(motion.div)`
  position: absolute;
  inset: -15% 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 255, 255, 0.06) 60%,
    rgba(255, 255, 255, 0.02) 100%
  );
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
`;

const OrbitGroup = styled.div`
  position: absolute;
  inset: -2.5rem;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 900px) {
    inset: -2rem;
  }
`;

const OrbitShape = styled(motion.div)<{
  $tone: BodyTypeKey;
  $variant: 1 | 2 | 3;
  $shape: "rect" | "wave" | "tri";
}>`
  position: absolute;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
  filter: drop-shadow(0 1rem 2rem rgba(15, 23, 42, 0.35));
  opacity: 0.7;

  ${({ theme, $tone }) => {
    const palette: Record<BodyTypeKey, [string, string]> = {
      STRAIGHT: [theme.colors.purple[200], theme.colors.brand],
      WAVE: [theme.colors.purple[50], theme.colors.purple[700]],
      NATURAL: [theme.colors.purple[200], theme.colors.purple[800]],
    };
    const [from, to] = palette[$tone];
    return css`
      background: linear-gradient(135deg, ${from} 0%, ${to} 100%);
    `;
  }}

  ${({ $shape }) =>
    $shape === "rect" &&
    css`
      border-radius: 0.35rem;
    `}

  ${({ $shape }) =>
    $shape === "wave" &&
    css`
      border-radius: 0.4rem;
      clip-path: polygon(0 0, 100% 0, 65% 52%, 100% 100%, 0 100%, 35% 52%);
    `}

  ${({ $shape }) =>
    $shape === "tri" &&
    css`
      clip-path: polygon(0 0, 100% 0, 82% 100%, 18% 100%);
    `}

  ${({ $variant }) =>
    $variant === 1 &&
    css`
      width: 8.75rem;
      height: 12.5rem;
      top: -1.6rem;
      right: -1.4rem;
    `}

  ${({ $variant }) =>
    $variant === 2 &&
    css`
      width: 8rem;
      height: 10.5rem;
      right: 10%;
      bottom: -1.5rem;
    `}

  ${({ $variant }) =>
    $variant === 3 &&
    css`
      width: 6.75rem;
      height: 6.75rem;
      left: -1.8rem;
      bottom: -1.2rem;
    `}

  @media (max-width: 900px) {
    ${({ $variant }) =>
      $variant === 1 &&
      css`
        width: 7.5rem;
        height: 10.5rem;
      `}

    ${({ $variant }) =>
      $variant === 2 &&
      css`
        width: 6.75rem;
        height: 9rem;
      `}

    ${({ $variant }) =>
      $variant === 3 &&
      css`
        width: 5.5rem;
        height: 5.5rem;
      `}
  }
`;

const Kicker = styled(motion.div)`
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
`;

const Title = styled(motion.h2)`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading["4xl"].fontSize};
  font-weight: ${({ theme }) => theme.typography.heading["4xl"].fontWeight};
  line-height: ${({ theme }) => theme.typography.heading["4xl"].lineHeight};
  color: ${({ theme }) => theme.colors.gray[50]};

  @media (max-width: 900px) {
    font-size: ${({ theme }) => theme.typography.heading["3xl"].fontSize};
    line-height: ${({ theme }) => theme.typography.heading["3xl"].lineHeight};
  }
`;

const Desc = styled(motion.p)`
  margin: 0;
  max-width: 42rem;
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.lg.regular.lineHeight};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Cta = styled(motion.a)`
  margin-top: 2.2rem;
  width: fit-content;
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  text-decoration: none;
  padding: 0.9rem 1.1rem;
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.semibold.lineHeight};
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  ${({ theme }) => css`
    color: ${theme.colors.gray[50]};
    background: ${theme.colors.brand};
    border: 1px solid ${theme.colors.brand};
  `}

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: 0 0.75rem 1.5rem rgba(152, 16, 250, 0.35);
  }
`;

const CtaIcon = styled.span`
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.brand};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`;

type ModelPhotosProps = {
  section: BodyTypeSection;
};

const ModelPhotos = ({ section }: ModelPhotosProps) => (
  <GenderGrid>
    <GenderCard>
      <GenderImageFrame>
        {section.maleImageSrc ? (
          <GenderImage src={section.maleImageSrc} alt={section.maleLabel} />
        ) : (
          <GenderLabel>{section.maleLabel}</GenderLabel>
        )}
      </GenderImageFrame>
    </GenderCard>
    <GenderCard>
      <GenderImageFrame>
        {section.femaleImageSrc ? (
          <GenderImage src={section.femaleImageSrc} alt={section.femaleLabel} />
        ) : (
          <GenderLabel>{section.femaleLabel}</GenderLabel>
        )}
      </GenderImageFrame>
    </GenderCard>
  </GenderGrid>
);

export function BodyTypeScrollShowcase() {
  const sections: BodyTypeSection[] = useMemo(
    () => [
      {
        key: "STRAIGHT",
        labelEn: "Straight",
        labelKo: "스트레이트",
        headline: "선이 돋보이는 구조감",
        desc: "직선 실루엣을 또렷하게 정리해 균형을 맞춰요.",
        cta: "스트레이트 추천 룩 보기",
        maleLabel: "Male model",
        femaleLabel: "Female model",
      },
      {
        key: "WAVE",
        labelEn: "Wave",
        labelKo: "웨이브",
        headline: "부드러운 곡선의 흐름",
        desc: "드레이프와 레이어로 가벼운 움직임을 살립니다.",
        cta: "웨이브 추천 룩 보기",
        maleLabel: "Male model",
        femaleLabel: "Female model",
      },
      {
        key: "NATURAL",
        labelEn: "Natural",
        labelKo: "내추럴",
        headline: "여유로운 질감의 균형",
        desc: "루즈한 핏과 텍스처로 자연스러운 멋을 완성해요.",
        cta: "내추럴 추천 룩 보기",
        maleLabel: "Male model",
        femaleLabel: "Female model",
      },
    ],
    [],
  );

  const theme = useTheme() as AppTheme;
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = scrollYProgress;

  const aOpacity = useTransform(p, [0, 0.28, 0.38], [1, 1, 0]);
  const bOpacity = useTransform(p, [0.25, 0.42, 0.62], [0, 1, 0]);
  const cOpacity = useTransform(p, [0.56, 0.72, 1], [0, 1, 1]);

  const aY = useTransform(p, [0, 0.35], [0, -18]);
  const bY = useTransform(p, [0.25, 0.62], [18, -18]);
  const cY = useTransform(p, [0.56, 1], [18, 0]);

  const aTitleY = useTransform(p, [0, 0.2, 0.35], [24, 0, -8]);
  const aDescY = useTransform(p, [0.05, 0.24, 0.38], [28, 0, -6]);
  const bTitleY = useTransform(p, [0.25, 0.42, 0.62], [24, 0, -8]);
  const bDescY = useTransform(p, [0.3, 0.46, 0.62], [28, 0, -6]);
  const cTitleY = useTransform(p, [0.56, 0.72, 1], [24, 0, -8]);
  const cDescY = useTransform(p, [0.6, 0.76, 1], [28, 0, -6]);
  const bImageOpacity = useTransform(p, [0.22, 0.46, 0.7], [0, 1, 0]);

  const washY = useTransform(p, [0, 1], [-140, 140]);
  // const aOrbitOpacity = useTransform(p, [0.02, 0.2], [0, 1]);
  // const bOrbitOpacity = useTransform(p, [0.3, 0.5], [0, 1]);
  // const cOrbitOpacity = useTransform(p, [0.62, 0.84], [0, 1]);

  // const aOrbit1X = useTransform(p, [0.02, 0.2], [0, 0]);
  // const aOrbit1Y = useTransform(p, [0.02, 0.2], [-140, 0]);
  // const aOrbit2X = useTransform(p, [0.02, 0.2], [140, 0]);
  // const aOrbit2Y = useTransform(p, [0.02, 0.2], [0, 0]);
  // const aOrbit3X = useTransform(p, [0.02, 0.2], [-140, 0]);
  // const aOrbit3Y = useTransform(p, [0.02, 0.2], [140, 0]);

  // const bOrbit1X = useTransform(p, [0.3, 0.5], [0, 0]);
  // const bOrbit1Y = useTransform(p, [0.3, 0.5], [-140, 0]);
  // const bOrbit2X = useTransform(p, [0.3, 0.5], [140, 0]);
  // const bOrbit2Y = useTransform(p, [0.3, 0.5], [0, 0]);
  // const bOrbit3X = useTransform(p, [0.3, 0.5], [-140, 0]);
  // const bOrbit3Y = useTransform(p, [0.3, 0.5], [140, 0]);

  // const cOrbit1X = useTransform(p, [0.62, 0.84], [0, 0]);
  // const cOrbit1Y = useTransform(p, [0.62, 0.84], [-140, 0]);
  // const cOrbit2X = useTransform(p, [0.62, 0.84], [140, 0]);
  // const cOrbit2Y = useTransform(p, [0.62, 0.84], [0, 0]);
  // const cOrbit3X = useTransform(p, [0.62, 0.84], [-140, 0]);
  // const cOrbit3Y = useTransform(p, [0.62, 0.84], [140, 0]);

  return (
    <Wrap>
      <Tall ref={ref} as="section">
        <Sticky>
          <ScrollWash style={{ y: washY }} />
          <Nav>
            {sections.map((s, idx) => {
              const navRange =
                idx === 0 ? [0, 0.28, 0.38] : idx === 1 ? [0.25, 0.42, 0.62] : [0.56, 0.72, 1];
              const navColors =
                idx === 2
                  ? [theme.colors.gray[500], theme.colors.brand, theme.colors.brand]
                  : [theme.colors.gray[500], theme.colors.brand, theme.colors.gray[500]];
              const navColor = useTransform(p, navRange, navColors);
              const navOpacity =
                idx === 2
                  ? useTransform(p, navRange, [0.55, 1, 1])
                  : useTransform(p, navRange, [0.55, 1, 0.55]);
              const dotColor = useTransform(p, navRange, navColors);
              const dotHeight =
                idx === 2
                  ? useTransform(p, navRange, ["0.35rem", "2.4rem", "2.4rem"])
                  : useTransform(p, navRange, ["0.35rem", "2.4rem", "0.35rem"]);

              return (
                <NavItem
                  key={s.key}
                  style={{ color: navColor, opacity: navOpacity }}
                  onClick={() => {
                    const target = idx === 0 ? 0.12 : idx === 1 ? 0.42 : 0.8;
                    const el = ref.current;
                    if (!el) return;
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    const h = el.offsetHeight - window.innerHeight;
                    window.scrollTo({ top: top + h * target, behavior: "smooth" });
                  }}
                  aria-label={`${s.labelKo} 섹션으로 이동`}
                >
                  <NavText>
                    <NavKo>{s.labelKo}</NavKo>
                    <NavEn>{s.labelEn}</NavEn>
                  </NavText>
                  <Dot style={{ backgroundColor: dotColor, height: dotHeight }} />
                </NavItem>
              );
            })}
          </Nav>
          <Frame>
            <Stage>
              <Layer style={{ opacity: aOpacity }}>
                <LayerInner>
                  <CopyBlock style={{ y: aY }}>
                    <Kicker initial={false} animate={{ opacity: 1 }}>
                      BODY TYPE 01
                    </Kicker>
                    <Title initial={false} animate={{ opacity: 1 }} style={{ y: aTitleY }}>
                      {sections[0].labelKo}
                    </Title>
                    <Desc initial={false} animate={{ opacity: 1 }} style={{ y: aDescY }}>
                      {sections[0].headline}
                    </Desc>
                    <Cta href="/types/straight">
                      {sections[0].cta}
                      <CtaIcon aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3.5 8h8.5M8.5 3.5l3 4.5-3 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </CtaIcon>
                    </Cta>
                  </CopyBlock>
                  <VisualBlock style={{ y: aY }}>
                    {/* Orbit shapes hidden for now. */}
                    {/* <OrbitGroup>
                      <OrbitShape
                        $tone="STRAIGHT"
                        $shape="rect"
                        $variant={1}
                        style={{ x: aOrbit1X, y: aOrbit1Y, opacity: aOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="STRAIGHT"
                        $shape="rect"
                        $variant={2}
                        style={{ x: aOrbit2X, y: aOrbit2Y, opacity: aOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="STRAIGHT"
                        $shape="rect"
                        $variant={3}
                        style={{ x: aOrbit3X, y: aOrbit3Y, opacity: aOrbitOpacity }}
                      />
                    </OrbitGroup> */}
                    <ModelPhotos section={sections[0]} />
                  </VisualBlock>
                </LayerInner>
              </Layer>

              <Layer>
                <LayerInner>
                  <CopyBlock style={{ y: bY, opacity: bOpacity }}>
                    <Kicker initial={false} animate={{ opacity: 1 }}>
                      BODY TYPE 02
                    </Kicker>
                    <Title initial={false} animate={{ opacity: 1 }} style={{ y: bTitleY }}>
                      {sections[1].labelKo}
                    </Title>
                    <Desc initial={false} animate={{ opacity: 1 }} style={{ y: bDescY }}>
                      {sections[1].headline}
                    </Desc>
                    <Cta href="/types/wave">
                      {sections[1].cta}
                      <CtaIcon aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3.5 8h8.5M8.5 3.5l3 4.5-3 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </CtaIcon>
                    </Cta>
                  </CopyBlock>
                  <VisualBlock style={{ opacity: bImageOpacity }}>
                    {/* Orbit shapes hidden for now. */}
                    {/* <OrbitGroup>
                      <OrbitShape
                        $tone="WAVE"
                        $shape="wave"
                        $variant={1}
                        style={{ x: bOrbit1X, y: bOrbit1Y, opacity: bOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="WAVE"
                        $shape="wave"
                        $variant={2}
                        style={{ x: bOrbit2X, y: bOrbit2Y, opacity: bOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="WAVE"
                        $shape="wave"
                        $variant={3}
                        style={{ x: bOrbit3X, y: bOrbit3Y, opacity: bOrbitOpacity }}
                      />
                    </OrbitGroup> */}
                    <ModelPhotos section={sections[1]} />
                  </VisualBlock>
                </LayerInner>
              </Layer>

              <Layer style={{ opacity: cOpacity }}>
                <LayerInner>
                  <CopyBlock style={{ y: cY }}>
                    <Kicker initial={false} animate={{ opacity: 1 }}>
                      BODY TYPE 03
                    </Kicker>
                    <Title initial={false} animate={{ opacity: 1 }} style={{ y: cTitleY }}>
                      {sections[2].labelKo}
                    </Title>
                    <Desc initial={false} animate={{ opacity: 1 }} style={{ y: cDescY }}>
                      {sections[2].headline}
                    </Desc>
                    <Cta href="/types/natural">
                      {sections[2].cta}
                      <CtaIcon aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3.5 8h8.5M8.5 3.5l3 4.5-3 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </CtaIcon>
                    </Cta>
                  </CopyBlock>
                  <VisualBlock style={{ y: cY }}>
                    {/* Orbit shapes hidden for now. */}
                    {/* <OrbitGroup>
                      <OrbitShape
                        $tone="NATURAL"
                        $shape="tri"
                        $variant={1}
                        style={{ x: cOrbit1X, y: cOrbit1Y, opacity: cOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="NATURAL"
                        $shape="tri"
                        $variant={2}
                        style={{ x: cOrbit2X, y: cOrbit2Y, opacity: cOrbitOpacity }}
                      />
                      <OrbitShape
                        $tone="NATURAL"
                        $shape="tri"
                        $variant={3}
                        style={{ x: cOrbit3X, y: cOrbit3Y, opacity: cOrbitOpacity }}
                      />
                    </OrbitGroup> */}
                    <ModelPhotos section={sections[2]} />
                  </VisualBlock>
                </LayerInner>
              </Layer>
            </Stage>
          </Frame>
        </Sticky>
      </Tall>
    </Wrap>
  );
}
