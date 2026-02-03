import styled from "styled-components";

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
  styles: string[];
  onToggleStyle: (style: string) => void;
  styleOptions?: string[];
}

const FavoriteStyleSelector = ({
  styles,
  onToggleStyle,
  styleOptions = ["Minimal", "Casual", "Street", "Feminine", "Vintage", "Sporty", "Formal"],
}: FavoriteStyleSelectorProps) => {
  return (
    <Container>
      <StyleHeader>
        <Label>선호하는 스타일</Label>
        <StyleHint>* 복수 선택 가능</StyleHint>
      </StyleHeader>
      <StyleOptions>
        {styleOptions.map((style) => (
          <StyleButton
            key={style}
            type="button"
            $selected={styles.includes(style)}
            onClick={() => onToggleStyle(style)}
          >
            {style}
          </StyleButton>
        ))}
      </StyleOptions>
    </Container>
  );
};

export default FavoriteStyleSelector;
