import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

import checkIcon from "@/assets/check.svg";
import img1 from "@/assets/image/best_wave_man2.png";
import img2 from "@/assets/image/worst_wave_man2.png";

const SectionWrap = styled.section`
  width: 100%;
  padding: 8rem 0;
  background: ${({ theme }) => theme.colors.gray[900]};

  @supports (content-visibility: auto) {
    content-visibility: auto;
    contain-intrinsic-size: 1px 900px;
  }

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxxl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    gap: ${({ theme }) => theme.spacing.xl};
    justify-items: center;
  }
`;

const Stack = styled.div`
  position: relative;
  width: 100%;
  max-width: 30.75rem;
  aspect-ratio: 2 / 3;
  border-radius: 0.75rem;
  justify-self: start;

  @media (max-width: 1024px) {
    justify-self: center;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    max-width: 24rem;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray[400]};
  background: ${({ theme }) => theme.colors.gray[900]};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const FrontCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gray[800]};
`;

const ResultBadge = styled.div<{ $variant: "best" | "worst" }>`
  position: absolute;
  top: 1rem;
  right: ${({ $variant}) =>($variant === "best" ? "1.5rem" : "1.8rem")};
  z-index: 2;
  padding: 0.35rem 0.75rem;
  border-radius: 0.45rem;
  background: transparent;
  border: 0.0625rem solid
    ${({ $variant, theme }) => ($variant === "best" ? "#9810FA" : theme.colors.gray[500])};
  color: ${({ $variant, theme }) => ($variant === "best" ? "#9810FA" : theme.colors.gray[500])};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transform: translate(30%, -30%);

  @media (max-width: 768px) {
    top: 1.25rem;
      right: ${({ $variant}) =>($variant === "best" ? "1.25rem" : "1.5rem")};
    transform: translate(24%, -24%);
  }
`;

const InnerSurface = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  left: 2rem;
  right: 2rem;
  bottom: 2rem;

  background: ${({ theme }) => theme.colors.gray[900]};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray[50]};
  border-radius: 0.5rem;
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(0.25rem);

  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    left: 1.25rem;
    right: 1.25rem;
    bottom: 1.25rem;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const OverlayTitle = styled.div`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: 800;
  line-height: 1rem;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 0.375rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.gray[50]};
  overflow: hidden;
`;

const ProgressBar = styled.div<{ value: number }>`
  width: ${({ value }) => `${value}%`};
  height: 100%;
  border-radius: 9999px;
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.colors.purple[200]} 0%, ${theme.colors.purple[900]} 100%)`};
`;

const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
`;

const ProgressValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 0.9rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.lg};
    max-width: 24rem;
  }
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleStrong = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.heading["3xl"].fontSize};
  font-weight: ${({ theme }) => theme.typography.heading["3xl"].fontWeight};
  line-height: 3rem;

  @media (max-width: 768px) {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
`;

const TitleLight = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 2.69375rem;
  font-weight: 700;
  line-height: 3rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  line-height: 1.625rem;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
    line-height: 1.375rem;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.96875rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CheckCircle = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.brand};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

const CheckIcon = styled.img.attrs({
  loading: "lazy",
  decoding: "async",
})`
  width: 0.625rem;
  height: 0.625rem;
  object-fit: contain;
  display: block;
`;

const ItemText = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  line-height: 1.25rem;
`;

const LinkRow = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: 700;
  line-height: 1.25rem;
  text-decoration: none;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.gray[50]};
  padding-bottom: 0.125rem;
`;

const OFFSET = 24;
const EASE = [0.22, 1, 0.36, 1] as const;

const frontVariants = {
  rest: {
    x: 0,
    y: 0,
    scale: 1,
    zIndex: 2,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },
  hover: {
    x: OFFSET,
    y: OFFSET,
    scale: 0.98,
    zIndex: 1,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    transition: { duration: 0.45, ease: EASE },
  },
};

const backVariants = {
  rest: {
    x: OFFSET,
    y: OFFSET,
    scale: 1,
    zIndex: 1,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },
  hover: {
    x: 0,
    y: [OFFSET, -14, 0],
    scale: 1,
    zIndex: 2,
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    transition: { duration: 0.55, ease: EASE },
  },
};

const Jang = styled.img.attrs({
  loading: "lazy",
  decoding: "async",
})`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
`;

export const MainAnalysisSection = () => {
  const [hovered, setHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");
    const syncMode = (matches: boolean) => {
      setIsDesktop(matches);
      setHovered(false);
    };

    syncMode(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent) => {
      syncMode(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setHovered(false);
  };

  const handleClick = () => {
    if (isDesktop) return;
    setHovered((prev) => !prev);
  };

  return (
    <SectionWrap>
      <Container>
        <Stack onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
          <Card animate={hovered ? "hover" : "rest"} variants={backVariants}>
            <InnerSurface>
              <Jang src={img2} />
              <ResultBadge $variant="worst">WORST</ResultBadge>
            </InnerSurface>
             <Overlay>
              <OverlayTitle>Analysis Result</OverlayTitle>

              <ProgressTrack>
                <ProgressBar value={85} />
              </ProgressTrack>

              <ProgressLabels>
                <ProgressLabel></ProgressLabel>
                <ProgressValue>Wave (85%)</ProgressValue>
              </ProgressLabels>
            </Overlay>
          </Card>

          <FrontCard animate={hovered ? "hover" : "rest"} variants={frontVariants}>
            <InnerSurface>
              <Jang src={img1} />
              <ResultBadge $variant="best">BEST</ResultBadge>
            </InnerSurface>

            <Overlay>
              <OverlayTitle>Analysis Result</OverlayTitle>

              <ProgressTrack>
                <ProgressBar value={85} />
              </ProgressTrack>

              <ProgressLabels>
                <ProgressLabel></ProgressLabel>
                <ProgressValue>Wave (85%)</ProgressValue>
              </ProgressLabels>
            </Overlay>
          </FrontCard>
        </Stack>

        <Content>
          <Heading data-aos="fade-up" data-aos-delay="0">
            <TitleStrong>Beyond the Trend,</TitleStrong>
            <TitleLight>Back to Basic.</TitleLight>
          </Heading>

          <Description data-aos="fade-up" data-aos-delay="150">
            유행을 좇는 패션은 금방 지치기 마련입니다.
            <br />
            본투비는 당신이 가진 고유의 선을 이해하고,
            <br />
            가장 자연스럽게 빛나는 스타일을 찾아줍니다.
          </Description>

          <List>
            <ListItem data-aos="fade-up" data-aos-delay="300">
              <CheckCircle>
                <CheckIcon src={checkIcon} alt="" />
              </CheckCircle>
              <ItemText>체형별 맞춤 가상 피팅 서비스</ItemText>
            </ListItem>

            <ListItem data-aos="fade-up" data-aos-delay="450">
              <CheckCircle>
                <CheckIcon src={checkIcon} alt="" />
              </CheckCircle>
              <ItemText>같은 체형 유저들과의 스타일 공유 커뮤니티</ItemText>
            </ListItem>

            <ListItem data-aos="fade-up" data-aos-delay="600">
              <CheckCircle>
                <CheckIcon src={checkIcon} alt="" />
              </CheckCircle>
              <ItemText>AI가 매일 업데이트하는 추천 아이템</ItemText>
            </ListItem>
          </List>

          <LinkRow data-aos="fade-up" data-aos-delay="750">
            <Link href="/community">
              View Community <span>→</span>
            </Link>
          </LinkRow>
        </Content>
      </Container>
    </SectionWrap>
  );
};
