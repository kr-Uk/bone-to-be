import styled, { keyframes } from "styled-components";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray[700]};
  border-top-color: ${({ theme }) => theme.colors.purple[600]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

/**
 * 로딩 스피너 컴포넌트
 * 다음 페이지 로딩 중 회전하는 스피너를 표시합니다
 */
export function LoadingSpinner() {
  return (
    <SpinnerContainer>
      <Spinner />
    </SpinnerContainer>
  );
}
