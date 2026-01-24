
import { useState } from "react";
import * as S from "./LoginPage.styles";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("TODO: Login API Call", { email, password });
  };

  const handleKakao = () => {
    console.log("TODO: Kakao Login");
  };

  const handleGoogle = () => {
    console.log("TODO: Google Login");
  };

  const handleSignUp = () => {
    console.log("TODO: Go to Sign Up");
  };

  const handleFindPassword = () => {
    console.log("TODO: Go to Find Password");
  };

  return (
    <S.PageWrapper>
      <S.LoginCard>
        {/* LEFT: Illustration */}
        <S.LeftPanel>
          <S.Shapes>
            <S.Hourglass />
            <S.Trapezoid />
            <S.TallRect />
          </S.Shapes>
        </S.LeftPanel>

        {/* Divider */}
        <S.Divider />

        {/* RIGHT: Login Form */}
        <S.RightPanel>
          <S.Brand>
            <S.BrandTitle>BONE:TOBE</S.BrandTitle>
            <S.BrandSub>타고난 골격을 찾아 떠나는 여정</S.BrandSub>
          </S.Brand>

          <S.Form>
            <S.Field>
              <S.Label>이메일</S.Label>
              <S.Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                autoComplete="email"
              />
            </S.Field>

            <S.Field>
              <S.Label>비밀번호</S.Label>
              <S.Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                autoComplete="current-password"
              />
            </S.Field>

            <S.PrimaryButton type="button" onClick={handleSubmit}>
              로그인
            </S.PrimaryButton>

            <S.OrRow>
              <S.OrLine />
              <S.OrText>간편 로그인</S.OrText>
              <S.OrLine />
            </S.OrRow>

            <S.SocialButtonKakao type="button" onClick={handleKakao}>
              <S.KakaoDot aria-hidden />
              카카오로 시작하기
            </S.SocialButtonKakao>

            <S.SocialButton type="button" onClick={handleGoogle}>
              <S.GoogleDot aria-hidden />
              구글로 시작하기
            </S.SocialButton>

            <S.BottomLinks>
              <S.LinkRow>
                <S.SmallText>아직 회원이 아니신가요?</S.SmallText>
                <S.LinkButton type="button" onClick={handleSignUp}>
                  회원가입
                </S.LinkButton>
              </S.LinkRow>

              <S.LinkRow>
                <S.SmallText>비밀번호를 잊어버리셨나요?</S.SmallText>
                <S.LinkButton type="button" onClick={handleFindPassword}>
                  비밀번호 찾기
                </S.LinkButton>
              </S.LinkRow>
            </S.BottomLinks>
          </S.Form>
        </S.RightPanel>
      </S.LoginCard>
    </S.PageWrapper>
  );
};
