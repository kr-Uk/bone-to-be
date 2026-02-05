import * as S from "./FeedDetailRight.styles";

import baseProfile from "@/assets/image/base__profile.png";

export interface FeedDetailHeaderProps {
  avatarUrl: string | null | undefined;
  username: string;
  meta: string;
  onUserClick?: () => void;
}

export function FeedDetailHeader({
  avatarUrl,
  username,
  meta,
  onUserClick,
}: FeedDetailHeaderProps) {
  const resolvedAvatar = avatarUrl ?? baseProfile;
  return (
    <S.DesktopHeader>
      <S.DesktopAvatar src={resolvedAvatar} alt="profile" onClick={onUserClick} />
      <div>
        <S.DesktopName onClick={onUserClick}>{username}</S.DesktopName>
        <S.DesktopMeta>{meta}</S.DesktopMeta>
      </div>
    </S.DesktopHeader>
  );
}
