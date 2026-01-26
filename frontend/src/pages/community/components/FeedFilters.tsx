/* eslint-disable @typescript-eslint/no-unsafe-return */

import styled from "styled-components";

import type { FeedFilters } from "../api";

interface FeedFiltersProps {
  filters: FeedFilters;
  onFilterChange: (filters: FeedFilters) => void;
}

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: 0.5rem;

  /* Desktop/Tablet */
  @media (min-width: 768px) {
    gap: 0.9375rem;
    overflow-x: visible;
    flex-wrap: wrap;
  }

  /* Mobile */
  @media (max-width: 767px) {
    gap: 0.75rem;
    padding-bottom: 0;
    flex-wrap: wrap;
  }

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[800]};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[600]};
    border-radius: 2px;
  }
`;

const FilterChip = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 1.625rem;
  border-radius: 9999px;
  border: 1px solid
    ${({ $selected, theme }) =>
      $selected
        ? theme.colors.purple[600]
        : theme.colors.gray[600]};
  background-color: ${({ $selected, theme }) =>
    $selected
      ? theme.colors.purple[900]
      : "transparent"};
  color: ${({ $selected, theme }) =>
    $selected
      ? theme.colors.purple[200]
      : theme.colors.gray[200]};
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  font-size: 1.09375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purple[600]};
  }

  /* Mobile */
  @media (max-width: 767px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const FilterLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const FilterChipX = styled.span`
  font-size: 1.2em;
  line-height: 1;
`;

export function FeedFilters({ filters, onFilterChange }: FeedFiltersProps) {
  const handleGenderChange = (gender: "men" | "women" | null) => {
    onFilterChange({
      ...filters,
      gender: filters.gender === gender ? null : gender,
    });
  };

  const handleBodyTypeChange = (bodyType: "Straight" | "Wave" | "Natural" | null) => {
    onFilterChange({
      ...filters,
      bodyType: filters.bodyType === bodyType ? null : bodyType,
    });
  };

  const handleStyleChange = (style: string) => {
    const newStyles = filters.styles.includes(style)
      ? filters.styles.filter((s) => s !== style)
      : [...filters.styles, style];

    onFilterChange({
      ...filters,
      styles: newStyles,
    });
  };

  const genderLabel =
    filters.gender === "men" ? "남성" : filters.gender === "women" ? "여성" : "성별";
  const bodyTypeLabels: Record<string, string> = {
    Straight: "스트레이트",
    Wave: "웨이브",
    Natural: "내추럴",
  };
  const bodyTypeLabel =
    filters.bodyType && bodyTypeLabels[filters.bodyType]
      ? bodyTypeLabels[filters.bodyType]
      : "골격유형";

  const styleLabels: Record<string, string> = {
    Casual: "캐주얼",
    Street: "스트릿",
    Minimal: "미니멀",
  };

  const allStyles = ["Casual", "Street", "Minimal"];

  return (
    <FiltersContainer>
      <FilterChip
        $selected={filters.gender !== null}
        onClick={() => handleGenderChange(filters.gender === "women" ? "men" : "women")}
      >
        <FilterLabel>
          {genderLabel}
          {filters.gender && <FilterChipX>×</FilterChipX>}
        </FilterLabel>
      </FilterChip>

      <FilterChip
        $selected={filters.bodyType !== null}
        onClick={() =>
          handleBodyTypeChange(
            filters.bodyType === "Straight" ? "Wave" : filters.bodyType === "Wave" ? "Natural" : "Straight",
          )
        }
      >
        <FilterLabel>
          {bodyTypeLabel}
          {filters.bodyType && <FilterChipX>×</FilterChipX>}
        </FilterLabel>
      </FilterChip>

      {allStyles.map((style) => (
        <FilterChip
          key={style}
          $selected={filters.styles.includes(style)}
          onClick={() => handleStyleChange(style)}
        >
          <FilterLabel>
            {styleLabels[style]}
            {filters.styles.includes(style) && <FilterChipX>×</FilterChipX>}
          </FilterLabel>
        </FilterChip>
      ))}
    </FiltersContainer>
  );
}
