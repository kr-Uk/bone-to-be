import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LogoSvg from "@/assets/logo.svg";

const HeaderContainer = styled.header`
  display: flex;
  position: absolute;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  width: 100%;
  z-index: 10;
  // position: relative;
`;

const Logo = styled.img`
  height: 2.5rem;
  cursor: pointer;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  color: ${({ theme }) => theme.colors.gray[300]};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[700]};
    border-color: ${({ theme }) => theme.colors.gray[600]};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

interface DiagnosisHeaderProps {
  onClose?: () => void;
}

const DiagnosisHeader = ({ onClose }: DiagnosisHeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Default behavior: navigate to home
      navigate("/");
    }
  };

  return (
    <HeaderContainer>
      <Logo src={LogoSvg} alt="BONE:TOBE Logo" onClick={handleLogoClick} />
      <CloseButton onClick={handleClose} aria-label="Close">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CloseButton>
    </HeaderContainer>
  );
};

export default DiagnosisHeader;
