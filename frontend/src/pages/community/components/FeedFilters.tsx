/* eslint-disable @typescript-eslint/no-unsafe-return */

import styled from "styled-components";

import type { FeedFilters } from "../api";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";

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

const Divider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0.5rem;
  flex-shrink: 0;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.625rem;
  border-radius: 9999px;
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray[200]};
  font-weight: 500;
  font-size: 1.09375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purple[600]};
    color: ${({ theme }) => theme.colors.purple[200]};
  }

  /* Mobile */
  @media (max-width: 767px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
`;

// Filter options
const genderOptions: FilterOption[] = [
  { value: "men", label: "남성" },
  { value: "women", label: "여성" },
];

const bodyTypeOptions: FilterOption[] = [
  { value: "Straight", label: "스트레이트" },
  { value: "Wave", label: "웨이브" },
  { value: "Natural", label: "내추럴" },
];

const styleOptions: FilterOption[] = [
  { value: "Casual", label: "캐주얼" },
  { value: "Street", label: "스트릿" },
  { value: "Minimal", label: "미니멀" },
];

export function FeedFilters({ filters, onFilterChange }: FeedFiltersProps) {
  const handleGenderChange = (value: string | string[] | null) => {
    onFilterChange({
      ...filters,
      gender: value as "men" | "women" | null,
    });
  };

  const handleBodyTypeChange = (value: string | string[] | null) => {
    onFilterChange({
      ...filters,
      bodyType: value as "Straight" | "Wave" | "Natural" | null,
    });
  };

  const handleStylesChange = (value: string | string[] | null) => {
    onFilterChange({
      ...filters,
      styles: Array.isArray(value) ? value : [],
    });
  };

  const handleReset = () => {
    onFilterChange({
      gender: null,
      bodyType: null,
      styles: [],
    });
  };

  const hasActiveFilters =
    filters.gender !== null || filters.bodyType !== null || filters.styles.length > 0;

  return (
    <FiltersContainer>
      <FilterDropdown
        label="성별"
        options={genderOptions}
        value={filters.gender}
        onChange={handleGenderChange}
        placeholder="성별 선택"
      />

      <FilterDropdown
        label="골격유형"
        options={bodyTypeOptions}
        value={filters.bodyType}
        onChange={handleBodyTypeChange}
        placeholder="골격유형 선택"
      />

      <FilterDropdown
        label="스타일"
        options={styleOptions}
        value={filters.styles}
        onChange={handleStylesChange}
        multiSelect
        placeholder="스타일 선택"
      />

      <FilterDropdown
        label="키/몸무게"
        options={[]}
        value={null}
        onChange={() => {}}
        placeholder="준비중"
      />

      {hasActiveFilters && (
        <>
          <Divider />
          <ResetButton type="button" onClick={handleReset}>
            초기화
          </ResetButton>
        </>
      )}
    </FiltersContainer>
  );
}
