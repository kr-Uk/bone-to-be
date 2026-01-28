import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import logo from "@/assets/image/logo.svg"

const Container = styled.header`
  width: 100%;
  height: 5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray[900]};
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 11rem;
  height: auto;
  margin-bottom: 0.25rem;
  cursor: pointer;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const LoginHeader = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <ContentWrap>
        <LogoImg src={logo} alt="BONE:TOBE" onClick={() => navigate("/")} />
        <Description>Find Your Originality</Description>
      </ContentWrap>
    </Container>
  );
};

export default LoginHeader;