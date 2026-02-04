import styled from "styled-components";

import { Stack } from "./ProfileCommon";

import { Skeleton } from "@/shared/components/Skeleton/Skeleton";
import { SkeletonText } from "@/shared/components/Skeleton/SkeletonText";

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

const AvatarSkeleton = styled(Skeleton)`
  width: 9rem !important;
  height: 9rem !important;
  border-radius: 624.9375rem;
  overflow: hidden;

  @media (max-width: 1024px) {
    width: 12.5rem !important;
    height: 12.5rem !important;
  }

  @media (max-width: 768px) {
    width: clamp(5rem, 18vw, 6.25rem) !important;
    height: clamp(5rem, 18vw, 6.25rem) !important;
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

const TypePillSkeleton = styled(Skeleton)`
  border-radius: 624.9375rem;
  align-self: center;

  @media (max-width: 1024px) {
    align-self: flex-start;
  }

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const NicknameSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  align-items: center;

  @media (max-width: 1024px) {
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const BioSkeleton = styled.div`
  width: 100%;
  margin: 0.5rem 0;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-top: 0.041875rem rgba(255, 255, 255, 0.1) solid;
  border-bottom: 0.041875rem rgba(255, 255, 255, 0.1) solid;
  width: 100%;

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
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 0.40625rem;

  @media (max-width: 1024px) {
    gap: 0.41625rem;
  }
`;

const Actions = styled(Stack).attrs({
  $direction: "row",
  $gap: "0.625rem",
  $align: "center",
})`
  width: 100%;
  justify-content: center;

  @media (max-width: 1024px) {
    justify-content: flex-start;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ButtonSkeleton = styled(Skeleton)`
  border-radius: 0.5rem;

  @media (max-width: 1024px) {
    border-radius: 0.625rem;
  }
`;

/**
 * Skeleton loading state for ProfileHeaderSection
 *
 * Replicates the structure of ProfileHeaderSection with skeleton elements:
 * - Avatar (9rem circular skeleton)
 * - Body type badge (pill-shaped skeleton)
 * - Nickname (2-line text skeleton)
 * - Bio (3-line text skeleton)
 * - Stats row (3 stat items with circular badge + text)
 * - Action buttons (2 button skeletons)
 *
 * @example
 * <ProfileHeaderSkeleton />
 */
export const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <Card aria-label="Loading profile header">
      {/* Avatar skeleton */}
      <AvatarWrap>
        <AvatarSkeleton variant="circular" />
      </AvatarWrap>

      <Info>
        {/* Body type badge skeleton */}
        <TypePillSkeleton width="8rem" height="2rem" />

        {/* Nickname skeleton - 2 lines */}
        <NicknameSkeleton>
          <Skeleton width="80%" height="2rem" />
          <Skeleton width="60%" height="2rem" />
        </NicknameSkeleton>

        {/* Stats row - 3 stat blocks */}
        <StatsRow>
          <StatItem>
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
            <Skeleton width="3rem" height="0.9375rem" />
          </StatItem>
          <StatItem>
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
            <Skeleton width="3rem" height="0.9375rem" />
          </StatItem>
          <StatItem>
            <Skeleton variant="circular" width="1.75rem" height="1.75rem" />
            <Skeleton width="3rem" height="0.9375rem" />
          </StatItem>
        </StatsRow>

        {/* Bio skeleton - 3 lines */}
        <BioSkeleton>
          <SkeletonText lines={3} width={["100%", "100%", "70%"]} lineHeight="1.5rem" />
        </BioSkeleton>

        {/* Action buttons skeleton */}
        <Actions>
          <ButtonSkeleton width="10rem" height="3rem" />
          <ButtonSkeleton width="3rem" height="3rem" />
        </Actions>
      </Info>
    </Card>
  );
};
