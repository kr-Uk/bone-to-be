import styled from "styled-components";
import { theme } from "@/shared/styles/theme";

export const PageWrapper = styled.div`
  min-height: calc(100vh - 64px); /* Subtract header height if needed, or 100vh */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray[900]};
  padding: 16px;
`;

export const LoginCard = styled.div`
  width: min(980px, calc(100vw - 32px));
  height: min(560px, calc(100vh - 32px));
  background: ${theme.colors.background};
  border-radius: 18px;
  border: 1px solid ${theme.colors.gray[300]};
  overflow: hidden;

  display: grid;
  grid-template-columns: 55% 1px 45%;

  /* ✅ 768 ~ 1024 */
  @media (max-width: 1024px) {
    width: min(920px, calc(100vw - 24px));
    height: min(540px, calc(100vh - 24px));
    grid-template-columns: 50% 1px 50%;
  }

  /* ✅ <= 768 */
  @media (max-width: 768px) {
    width: calc(100vw - 24px);
    height: min(720px, calc(100vh - 24px));
    grid-template-columns: 1fr;
    grid-template-rows: 240px 1px 1fr;
  }

  /* ✅ <= 375 */
  @media (max-width: 375px) {
    height: min(760px, calc(100vh - 16px));
    grid-template-rows: 210px 1px 1fr;
  }
`;

export const LeftPanel = styled.div`
  background: ${theme.colors.gray[100]};
  position: relative;
`;

export const Divider = styled.div`
  background: ${theme.colors.gray[300]};
`;

export const RightPanel = styled.div`
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 44px 56px;

  & > * {
    width: 100%;
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: 1024px) {
    padding: 36px 36px;
    & > * {
      max-width: 340px;
    }
  }

  @media (max-width: 768px) {
    padding: 28px 20px;
    & > * {
      max-width: 380px;
    }
  }

  @media (max-width: 375px) {
    padding: 22px 16px;
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
  background: ${theme.colors.purple[200]}; 
  opacity: 0.8;
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
  margin-bottom: 18px;
`;

export const BrandTitle = styled.div`
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 900;
  letter-spacing: 0.5px;
  color: ${theme.colors.gray[900]};
`;

export const BrandSub = styled.div`
  font-size: clamp(11px, 1.2vw, 12px);
  color: ${theme.colors.gray[500]};
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 19.4px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.gray[900]};
`;

export const Input = styled.input`
  height: 42px;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 6px;
  padding: 0 12px;
  outline: none;

  &:focus {
    border-color: ${theme.colors.purple[600]};
    box-shadow: 0 0 0 3px rgba(152, 16, 250, 0.15);
  }

  @media (max-width: 1024px) {
    height: 40px;
  }

  @media (max-width: 375px) {
    height: 38px;
  }
`;

export const PrimaryButton = styled.button`
  height: 44px;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  background: ${theme.colors.purple[600]};
  color: ${theme.colors.secondary};
  font-weight: 800;

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 1024px) {
    height: 42px;
  }

  @media (max-width: 375px) {
    height: 40px;
  }
`;

export const OrRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

export const OrLine = styled.div`
  height: 1px;
  background: ${theme.colors.gray[200]};
`;

export const OrText = styled.div`
  font-size: 11px;
  color: ${theme.colors.gray[400]};
`;

export const SocialButtonKakao = styled.button`
  height: 42px;
  border-radius: 6px;
  border: none;
  cursor: pointer;

  background: #fee500; /* Kakao Brand Color */
  color: ${theme.colors.gray[900]};
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 1024px) {
    height: 40px;
  }

  @media (max-width: 375px) {
    height: 38px;
  }
`;

export const SocialButton = styled.button`
  height: 42px;
  border-radius: 6px;
  border: 1px solid ${theme.colors.gray[200]};
  cursor: pointer;

  background: ${theme.colors.background};
  color: ${theme.colors.gray[900]};
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  @media (max-width: 1024px) {
    height: 40px;
  }

  @media (max-width: 375px) {
    height: 38px;
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
  margin-top: 6px;
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
  font-size: 11px;
  color: ${theme.colors.gray[400]};
`;

export const LinkButton = styled.button`
  font-size: 11px;
  color: ${theme.colors.purple[600]};
  font-weight: 800;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
