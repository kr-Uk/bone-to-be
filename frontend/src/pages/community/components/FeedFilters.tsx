import styled from "styled-components";

import { FilterDropdown, type FilterOption } from "./FilterDropdown";
import { RangeFilterDropdown, type RangePreset } from "./RangeFilterDropdown";

import type { FeedFilters } from "../api";

interface FeedFiltersProps {
  filters: FeedFilters;
  onFilterChange: (filters: FeedFilters) => void;
}

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  /* Desktop/Tablet */
  @media (min-width: 768px) {
    gap: 0.9375rem;
  }

  /* Mobile */
  @media (max-width: 767px) {
    gap: 0.75rem;
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
  { value: "M", label: "남성" },
  { value: "F", label: "여성" },
];

const bodyTypeOptions: FilterOption[] = [
  { value: "Straight", label: "스트레이트" },
  { value: "Wave", label: "웨이브" },
  { value: "Natural", label: "내추럴" },
];

const styleOptions: FilterOption[] = [
  { value: "casual", label: "캐주얼" },
  { value: "street", label: "스트릿" },
  { value: "minimal", label: "미니멀" },
];

// Height presets (5cm intervals)
const HEIGHT_PRESETS: RangePreset[] = [
  { label: "140cm~144cm", min: 140, max: 144 },
  { label: "145cm~149cm", min: 145, max: 149 },
  { label: "150cm~154cm", min: 150, max: 154 },
  { label: "155cm~159cm", min: 155, max: 159 },
  { label: "160cm~164cm", min: 160, max: 164 },
  { label: "165cm~169cm", min: 165, max: 169 },
  { label: "170cm~174cm", min: 170, max: 174 },
  { label: "175cm~179cm", min: 175, max: 179 },
  { label: "180cm~184cm", min: 180, max: 184 },
  { label: "185cm~189cm", min: 185, max: 189 },
  { label: "190cm 이상", min: 190, max: 250 },
];

const HEIGHT_RANGE = { min: 140, max: 250, step: 1 };

// Weight presets (5kg intervals)
const WEIGHT_PRESETS: RangePreset[] = [
  { label: "30kg~34kg", min: 30, max: 34 },
  { label: "35kg~39kg", min: 35, max: 39 },
  { label: "40kg~44kg", min: 40, max: 44 },
  { label: "45kg~49kg", min: 45, max: 49 },
  { label: "50kg~54kg", min: 50, max: 54 },
  { label: "55kg~59kg", min: 55, max: 59 },
  { label: "60kg~64kg", min: 60, max: 64 },
  { label: "65kg~69kg", min: 65, max: 69 },
  { label: "70kg~74kg", min: 70, max: 74 },
  { label: "75kg~79kg", min: 75, max: 79 },
  { label: "80kg~84kg", min: 80, max: 84 },
  { label: "85kg~89kg", min: 85, max: 89 },
  { label: "90kg 이상", min: 90, max: 200 },
];

const WEIGHT_RANGE = { min: 30, max: 200, step: 1 };

export function FeedFilters({ filters, onFilterChange }: FeedFiltersProps) {
  const handleGenderChange = (value: string | string[] | null) => {
    onFilterChange({
      ...filters,
      gender: value as "M" | "F" | null,
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

  const handleHeightRangeChange = (value: { min: number; max: number } | null) => {
    onFilterChange({
      ...filters,
      heightRange: value,
    });
  };

  const handleWeightRangeChange = (value: { min: number; max: number } | null) => {
    onFilterChange({
      ...filters,
      weightRange: value,
    });
  };

  const handleReset = () => {
    onFilterChange({
      gender: null,
      bodyType: null,
      styles: [],
      heightRange: null,
      weightRange: null,
    });
  };

  const hasActiveFilters =
    filters.gender !== null ||
    filters.bodyType !== null ||
    filters.styles.length > 0 ||
    filters.heightRange !== null ||
    filters.weightRange !== null;

  return (
    <FiltersContainer>
      <FilterDropdown
        label="성별"
        options={genderOptions}
        value={filters.gender}
        onChange={handleGenderChange}
      />

      <FilterDropdown
        label="골격유형"
        options={bodyTypeOptions}
        value={filters.bodyType}
        onChange={handleBodyTypeChange}
      />

      <FilterDropdown
        label="스타일"
        options={styleOptions}
        value={filters.styles}
        onChange={handleStylesChange}
        multiSelect
      />

      <RangeFilterDropdown
        label="키"
        unit="cm"
        min={HEIGHT_RANGE.min}
        max={HEIGHT_RANGE.max}
        step={HEIGHT_RANGE.step}
        value={filters.heightRange}
        onChange={handleHeightRangeChange}
        presetRanges={HEIGHT_PRESETS}
      />

      <RangeFilterDropdown
        label="몸무게"
        unit="kg"
        min={WEIGHT_RANGE.min}
        max={WEIGHT_RANGE.max}
        step={WEIGHT_RANGE.step}
        value={filters.weightRange}
        onChange={handleWeightRangeChange}
        presetRanges={WEIGHT_PRESETS}
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
