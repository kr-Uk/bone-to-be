import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { useFeedList, useLikeToggle } from "./api";
import { FeedCreateModal } from "./components/FeedCreateModal";
import { FeedDetailModal } from "./components/FeedDetailModal";
import { FeedFAB } from "./components/FeedFAB";
import { FeedFilters } from "./components/FeedFilters";
import { FeedGrid } from "./components/FeedGrid";
import { FeedHeader } from "./components/FeedHeader";
import { SelectedFilters } from "./components/SelectedFilters";

import type { FeedFilters as FeedFiltersType, SortBy } from "./api";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.gray[900]};
  min-height: 100vh;
`;

const FilterHeader = styled.div`
  top: 0;
  z-index: 10;
  backdrop-filter: blur(8px);
  background-color: ${({ theme }) =>
    `rgba(${parseInt(theme.colors.gray[900].slice(1, 3), 16)}, ${parseInt(
      theme.colors.gray[900].slice(3, 5),
      16,
    )}, ${parseInt(theme.colors.gray[900].slice(5, 7), 16)}, 0.95)`};
  border-bottom: 1.333px solid ${({ theme }) => theme.colors.gray[600]};
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 1280px;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1280px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.gray[400]};
  ${({ theme }) => theme.typography.body.lg.regular};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.gray[400]};
  ${({ theme }) => theme.typography.body.lg.regular};
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${({ theme }) => theme.colors.gray[400]};
  ${({ theme }) => theme.typography.body.lg.regular};
`;

export default function CommunityPage() {
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [filters, setFilters] = useState<FeedFiltersType>({
    gender: null,
    bodyType: null,
    styles: [],
    heightRange: null,
    weightRange: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const { data, isLoading, error } = useFeedList({
    sortBy,
    filters,
    page: 0,
    limit: 12,
  });
  const feedIds = useMemo(() => data?.items.map((item) => item.id) ?? [], [data?.items]);
  const selectedIndex = selectedFeedId ? feedIds.indexOf(selectedFeedId) : -1;
  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex >= 0 && selectedIndex < feedIds.length - 1;

  const likeToggleMutation = useLikeToggle();

  const handleSortChange = useCallback((newSort: SortBy) => {
    setSortBy(newSort);
  }, []);

  const handleFilterChange = useCallback((newFilters: FeedFiltersType) => {
    setFilters(newFilters);
  }, []);

  const handleRemoveFilter = useCallback((filterKey: string, value?: string) => {
    if (filterKey === "gender") {
      setFilters((prev) => ({ ...prev, gender: null }));
    } else if (filterKey === "bodyType") {
      setFilters((prev) => ({ ...prev, bodyType: null }));
    } else if (filterKey === "styles" && value) {
      setFilters((prev) => ({
        ...prev,
        styles: prev.styles.filter((s) => s !== value),
      }));
    }
  }, []);

  const handleLike = useCallback(
    (feedId: string, isLiked: boolean) => {
      likeToggleMutation.mutate({ feedId, isLiked });
    },
    [likeToggleMutation],
  );

  const handleCardClick = useCallback((feedId: string) => {
    setSelectedFeedId(feedId);
  }, []);
  const handlePrev = useCallback(() => {
    if (!hasPrev) {
      return;
    }
    setSelectedFeedId(feedIds[selectedIndex - 1]);
  }, [feedIds, hasPrev, selectedIndex]);
  const handleNext = useCallback(() => {
    if (!hasNext) {
      return;
    }
    setSelectedFeedId(feedIds[selectedIndex + 1]);
  }, [feedIds, hasNext, selectedIndex]);

  const handleFABClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <PageContainer>
      <FilterHeader>
        <FeedHeader sortBy={sortBy} onSortChange={handleSortChange} />
        <FeedFilters filters={filters} onFilterChange={handleFilterChange} />
        <SelectedFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
      </FilterHeader>

      <ContentContainer>
        {isLoading ? (
          <LoadingContainer>로딩 중...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>피드를 불러올 수 없습니다. 다시 시도해주세요.</ErrorContainer>
        ) : !data?.items || data.items.length === 0 ? (
          <EmptyContainer>선택한 필터에 맞는 피드가 없습니다.</EmptyContainer>
        ) : (
          <FeedGrid feedItems={data.items} onLike={handleLike} onCardClick={handleCardClick} />
        )}
      </ContentContainer>

      <FeedFAB onClick={handleFABClick} />

      <FeedCreateModal isOpen={isCreateModalOpen} onClose={handleCloseModal} />
      {selectedFeedId && (
        <FeedDetailModal
          onClose={() => setSelectedFeedId(null)}
          feedId={selectedFeedId}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </PageContainer>
  );
}
