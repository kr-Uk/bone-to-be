import { Outlet } from "react-router-dom";
import styled from "styled-components";

import { MainHeader } from "@/shared/components/MainHeader";

export const MainLayout = () => {
  return (
    <Wrapper>
      <MainHeader />
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

const Main = styled.main`
  flex: 1;
`;
