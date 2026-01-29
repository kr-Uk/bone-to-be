import styled from "styled-components";

import type { ReactNode } from "react";

const Card = styled.div`
  background: rgba(38, 38, 38, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(38, 38, 38, 0.8);
    border-color: ${({ theme }) => theme.colors.gray[600]};
  }

  @media (min-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.purple[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.purple[600]};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: 300;
  color: ${({ theme }) => theme.colors.gray[400]};
  line-height: 1.5;
  margin: 0;
`;

interface ScanningGuideCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const ScanningGuideCard = ({ icon, title, description }: ScanningGuideCardProps) => {
  return (
    <Card>
      <IconWrapper>{icon}</IconWrapper>
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Content>
    </Card>
  );
};
