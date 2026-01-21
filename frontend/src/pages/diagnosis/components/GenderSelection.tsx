import styled from "styled-components";

const Container = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const GenderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 2px solid ${(props) => (props.$selected ? "#000" : "#e5e7eb")};
  background-color: ${(props) => (props.$selected ? "#000" : "#fff")};
  color: ${(props) => (props.$selected ? "#fff" : "#9ca3af")};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => (props.$selected ? "#000" : "#d1d5db")};
  }
`;

const GenderLetter = styled.div`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const GenderText = styled.div`
  font-size: 0.875rem;
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
