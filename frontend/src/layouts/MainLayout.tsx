import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import { LoginModalContainer } from "@/pages/LoginPage/components/LoginModalContainer";
import { AuthRequiredModal } from "@/shared/components/AuthRequiredModal";
import { MainHeader } from "@/shared/components/MainHeader";
import { NotificationToastContainer } from "@/shared/components/NotificationToastContainer";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";

export const MainLayout = () => {
  const location = useLocation();
  const prevLocationRef = useRef<string>("");
  const clearDiagnosisData = useDiagnosisStore((state) => state.clearDiagnosisData);

  // 진단 플로우 외부로 이동 시 세션 데이터 초기화
  useEffect(() => {
    const prevPath = prevLocationRef.current;
    const currentPath = location.pathname;

    const wasDiagnosisFlow = prevPath.startsWith("/diagnosis");
    const isDiagnosisFlow = currentPath.startsWith("/diagnosis");

    // 진단 플로우에서 외부로 나가는 경우 데이터 초기화
    if (wasDiagnosisFlow && !isDiagnosisFlow) {
      clearDiagnosisData();
    }

    prevLocationRef.current = currentPath;
  }, [location.pathname, clearDiagnosisData]);

  return (
    <Wrapper>
      <MainHeader key={location.key} />
      <Main>
        <Outlet />
      </Main>
      <LoginModalContainer />
      <AuthRequiredModal />
      <NotificationToastContainer />
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
