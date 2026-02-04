import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { CheckCircle2 } from "lucide-react";

interface ReportSummaryProps {
  bodyTypeKey: "natural" | "wave" | "straight";
}

const SummarySection = styled.section`
  width: 100%;
  margin: 0 auto;
`;

const SummaryPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding: 48px;
  background: rgba(255, 255, 255, 0.03);

  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  width: 100%;

  @media (max-width: 1024px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const AccentGlow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at top right, rgba(152, 16, 250, 0.1), transparent 70%);
  border-radius: 9999px;
  filter: blur(120px);
  transform: translate(30%, -50%);
  pointer-events: none;
`;

const SummaryHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SummaryEyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.purple[600]};
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
`;

const SummaryTitle = styled.h2`
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 48px;
  color: ${({ theme }) => theme.colors.gray[50]};

  @media (max-width: 1024px) {
    font-size: 40px;
    line-height: 44px;
  }
  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 36px;
  }
`;

const SummaryTitleAccent = styled.span`
  color: ${({ theme }) => theme.colors.purple[600]};
`;

const SummaryDescription = styled.p`
  margin: 0;
  max-width: 672px;
  font-size: 20px;
  font-weight: 300;
  line-height: 32.5px;
  color: ${({ theme }) => theme.colors.gray[300]};

  @media (max-width: 1024px) {
    font-size: 18px;
    line-height: 28px;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.purple[600]};
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
`;

const TabSection = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DesktopTabBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const MobileTabBody = styled.div`
  display: none;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 1023px) {
    display: flex;
  }
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[600]};

  @media (max-width: 1023px) {
    display: none;
  }
`;

const TabButton = styled(motion.button)<{ $active: boolean }>`
  position: relative;
  border: none;
  background: none;
  padding: 0 0 32px;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

const TabNumber = styled(motion.span)<{ $active: boolean }>`
  display: block;
  margin-bottom: 12px;
  font-size: 60px;
  font-weight: 900;
  line-height: 60px;
  color: ${({ theme }) => theme.colors.purple[600]};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  transition: color 0.3s ease, opacity 0.3s ease;

  @media (max-width: 1024px) {
    font-size: 44px;
    line-height: 48px;
  }
`;

const TabLabel = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.purple[600]};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 4px;
  opacity: 0.8;
`;

const TabTitle = styled(motion.span)<{ $active: boolean }>`
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[400])};
  transition: color 0.3s ease;

  @media (max-width: 1024px) {
    font-size: 20px;
  }
`;

const TabUnderline = styled(motion.div)<{ $active: boolean }>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: ${({ theme }) => theme.colors.purple[600]};
  transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
  transform-origin: left center;
  transition: transform 0.3s ease;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const TabContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  height: 160px;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const TabContentCell = styled.div<{ $active: boolean }>`
  position: relative;
  height: 160px;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const MobileRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
`;

const MobileSideLine = styled(motion.div)<{ $active: boolean }>`
  width: 3px;
  height: 100%;
  background: ${({ theme }) => theme.colors.purple[600]};
  transform: scaleY(${({ $active }) => ($active ? 1 : 0)});
  transform-origin: top center;
  transition: transform 0.3s ease;
`;

const MobileContent = styled.div`
  min-height: 120px;
`;

const TabContentText = styled(motion.p)<{ $active: boolean }>`
  margin: 0;
  font-size: 20px;
  font-weight: 300;
  line-height: 32px;
  color: ${({ theme, $active }) => ($active ? theme.colors.gray[50] : theme.colors.gray[600])};
  opacity: ${({ $active }) => ($active ? 1 : 0.4)};
  transition: color 0.3s ease, opacity 0.3s ease;

  @media (max-width: 1024px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const BottomSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[600]};
  padding-top: 40px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px;
  }
`;

const BottomTitle = styled.h4`
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.purple[600]};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BottomTitleLine = styled.span`
  display: inline-block;
  width: 24px;
  height: 1px;
  background: ${({ theme }) => theme.colors.purple[600]};
`;

const Checklist = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChecklistItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ChecklistIcon = styled(CheckCircle2)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.purple[600]};
  opacity: 0.8;
`;

const ChecklistText = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 300;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const SkinTitle = styled.p`
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 300;
  line-height: 30px;
  color: ${({ theme }) => theme.colors.gray[50]};

  @media (max-width: 1024px) {
    font-size: 20px;
    line-height: 26px;
  }
`;

const SkinDescription = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 300;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const TYPE_CONTENT = {
  natural: {
    description: (
      <>
        고객님의 신체는 근육이나 지방의 볼륨감이 아닌,{" "}
        <HighlightText>골격 자체가 형성하는 프레임(Frame)</HighlightText>이 주도하는 체형입니다.
        마치 옷걸이처럼 어깨가 단단히 형태를 잡고 있어 어떤 옷을 입어도 옷의 형태가
        무너지지 않고 본연의 핏으로 떨어집니다.
      </>
    ),
    tabs: [
      {
        label: "Upper Zone",
        title: "목과 승모근",
        content:
          "목의 길이가 다소 짧거나, 목에서 어깨로 이어지는 승모근 라인이 발달해 있을 가능성이 높습니다. 쇄골은 뼈가 도드라지기보다 근육이나 살에 덮여 매끄럽고 깔끔한 라인을 형성하는 것이 특징입니다.",
      },
      {
        label: "Torso Volume",
        title: "흉곽과 허리",
        content:
          "흉곽의 앞뒤 폭이 넓어 옆에서 보았을 때 두께감이 느껴집니다. 갈비뼈에서 골반까지의 거리가 짧아 허리 위치가 높게 형성되어 상체가 짧고 하체가 길어 보이는 비율적 장점을 만듭니다.",
      },
      {
        label: "Lower Line",
        title: "다리와 무릎",
        content:
          "무릎 뼈가 작고 도드라지지 않으며, 허벅지 근육이 앞쪽으로 발달해 입체적인 형태를 띱니다. 종아리는 곧게 뻗어 있으며 발목 역시 뼈가 굵지 않고 탄력 있게 뻗은 실루엣을 보여줍니다.",
      },
    ],
    checklist: [
      "몸에 비해 손이 크고, 팔다리도 긴 편인가?",
      "쇄골이 잘 보이고, 뼈가 굵은 편인가?",
      "늑골(갈비뼈)이 둥글지 않고 평평한 편인가?",
      "엉덩이가 둥글게 솟기보다 납작하고 평평한 편인가?",
      "흉통의 두께가 얇거나, 바스트 탑의 위치가 조금 낮은 편인가?",
    ],
    skinTitle: '"Matte & Sinewy"',
    skinDesc:
      "피부 질감이 매트하고 드라이한 경향이 있습니다. 근육과 지방이 뼈를 덮기보다는 뼈대의 형태를 그대로 드러내며 납작하고 길게 붙는 것이 특징입니다. 이러한 드라이한 텍스처는 린넨이나 가죽 같은 거친 소재와 잘 어울립니다.",
  },
  wave: {
    description: (
      <>
        고객님의 신체는 곡선과 볼륨이 자연스럽게 드러나는{" "}
        <HighlightText>부드러운 실루엣 중심 체형</HighlightText>입니다. 허리와 골반의
        굴곡이 강조되어 여성적인 라인이 잘 나타납니다.
      </>
    ),
    tabs: [
      {
        label: "Upper Zone",
        title: "목과 승모근",
        content:
          "목선이 길고 완만하며 어깨 라인이 부드럽게 떨어집니다. 쇄골이 은은하게 드러나고 상체가 가볍고 섬세한 인상을 줍니다.",
      },
      {
        label: "Torso Volume",
        title: "흉곽과 허리",
        content:
          "허리 굴곡이 뚜렷하고 상체의 볼륨감이 자연스럽게 이어집니다. 곡선이 살아 있는 실루엣이 특징입니다.",
      },
      {
        label: "Lower Line",
        title: "다리와 무릎",
        content:
          "골반과 허벅지의 곡선이 도드라지며 다리 라인이 유연하게 이어집니다. 하체가 부드럽고 여성적인 느낌을 줍니다.",
      },
    ],
    checklist: [
      "허리 굴곡이 뚜렷하고 체형이 곡선적으로 보이는가?",
      "상체보다 골반/허벅지 라인이 더 부드럽게 드러나는가?",
      "어깨와 팔 라인이 가늘고 섬세한 편인가?",
      "무릎이나 종아리 라인이 매끈하게 이어지는가?",
      "전체적으로 부드럽고 유연한 인상을 주는가?",
    ],
    skinTitle: '"Soft & Curvy"',
    skinDesc:
      "피부 질감이 부드럽고 탄력이 있어 보이는 경향이 있습니다. 볼륨감 있는 텍스처가 곡선적인 실루엣과 잘 어울립니다.",
  },
  straight: {
    description: (
      <>
        고객님의 신체는 입체감과 탄탄함이 강조되는{" "}
        <HighlightText>볼륨 중심 체형</HighlightText>입니다. 상체의 두께감과 단단한
        라인이 특징입니다.
      </>
    ),
    tabs: [
      {
        label: "Upper Zone",
        title: "목과 승모근",
        content:
          "목이 비교적 짧고 어깨 라인이 단단하게 형성됩니다. 상체 프레임이 안정적이며 힘 있는 인상을 줍니다.",
      },
      {
        label: "Torso Volume",
        title: "흉곽과 허리",
        content:
          "흉곽이 입체적으로 발달해 두께감이 느껴집니다. 허리 굴곡이 크지 않아 상체가 단단해 보입니다.",
      },
      {
        label: "Lower Line",
        title: "다리와 무릎",
        content:
          "허벅지와 종아리가 탄탄하게 이어지며 다리 라인이 곧고 힘 있게 느껴집니다.",
      },
    ],
    checklist: [
      "상체가 두껍고 입체적으로 느껴지는가?",
      "허리 굴곡이 크지 않고 직선적으로 보이는가?",
      "어깨와 팔 라인이 단단한 편인가?",
      "허벅지와 종아리가 탄탄하게 이어지는가?",
      "전체적으로 힘 있고 안정적인 인상을 주는가?",
    ],
    skinTitle: '"Firm & Solid"',
    skinDesc:
      "피부와 조직이 탄탄하게 느껴지며, 입체감 있는 실루엣을 강조합니다. 구조적인 소재와도 잘 어울립니다.",
  },
} as const;

const ReportSummary = ({ bodyTypeKey }: ReportSummaryProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const content = useMemo(() => TYPE_CONTENT[bodyTypeKey], [bodyTypeKey]);

  useEffect(() => {
    if (window.innerWidth > 1023) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-report-summary-row]"),
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const target = visible[0].target as HTMLElement;
          const index = Number(target.dataset.index ?? 0);
          setActiveTab(index);
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75],
        rootMargin: "0px",
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <SummarySection>
      <SummaryPanel>
        <AccentGlow />
        <SummaryHeader>
          <SummaryEyebrow>Skeletal Structure Analysis</SummaryEyebrow>
          <SummaryTitle>
            골격 유형 <SummaryTitleAccent>포인트</SummaryTitleAccent>
          </SummaryTitle>
          <SummaryDescription>{content.description}</SummaryDescription>
        </SummaryHeader>

        <TabSection>
          <DesktopTabBody>
            <TabList>
              {content.tabs.map((tab, index) => {
                const isActive = activeTab === index;
                return (
                  <TabButton
                    key={tab.title}
                    type="button"
                    $active={isActive}
                    onClick={() => setActiveTab(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TabNumber
                      $active={isActive}
                      animate={{ opacity: isActive ? 1 : 0.6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {`0${index + 1}`}
                    </TabNumber>
                    <TabLabel>{tab.label}</TabLabel>
                    <TabTitle
                      $active={isActive}
                      animate={{ color: isActive ? "#FAFAFA" : "#A1A1A1" }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab.title}
                    </TabTitle>
                    <TabUnderline
                      $active={isActive}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </TabButton>
                );
              })}
            </TabList>

            <TabContentGrid>
              {content.tabs.map((tab, index) => {
                const isActive = activeTab === index;
                return (
                  <TabContentCell key={tab.title} $active={isActive}>
                    <TabContentText
                      $active={isActive}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: isActive ? 1 : 0.15,
                        x: 0,
                        color: isActive ? "#FAFAFA" : "#D4D4D4",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {tab.content}
                    </TabContentText>
                  </TabContentCell>
                );
              })}
            </TabContentGrid>
          </DesktopTabBody>

          <MobileTabBody>
            {content.tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <MobileRow key={tab.title} data-report-summary-row data-index={`${index}`}>
                  <TabButton
                    type="button"
                    $active={isActive}
                    onClick={() => setActiveTab(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TabNumber
                      $active={isActive}
                      animate={{ opacity: isActive ? 1 : 0.6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {`0${index + 1}`}
                    </TabNumber>
                    <TabLabel>{tab.label}</TabLabel>
                    <TabTitle
                      $active={isActive}
                      animate={{ color: isActive ? "#FAFAFA" : "#A1A1A1" }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab.title}
                    </TabTitle>
                    <TabUnderline
                      $active={isActive}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </TabButton>

                  <MobileSideLine
                    $active={isActive}
                    animate={{ scaleY: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <MobileContent>
                    <TabContentText
                      $active={isActive}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{
                        opacity: isActive ? 1 : 0.15,
                        x: 0,
                        color: isActive ? "#FAFAFA" : "#D4D4D4",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      {tab.content}
                    </TabContentText>
                  </MobileContent>
                </MobileRow>
              );
            })}
          </MobileTabBody>
        </TabSection>

        <BottomSection>
          <div>
            <BottomTitle>
              <BottomTitleLine />
              Skeletal Checklist
            </BottomTitle>
            <Checklist>
              {content.checklist.map((item) => (
                <ChecklistItem key={item}>
                  <ChecklistIcon aria-hidden="true" />
                  <ChecklistText>{item}</ChecklistText>
                </ChecklistItem>
              ))}
            </Checklist>
          </div>
          <div>
            <BottomTitle>
              <BottomTitleLine />
              Skin & Texture
            </BottomTitle>
            <SkinTitle>{content.skinTitle}</SkinTitle>
            <SkinDescription>{content.skinDesc}</SkinDescription>
          </div>
        </BottomSection>
      </SummaryPanel>
    </SummarySection>
  );
};

export default ReportSummary;
