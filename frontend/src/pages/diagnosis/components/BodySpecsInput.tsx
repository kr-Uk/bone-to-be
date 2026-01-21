import styled from "styled-components";

const Container = styled.div``;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  /* font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight}; */
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  /* Hide number input spinner */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
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
  const handleInputChange = (value: string, onChange: (value: string) => void) => {
    // 빈 값 허용
    if (value === "") {
      onChange("");
      return;
    }

    // 숫자만 허용하고 최대 3자리까지
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 3) {
      onChange(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 음수 기호(-), e, +, . 입력 방지
    if (e.key === "-" || e.key === "e" || e.key === "+" || e.key === ".") {
      e.preventDefault();
    }
  };

  return (
    <Container>
      <Label>BODY SPECS</Label>
      <InputGrid>
        <InputWrapper>
          <InputLabel>Height (cm)</InputLabel>
          <Input
            type="number"
            value={height}
            onChange={(e) => handleInputChange(e.target.value, onHeightChange)}
            onKeyDown={handleKeyDown}
            min="0"
            max="999"
          />
        </InputWrapper>
        <InputWrapper>
          <InputLabel>Weight (kg)</InputLabel>
          <Input
            type="number"
            value={weight}
            onChange={(e) => handleInputChange(e.target.value, onWeightChange)}
            onKeyDown={handleKeyDown}
            min="0"
            max="999"
          />
        </InputWrapper>
      </InputGrid>
    </Container>
  );
};

export default BodySpecsInput;
