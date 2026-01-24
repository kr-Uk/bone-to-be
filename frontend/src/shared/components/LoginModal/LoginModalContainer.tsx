import { useState } from "react";

import { Modal } from "@/shared/components/Modal";
import { useAuthStore } from "@/shared/stores/authStore";

import { LoginModalView } from "./LoginModalView";

export const LoginModalContainer = () => {
  const { isLoginModalOpen, closeLoginModal } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("TODO: Login API Call", { email, password });
    // 추후 API 연동
    closeLoginModal();
  };

  const handleKakao = () => {
    console.log("TODO: Kakao Login");
  };

  const handleGoogle = () => {
    console.log("TODO: Google Login");
  };

  const handleSignUp = () => {
    console.log("TODO: Go to Sign Up");
    closeLoginModal();
  };

  const handleFindPassword = () => {
    console.log("TODO: Go to Find Password");
    closeLoginModal();
  };

  return (
    <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal}>
      <LoginModalView
        email={email}
        password={password}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
        onClickKakao={handleKakao}
        onClickGoogle={handleGoogle}
        onClickSignUp={handleSignUp}
        onClickFindPassword={handleFindPassword}
      />
    </Modal>
  );
};
