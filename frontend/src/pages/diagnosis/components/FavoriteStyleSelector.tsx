import styled from "styled-components";

const Container = styled.div``;

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
`;

const StyleHint = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const StyleOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyleButton = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid ${(props) => (props.$selected ? "#000" : "#d1d5db")};
  background-color: ${(props) => (props.$selected ? "#000" : "#fff")};
  color: ${(props) => (props.$selected ? "#fff" : "#4b5563")};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #000;
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
        <Label>FAVORITE STYLE</Label>
        <StyleHint>* 복수 선택 가능</StyleHint>
      </StyleHeader>
      <StyleOptions>
        {styleOptions.map((style) => (
          <StyleButton
            key={style}
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
