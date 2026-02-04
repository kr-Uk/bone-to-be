import * as S from "./FeedDetailRight.styles";

export interface FeedDetailHeaderProps {
  avatarUrl: string | null | undefined;
  username: string;
  meta: string;
  onUserClick?: () => void;
}

export function FeedDetailHeader({ avatarUrl, username, meta, onUserClick }: FeedDetailHeaderProps) {
  return (
    <S.DesktopHeader>
      {avatarUrl ? (
        <S.DesktopAvatar src={avatarUrl} alt="profile" onClick={onUserClick} />
      ) : (
        <S.DesktopAvatarFallback onClick={onUserClick} />
      )}
      <div>
        <S.DesktopName onClick={onUserClick}>{username}</S.DesktopName>
        <S.DesktopMeta>{meta}</S.DesktopMeta>
      </div>
    </S.DesktopHeader>
  );
}
