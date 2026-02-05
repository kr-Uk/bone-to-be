import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";

import checkIcon from "@/assets/check.svg";
import img1 from "@/assets/인동장씨호정.png";

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
  height: 46rem;
  border-radius: 0.75rem;

  @media (max-width: 1024px) {
    height: 38rem;
  }

  @media (max-width: 768px) {
    height: 26rem;
    max-width: 24rem;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray[400]};
  background: transparent;
  padding: 2.5rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const InnerSurface = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SurfaceText = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  line-height: 1.5rem;
`;

const Overlay = styled.div`
  position: absolute;
  left: 2.5rem;
  right: 2.5rem;
  bottom: 2.5rem;

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
    left: 1.5rem;
    right: 1.5rem;
    bottom: 1.5rem;
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
  display: flex;
`;

export const MainAnalysisSection = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <SectionWrap>
      <Container>
        <Stack onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <Card animate={hovered ? "hover" : "rest"} variants={backVariants}>
            <InnerSurface>
              <SurfaceText>Back Image</SurfaceText>
            </InnerSurface>
          </Card>

          <Card animate={hovered ? "hover" : "rest"} variants={frontVariants}>
            <InnerSurface>
              <Jang src={img1} />
              <SurfaceText>Front Image</SurfaceText>
            </InnerSurface>

            <Overlay>
              <OverlayTitle>Analysis Result</OverlayTitle>

              <ProgressTrack>
                <ProgressBar value={85} />
              </ProgressTrack>

              <ProgressLabels>
                <ProgressLabel>Straight</ProgressLabel>
                <ProgressValue>Natural (85%)</ProgressValue>
              </ProgressLabels>
            </Overlay>
          </Card>
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
