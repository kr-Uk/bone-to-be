import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { LoginModalView } from "./components/LoginModalView";
import { SignUpModalView } from "./components/SignUpModalView";
import * as S from "./styles/LoginPage.styles";

import type { AxiosError } from "axios";

import { useLogin } from "@/shared/hooks";

export const LoginPage = () => {
  const location = useLocation();
  const loginMutation = useLogin();
  const [viewMode, setViewMode] = useState<"LOGIN" | "SIGNUP">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async () => {
    setLoginError("");
    try {
      await loginMutation.mutateAsync({ email, password });
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
  };

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    setViewMode(mode === "signup" ? "SIGNUP" : "LOGIN");
  }, [location.search]);

  return (
    <S.PageWrapper>
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
    </S.PageWrapper>
  );
};
