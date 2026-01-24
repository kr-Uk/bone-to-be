import styled, { css } from "styled-components";

type StackDirection = "row" | "column";
type StackAlign = "flex-start" | "center" | "flex-end" | "stretch";
type StackJustify = "flex-start" | "center" | "flex-end" | "space-between";

interface StackProps {
  $direction?: StackDirection;
  $gap?: string;
  $align?: StackAlign;
  $justify?: StackJustify;
  $wrap?: "nowrap" | "wrap";
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ?? "column"};
  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${$gap};
    `}
  ${({ $align }) =>
    $align &&
    css`
      align-items: ${$align};
    `}
  ${({ $justify }) =>
    $justify &&
    css`
      justify-content: ${$justify};
    `}
  ${({ $wrap }) =>
    $wrap &&
    css`
      flex-wrap: ${$wrap};
    `}
`;

interface TextProps {
  $color?: string;
  $size?: string;
  $weight?: number;
  $lineHeight?: string;
  $letterSpacing?: string;
  $transform?: string;
  $align?: string;
  $family?: string;
}

export const Text = styled.span<TextProps>`
  margin: 0;
  color: ${({ $color }) => $color ?? "inherit"};
  font-size: ${({ $size }) => $size ?? "inherit"};
  font-weight: ${({ $weight }) => $weight ?? 400};
  line-height: ${({ $lineHeight }) => $lineHeight ?? "normal"};
  letter-spacing: ${({ $letterSpacing }) => $letterSpacing ?? "normal"};
  text-transform: ${({ $transform }) => $transform ?? "none"};
  font-family: ${({ $family }) => $family ?? "Pretendard"};
  text-align: ${({ $align }) => $align ?? "inherit"};
  word-wrap: break-word;
`;
