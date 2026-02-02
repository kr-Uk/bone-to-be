import styled, { keyframes } from "styled-components";

import { MainHeader } from "@/shared/components/MainHeader";
import { useScrollSpy, type SectionId } from "@/pages/AboutPage/hooks/useScrollSpy";
import { useSectionAnimation } from "@/pages/AboutPage/hooks/useSectionAnimation";
import { BackgroundEffects } from "@/pages/AboutPage/components/BackgroundEffects";
import { AboutHero } from "@/pages/AboutPage/components/AboutHero";
import { TypeSection } from "@/pages/AboutPage/components/TypeSection";
import { ScrollNav } from "@/pages/AboutPage/components/ScrollNav";
import type { JSX } from "react";

interface TypeSectionData {
  id: SectionId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
}

const sections: TypeSectionData[] = [
  {
    id: "straight",
    index: "01",
    title: "Straight Type",
    subtitle: "Firm & Straight",
    description:
      '"입체적이고 탄탄한 바디 라인"\n\n상체에 두께감이 있고 허리 위치가 높은 것이 특징입니다.\n전체적으로 근육질의 탄탄한 느낌을 주며, 옆에서 보았을 때 입체감이 뚜렷합니다.',
    bullets: [
      "두께감 있는 상체와 둥근 어깨",
      "높은 허리 위치와 긴 다리",
      "근육이 덮여 잘 보이지 않는 쇄골",
    ],
  },
  {
    id: "wave",
    index: "02",
    title: "Wave Type",
    subtitle: "Soft & Curved",
    description:
      '"부드러운 곡선과 여리여리한 실루엣"\n\n상체가 얇고 화려하지 않으며, 몸의 밸런스가 하체에 실려 있습니다.\n허리가 길고 가늘며, 옆에서 보았을 때 몸이 납작한 편입니다.',
    bullets: ["두께감 없는 처진 느낌의 어깨", "낮은 허리 위치", "길고 가는 목"],
    reverse: true,
  },
  {
    id: "natural",
    index: "03",
    title: "Natural Type",
    subtitle: "Linear & Structured",
    description:
      '"프레임이 뚜렷하고 멋스러운 모델 체형"\n\n어깨가 넓고 쇄골, 무릎 등 관절 뼈가 도드라집니다.\n근육이나 지방감보다는 뼈대 자체가 강조되는 체형입니다.',
    bullets: ["넓고 각진 어깨", "도드라지는 쇄골과 관절", "긴 팔다리, 중성적인 매력"],
  },
];

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  overflow-x: hidden;
  font-family:
    "Pretendard Variable",
    "Pretendard",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Helvetica,
    Arial,
    sans-serif;
`;

const HeaderWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
`;

const Main = styled.main`
  position: relative;
  z-index: 10;
  padding-top: 7rem;
  padding-bottom: 5rem;
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 0 2.5rem;
  }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(2rem); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOutUp = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-2rem); }
`;

const AnimatedSection = styled.div`
  &.animate__animated {
    animation-duration: 0.8s;
    animation-fill-mode: both;
  }

  &.animate__fadeInUp {
    animation-name: ${fadeInUp};
  }

  &.animate__fadeOutUp {
    animation-name: ${fadeOutUp};
  }
`;

export default function AboutPage(): JSX.Element {
  const sectionIds = sections.map((section) => section.id) as SectionId[];
  const { progress, activeId } = useScrollSpy(sectionIds);
  const animationState = useSectionAnimation(sectionIds);

  return (
    <Page>
      <BackgroundEffects />
      <ScrollNav sectionIds={sectionIds} progress={progress} activeId={activeId} />

      <Main>
        <Container>
          <AboutHero />
        </Container>

        {sections.map((section) => (
          <Container key={section.id}>
            <AnimatedSection
              className={
                animationState[section.id] === "in"
                  ? "animate__animated animate__fadeInUp"
                  : "animate__animated animate__fadeOutUp"
              }
            >
              <TypeSection {...section} />
            </AnimatedSection>
          </Container>
        ))}
      </Main>
    </Page>
  );
}
