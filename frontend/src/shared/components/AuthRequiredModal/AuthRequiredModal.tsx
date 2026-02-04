import { useNavigate } from "react-router-dom";

import * as S from "./AuthRequiredModal.styles";

import { Modal } from "@/shared/components/Modal";
import { useAuthStore } from "@/shared/stores/authStore";

export const AuthRequiredModal = () => {
  const navigate = useNavigate();
  const { isAuthRequiredModalOpen, closeAuthRequiredModal, authRequiredReturnPath } =
    useAuthStore();

  const handleNavigateToLogin = () => {
    closeAuthRequiredModal();
    navigate("/login", {
      replace: true,
      state: { returnTo: authRequiredReturnPath },
    });
  };

  const handleCancel = () => {
    closeAuthRequiredModal();
  };

  return (
    <Modal isOpen={isAuthRequiredModalOpen} onClose={handleCancel}>
      <S.Content>
        <S.IconWrapper>
          <S.LockIcon />
        </S.IconWrapper>
        <S.Title>로그인이 필요한 서비스입니다</S.Title>
        <S.Message>이 기능을 사용하려면 로그인이 필요합니다.</S.Message>
        <S.ButtonGroup>
          <S.PrimaryButton onClick={handleNavigateToLogin}>로그인 페이지로 이동</S.PrimaryButton>
          <S.SecondaryButton onClick={handleCancel}>취소</S.SecondaryButton>
        </S.ButtonGroup>
      </S.Content>
    </Modal>
  );
};
