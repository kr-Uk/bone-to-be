import styled, { css } from "styled-components";

export const FabButton = styled.button<{ $visible?: boolean }>`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(0, 0, 0, 0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
  z-index: 120;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
    transform: translateY(0);
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(0, 0, 0, 0.28),
      0 6px 16px rgba(0, 0, 0, 0.18);
  }

  ${({ $visible }) =>
    $visible === false &&
    css`
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
    `}

  @media (max-width: 767px) {
    right: 16px;
    bottom: 16px;
  }
`;
