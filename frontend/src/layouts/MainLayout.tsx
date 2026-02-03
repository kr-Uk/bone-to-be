import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import { LoginModalContainer } from "@/pages/LoginPage/components/LoginModalContainer";
import { AuthRequiredModal } from "@/shared/components/AuthRequiredModal";
import { MainHeader } from "@/shared/components/MainHeader";

export const MainLayout = () => {
  const location = useLocation();

  return (
    <Wrapper>
      <MainHeader key={location.key} />
      <Main>
        <Outlet />
      </Main>
      <LoginModalContainer />
      <AuthRequiredModal />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;
