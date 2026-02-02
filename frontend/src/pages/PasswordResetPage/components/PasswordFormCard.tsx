import type { ReactNode } from "react";
import styled from "styled-components";

interface PasswordFormCardProps {
  title: string;
  descriptions: string[];
  actionLabel: string;
  actionLabelSubmitting: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
  links: ReactNode;
  leading?: ReactNode;
  children: ReactNode;
}

export const PasswordFormCard = ({
  title,
  descriptions,
  actionLabel,
  actionLabelSubmitting,
  isSubmitting,
  canSubmit,
  onSubmit,
  links,
  leading,
  children,
}: PasswordFormCardProps) => {
  return (
    <Card>
      {leading}
      <Header>
        <Title>{title}</Title>
        <DescGroup>
          {descriptions.map((description, index) => (
            <Desc key={`${description}-${index}`}>{description}</Desc>
          ))}
        </DescGroup>
      </Header>

      <Form>
        {children}

        <ActionRow>
          <PrimaryButton type="button" onClick={onSubmit} disabled={!canSubmit}>
            {isSubmitting ? actionLabelSubmitting : actionLabel}
          </PrimaryButton>
        </ActionRow>

        <Links>{links}</Links>
      </Form>
    </Card>
  );
};

const Card = styled.section`
  position: relative;
  width: 100%;
  max-width: 32rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 0.75rem;
  box-shadow:
    0 1.75rem 3.5rem -1rem rgba(0, 0, 0, 0.6),
    0 0 1.5rem rgba(0, 0, 0, 0.6);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 2.75rem;
  }

  @media (max-width: 768px) {
    padding: 2.25rem 1.5rem;
    gap: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
`;

const DescGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
`;

export const InputWrap = styled.div`
  position: relative;
`;

export const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 2.75rem 0 0.9rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.9rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

export const InputIcon = styled.span<{ $success?: boolean }>`
  position: absolute;
  top: 50%;
  right: 0.9rem;
  transform: translateY(-50%);
  color: ${({ theme, $success }) => ($success ? "#22c55e" : theme.colors.gray[400])};
  pointer-events: none;
  display: inline-flex;
`;

export const RuleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-top: 0.25rem;
`;

export const RuleItem = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.brand : theme.colors.gray[500])};
`;

export const HelperText = styled.p<{ $error?: boolean }>`
  min-height: 1rem;
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: ${({ theme, $error }) => ($error ? "#ef4444" : theme.colors.gray[500])};
`;

const ActionRow = styled.div`
  display: flex;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 3.25rem;
  border-radius: 0.35rem;
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
`;

export const LinkButton = styled.button`
  all: unset;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;
