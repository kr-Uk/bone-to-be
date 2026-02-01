import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { LuChevronLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";

import { useProfileQuery } from "./hooks/useProfileQuery";
import { useProfileImageUpdate } from "./hooks/useProfileImageUpdate";
import { useProfileUpdate } from "./hooks/useProfileUpdate";
import { checkNickname } from "@/pages/LoginPage/api/authApi";

const extractProfileImageId = (url?: string | null): number | null => {
  if (!url) return null;
  const match = url.match(/\/profile\/(\d+)\//);
  if (!match) return null;
  return Number(match[1]);
};

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useProfileQuery();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nickname, setNickname] = useState("");
  const [initialNickname, setInitialNickname] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "error"
  >("idle");

  const profileUpdateMutation = useProfileUpdate();
  const profileImageUpdateMutation = useProfileImageUpdate();

  const isSubmitting = profileUpdateMutation.isPending || profileImageUpdateMutation.isPending;

  useEffect(() => {
    if (!profile) return;
    setNickname(profile.username);
    setInitialNickname(profile.username);
    setBio(profile.bio ?? "");
    setPreviewUrl(profile.profileImageUrl ?? null);
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const canSubmit = useMemo(() => {
    const trimmedNickname = nickname.trim();
    const isNicknameUnchanged = trimmedNickname === initialNickname.trim();
    const hasInvalidNickname = /[^a-zA-Z0-9가-힣_]/.test(trimmedNickname);

    if (!trimmedNickname || hasInvalidNickname) return false;
    if (!isNicknameUnchanged && nicknameCheckStatus !== "available") return false;
    return !isSubmitting;
  }, [nickname, initialNickname, nicknameCheckStatus, isSubmitting]);

  const nicknameFeedback = useMemo(() => {
    if (nicknameCheckStatus === "available") {
      return { text: "사용 가능한 닉네임입니다.", isError: false };
    }
    if (nicknameCheckStatus === "taken") {
      return { text: "이미 사용 중인 닉네임입니다.", isError: true };
    }
    if (nicknameCheckStatus === "invalid") {
      return { text: "올바르지 않은 닉네임입니다.", isError: true };
    }
    if (nicknameCheckStatus === "error") {
      return { text: "닉네임 확인에 실패했습니다.", isError: true };
    }
    return null;
  }, [nicknameCheckStatus]);

  const handleSelectImage = () => {
    if (isSubmitting) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleSubmit = async () => {
    if (!profile || !canSubmit) return;

    try {
      if (imageFile) {
        await profileImageUpdateMutation.mutateAsync({
          file: imageFile,
          nickname: nickname.trim(),
          bio: bio.trim(),
        });
        setImageFile(null);
        navigate(-1);
        return;
      }
      const profileImageId = extractProfileImageId(profile.profileImageUrl);

      await profileUpdateMutation.mutateAsync({
        nickname: nickname.trim(),
        bio: bio.trim(),
        ...(profileImageId ? { profileImageId } : {}),
      });
      navigate(-1);
    } catch {
      alert("프로필 편집에 실패했습니다.");
    }
  };

  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) return;
    if (/[^a-zA-Z0-9가-힣_]/.test(trimmedNickname)) {
      setNicknameCheckStatus("invalid");
      return;
    }

    try {
      setNicknameCheckStatus("checking");
      const data = await checkNickname(trimmedNickname);
      const hasNickname = data?.data?.hasNickname;
      setNicknameCheckStatus(hasNickname ? "taken" : "available");
    } catch {
      setNicknameCheckStatus("error");
    }
  };

  if (isLoading) {
    return (
      <Page>
        <LoginHeader />
        <Main>
        
          <StatusMessage>프로필을 불러오는 중입니다...</StatusMessage>
        </Main>
      </Page>
    );
  }

  if (isError || !profile) {
    return (
      <Page>
        <LoginHeader />
        <Main>
        
          <StatusMessage>프로필 정보를 불러오지 못했습니다.</StatusMessage>
        </Main>
      </Page>
    );
  }

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
          <BackButton type="button" onClick={() => navigate(-1)} aria-label="????">
            <LuChevronLeft size={24} />
          </BackButton>
          <Header>
            <Title>프로필 편집</Title>
            <Desc>닉네임과 소개글, 프로필 이미지를 변경할 수 있습니다.</Desc>
          </Header>

          <Form>
            <ImageField>
              <Label>프로필 이미지</Label>
              <ImageRow $center>
                <Avatar>
                  {previewUrl ? (
                    <AvatarImage src={previewUrl} alt="profile preview" />
                  ) : (
                    <AvatarFallback />
                  )}
                </Avatar>
                <ImageActions>
                  <ImageButton type="button" onClick={handleSelectImage} disabled={isSubmitting}>
                    이미지 변경
                  </ImageButton>
                  <HelperText>JPG, PNG 파일을 권장합니다.</HelperText>
                </ImageActions>
              </ImageRow>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </ImageField>
            <Divider />

            <Field>
              <Label>닉네임</Label>
              <NicknameRow>
                <Input
                  value={nickname}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    const trimmed = nextValue.trim();
                    setNickname(nextValue);
                    if (!trimmed) {
                      setNicknameCheckStatus("idle");
                      return;
                    }
                    if (/[^a-zA-Z0-9가-힣_]/.test(trimmed)) {
                      setNicknameCheckStatus("invalid");
                      return;
                    }
                    setNicknameCheckStatus("idle");
                  }}
                  placeholder="닉네임을 입력해 주세요"
                  disabled={isSubmitting}
                />
                <CheckButton
                  type="button"
                  onClick={handleCheckNickname}
                  disabled={isSubmitting || nicknameCheckStatus === "checking"}
                >
                  {nicknameCheckStatus === "checking" ? "확인 중..." : "중복 확인"}
                </CheckButton>
              </NicknameRow>
              <ValidationMessage $isError={nicknameFeedback?.isError}>
                {nicknameFeedback?.text ?? " "}
              </ValidationMessage>
            </Field>

            <Field>
              <Label>소개글</Label>
              <Input
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="나를 소개하는 한 줄을 입력해 주세요"
                disabled={isSubmitting}
              />
            </Field>
            <Divider />
            <Divider />
            
            <ActionRow>
              <GhostButton type="button" onClick={() => navigate(-1)} disabled={isSubmitting}>
                취소
              </GhostButton>
              <PrimaryButton type="button" onClick={handleSubmit} disabled={!canSubmit}>
                저장
              </PrimaryButton>
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
  padding: 5rem 1.5rem 4rem;

  @media (max-width: 1024px) {
    padding: 4.5rem 1.5rem 3.5rem;
  }

  @media (max-width: 768px) {
    padding: 4rem 1rem 3rem;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
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

const ShapesLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  & ${StraightShape} {
    top: 7%;
    right: 8%;
    opacity: 0.32;
  }

  & ${WaveShape} {
    bottom: 9%;
    left: 6%;
    opacity: 0.3;
  }

  & ${NaturalShape} {
    top: 55%;
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
      top: 60%;
      left: 6%;
    }
  }

  @media (max-width: 768px) {
    & ${NaturalShape} {
      display: none;
    }
  }
`;


const Divider = styled.hr`
  margin: 0.5rem 0;
  border: none;
`

const Card = styled.section`
  position: relative;
  width: 100%;
  max-width: 36rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 0.75rem;
  box-shadow:
    0 1.75rem 3.5rem -1rem rgba(0, 0, 0, 0.6),
    0 0 1.5rem rgba(0, 0, 0, 0.6);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 1;
  align-self: center;
  height: fit-content;

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
  gap: 0.5rem;
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

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.9rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;

`;

const ImageField = styled(Field)`
  gap: 0.75rem;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
  margin-bottom: 0.4rem;
  margin-top: 0.25rem;
`;

const ImageRow = styled.div<{ $center?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  ${({ $center }) =>
    $center
      ? `
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  `
      : ""}
`;

const Avatar = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  position: relative;
`;

const AvatarImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div`
  position: absolute;
  inset: 0;
`;

const ImageActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 0.9rem;
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

  &:disabled {
    opacity: 0.5;
  }
`;

const NicknameRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const CheckButton = styled.button`
  min-width: 6.5rem;
  
  padding: 0.56rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const GhostButton = styled.button`
  width: 100%;
  padding: 0.5625rem 1.5rem;
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

const HelperText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;
`;

const ImageButton = styled.button`
  padding: 0.5625rem 1.75rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ValidationMessage = styled.p<{ $isError?: boolean }>`
  margin: 0.25rem 0 0;
  min-height: 1rem;
  color: ${({ theme, $isError }) => ($isError ? "#ef4444" : theme.colors.brand)};
  font-size: 0.75rem;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const StatusMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 1rem;
  margin: 0;
`;

export default ProfileEditPage;
