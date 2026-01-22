import { IoAddSharp } from "react-icons/io5";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: flex-start;
`;

const AvatarFrame = styled.div`
  width: 160px;
  height: 160px;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: 9999px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.text};
    opacity: 0.05;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserName = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.lg.lineHeight};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EditButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
`;

const SettingsButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SettingsIcon = styled.span`
  width: 12px;
  height: 12px;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: 2px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    border: 1px solid ${({ theme }) => theme.colors.text};
    border-radius: 2px;
    top: 4px;
    left: 4px;
  }
`;

const FollowButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  box-shadow: 0 2px 4px -2px ${({ theme }) => theme.colors.gray[300]};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  padding: 0.45rem 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;


const MessageButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  padding: 0.45rem 1.5rem;

`;

const StatGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading.sm.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.sm.lineHeight};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MetaStrong = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.semibold.lineHeight};
`;

const MetaText = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.regular.lineHeight};
`;

const Bio = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.md.regular.lineHeight};
  white-space: pre-line;
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
}: ProfileHeaderSectionProps) => {
  const bodyTypeLabel = formatBodyType(bodyType);

  return (
    <Section>
      <AvatarFrame>
        <Avatar />
      </AvatarFrame>
      <Info>
        <HeaderRow>
          <UserName>{username}</UserName>
          <ActionGroup>
            {isOwner ? (
              <>
                <EditButton>프로필 편집</EditButton>
                <SettingsButton aria-label="Profile settings">
                  <SettingsIcon />
                </SettingsButton>
              </>
            ) : (
              <>
                <FollowButton>
                  Follow
                  <IoAddSharp />
                </FollowButton>
                <MessageButton>Message</MessageButton>
              </>
            )}
          </ActionGroup>
        </HeaderRow>
        <StatGroup>
          <StatItem>
            <StatValue>{formatCount(postCount)}</StatValue>
            <StatLabel>게시물</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCount(follower)}</StatValue>
            <StatLabel>팔로워</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCount(following)}</StatValue>
            <StatLabel>팔로잉</StatLabel>
          </StatItem>
        </StatGroup>
        <MetaRow>
          {profileMeta && <MetaStrong>{profileMeta}</MetaStrong>}
          <MetaText>{bodyTypeLabel}</MetaText>
        </MetaRow>
        {bio && <Bio>{bio}</Bio>}
      </Info>
    </Section>
  );
};

export default ProfileHeaderSection;
