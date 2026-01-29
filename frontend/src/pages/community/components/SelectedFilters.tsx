import styled from "styled-components";

import type { FeedFilters } from "../api";

interface SelectedFiltersProps {
  filters: FeedFilters;
  onRemoveFilter: (filterKey: string, value?: string) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.body.md.medium};
  color: ${({ theme }) => theme.colors.purple[600]};
  text-transform: uppercase;
  font-weight: 700;
`;

const FiltersList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.purple[900]};
  border: 1px solid ${({ theme }) => theme.colors.purple[600]};
  border-radius: 9999px;
  ${({ theme }) => theme.typography.body.sm.regular};
  color: ${({ theme }) => theme.colors.purple[200]};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.purple[200]};
  padding: 0;
  margin: 0;
  font-size: 1.2em;
  line-height: 1;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

export function SelectedFilters({ filters, onRemoveFilter }: SelectedFiltersProps) {
  const selectedFilters: { label: string; key: string; value?: string }[] = [];

  if (filters.gender) {
    selectedFilters.push({
      label: filters.gender === "M" ? "남성" : "여성",
      key: "gender",
    });
  }

  if (filters.bodyType) {
    const bodyTypeLabels: Record<string, string> = {
      Straight: "스트레이트",
      Wave: "웨이브",
      Natural: "내추럴",
    };
    selectedFilters.push({
      label: bodyTypeLabels[filters.bodyType],
      key: "bodyType",
    });
  }

  const styleLabels: Record<string, string> = {
    casual: "캐주얼",
    street: "스트릿",
    minimal: "미니멀",
  };

  filters.styles.forEach((style) => {
    selectedFilters.push({
      label: styleLabels[style] || style,
      key: "styles",
      value: style,
    });
  });

  if (filters.heightRange) {
    selectedFilters.push({
      label: `키 ${filters.heightRange.min}cm~${filters.heightRange.max}cm`,
      key: "heightRange",
    });
  }

  if (filters.weightRange) {
    selectedFilters.push({
      label: `몸무게 ${filters.weightRange.min}kg~${filters.weightRange.max}kg`,
      key: "weightRange",
    });
  }

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <Container>
      <Label>선택됨 :</Label>
      <FiltersList>
        {selectedFilters.map((filter, index) => (
          <FilterPill key={`${filter.key}-${filter.value || ""}-${index}`}>
            {filter.label}
            <RemoveButton
              onClick={() => onRemoveFilter(filter.key, filter.value)}
              aria-label={`Remove ${filter.label} filter`}
            >
              ×
            </RemoveButton>
          </FilterPill>
        ))}
      </FiltersList>
    </Container>
  );
}
