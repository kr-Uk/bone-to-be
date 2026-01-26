import styled from "styled-components";

interface FeedFABProps {
  onClick: () => void;
}

const FABButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.purple[600]};
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: transform 0.2s ease;
  z-index: 100;
  font-size: 2.125rem;
  color: white;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Mobile */
  @media (max-width: 767px) {
    width: 60px;
    height: 60px;
    bottom: 12px;
    right: 12px;
    font-size: 1.5rem;
  }
`;

export function FeedFAB({ onClick }: FeedFABProps) {
  return (
    <FABButton onClick={onClick} aria-label="Create new feed post">
      +
    </FABButton>
  );
}
