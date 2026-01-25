import { IoAddSharp } from "react-icons/io5";
import { MdOutlineSettings } from "react-icons/md";
import styled from "styled-components";

import { Stack, Text } from "./ProfileCommon";

const Card = styled.section`
  width: 100%;
  padding: 2.0625rem;
  background: rgba(20, 20, 20, 0.6);
  border-radius: 1.5rem;
  outline: 0.0625rem rgba(255, 255, 255, 0.1) solid;
  outline-offset: -0.0625rem;
  backdrop-filter: blur(0.625rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 1024px) {
    padding: 3.104375rem;
    background: var(--neutral-900, #171717);
    border-radius: 1.875rem;
    outline: 0.0625rem var(--neutral-600, #525252) solid;
    align-items: flex-start;
    flex-direction: row;
    gap: 3.125rem;
  }

  @media (max-width: 768px) {
    padding: clamp(0.5rem, 2.5vw, 0.75rem);
    gap: clamp(0.5rem, 2.5vw, 0.75rem);
    align-items: center;
    flex-direction: column;
  }
`;

const AvatarWrap = styled.div`
  width: 9rem;
  height: 9rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    width: 12.5rem;
    height: 12.5rem;
  }

  @media (max-width: 768px) {
    width: clamp(5rem, 18vw, 6.25rem);
    height: clamp(5rem, 18vw, 6.25rem);
  }
`;

const Avatar = styled.div`
  width: 9rem;
  height: 9rem;
  position: relative;
  background: var(--base-black, black);
  border-radius: 624.9375rem;
  overflow: hidden;
  box-shadow: 0 0 1.25rem rgba(124, 58, 237, 0.3), 0 0 0 0.125rem rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    width: 12.5rem;
    height: 12.5rem;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    width: clamp(5rem, 18vw, 6.25rem);
    height: clamp(5rem, 18vw, 6.25rem);
  }
`;

const AvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: var(--color-brand-primary-900, #59168b);
`;

const AvatarCore = styled.div`
  width: 6rem;
  height: 6rem;
  left: 1.5rem;
  top: 1.5rem;
  position: absolute;
  background: var(--color-brand-primary-200, #e9d4ff);

  @media (max-width: 1024px) {
    width: 8.333125rem;
    height: 8.333125rem;
    left: 2.083125rem;
    top: 2.083125rem;
  }

  @media (max-width: 768px) {
    width: clamp(3.5rem, 12vw, 4.166875rem);
    height: clamp(3.5rem, 12vw, 4.166875rem);
    left: clamp(0.875rem, 3vw, 1.041875rem);
    top: clamp(0.875rem, 3vw, 1.041875rem);
  }
`;

const Info = styled(Stack)`
  width: 100%;
  align-items: center;
  text-align: center;
  gap: 0.625rem;

  @media (max-width: 1024px) {
    width: 23.5rem;
    align-items: flex-start;
    text-align: left;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    text-align: center;
    gap: clamp(0.4rem, 2vw, 0.5rem);
  }
`;

const TypePill = styled.div`
  padding: 0.25rem 0.75rem;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 624.9375rem;
  outline: 0.0625rem rgba(124, 58, 237, 0.3) solid;
  outline-offset: -0.0625rem;
  display: inline-flex;

  @media (max-width: 1024px) {

  }
`;

const TypeLabel = styled(Text)`
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1rem;

  @media (max-width: 1024px) {
    font-size: 0.9375rem;
    line-height: 1.25rem;
  }
`;

const UserName = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;

  @media (max-width: 1024px) {
    font-size: 2.34375rem;
    line-height: 2.8125rem;
  }

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 5vw, 1.75rem);
    line-height: clamp(1.8rem, 6vw, 2.1rem);
  }
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-top: 0.041875rem rgba(255, 255, 255, 0.1) solid;
  border-bottom: 0.041875rem rgba(255, 255, 255, 0.1) solid;

  @media (max-width: 1024px) {
    gap: 3.75rem;
    padding: 0;
    border: none;
  }

  @media (max-width: 768px) {
    gap: clamp(2.5rem, 10vw, 3.75rem);
  }
`;

const StatItem = styled(Stack)`
  align-items: center;
  gap: 0.40625rem;

  @media (max-width: 1024px) {
    gap: 0.41625rem;
  }
`;

const StatButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.40625rem;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: pointer;
  font: inherit;

  @media (max-width: 1024px) {
    gap: 0.41625rem;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-brand, #9810fa);
    outline-offset: 0.25rem;
    border-radius: 0.5rem;
  }

  &:disabled {
    cursor: default;
  }
`;

const StatValue = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.75rem;

  @media (max-width: 1024px) {
    font-size: 1.5625rem;
    line-height: 2.1875rem;
  }

  @media (max-width: 768px) {
    font-size: clamp(1.1rem, 4vw, 1.25rem);
    line-height: clamp(1.75rem, 6vw, 2.1875rem);
  }
`;

const StatLabel = styled(Text)`
  color: #6b7280;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  text-transform: uppercase;

  @media (max-width: 1024px) {
    color: var(--neutral-500, #737373);
    font-size: 0.9375rem;
    line-height: 1.25rem;
    letter-spacing: 0.046875rem;
    text-transform: none;
  }

  @media (max-width: 768px) {
    font-size: clamp(0.8rem, 3vw, 0.9375rem);
    line-height: clamp(1.1rem, 4vw, 1.25rem);
  }
`;

const QuoteText = styled(Text)`
  color: var(--neutral-300, #d4d4d4);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.5rem;
  text-align: inherit;
`;

const MetaBadge = styled.div`
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const MetaBadgeText = styled(Text)`
  color: var(--color-brand-primary-200, #e9d4ff);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.25rem;
  font-family: Consolas;
`;

const Actions = styled(Stack).attrs({
  $direction: "row",
  $gap: "0.625rem",
  $align: "center",
})``;

const EditButton = styled.button`
  padding: 0.64625rem 1.25rem;
  background: white;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 0.5rem 1.5rem;
    border-radius: 0.625rem;
    outline: 0.0625rem var(--neutral-600, #525252) solid;
    outline-offset: -0.0625rem;
  }
`;

const EditButtonText = styled(Text)`
  color: black;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (max-width: 1024px) {
    color: var(--neutral-700, #404040);
    font-size: 1.09375rem;
    line-height: 1.5625rem;
  }
`;

const SettingsButton = styled.button`
  padding: 0.604375rem;
  border-radius: 0.5rem;
  outline: 0.0625rem rgba(255, 255, 255, 0.2) solid;
  outline-offset: -0.0625rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 0.5rem;
    border-radius: 0.625rem;
    outline: 0.0625rem var(--neutral-600, #525252) solid;
  }
`;

const FollowButton = styled.button`
  padding: 0.64625rem 1.25rem;
  background: var(--color-bg-brand, #9810fa);
  border-radius: 0.5rem;
  color: var(--neutral-50, #fafafa);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;

  @media (max-width: 1024px) {
    padding: 0.5rem 1.5rem;
    border-radius: 0.625rem;
  }
`;

const MessageButton = styled.button`
  padding: 0.64625rem 1.25rem;
  background: white;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    padding: 0.5rem 1.5rem;
    border-radius: 0.625rem;
  }
`;

const ActionText = styled(Text)`
  color: ${({ $color }) => $color ?? "black"};
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  @media (max-width: 1024px) {
    font-size: 1.09375rem;
    line-height: 1.5625rem;
  }
`;

interface ProfileHeaderSectionProps {
  username: string;
  postCount: number;
  follower: number;
  following: number;
  bodyType?: string;
  profileMeta?: string;
  isOwner?: boolean;
  bio?: string;
  onFollowerClick?: () => void;
  onFollowingClick?: () => void;
}

const formatCount = (value: number) => {
  if (value >= 1000) {
    const shortValue = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${shortValue}k`;
  }

  return `${value}`;
};

const formatBodyType = (value?: string) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return "Natural Type";
  }

  const isKorean = /[가-힣]/.test(normalizedValue);
  const hasTypeSuffix = /type/i.test(normalizedValue);

  if (isKorean || hasTypeSuffix) {
    return normalizedValue;
  }

  return `${normalizedValue} Type`;
};

const ProfileHeaderSection = ({
  username,
  postCount,
  follower,
  following,
  bodyType,
  profileMeta,
  isOwner = false,
  bio,
  onFollowerClick,
  onFollowingClick,
}: ProfileHeaderSectionProps) => {
  const bodyTypeLabel = formatBodyType(bodyType);
  const metaParts = profileMeta
    ? profileMeta.split(/[•/]/).map((part) => part.trim()).filter(Boolean)
    : [];
  const metaLabel = metaParts.length ? metaParts.join(" • ") : "171cm • 58kg";
  const quoteText = bio?.trim() ? bio : "나랑 어울리는 옷들로 꽉 채워야지이ㅣ~~";

  return (
    <Card>
      <AvatarWrap>
        <Avatar>
          <AvatarOverlay />
          <AvatarCore />
        </Avatar>
      </AvatarWrap>
      <Info>
        <TypePill>
          <TypeLabel>{bodyTypeLabel}</TypeLabel>
        </TypePill>
        <Stack $direction="row" $align="center" $justify="center">
          <UserName as="h1">{username}</UserName>
        </Stack>
        <StatsRow>
          <StatItem>
            <StatValue>{formatCount(postCount)}</StatValue>
            <StatLabel>Posts</StatLabel>
          </StatItem>
          <StatButton type="button" onClick={onFollowerClick} disabled={!onFollowerClick}>
            <StatValue>{formatCount(follower)}</StatValue>
            <StatLabel>Followers</StatLabel>
          </StatButton>
          <StatButton type="button" onClick={onFollowingClick} disabled={!onFollowingClick}>
            <StatValue>{formatCount(following)}</StatValue>
            <StatLabel>Following</StatLabel>
          </StatButton>
        </StatsRow>
        <QuoteText as="p">{quoteText}</QuoteText>
        <MetaBadge>
          <MetaBadgeText as="span">{metaLabel}</MetaBadgeText>
        </MetaBadge>
        <Actions>
          {isOwner ? (
            <>
              <EditButton type="button">
                <EditButtonText>프로필 편집</EditButtonText>
              </EditButton>
              <SettingsButton type="button" aria-label="Profile settings">
                <MdOutlineSettings size={24}color="#FAFAFA" />
              </SettingsButton>
            </>
          ) : (
            <>
              <FollowButton type="button">
                <ActionText $color="var(--neutral-50, #fafafa)">Follow</ActionText>
                <IoAddSharp />
              </FollowButton>
              <MessageButton type="button">
                <ActionText>Message</ActionText>
              </MessageButton>
            </>
          )}
        </Actions>
      </Info>
    </Card>
  );
};

export default ProfileHeaderSection;
