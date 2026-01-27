import { useState } from "react";


import { LoginModalView } from "./LoginModalView";
import { SignUpModalView } from "./SignUpModalView";

import type { AxiosError } from "axios";

import { Modal } from "@/shared/components/Modal/Modal";
import { useLogin } from "@/shared/hooks";
import { useAuthStore } from "@/shared/stores/authStore";




export const LoginModalContainer = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();
  const loginMutation = useLogin();
  const [viewMode, setViewMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async () => {
    setLoginError("");
    try {
      await loginMutation.mutateAsync({ email, password });
      closeLoginModal();
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (status === 401) {
        setLoginError("아이디 및 비밀번호가 일치하지 않습니다.");
        return;
      }
      setLoginError("서버 연결이 원활하지 않습니다.");
    }
  };

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    if (loginError) {
      setLoginError("");
    }
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
    if (loginError) {
      setLoginError("");
    }
  };

  const handleKakao = () => {
    console.log("TODO: Kakao Login");
  };

  const handleGoogle = () => {
    console.log("TODO: Google Login");
  };

  const handleSwitchToSignUp = () => {
    setViewMode("SIGNUP");
  };

  const handleSwitchToLogin = () => {
    setViewMode("LOGIN");
  };

  const handleFindPassword = () => {
    console.log("TODO: Go to Find Password");
    closeLoginModal();
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
      {viewMode === "LOGIN" ? (
        <LoginModalView
          email={email}
          password={password}
          loginError={loginError}
          onChangeEmail={handleChangeEmail}
          onChangePassword={handleChangePassword}
          onSubmit={handleSubmit}
          onClickKakao={handleKakao}
          onClickGoogle={handleGoogle}
          onClickSignUp={handleSwitchToSignUp}
          onClickFindPassword={handleFindPassword}
        />
      ) : (
        <SignUpModalView onSwitchToLogin={handleSwitchToLogin} />
      )}
    </Modal>
  );
};
