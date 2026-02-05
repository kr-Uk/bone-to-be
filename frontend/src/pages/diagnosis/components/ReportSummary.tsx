import { useEffect, useMemo, useState, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { CheckCircle2 } from "lucide-react";

type Gender = "male" | "female";

type Gendered<T> = {
  male: T;
  female: T;
};

interface ReportSummaryProps {
  bodyTypeKey: "natural" | "wave" | "straight";
  gender?: Gender;
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
    description: {
      male: (
        <>
          고객님의 체형은 근육이나 지방의 볼륨보다,{" "}
          <HighlightText>굵고 단단한 골격 프레임</HighlightText>이 주도하는 체형입니다.
          마치 옷걸이처럼 어깨가 단단히 형태를 잡고 있어 어떤 옷을 입어도 옷의 형태가
          무너지지 않고 본연의 핏으로 떨어집니다. 특히 자켓/코트처럼 구조감 있는 아이템에서 옷 태가 잘 살아납니다.
        </>
      ),
      female: (
        <>
          고객님의 체형은 근육이나 지방의 볼륨보다,{" "}
          <HighlightText>골격이 만드는 직선적 프레임</HighlightText>이 중심이 됩니다.
          마치 옷걸이처럼 어깨가 단단히 형태를 잡고 있어 어떤 옷을 입어도 옷의 형태가
          무너지지 않고 본연의 핏으로 떨어집니다. <HighlightText>루즈한 실루엣 + 질감 있는 소재</HighlightText>는 여리하고 세련된 이미지를 줄 수 있습니다.
        </>
      ),
    } satisfies Gendered<JSX.Element>,
    tabs: {
      male: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "목의 길이가 다소 짧거나, 목에서 어깨로 이어지는 승모근 라인이 발달해 있을 가능성이 높습니다. 쇄골은 뼈가 도드라지기보다 근육이나 살에 덮여 매끄럽고 단단한 인상으로 정리되는 경우가 많습니다. 카라가 너무 타이트한 상의보다는 넥라인에 여유가 있는 아이템이 상체를 더 깔끔하게 보이게 합니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉곽의 앞뒤 폭이 넓어 옆에서 보았을 때 두께감이 느껴질 수 있습니다. 갈비뼈에서 골반까지의 거리가 짧아 허리 위치가 높게 형성되어 상체가 짧고 하체가 길어 보이는 비율적 장점을 만듭니다. 상·하의 실루엣을 ‘통’으로 여유 있게 잡아주는 스타일이 자연스럽습니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "하체는 근육·지방의 볼륨보다 골격 프레임이 먼저 드러나며, 특히 무릎 뼈가 비교적 도드라져 관절의 존재감이 보이는 경우가 많습니다. 스키니처럼 관절을 강조하는 핏보다는, 무릎을 살짝 여유 있게 감싸는 핏이 하체 라인을 깔끔하게 보이게 합니다.",
        },
      ],
      female: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "쇄골이 선명하게 드러나기보다는 살결에 자연스럽게 덮여 매끈한 라인으로 보이는 편입니다. 어깨선을 과하게 강조하기보다 드롭 숄더/여유 있는 넥라인처럼 힘을 빼는 디테일이 더 세련된 분위기를 만듭니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉곽의 앞뒤 폭이 비교적 넓어 옆모습에서 두께감이 느껴질 수 있습니다. 허리 라인을 살짝만 드러내거나(세미 크롭/하이웨스트) 전체적으로 루즈하게 떨어뜨리는 편이 더 자연스럽게 정리됩니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "하체는 근육이나 지방의 둥근 볼륨보다 골격 프레임이 먼저 보이며, 특히 무릎 뼈가 비교적 도드라져 관절의 존재감이 드러나는 경우가 많습니다. 관절이 직접 강조되는 스키니나 딱 무릎선 기장보다는, 무릎을 살짝 덮는 기장과 세미와이드·부츠컷처럼 흐르는 라인이 하체를 더 매끈하게 정리해줍니다.",
        },
      ],
    } satisfies Gendered<
      {
        label: string;
        title: string;
        content: string;
      }[]
    >,
    checklist: {
      male: [
        "몸에 비해 손이 크고, 팔다리도 긴 편인가?",
        "쇄골이 잘 보이고, 뼈가 굵은 편인가?",
        "늑골이 둥글지 않고 조금 평평한 편인가?",
        "엉덩이가 둥글게 솟기보다 납작하고 평평한 편인가?",
        "흉통의 두께가 조금 얇은 편인가?",
      ],
      female: [
        "몸에 비해 손이 크고, 팔다리도 긴 편인가?",
        "쇄골이 잘 보이고, 뼈가 굵은 편인가?",
        "늑골이 둥글지 않고 조금 평평한 편인가?",
        "엉덩이가 둥글게 솟기보다 납작하고 평평한 편인가?",
        "바스트 탑의 위치가 조금 낮은 편인가?",
      ],
    } satisfies Gendered<string[]>,
    skinTitle: '"Matte & Sinewy"',
    skinDesc: {
      male:
        "피부 질감이 매트하고 드라이한 경향이 있습니다. 근육·지방이 뼈대를 두껍게 감싸기보다, 프레임을 따라 납작하고 길게 붙는 느낌이 강합니다. 그래서 매끈한 얇은 원단보다는 가죽·스웨이드·로우게이지 니트처럼 결이 살아있는 소재에서 체형의 장점이 더 멋스럽게 드러납니다.",
      female:
        "피부 질감이 매트하고 드라이한 경향이 있습니다. 살이 여리여리하게 흐르는 타입이라기보다, 뼈대 라인을 따라 납작하고 길게 붙는 편이라 실루엣이 시크하게 정리됩니다. 니트·스웨이드·코듀로이·린넨처럼 텍스처가 보이는 소재로 무심한 멋을 주는 것이 가장 잘 맞습니다."
    } satisfies Gendered<string>,
  },
  wave: {
    description: {
      male: (
        <>
          고객님의 신체는 뼈대가 가늘고, 라인이 각지기보다{" "}
          <HighlightText>부드럽게 흐르는 곡선형 프레임</HighlightText>이 특징입니다. 흉통의 두께감이 얇고 상체 프레임이 가벼우며, 얇은 쇄골과 긴 목이 상체의 인상을 더 섬세하게 만듭니다.
          상체가 길게 늘어지는 라인으로 이어져, 전체 무게 중심이 하체 쪽으로 내려가 보일 수 있습니다.
        </>
      ),
      female: (
        <>
          고객님의 신체는 뼈대가 가늘고, 선이 직선적으로 끊기기보다{" "}
          <HighlightText>부드럽게 이어지는 곡선형 프레임</HighlightText>을 가지고 있습니다.
          상체는 얇고 평면적인 편이지만, 허리 라인이 길게 형성되고 골반이 아래로 자연스럽게 이어지는 체형입니다.
          넓은 골반과 도드라지는 하체로 인해 무게 중심이 아래로 쏠린듯 보일 수 있습니다. 
        </>
      ),
    } satisfies Gendered<JSX.Element>,
    tabs: {
      male: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "목이 가늘고 긴 편입니다. 또한, 어깨는 넓지 않으며, 어깨선이 각지기보다 완만하게 내려오는 경우가 많습니다. 쇄골은 얇고 섬세하게 드러나 상체 프레임이 전반적으로 가볍고 여리한 인상을 줍니다. 두꺼운 소재와 약간의 여유가 있는 핏의 옷이 상체 밸런스를 보완해줄 수 있습니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉곽(갈비뼈)이 납작하고 얇은 평면형 구조에 가까워 상체 두께감이 크지 않습니다. 갈비뼈에서 골반까지의 거리가 길어 허리선이 낮게 형성되는 편이며, 이로 인해 상체가 길고 가늘게 보이는 특징이 나타납니다. 상의를 살짝 넣어 허리 위치를 정리하거나, 짧은 기장의 아우터처럼 시선을 위로 끌어올리는 아이템이 전체 비율을 더 균형 있게 잡아줍니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "골반이 크지 않고 엉덩이 볼륨이 두드러지지 않아, 하체의 볼륨감이 뚜렷하지은 않은 체형입니다. 다리 길이도 길게 느껴지기보다 비교적 짧게 보일 수 있어, 무릎 위치가 위로 올라와 보이거나 하체에서 비율이 끊겨 보이는 인상이 생길 수 있습니다. 무릎 자체는 크게 각지기보다 라인이 부드럽게 이어지는 경우가 많지만, 하체 볼륨이 약해 실루엣이 밋밋해 보일 수 있습니다. 하의는 무릎선을 드러내는 딱 끊기는 기장보다, 밑단을 길게 가져가 라인을 연결해주는 핏이 전체 비율을 가장 안정적으로 정리해줍니다.",
        },
      ],
      female: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "목이 가늘고 긴 편이며, 어깨 라인이 각지기보다 부드럽게 내려오는 형태가 많습니다. 쇄골이 얇고 섬세하게 드러나 상체 프레임이 가볍고 정돈된 인상을 줍니다. 카라나 목위로 올라오는 티셔츠를 입으면 목 길이가 보완되어 어깨넓이를 보완해줄 수 있습니다. 힘이 들어간 어깨 각을 만들기보다, 자연스럽게 흐르는 라인이 상체의 장점을 더 또렷하게 살립니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉곽(갈비뼈)이 납작하고 얇아 상체가 평면적으로 보일 수 있습니다. 허리 라인이 길게 형성되는 편이라, 벨트로 허리 위치를 정리하거나 크롭 기장처럼 한 번 끊어주는 디테일이 비율을 더 균형 있게 보이게 합니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "볼륨이 엉덩이·허벅지 쪽에 모이는 경향이 있어 하체 중심의 실루엣이 만들어질 수 있습니다. 무릎·종아리 라인도 매끈하게 연결되는 편입니다. 하체를 강하게 눌러 잡기보다는, 라인을 길게 이어주는 실루엣이 전체 비율을 가장 깔끔하게 정리해줍니다.",
        },
      ],
    } satisfies Gendered<
      {
        label: string;
        title: string;
        content: string;
      }[]
    >,
    checklist: {
      male: [
        "목이 길고 어깨가 가늘면서 처진 느낌인가?",
        "흉부가 얇으며 허리가 긴 편인가?",
        "쇄골이 연약해 보이지만 잘 보이는가?",
        "늑골이 평평하고 두께가 없는 편인가?",
        "엉덩이가 평평한가?",
      ],
      female: [
        "목이 길고 어깨가 가늘면서 처진 느낌인가?",
        "바스트 탑 위치가 조금 낮은 편인가?",
        "쇄골이 연약해 보이지만 잘 보이는가?",
        "허리가 긴 편인가?",
        "어깨에 비해 골반이 넓은 편인가?",
      ],
    } satisfies Gendered<string[]>,
    skinTitle: '"Soft & Curvy"',
    skinDesc: {
      male:
        "피부 질감이 부드럽고 유연하게 보이는 편이라, 흐물한 원단보다는 어느 정도 힘이 있는 소재가 더 잘 어울립니다. 적당한 탄성과 두께감이 있는 원단은 상체 프레임을 잡아줘 왜소해 보일 수 있는 인상을 자연스럽게 보완해줍니다.",
      female:
        "피부 질감이 부드러운 경향이 있습니다. 살성이 단단히 각을 세우기보다 유연하게 붙어, 실루엣이 매끈하게 이어지는 느낌을 만듭니다. 광택이 과하게 도는 소재보다 결이 부드럽게 살아있는 텍스처가 전체 라인을 더 고급스럽게 정리해줍니다.",
    } satisfies Gendered<string>,
  },
  straight: {
    description: {
      male: (
        <>
          고객님의 신체는 3가지 체형 중에서도{" "}
          <HighlightText>근육 발달과 탄탄한 밀도감</HighlightText>이 두드러지는 편입니다.
          뼈대는 짧고 굵게 형성되는 경향이 있고, 그 위를 근육이 덮어
          쇄골·갈비뼈·무릎뼈 같은 골격 포인트가 눈에 띄기보다
          전체 윤곽이 매끈하고 입체적인 편입니다.
        </>
      ),
      female: (
        <>
          고객님의 신체는 전반적으로 균형이 잡혀 있고,{" "}
          <HighlightText>근육과 조직의 밀도감</HighlightText>이 뼈대를 덮어
          골격이 도드라지기보다 매끈하게 정리되는 체형입니다.
          둥근 어깨와 비교적 짧은 목, 잘 드러나지 않는 쇄골이 함께 나타날 수 있으며,
          흉통의 볼륨으로 인해 상체가 글래머러스하게 보일 가능성이 높습니다.
        </>
      ),
    } satisfies Gendered<JSX.Element>,
    tabs: {
      male: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "상체 두께감이 있어 목이 길게 드러나기보다는 비교적 짧고 단단한 인상으로 보일 수 있습니다. 쇄골은 선명하게 튀기보다 근육과 살에 덮여 매끈하게 정리되는 편이며, 어깨선도 날카롭게 각지기보다 안정적으로 잡혀 보이는 경우가 많습니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉곽의 앞뒤 두께감이 있어 상체가 평면적으로 보이기보다는 ‘입체감’이 느껴질 수 있습니다. 갈비뼈가 도드라지기보다 근육에 덮여 존재감이 줄어들고, 허리 라인은 길게 흐르기보다 비교적 짧게 정리되는 편입니다. 전체적으로 상체의 볼륨이 중심이 되어 직선적인 윤곽이 강조됩니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "하체는 뼈가 튀어나오기보다 근육·조직의 밀도감으로 탄탄하게 정리되는 편입니다. 무릎뼈가 선명하게 도드라지기보다는 라인이 두께감 있게 이어질 수 있고, 엉덩이는 아래로 퍼지기보다 윗부분에 볼륨이 모여 보이는 경우가 있습니다. 하의는 과한 와이드핏보다 직선 실루엣을 살려주는 핏이 전체 비율을 가장 깔끔하게 만듭니다.",
        },
      ],
      female: [
        {
          label: "Upper Zone",
          title: "목과 승모근",
          content:
            "둥근 어깨선과 비교적 짧은 목이 함께 나타날 수 있으며, 쇄골은 선명하게 드러나기보다 근육과 살에 덮여 매끈하게 정리되는 편입니다. 상체의 입체감이 이미 충분한 타입이라, 목 주변을 막아 답답해 보이게 하기보다는 넥라인을 열어 시원하게 정리해주는 연출이 균형을 잡아줍니다.",
        },
        {
          label: "Torso Volume",
          title: "흉곽과 허리",
          content:
            "흉통의 앞뒤 두께감이 있어 상체가 평면적으로 보이기보다 볼륨감이 느껴질 수 있습니다. 허리 라인은 잘록하게 강조되기보다 비교적 직선적으로 정리되며, 체중 변화가 있을 때는 배 쪽이 먼저 부각되는 경향이 나타날 수 있습니다. 따라서 실루엣은 과한 장식보다는 군더더기 없이 정돈하는 방향이 가장 깔끔합니다.",
        },
        {
          label: "Lower Line",
          title: "다리와 무릎",
          content:
            "상체에 비해 다리가 길게 보이고, 허리가 짧게 느껴질 수 있습니다. 하체는 뼈가 도드라지기보다 탄탄한 조직감으로 라인이 매끈하게 이어지는 편이며, 전체 실루엣이 직선적으로 정리됩니다. 과도하게 넓은 핏은 상·하의 두께감을 동시에 키워 보일 수 있어, 일자로 떨어지는 라인이 안정적입니다.",
        },
      ],
    } satisfies Gendered<
      {
        label: string;
        title: string;
        content: string;
      }[]
    >,
    checklist: {
      male: [
        "어깨가 둥글고 두꺼우며 튼튼한가?",
        "쇄골이 잘 보이지 않는가?",
        "정면에서 실루엣이 굴곡보다 직선적으로 정리되어 보이는가?",
        "옆모습에서 S라인보다 상체의 두께감(입체감)이 더 먼저 느껴지는가?",
        "목이 길게 드러나기보다 비교적 짧고 단단한 인상으로 보이는가?",
      ],
      female: [
        "어깨가 둥글고 두꺼우며 튼튼한가?",
        "쇄골이 잘 보이지 않는가?",
        "흉통 볼륨이 있어 상체가 글래머러스하게 보이는 편인가?",
        "허리 라인이 뚜렷하기보다 직선적으로 정리되어 보이는가?",
        "체중이 늘면 배 쪽이 먼저 부각되는 경향이 있는가?",
      ],
    } satisfies Gendered<string[]>,
    skinTitle: '"Firm & Solid"',
    skinDesc: {
      male:
        "피부와 조직이 탄탄하고 밀도 있게 느껴지는 편이라, 부드럽게 흐르는 소재보다는 어느 정도 힘이 있고 형태를 잡아주는 원단이 잘 어울립니다. 원단이 실루엣을 정돈해주면 상체의 입체감이 과장되지 않고 깔끔하게 마무리됩니다.",
      female:
        "피부와 조직이 탄탄하고 밀도 있게 느껴지는 편이라 실루엣을 붙잡아 두께를 더 키우는 빳빳한 원단보다는 몸을 따라 부드럽게 흐르며 표면이 매끈한 소재를 선택하는 것이 좋습니다. 반대로 두께가 추가되는 소재는 단단한 느낌을 더 강조할 수 있어 주의가 필요합니다.",
    } satisfies Gendered<string>,
  },
} as const;

const ReportSummary = ({ bodyTypeKey, gender }: ReportSummaryProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const content = useMemo(() => TYPE_CONTENT[bodyTypeKey], [bodyTypeKey]);
  // Temporary preview fallback until backend provides gender.
  const previewGender: Gender = "female";
  const genderKey: Gender = gender ?? previewGender;
  const description = content.description[genderKey];
  const tabs = content.tabs[genderKey];
  const checklist = content.checklist[genderKey];
  const skinDesc = content.skinDesc[genderKey];

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
          <SummaryDescription>{description}</SummaryDescription>
        </SummaryHeader>

        <TabSection>
          <DesktopTabBody>
            <TabList>
              {tabs.map((tab, index) => {
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
              {tabs.map((tab, index) => {
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
            {tabs.map((tab, index) => {
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
              {checklist.map((item) => (
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
            <SkinDescription>{skinDesc}</SkinDescription>
          </div>
        </BottomSection>
      </SummaryPanel>
    </SummarySection>
  );
};

export default ReportSummary;
