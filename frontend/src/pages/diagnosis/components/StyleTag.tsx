import styled from "styled-components";

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 5px 13px;
  border: 1px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[200]};
  line-height: 16px;
  white-space: nowrap;
`;

interface StyleTagProps {
  children: React.ReactNode;
}

const StyleTag = ({ children }: StyleTagProps) => {
  return <Tag>{children}</Tag>;
};

export default StyleTag;
