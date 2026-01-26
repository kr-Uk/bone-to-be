import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "@/shared/styles/theme";

export const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Header>
        <HeaderContent>
          <Logo>BONE:TOBE</Logo>
          <RightSection>
            <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
          </RightSection>
        </HeaderContent>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  height: 64px;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  background: ${theme.colors.background};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 20px;
  color: ${theme.colors.gray[900]};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LoginButton = styled.button`
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid ${theme.colors.gray[300]};
  background: ${theme.colors.background};
  color: ${theme.colors.gray[900]};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${theme.colors.gray[50]};
    border-color: ${theme.colors.gray[400]};
  }
`;

const Main = styled.main`
  flex: 1;
`;
