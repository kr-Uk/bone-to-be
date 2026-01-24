
import * as S from "./LoginModal.styles";

type Props = {
  email?: string;
  password?: string;
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
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onClickKakao,
  onClickGoogle,
  onClickSignUp,
  onClickFindPassword,
}: Props) => {
  return (
    <S.ModalCard>
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
              onChange={(e) => onChangeEmail?.(e.target.value)}
              placeholder=""
              autoComplete="email"
            />
          </S.Field>

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

          <S.PrimaryButton type="button" onClick={onSubmit}>
            로그인
          </S.PrimaryButton>

          <S.OrRow>
            <S.OrLine />
            <S.OrText>간편 로그인</S.OrText>
            <S.OrLine />
          </S.OrRow>

          <S.SocialButtonKakao type="button" onClick={onClickKakao}>
            <S.KakaoDot aria-hidden />
            카카오로 시작하기
          </S.SocialButtonKakao>

          <S.SocialButton type="button" onClick={onClickGoogle}>
            <S.GoogleDot aria-hidden />
            구글로 시작하기
          </S.SocialButton>

          <S.BottomLinks>
            <S.LinkRow>
              <S.SmallText>아직 회원이 아니신가요?</S.SmallText>
              <S.LinkButton type="button" onClick={onClickSignUp}>
                회원가입
              </S.LinkButton>
            </S.LinkRow>

            <S.LinkRow>
              <S.SmallText>비밀번호를 잊어버리셨나요?</S.SmallText>
              <S.LinkButton type="button" onClick={onClickFindPassword}>
                비밀번호 찾기
              </S.LinkButton>
            </S.LinkRow>
          </S.BottomLinks>
        </S.Form>
      </S.RightPanel>
    </S.ModalCard>
  );
};
