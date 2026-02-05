import styled from "styled-components";

import type { StyleOption } from '@/shared/constants/styleOptions';

import { SELECTABLE_STYLES, STYLE_LABELS } from '@/shared/constants/styleOptions';

const Container = styled.div``;

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: 1.5rem;
  /* font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight}; */
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 767px) {
    font-size: 1rem;
  }
`;

const StyleHint = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const StyleOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyleButton = styled.button<{ $selected: boolean }>`
  padding: 10px 20px;
  border-radius: 9999px;
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.gray[200])};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.purple[600] : "")};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.secondary : theme.colors.gray[300])};
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purple[600]};
  }
`;

interface FavoriteStyleSelectorProps {
  styles: StyleOption[];
  onToggleStyle: (style: StyleOption) => void;
}

const FavoriteStyleSelector = ({
  styles,
  onToggleStyle,
}: FavoriteStyleSelectorProps) => {
  return (
    <Container>
      <StyleHeader>
        <Label>선호하는 스타일</Label>
        <StyleHint>* 복수 선택 가능</StyleHint>
      </StyleHeader>
      <StyleOptions>
        {SELECTABLE_STYLES.map((style) => (
          <StyleButton
            key={style}
            type="button"
            $selected={styles.includes(style)}
            onClick={() => onToggleStyle(style)}
            aria-pressed={styles.includes(style)}
          >
            {STYLE_LABELS[style]}
          </StyleButton>
        ))}
      </StyleOptions>
    </Container>
  );
};

export default FavoriteStyleSelector;
