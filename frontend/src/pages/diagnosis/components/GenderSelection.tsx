import styled from "styled-components";

const Container = styled.div``;

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

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 0.75rem;
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.purple[600] : "inherit")};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.secondary : theme.colors.gray[400])};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.gray[300]};
  }
`;

const GenderLetter = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GenderText = styled.div`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
`;

interface GenderSelectionProps {
  gender: "women" | "men";
  onGenderChange: (gender: "women" | "men") => void;
}

const GenderSelection = ({ gender, onGenderChange }: GenderSelectionProps) => {
  return (
    <Container>
      <Label>성별</Label>
      <GenderGrid>
        <GenderButton
          type="button"
          $selected={gender === "women"}
          onClick={() => onGenderChange("women")}
        >
          <GenderLetter>W</GenderLetter>
          <GenderText>Women</GenderText>
        </GenderButton>
        <GenderButton
          type="button"
          $selected={gender === "men"}
          onClick={() => onGenderChange("men")}
        >
          <GenderLetter>M</GenderLetter>
          <GenderText>Men</GenderText>
        </GenderButton>
      </GenderGrid>
    </Container>
  );
};

export default GenderSelection;
