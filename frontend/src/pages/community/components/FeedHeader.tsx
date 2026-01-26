import styled from "styled-components";

import type { SortBy } from "../api/community.types";

interface FeedHeaderProps {
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  /* Mobile */
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.heading.lg};
  color: ${({ theme }) => theme.colors.gray[50]};
  margin-bottom: 0.5rem;

  /* Mobile */
  @media (max-width: 767px) {
    ${({ theme }) => theme.typography.heading.sm};
  }
`;

const Subtitle = styled.p`
  ${({ theme }) => theme.typography.body.md.regular};
  color: ${({ theme }) => theme.colors.gray[400]};
  margin: 0;
`;

const SortTabs = styled.div`
  display: flex;
  gap: 2rem;
  padding-bottom: 0.75rem;

  /* Mobile */
  @media (max-width: 767px) {
    width: 100%;
    gap: 1.5rem;
    padding-bottom: 0.5rem;
  }
`;

const SortTab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.purple[600] : theme.colors.gray[400]};
  border-bottom: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.purple[600] : "transparent"};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.purple[600]};
  }
`;

export function FeedHeader({ sortBy, onSortChange }: FeedHeaderProps) {
  return (
    <HeaderContainer>
      <TitleSection>
        <Title>Community</Title>
        <Subtitle>다양한 스타일의 패션 피드를 만나보세요</Subtitle>
      </TitleSection>
      <SortTabs>
        <SortTab $active={sortBy === "popular"} onClick={() => onSortChange("popular")}>
          인기순
        </SortTab>
        <SortTab $active={sortBy === "recommended"} onClick={() => onSortChange("recommended")}>
          추천순
        </SortTab>
        <SortTab $active={sortBy === "latest"} onClick={() => onSortChange("latest")}>
          최신순
        </SortTab>
      </SortTabs>
    </HeaderContainer>
  );
}
