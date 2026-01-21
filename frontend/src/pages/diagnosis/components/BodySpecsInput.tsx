import styled from "styled-components";

const Container = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.5rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
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
