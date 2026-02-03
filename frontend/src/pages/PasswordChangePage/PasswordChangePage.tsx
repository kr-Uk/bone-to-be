import { useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuChevronLeft, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
import {
  Field,
  HelperText,
  Input,
  InputIcon,
  InputWrap,
  Label,
  LinkButton,
  PasswordFormCard,
  RuleItem,
  RuleList,
} from "@/pages/PasswordResetPage/components/PasswordFormCard";
import { usePasswordUpdate } from "@/pages/profile/hooks/usePasswordUpdate";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";

export const PasswordChangePage = () => {
  const navigate = useNavigate();
  const passwordUpdateMutation = usePasswordUpdate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isLengthValid = newPassword.length >= 8 && newPassword.length <= 12;
  const isPasswordValid = hasLetter && hasNumber && hasSpecial && isLengthValid;
  const isPasswordMatch = newPassword.length > 0 && newPassword === newPasswordConfirm;
  const isCurrentPasswordValid = currentPassword.trim().length > 0;

  const isSubmitting = passwordUpdateMutation.isPending;
  const canSubmit = useMemo(() => {
    return isCurrentPasswordValid && isPasswordValid && isPasswordMatch && !isSubmitting;
  }, [isCurrentPasswordValid, isPasswordValid, isPasswordMatch, isSubmitting]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      const response = await passwordUpdateMutation.mutateAsync({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      if (response.code !== 200) {
        throw new Error("Failed to update password");
      }
      alert("비밀번호 변경이 완료되었습니다.");
      navigate("/profile", { state: { fromInternalNav: true } });
    } catch {
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <Page>
      <LoginHeader />
      <Main>
        <ShapesLayer aria-hidden="true">
          <StraightShape />
          <WaveShape />
          <NaturalShape />
        </ShapesLayer>

        <PasswordFormCard
          title="비밀번호 변경"
          descriptions={[
            "현재 비밀번호와 새 비밀번호를 입력해 주세요.",
            "이전에 사용한 적 없는 비밀번호가 안전합니다.",
          ]}
          actionLabel="비밀번호 변경"
          actionLabelSubmitting="변경 중..."
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
          links={
            <LinkButton
              type="button"
              onClick={() => navigate("/profile", { state: { fromInternalNav: true } })}
            >
              마이페이지로 돌아가기
            </LinkButton>
          }
          leading={
            <BackButton type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
              <LuChevronLeft size={24} />
            </BackButton>
          }
        >
          <Field>
            <Label>현재 비밀번호</Label>
            <InputWrap>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="현재 비밀번호를 입력해 주세요"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <InputIcon aria-hidden="true">
                <LuLock />
              </InputIcon>
            </InputWrap>
          </Field>

          <Field>
            <Label>새 비밀번호</Label>
            <InputWrap>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="새 비밀번호를 입력해 주세요"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={newPassword.length > 0 && !isPasswordValid}
              />
              <InputIcon aria-hidden="true">
                <LuLock />
              </InputIcon>
            </InputWrap>
            <RuleList>
              <RuleItem $active={hasLetter}>영문 포함</RuleItem>
              <RuleItem $active={hasNumber}>숫자 포함</RuleItem>
              <RuleItem $active={isLengthValid}>8~12자</RuleItem>
              <RuleItem $active={hasSpecial}>특수문자 포함</RuleItem>
            </RuleList>
          </Field>

          <Field>
            <Label>새 비밀번호 확인</Label>
            <InputWrap>
              <Input
                type="password"
                value={newPasswordConfirm}
                onChange={(event) => setNewPasswordConfirm(event.target.value)}
                placeholder="비밀번호를 다시 입력해 주세요"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={newPasswordConfirm.length > 0 && !isPasswordMatch}
              />
              <InputIcon aria-hidden="true" $success={isPasswordMatch}>
                <FaCheck />
              </InputIcon>
            </InputWrap>
            <HelperText $error={newPasswordConfirm.length > 0 && !isPasswordMatch}>
              {newPasswordConfirm.length > 0 && !isPasswordMatch
                ? "비밀번호가 일치하지 않습니다."
                : " "}
            </HelperText>
          </Field>
        </PasswordFormCard>
      </Main>
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 10rem 1.5rem 7.5rem;

  @media (max-width: 1024px) {
    padding: 8rem 1.5rem 6rem;
  }

  @media (max-width: 768px) {
    padding: 6.5rem 1rem 4.5rem;
  }
`;

const ShapesLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  & ${StraightShape} {
    top: 8%;
    right: 8%;
    opacity: 0.32;
  }

  & ${WaveShape} {
    bottom: 10%;
    left: 6%;
    opacity: 0.3;
  }

  & ${NaturalShape} {
    top: 58%;
    left: 12%;
    margin-left: 0;
    margin-top: 0;
    opacity: 0.2;
  }

  @media (max-width: 1024px) {
    & ${StraightShape} {
      top: 6%;
      right: 5%;
    }

    & ${WaveShape} {
      bottom: 8%;
      left: 4%;
    }

    & ${NaturalShape} {
      top: 62%;
      left: 6%;
    }
  }

  @media (max-width: 768px) {
    & ${NaturalShape} {
      display: none;
    }
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[100]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }
`;
