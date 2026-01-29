import { useMemo, useState } from "react";
import { LuChevronDown, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";
import { useDeleteMe } from "@/shared/hooks/useDeleteMe";
import { useLogout } from "@/shared/hooks/useLogout";



type ReasonOption = {
  value: string;
  label: string;
};

const reasonOptions: ReasonOption[] = [
  { value: "", label: "탈퇴 사유를 선택해 주세요" },
  { value: "low-usage", label: "서비스 이용 빈도가 낮아서" },
  { value: "not-helpful", label: "원하는 기능/정보가 부족해서" },
  { value: "privacy", label: "개인정보/보안이 걱정되어서" },
  { value: "etc", label: "기타" },
];

export const WithdrawPage = () => {
  const navigate = useNavigate();
  const deleteMeMutation = useDeleteMe();
  const logoutMutation = useLogout();
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(reason) && password.trim().length > 0 && agreed;
  }, [reason, password, agreed]);

  const isSubmitting = deleteMeMutation.isPending || logoutMutation.isPending;

  const handleWithdraw = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    const confirmed = window.confirm("정말 탈퇴하시겠습니까?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteMeMutation.mutateAsync();
      await logoutMutation.mutateAsync();
      navigate("/");
    } catch {
      alert("탈퇴에 실패했습니다.");
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

        <Card>
          <Header>
            <Title>회원 탈퇴</Title>
            <DescGroup>
              <Desc>탈퇴 시 회원님의 모든 체형 분석 데이터와</Desc>
              <DescLine>
                <EmphasisUnderline>스크랩한 스타일이 영구적으로 삭제</EmphasisUnderline>
                <DescInline>됩니다.</DescInline>
              </DescLine>
            </DescGroup>
          </Header>

          <Form>
            <Field>
              <Label>탈퇴 사유</Label>
              <SelectWrap>
                <Select value={reason} onChange={(event) => setReason(event.target.value)}>
                  {reasonOptions.map((option) => (
                    <option key={option.value || "placeholder"} value={option.value} disabled={!option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <SelectIcon aria-hidden="true">
                  <LuChevronDown />
                </SelectIcon>
              </SelectWrap>
            </Field>

            <Field>
              <Label>비밀번호 확인</Label>
              <InputWrap>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호를 입력해 주세요"
                  autoComplete="current-password"
                />
                <InputIcon aria-hidden="true">
                  <LuLock />
                </InputIcon>
              </InputWrap>
            </Field>

            <AgreementBox>
              <AgreementRow>
                <Checkbox
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <AgreementText>
                  <strong>데이터 삭제</strong>에 동의하며, 탈퇴 후 복구가 불가능함을 확인했습니다.
                </AgreementText>
              </AgreementRow>
            </AgreementBox>

            <ActionRow>
              <GhostButton type="button" onClick={() => navigate(-1)} disabled={isSubmitting}>
                취소하기
              </GhostButton>
              <DangerButton type="button" disabled={!canSubmit || isSubmitting} onClick={handleWithdraw}>
                탈퇴하기
              </DangerButton>
            </ActionRow>
          </Form>
        </Card>
      </Main>
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 6rem 1.5rem 4rem;

  @media (max-width: 1024px) {
    padding: 5.5rem 1.5rem 3.5rem;
  }

  @media (max-width: 768px) {
    padding: 5rem 1rem 3rem;
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
    opacity: 0.35;
  }

  & ${WaveShape} {
    bottom: 10%;
    left: 6%;
    opacity: 0.32;
  }

  & ${NaturalShape} {
    top:10%;
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
      top: 52%;
      left: 6%;
    }
  }

  @media (max-width: 768px) {
    & ${NaturalShape} {
      display: none;
    }
  }
`;

const Card = styled.section`
  position: relative;
  width: 100%;
  max-width: 34rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 0.75rem;
  box-shadow:
    0 1.75rem 3.5rem -1rem rgba(0, 0, 0, 0.6),
    0 0 1.5rem rgba(0, 0, 0, 0.6);
  padding: 3.25rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 2.75rem;
  }

  @media (max-width: 768px) {
    padding: 2.25rem 1.5rem;
    gap: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
`;

const DescGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const DescLine = styled.p`
  margin: 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.2rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const EmphasisUnderline = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid var(--color-bg-brand, #9810fa);
  line-height: 1.5rem;
  vertical-align: baseline;
`;

const DescInline = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  line-height: 1.5rem;
  vertical-align: baseline;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
`;

const SelectWrap = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  height: 3.25rem;
  padding: 0 2.75rem 0 0.9rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.9rem;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SelectIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 0.9rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
  display: inline-flex;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 2.75rem 0 0.9rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.9rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const InputIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 0.9rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
  display: inline-flex;
`;

const AgreementBox = styled.div`
  background: var(--neutral-800, #262626);
  border: 1px solid var(--neutral-700, #404040);
  border-radius: 0.5rem;
  padding: 0.55rem 0.9rem;
`;

const AgreementRow = styled.label`
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 0.85rem;
  line-height: 1.4rem;
`;

const Checkbox = styled.input`
  margin-top: 0.2rem;
  width: 1rem;
  height: 1rem;
  accent-color: ${({ theme }) => theme.colors.brand};
`;

const AgreementText = styled.p`
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.brand};
    font-weight: 600;
  }
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const GhostButton = styled.button`
  height: 3.1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[200]};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const DangerButton = styled.button`
  height: 3.1rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
