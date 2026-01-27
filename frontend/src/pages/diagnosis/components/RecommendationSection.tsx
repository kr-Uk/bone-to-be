import styled from "styled-components";

const Section = styled.section`
  backdrop-filter: blur(10px);
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 12px;
  box-shadow: 0px 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 33px 25px 25px;
  display: flex;
  flex-direction: column;
  gap: 23.99px;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  &:not(:last-child) {
    @media (min-width: 768px) {
      border-right: 1px solid ${({ theme }) => theme.colors.gray[600]};
      padding-right: 25px;
    }
  }

  &:last-child {
    @media (min-width: 768px) {
      padding-left: 25px;
    }
  }
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Heading = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  line-height: 16px;
  margin: 0;
`;

const DoHeading = styled(Heading)`
  color: ${({ theme }) => theme.colors.brand};
`;

const DontHeading = styled(Heading)`
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const List = styled.ul`
  list-style: none;
  padding: 0 0 0 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ListItem = styled.li`
  position: relative;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 20px;
  padding-left: 10px;

  &::before {
    content: "•";
    position: absolute;
    left: -10px;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  }
`;

interface RecommendationSectionProps {
  doRecommendations: string[];
  dontRecommendations: string[];
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.3332 4L5.99984 11.3333L2.6665 8"
      stroke="#9810FA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="#A1A1A1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RecommendationSection = ({
  doRecommendations,
  dontRecommendations,
}: RecommendationSectionProps) => {
  return (
    <Section>
      <Column>
        <Header>
          <Icon>
            <CheckIcon />
          </Icon>
          <DoHeading>RECOMMENDED (DO)</DoHeading>
        </Header>
        <List>
          {doRecommendations.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Column>

      <Column>
        <Header>
          <Icon>
            <XIcon />
          </Icon>
          <DontHeading>AVOID (DON&apos;T)</DontHeading>
        </Header>
        <List>
          {dontRecommendations.map((item, index) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </List>
      </Column>
    </Section>
  );
};

export default RecommendationSection;
