import { FaArrowRightLong } from "react-icons/fa6"
import { motion, useScroll, useTransform } from "framer-motion";

import { useEffect, useMemo, useRef, useState } from "react";

import styled, { css } from "styled-components";


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
  position: relative;
`;

const PinnedSectionWrap = styled.section`
  position: relative;
  height: 220vh;
  min-height: 200vh;
`;

const PinnedSticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  align-items: center;
`;

const PinnedContent = styled(motion.div)`
  width: 100%;
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

  @media (min-width: 901px) {
    padding-right: calc(${({ theme }) => theme.spacing.lg} + 6.5rem);
  }

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
`;

const NavRail = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 20;

  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(-8px)")};
  transition: opacity 0.2s ease, transform 0.2s ease;

  @media (max-width: 900px) {
    display: none;
  }
`;


const FloatingNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
  text-align: right;
  margin-right: 0.75rem;
  pointer-events: auto;
`;

const NavItem = styled.button<{ $active: boolean }>`
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
  color: ${({ theme, $active }) => ($active ? theme.colors.brand : theme.colors.gray[400])};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const NavText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  align-items: flex-end;
  text-align: right;
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

const NavDot = styled.span<{ $active: boolean }>`
  width: 0.32rem;
  height: ${({ $active }) => ($active ? "2.4rem" : "0.35rem")};
  border-radius: 9999px;
  background: currentColor;
  flex: 0 0 auto;
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  transition: height 0.25s ease, opacity 0.25s ease;
`;



const CopyBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 36rem;
  padding-left: 0.5rem;
  padding-top: 4rem;
  @media (max-width: 1024px){
      padding-top: 0.5rem;
      gap: 0.5rem;
  }
`;

const VisualBlock = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
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
    width: 26rem;
  }

  @media (max-width: 500px) {
    width: min(100%, 22rem);
    margin: 0 auto;
    transform: none;
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const GenderCard = styled.div<{ $active?: boolean }>`
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

  @media (max-width: 500px) {
    display: ${({ $active }) => ($active ? "flex" : "none")};
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

const GenderSwitch = styled.div`
  display: none;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 500px) {
    display: inline-flex;
  }
`;

const GenderSwitchButton = styled.button<{ $active: boolean }>`
  border-radius: 9999px;
  border: 0.0625rem solid
    ${({ theme, $active }) => ($active ? theme.colors.brand : theme.colors.gray[700])};
  background: ${({ theme, $active }) => ($active ? theme.colors.brand : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[300])};
  padding: 0.35rem 0.75rem;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[50])};
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
  margin-top: 1.5rem;
  width: fit-content;
  display: inline-flex;
  gap: 0.75rem;
  align-items: center;
  text-decoration: none;
  padding: 0.9rem 1rem;
  border-radius: 10px;
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
  @media (max-width: 1024px){
    padding: 0.5rem 0.9rem;
    margin-top: 0.75rem;

  }
`;


type ModelPhotosProps = {
  section: BodyTypeSection;
};

type ActiveGender = "male" | "female";

const ModelPhotos = ({ section }: ModelPhotosProps) => {
  const [activeGender, setActiveGender] = useState<ActiveGender>("female");

  return (
    <>
      <GenderGrid>
        <GenderCard $active={activeGender === "male"}>
          <GenderImageFrame>
            {section.maleImageSrc ? (
              <GenderImage src={section.maleImageSrc} alt={section.maleLabel} />
            ) : (
              <GenderLabel>{section.maleLabel}</GenderLabel>
            )}
          </GenderImageFrame>
        </GenderCard>
        <GenderCard $active={activeGender === "female"}>
          <GenderImageFrame>
            {section.femaleImageSrc ? (
              <GenderImage src={section.femaleImageSrc} alt={section.femaleLabel} />
            ) : (
              <GenderLabel>{section.femaleLabel}</GenderLabel>
            )}
          </GenderImageFrame>
        </GenderCard>
      </GenderGrid>
      <GenderSwitch>
        <GenderSwitchButton
          type="button"
          $active={activeGender === "female"}
          aria-pressed={activeGender === "female"}
          onClick={() => setActiveGender("female")}
        >
          Female
        </GenderSwitchButton>
        <GenderSwitchButton
          type="button"
          $active={activeGender === "male"}
          aria-pressed={activeGender === "male"}
          onClick={() => setActiveGender("male")}
        >
          Male
        </GenderSwitchButton>
      </GenderSwitch>
    </>
  );
};

const ctaHrefMap: Record<BodyTypeKey, string> = {
  STRAIGHT: "/types/straight",
  WAVE: "/types/wave",
  NATURAL: "/types/natural",
};

type PinnedSectionProps = {
  section: BodyTypeSection;
  index: number;
};

const PinnedSection = ({ section, index }: PinnedSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [40, 0, 0, -40]);
  const sectionId = `body-type-${section.key.toLowerCase()}`;

  return (
    <PinnedSectionWrap ref={sectionRef} id={sectionId} data-key={section.key}>
      <PinnedSticky>
        {/* <ScrollWash style={{ y: washY }} /> */}
        <PinnedContent style={{ opacity, y }}>
          <Frame>
            <CopyBlock>
              <Kicker initial={false} animate={{ opacity: 1 }}>
                BODY TYPE {String(index + 1).padStart(2, "0")}
              </Kicker>
              <Title initial={false} animate={{ opacity: 1 }}>
                {section.labelKo}
              </Title>
              <Desc initial={false} animate={{ opacity: 1 }}>
                {section.headline} <hr />
                {section.desc}
              </Desc>
              <Cta href={ctaHrefMap[section.key]}>
                {section.cta} <FaArrowRightLong />
              </Cta>
            </CopyBlock>
            <VisualBlock>
              <ModelPhotos section={section} />
            </VisualBlock>
          </Frame>
        </PinnedContent>
      </PinnedSticky>
    </PinnedSectionWrap>
  );
};

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

  const [activeKey, setActiveKey] = useState<BodyTypeKey>("STRAIGHT");


  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(`body-type-${section.key.toLowerCase()}`))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topEntry = visible.sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio,
        )[0];
        const key = (topEntry.target as HTMLElement).dataset.key as BodyTypeKey | undefined;
        if (key) setActiveKey(key);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const [showNav, setShowNav] = useState(false);
  useEffect(() => {
    const first = document.getElementById("body-type-straight");
    if (!first) return;

    const onScroll = () => {
      const top = first.getBoundingClientRect().top;
      setShowNav(top <= 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Wrap>
      <NavRail $show={showNav}>
        <FloatingNav aria-label="Body type sections">
          {sections.map((section) => {
            const isActive = activeKey === section.key;
            return (
              <NavItem
                key={section.key}
                $active={isActive}
                onClick={() => {
                  const target = document.getElementById(`body-type-${section.key.toLowerCase()}`);
                  if (!target) return;
                  const top = target.getBoundingClientRect().top + window.scrollY;
                  const bottom = top + target.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: Math.max(bottom, 0), behavior: "smooth" });
                }}
              >
                <NavText>
                  <NavKo>{section.labelKo}</NavKo>
                  <NavEn>{section.labelEn}</NavEn>
                </NavText>
                <NavDot $active={isActive} />
              </NavItem>
            );
          })}
        </FloatingNav>
      </NavRail>
      {sections.map((section, index) => (
        <PinnedSection key={section.key} section={section} index={index} />
      ))}
    </Wrap>
  );
}
