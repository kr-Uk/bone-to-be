import { formatTimeAgo } from "../../utils";

import * as S from "./FeedDetailRight.styles";

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
  return (
    <S.PostContent>
      <S.Avatar onClick={onUserClick} />
      <div>
        <S.Username onClick={onUserClick}>{author.username}</S.Username>
        {content.map((line: string, index: number) => (
          <S.Text key={`content-${index}`}>{line}</S.Text>
        ))}
        <S.Tags>{tags.map((tag: string) => `#${tag}`).join(" ")}</S.Tags>
        <S.Time>{formatTimeAgo(createdAt)}</S.Time>
      </div>
    </S.PostContent>
  );
}
