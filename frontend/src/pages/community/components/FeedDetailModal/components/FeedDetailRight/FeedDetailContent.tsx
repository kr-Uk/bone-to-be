import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { formatTimeAgo } from "../../utils";

import * as S from "./FeedDetailRight.styles";

import baseProfile from "@/assets/image/base__profile.png";

export interface FeedDetailContentProps {
  author: {
    userId: string;
    username: string;
    avatarUrl: string | null | undefined;
  };
  content: string[];
  tags: string[];
  createdAt: string;
  onUserClick?: () => void;
}

export function FeedDetailContent({
  author,
  content,
  tags,
  createdAt,
  onUserClick,
}: FeedDetailContentProps) {
  const resolvedAvatar = author.avatarUrl ?? baseProfile;
  const text = useMemo(() => content.join("\n"), [content]);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useLayoutEffect(() => {
    if (expanded) return;
    const el = textRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 1;
    setCanToggle(hasOverflow);
  }, [expanded, text]);

  return (
    <S.PostContent>
      <S.Avatar onClick={onUserClick}>
        <S.AvatarImage src={resolvedAvatar} alt={`${author.username} avatar`} />
      </S.Avatar>
      <div>
        <S.Username onClick={onUserClick}>{author.username}</S.Username>
        <S.Text ref={textRef} $expanded={expanded}>
          {text}
        </S.Text>
        {canToggle ? (
          <S.TextToggle type="button" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? "접기" : "더보기"}
          </S.TextToggle>
        ) : null}
        <S.Tags>{tags.map((tag: string) => `#${tag}`).join(" ")}</S.Tags>
        <S.Time>{formatTimeAgo(createdAt)}</S.Time>
      </div>
    </S.PostContent>
  );
}
