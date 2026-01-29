import { MdMyLocation } from "react-icons/md";
import styled from "styled-components";

const Card = styled.div`
  background: rgba(38, 38, 38, 0.6);
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: 0 auto;
  max-width: 28rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderIcon = styled(MdMyLocation)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.purple[600]};
`;

const HeaderTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[300]};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: 300;
  line-height: 1.5;
`;

const Bullet = styled.span`
  color: ${({ theme }) => theme.colors.purple[600]};
  font-weight: 600;
  flex-shrink: 0;
`;

const guideItems = [
  "머리부터 발끝까지 전신이 나오도록 촬영해주세요",
  "몸의 체형이 드러나는 옷을 입고 촬영해주세요",
  "양손은 보고 팔은 벌린 A-포즈 취해주세요",
];

export const ScanningGuideBullet = () => {
  return (
    <Card>
      <Header>
        <HeaderIcon aria-hidden="true" />
        <HeaderTitle>Guide</HeaderTitle>
      </Header>
      <List>
        {guideItems.map((item, index) => (
          <ListItem key={index}>
            <Bullet aria-hidden="true">•</Bullet>
            <span>{item}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
