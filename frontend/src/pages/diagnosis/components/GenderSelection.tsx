import styled from "styled-components";

const Container = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 0.75rem;
  border: 2px solid ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.secondary)};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.secondary : theme.colors.gray[400])};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.gray[300])};
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
      <Label>GENDER</Label>
      <GenderGrid>
        <GenderButton $selected={gender === "women"} onClick={() => onGenderChange("women")}>
          <GenderLetter>W</GenderLetter>
          <GenderText>Women</GenderText>
        </GenderButton>
        <GenderButton $selected={gender === "men"} onClick={() => onGenderChange("men")}>
          <GenderLetter>M</GenderLetter>
          <GenderText>Men</GenderText>
        </GenderButton>
      </GenderGrid>
    </Container>
  );
};

export default GenderSelection;
