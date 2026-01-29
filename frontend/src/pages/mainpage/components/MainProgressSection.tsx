import { motion, useScroll, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import MainDataDrivenIcon1 from "@/assets/MainDataDrivenIcon1.svg";
import MainDataDrivenIcon2 from "@/assets/MainDataDrivenIcon2.svg";
import MainDataDrivenIcon3 from "@/assets/MainDataDrivenIcon3.svg";

export const MainProgressSection = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const [maxTitleHeight, setMaxTitleHeight] = useState<number>();

  useLayoutEffect(() => {
    const heights = titleRefs.current.map((el) => el?.offsetHeight || 0);
    setMaxTitleHeight(Math.max(...heights));
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "end 60%"],
  });
  const sectionOpacity = useTransform(scrollYProgress, [0.4, 0.65], [0, 1]);

  return (
    <SectionWrap ref={sectionRef}>
      <Container>
        <Header>
          <HeaderLeft>
            <Eyebrow>How it works</Eyebrow>
            <TitleRow>
              <TitleStrong>Data Driven</TitleStrong>
              <TitleLight>Styling Process.</TitleLight>
            </TitleRow>
          </HeaderLeft>
          <HeaderRight>
            단 3초 만에 당신의 골격을 분석하고,
            <br />
            가상 피팅으로 베스트 스타일을 확인하세요.
          </HeaderRight>
        </Header>
        <Cards>
          {cardData.map((c, i) => {
            const baseY = -48 + -i * 70;

            const y = useTransform(scrollYProgress, [0.4, 0.65], [baseY, 0]);
            return (
              <motion.div
                key={c.title}
                style={{
                  y,
                  opacity: sectionOpacity,
                }}
              >
                <Card>
                  <IconWrap>
                    <IconImg src={c.icon} alt="" />
                  </IconWrap>
                  <TextBlock>
                    <CardTitle
                      ref={(el) => {
                        if (el) titleRefs.current[i] = el;
                      }}
                      $height={maxTitleHeight}
                    >
                      {c.title}
                    </CardTitle>
                    <CardDesc>{c.desc}</CardDesc>
                  </TextBlock>
                  <Divider />
                </Card>
              </motion.div>
            );
          })}
        </Cards>
      </Container>
    </SectionWrap>
  );
};

const SectionWrap = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[900]};
  padding: 8rem 0;

  @media (max-width: 1024px) {
    padding: 6.5rem 0;
  }

  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: 5rem;

  @media (max-width: 1024px) {
    padding: 0 2rem;
    gap: 4rem;
  }

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    gap: 3rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xxl};
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    align-items: center;
    text-align: center;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.brand};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: 700;
  letter-spacing: 0.075rem;
  text-transform: uppercase;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TitleStrong = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.heading["3xl"].fontSize};
  font-weight: ${({ theme }) => theme.typography.heading["3xl"].fontWeight};
  line-height: 3rem;

  @media (max-width: 1024px) {
    font-size: 2.5rem;
    line-height: 2.75rem;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
`;

const TitleLight = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 2.69375rem;
  font-weight: 400;
  line-height: 3rem;

  @media (max-width: 1024px) {
    font-size: 2.25rem;
    line-height: 2.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
`;

const HeaderRight = styled.p`
  margin: 0;
  max-width: 20rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: 1.421875rem;

  @media (max-width: 1024px) {
    max-width: none;
  }

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Cards = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: nowrap;
  align-items: stretch;

  > * {
    flex: 1 1 0;
    min-width: 0;
  }

  @media (max-width: 1024px) {
    flex-wrap: wrap;

    > * {
      flex: 1 1 calc(50% - 1.25rem);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};

    > * {
      flex: 1 1 100%;
    }
  }
`;

const Card = styled.div`
  --card-border: ${({ theme }) => theme.colors.gray[700]};
  --card-icon-bg: ${({ theme }) => theme.colors.gray[700]};
  --card-divider-bg: ${({ theme }) => theme.colors.gray[700]};
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.gray[800]};
  border-radius: 1rem;
  border: 0.0625rem solid var(--card-border);
  box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
    --card-border: ${({ theme }) => theme.colors.brand};
    --card-icon-bg: ${({ theme }) => theme.colors.brand};
    --card-divider-bg: ${({ theme }) => theme.colors.brand};
  }

  @media (max-width: 768px) {
    padding: 1.75rem;
  }
`;
const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.md};
  }
`;

const IconWrap = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background: var(--card-icon-bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
`;

const IconImg = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  display: block;
`;

const CardTitle = styled.div<{ $height?: number }>`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.75rem;

  height: ${({ $height }) => ($height ? `${$height}px` : "auto")};

  @media (max-width: 768px) {
    font-size: 1.125rem;
    line-height: 1.5rem;
    height: auto;
  }
`;

const CardDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: 1.421875rem;
  margin-bottom: 1.5rem;

  flex: 1;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
    line-height: 1.25rem;
  }
`;

const Divider = styled.div`
  width: 3rem;
  height: 0.25rem;
  background: var(--card-divider-bg);
  margin-top: auto;
  transition: background-color 0.3s ease;

  @media (max-width: 768px) {
    width: 2.5rem;
  }
`;

const cardData = [
  {
    icon: MainDataDrivenIcon1,
    title: "01. AI Skeletal Analysis",
    desc: (
      <>
        전신 사진을 업로드하면 AI가 신체 관절 포인트와 비율을 계산하여 당신의 고유한 골격 타입을
        판별합니다.
      </>
    ),
  },
  {
    icon: MainDataDrivenIcon2,
    title: "02. Best vs Worst Report",
    desc: (
      <>
        분석된 체형을 바탕으로 체형을 보완해주는 베스트 아이템과 단점을 부각시키는 워스트 아이템을
        비교 분석합니다.
      </>
    ),
  },
  {
    icon: MainDataDrivenIcon3,
    title: "03. AI Virtual Fitting",
    desc: (
      <>
        실패 없는 쇼핑을 위해, 추천된 베스트 룩과 피해야 할 워스트 룩을 내 사진에 직접 가상으로
        입혀보세요.
      </>
    ),
  },
] as const;
