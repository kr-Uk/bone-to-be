import styled from "styled-components";

const Container = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

interface BodySpecsInputProps {
  height: string;
  weight: string;
  onHeightChange: (height: string) => void;
  onWeightChange: (weight: string) => void;
}

const BodySpecsInput = ({
  height,
  weight,
  onHeightChange,
  onWeightChange,
}: BodySpecsInputProps) => {
  return (
    <Container>
      <Label>BODY SPECS</Label>
      <InputGrid>
        <Input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
        />
      </InputGrid>
    </Container>
  );
};

export default BodySpecsInput;
