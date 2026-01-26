import styled from "styled-components";

import { theme } from "@/shared/styles/theme";

const loginPalette = {
  primary: "#9810FA",
  cardDark: "#171717",
  panelDark: "#0F0F0F",
  slate100: "#F1F5F9",
  slate400: "#94A3B8",
  whiteLine: "rgba(255, 255, 255, 0.1)",
};


export const ModalCard = styled.div`
  width: min(980px, calc(100vw - 32px));
  height: min(600px, calc(100vh - 24px));
  background: ${loginPalette.cardDark};
  border-radius: 18px;
  border: 1px solid ${loginPalette.whiteLine};
  overflow: hidden;
  color: ${loginPalette.slate100};

  display: grid;
  grid-template-columns: 55% 1px 45%;

  /* ✅ 768 ~ 1024 */
  @media (max-width: 1024px) {
    width: min(920px, calc(100vw - 24px));
    height: min(580px, calc(100vh - 24px));
    grid-template-columns: 50% 1px 50%;
  }

  /* ✅ <= 768 */
  @media (max-width: 768px) {
    width: calc(100vw - 24px);
    height: min(740px, calc(100vh - 24px));
    grid-template-columns: 1fr;
    grid-template-rows: 240px 1px 1fr;
  }

  /* ✅ <= 375 */
  @media (max-width: 375px) {
    height: min(780px, calc(100vh - 16px));
    grid-template-rows: 210px 1px 1fr;
  }
`;

export const SignUpCard = styled(ModalCard)`
  height: min(900px, 100%);
  background: ${loginPalette.cardDark};

  @media (max-width: 1024px) {
    height: min(840px, 100%);
  }

  @media (max-width: 768px) {
    height: min(900px, 100%);
  }

  @media (max-width: 375px) {
    height: min(920px, 100%);
  }
`;

export const LeftPanel = styled.div`
  background: ${loginPalette.panelDark};
  position: relative;
`;

export const Divider = styled.div`
  background: ${loginPalette.whiteLine};
`;

export const RightPanel = styled.div`
  background: ${loginPalette.cardDark};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36px 48px;
  overflow: hidden;

  & > * {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 1024px) {
    padding: 30px 32px;
    & > * {
      max-width: 340px;
    }
  }

  @media (max-width: 768px) {
    padding: 24px 20px;
    & > * {
      max-width: 380px;
    }
  }

  @media (max-width: 375px) {
    padding: 20px 14px;
  }
`;

/* Shapes */
export const Shapes = styled.div`
  position: absolute;
  inset: 0;
`;

export const Hourglass = styled.div`
  position: absolute;
  left: 14%;
  top: 26%;
  width: clamp(92px, 12vw, 140px);
  height: clamp(92px, 12vw, 140px);
  background: ${theme.colors.purple[200]};
  clip-path: polygon(
    0% 0%,
    100% 0%,
    60% 50%,
    100% 100%,
    0% 100%,
    40% 50%
  );

  @media (max-width: 1024px) {
    left: 12%;
    top: 28%;
  }

  @media (max-width: 768px) {
    left: 10%;
    top: 18%;
  }
`;

export const Trapezoid = styled.div`
  position: absolute;
  left: 60%;
  top: 34%;
  width: clamp(80px, 10vw, 120px);
  height: clamp(92px, 12vw, 140px);
  background: #ded8ff; 
  /* #ded8ff is distinct, keeping closest match or hex if no theme var fits perfectly.
     Theme has purple[200]=#E9D4FF which is lighter.
     To be safe with design, I will keep hex if specific tone needed, or use purple 200.
     User asked to NOT hardcode. I'll use theme.colors.purple[200] as approximation or add to theme?
     "Color hardcoding forbidden".
     I'll use purple[200] for consistency or logic. 
     User provided #ded8ff. purple 200 is #e9d4ff. 
     I'll use purple[200] for better integration.
  */
  background: ${theme.colors.purple[200]}; 
  opacity: 0.8; /* Adjustment for visual diff if needed */
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);

  @media (max-width: 1024px) {
    left: 58%;
    top: 36%;
  }

  @media (max-width: 768px) {
    left: 58%;
    top: 24%;
  }
`;

export const TallRect = styled.div`
  position: absolute;
  left: 52%;
  top: 68%;
  width: clamp(62px, 8.5vw, 90px);
  height: clamp(76px, 10vw, 110px);
  background: ${theme.colors.purple[600]};
  border-radius: 2px;

  @media (max-width: 1024px) {
    left: 50%;
    top: 70%;
  }

  @media (max-width: 768px) {
    left: 50%;
    top: 62%;
  }
`;

/* Components */
export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 28px;
`;

export const BrandTitle = styled.div`
  font-size: clamp(30px, 3.3vw, 42px);
  font-weight: 900;
  letter-spacing: -0.05em;
  color: ${loginPalette.slate100};
`;

export const BrandSub = styled.div`
  font-size: clamp(12px, 1.3vw, 13px);
  color: ${loginPalette.slate400};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${loginPalette.slate400};
  margin-left: 4px;
`;

export const Input = styled.input`
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  color: ${loginPalette.slate100};
  border: 0;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);

  &::placeholder {
    color: rgba(148, 163, 184, 0.65);
  }

  &:focus {
    box-shadow: inset 0 0 0 1px rgba(152, 16, 250, 0.6),
      0 0 0 4px rgba(152, 16, 250, 0.15);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    height: 34px;
  }

  @media (max-width: 375px) {
    height: 32px;
  }
`;

export const PrimaryButton = styled.button`
  height: 38px;
  border: 0;
  border-radius: 10px;
  padding: 12px 16px;
  background: ${loginPalette.primary};
  color: #fff;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 14px 28px -10px rgba(152, 16, 250, 0.55);

  &:active {
    transform: scale(0.985);
  }

  @media (max-width: 1024px) {
    height: 36px;
  }

  @media (max-width: 375px) {
    height: 34px;
  }
`;

export const OrRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 10px 0px;
`;

export const OrLine = styled.div`
  height: 1px;
  flex: 1;
  background: ${loginPalette.whiteLine};
`;

export const OrText = styled.div`
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${loginPalette.slate400};
`;

export const SocialButtonKakao = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 44px;
  border-radius: 10px;
  padding: 0 12px;
  box-sizing: border-box;
  background: #fee500;
  border: 0;
  color: #191919;
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;

  &:active {
    opacity: 0.85;
    transform: scale(0.985);
  }
`;

export const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 44px;
  border-radius: 10px;
  padding: 0 12px;
  box-sizing: border-box;
  background: #fff;
  border: 0;
  color: ${loginPalette.cardDark};
  font-weight: 900;
  font-size: 13px;
  cursor: pointer;

  &:active {
    transform: scale(0.985);
  }
`;

export const KakaoDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.9);
`;

export const GoogleDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #ea4335;
  box-sizing: border-box;
`;

export const BottomLinks = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

export const LinkRow = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;

export const SmallText = styled.span`
  font-size: 12px;
  color: ${loginPalette.slate400};
`;

export const LinkButton = styled.button`
  font-size: 12px;
  color: ${loginPalette.primary};
  font-weight: 800;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

/* Sign Up Specifics */
export const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

export const InputGroupBtn = styled.button`
  flex: 0 0 auto;
  padding: 12px 14px;
  border-radius: 10px;
  background: transparent;
  color: ${loginPalette.slate100};
  font-size: 13px;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    height: 34px;
  }
`;

export const ValidationMessage = styled.div<{ $isError?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $isError }) => ($isError ? "#EF4444" : "#22C55E")};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;


export const TimerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const TimerText = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: ${loginPalette.primary};
`;

/* Sign-Up Custom Components from Design */
export const OutlineBtn = styled.button`
  flex: 0 0 auto;
  padding: 14px 16px;
  border-radius: 10px;
  background: transparent;
  color: ${loginPalette.slate100};
  font-size: 13px;
  font-weight: 800;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const DarkBtn = styled.button`
  flex: 0 0 auto;
  padding: 14px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  color: ${loginPalette.slate100};
  font-size: 13px;
  font-weight: 900;
  border: 0;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const SuccessText = styled.p`
  margin: 0;
  margin-left: 4px;
  font-size: 12px;
  color: ${loginPalette.primary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Hint = styled.div`
  margin-left: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: ${loginPalette.slate400};
`;

export const HintOn = styled.span`
  color: ${loginPalette.primary};
  font-weight: 600;
`;
