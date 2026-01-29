import * as S from "../styles/LoginModal.styles";

import googleIcon from "@/assets/image/Google.png";
import kakaoIcon from "@/assets/image/Kakao.png";

type Props = {
  email?: string;
  password?: string;
  loginError?: string;
  onChangeEmail?: (v: string) => void;
  onChangePassword?: (v: string) => void;
  onSubmit?: () => void;
  onClickKakao?: () => void;
  onClickGoogle?: () => void;
  onClickSignUp?: () => void;
  onClickFindPassword?: () => void;
};

export const LoginModalView = ({
  email = "",
  password = "",
  loginError,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onClickKakao,
  onClickGoogle,
  onClickSignUp,
  onClickFindPassword,
}: Props) => {
  return (
    <S.RightPanel>
      <S.Brand>
        <S.BrandTitle>로그인</S.BrandTitle>
      </S.Brand>

      <S.Form>
        <S.Field>
          <S.Label>이메일</S.Label>
          <S.Input
            value={email}
            onChange={(e) => onChangeEmail?.(e.target.value)}
            placeholder=""
            autoComplete="email"
          />
        </S.Field>
        <S.PasswordSpacer />

        <S.Field>
          <S.Label>비밀번호</S.Label>
          <S.Input
            type="password"
            value={password}
            onChange={(e) => onChangePassword?.(e.target.value)}
            placeholder=""
            autoComplete="current-password"
          />
        </S.Field>
        <S.ValidationMessage $isError style={{ visibility: loginError ? "visible" : "hidden" }}>
          {loginError ?? " "}
        </S.ValidationMessage>

        <S.PrimaryButton type="button" onClick={onSubmit}>
          로그인
        </S.PrimaryButton>

        <S.OrRow>
          <S.OrLine />
          <S.OrText>간편 로그인</S.OrText>
          <S.OrLine />
        </S.OrRow>
        <S.SocialButtonKakao type="button" onClick={onClickKakao}>
          <img alt="Kakao" src={kakaoIcon} width={16} height={16} />
          카카오로 시작하기
        </S.SocialButtonKakao>

        <S.SocialButtonGoogle type="button" onClick={onClickGoogle}>
          <img alt="Google" src={googleIcon} width={16} height={16} />
          구글로 시작하기
        </S.SocialButtonGoogle>

        <S.BottomLinks>
          <S.LinkRow>
            <S.SmallText>아직 회원이 아니신가요?</S.SmallText>
            <S.LinkButton type="button" onClick={onClickSignUp}>
              회원가입
            </S.LinkButton>
          </S.LinkRow>

          <S.LinkRow>
            <S.SmallText>비밀번호를 잃어버리셨나요?</S.SmallText>
            <S.LinkButton type="button" onClick={onClickFindPassword}>
              비밀번호 찾기
            </S.LinkButton>
          </S.LinkRow>
        </S.BottomLinks>
      </S.Form>
    </S.RightPanel>
  );
};
