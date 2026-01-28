export type BodyTypeKey = "natural" | "wave" | "straight";

export interface BodyTypeMetadata {
  korean: string;
  tagline: string;
  description: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  strengthDescription: string;
  doRecommendations: string[];
  dontRecommendations: string[];
  fitReferences: Array<{
    name: string;
    imageUrl: string;
    isBest: boolean;
  }>;
}

export const BODY_TYPE_METADATA: Record<BodyTypeKey, BodyTypeMetadata> = {
  natural: {
    korean: "내추럴",
    tagline: "Free Spirit, Natural Chic",
    description: {
      mobile:
        "당신은 뼈대가 뚜렷하고 프레임이 단단한 내추럴 골격입니다.\n인위적인 핏보다는 루즈하게 흐르는 실루엣이\n본연의 멋을 극대화합니다.",
      tablet:
        "당신은 뼈대가 뚜렷하고 프레임이 단단한 내추럴 골격입니다.\n인위적인 핏보다는 루즈하게 흐르는 실루엣이 본연의 멋을 극대화합니다.",
      desktop:
        "당신은 뼈대가 뚜렷하고 프레임이 단단한 내추럴 골격입니다.\n인위적인 핏보다는 루즈하게 흐르는 실루엣이 본연의 멋을 극대화합니다.",
    },
    strengthDescription: "어깨와 관절의 뼈대가 도드라짐",
    doRecommendations: [
      "어깨선이 내려간 드롭 숄더 (Drop Shoulder)",
      "거친 질감이 살아있는 린넨, 데님 소재",
      "발등을 덮는 긴 기장의 와이드 팬츠",
    ],
    dontRecommendations: [
      "몸에 딱 달라붙는 스키니 핏",
      "광택이 과하게 도는 실크, 새틴 소재",
      "어깨를 좁아 보이게 하는 래글런 소매",
    ],
    fitReferences: [
      {
        name: "Oversized Blazer",
        imageUrl: "/images/placeholder-model-1.jpg",
        isBest: true,
      },
      {
        name: "Linen Set-up",
        imageUrl: "/images/placeholder-model-2.jpg",
        isBest: false,
      },
      {
        name: "Wide Slacks",
        imageUrl: "/images/placeholder-model-3.jpg",
        isBest: false,
      },
    ],
  },
  wave: {
    korean: "웨이브",
    tagline: "Elegant Curves, Feminine Grace",
    description: {
      mobile:
        "당신은 부드러운 곡선과\n균형 잡힌\n웨이브 골격입니다.\n몸의 곡선을 살리는 핏이\n우아함을 극대화합니다.",
      tablet:
        "당신은 부드러운 곡선과\n균형 잡힌 웨이브 골격입니다.\n몸의 곡선을 살리는 핏이\n우아함을 극대화합니다.",
      desktop:
        "당신은 부드러운 곡선과 균형 잡힌\n웨이브 골격입니다.\n몸의 곡선을 살리는 핏이 우아함을 극대화합니다.",
    },
    strengthDescription: "허리 라인과 힙의 곡선이 부드러움",
    doRecommendations: [
      "허리 라인을 강조하는 벨티드 디자인",
      "부드럽게 떨어지는 A라인 실루엣",
      "몸의 곡선을 살리는 세미 핏",
    ],
    dontRecommendations: [
      "각진 디자인과 하드한 소재",
      "지나치게 루즈한 박시 핏",
      "어깨를 강조하는 패드 디자인",
    ],
    fitReferences: [
      {
        name: "Wrap Dress",
        imageUrl: "/images/placeholder-model-4.jpg",
        isBest: true,
      },
      {
        name: "Fit & Flare",
        imageUrl: "/images/placeholder-model-5.jpg",
        isBest: false,
      },
      {
        name: "Belted Coat",
        imageUrl: "/images/placeholder-model-6.jpg",
        isBest: false,
      },
    ],
  },
  straight: {
    korean: "스트레이트",
    tagline: "Sharp Lines, Modern Chic",
    description: {
      mobile:
        "당신은 직선적이고\n균형 잡힌\n스트레이트 골격입니다.\n깔끔하고 단정한\n실루엣이 세련미를\n극대화합니다.",
      tablet:
        "당신은 직선적이고\n균형 잡힌 스트레이트 골격입니다.\n깔끔하고 단정한 실루엣이\n세련미를 극대화합니다.",
      desktop:
        "당신은 직선적이고 균형 잡힌\n스트레이트 골격입니다.\n깔끔하고 단정한 실루엣이 세련미를 극대화합니다.",
    },
    strengthDescription: "어깨와 허리, 힙이 일직선으로 균형잡힘",
    doRecommendations: [
      "허리를 살짝 강조하는 세미 테일러드 핏",
      "깔끔한 라인의 스트레이트 팬츠",
      "미니멀한 디자인의 구조적 재킷",
    ],
    dontRecommendations: [
      "과도하게 볼륨감 있는 디자인",
      "허리를 과하게 조이는 타이트 핏",
      "지나치게 부드러운 드레이프 소재",
    ],
    fitReferences: [
      {
        name: "Tailored Suit",
        imageUrl: "/images/placeholder-model-7.jpg",
        isBest: true,
      },
      {
        name: "Straight Jeans",
        imageUrl: "/images/placeholder-model-8.jpg",
        isBest: false,
      },
      {
        name: "Structured Blazer",
        imageUrl: "/images/placeholder-model-9.jpg",
        isBest: false,
      },
    ],
  },
};

export interface VirtualFittingData {
  imageUrl: string;
  title: string;
  description: string;
  tags: string[];
}

export const VIRTUAL_FITTING_OPTIONS: VirtualFittingData[] = [
  {
    imageUrl: "/images/placeholder-virtual-fitting-1.jpg",
    title: "Casual Linen Mood",
    description: "고객님의 넓은 어깨 라인을 장점으로 승화시키는 루즈핏 린넨 셋업입니다.",
    tags: ["#Oversized", "#Natural", "#Summer"],
  },
  {
    imageUrl: "/images/placeholder-virtual-fitting-2.jpg",
    title: "Urban Street Vibe",
    description: "자유로운 실루엣에 강렬한 포인트를 더한 도시적인 스트릿 룩입니다.",
    tags: ["#Oversized", "#Street", "#Casual"],
  },
  {
    imageUrl: "/images/placeholder-virtual-fitting-3.jpg",
    title: "Minimal Chic",
    description: "심플한 디자인으로 당신의 골격 라인을 자연스럽게 살린 미니멀 스타일입니다.",
    tags: ["#Minimal", "#Clean", "#Modern"],
  },
];

// Legacy export for backward compatibility
export const VIRTUAL_FITTING_MOCK: VirtualFittingData = VIRTUAL_FITTING_OPTIONS[0];
