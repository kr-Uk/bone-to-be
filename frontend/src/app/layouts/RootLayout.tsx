import { Outlet } from "react-router-dom";
import styled from "styled-components";

const RootPage = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function RootLayout() {
  return (
    <RootPage>
      <main>
        <Outlet />
      </main>
    </RootPage>
  );
}
