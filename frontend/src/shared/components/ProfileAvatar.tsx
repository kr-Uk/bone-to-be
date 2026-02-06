import styled from "styled-components";

import baseProfile from "@/assets/image/base__profile.png";

import type { HTMLAttributes } from "react";

interface ProfileAvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt: string;
  size?: number | string;
}

export function ProfileAvatar({ src, alt, size = "3rem", ...rest }: ProfileAvatarProps) {
  const resolvedSize = typeof size === "number" ? `${size}px` : size;
  const resolvedSrc = src ?? baseProfile;
  const isClickable = Boolean(rest.onClick);

  return (
    <AvatarWrap $size={resolvedSize} $clickable={isClickable} {...rest}>
      <AvatarImage src={resolvedSrc} alt={alt} />
    </AvatarWrap>
  );
}

const AvatarWrap = styled.div<{ $size: string; $clickable: boolean }>`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  background: var(--neutral-900, #171717);
  overflow: hidden;
  border-radius: 624.9375rem;
  outline: 0.0625rem var(--neutral-700, #404040) solid;
  outline-offset: -0.0625rem;
  display: grid;
  place-items: center;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
