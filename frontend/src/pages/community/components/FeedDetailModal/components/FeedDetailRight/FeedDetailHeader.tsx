import * as S from "./FeedDetailRight.styles";

export interface FeedDetailHeaderProps {
  avatarUrl: string | null | undefined;
  username: string;
  meta: string;
}

export function FeedDetailHeader({ avatarUrl, username, meta }: FeedDetailHeaderProps) {
  return (
    <S.DesktopHeader>
      {avatarUrl ? <S.DesktopAvatar src={avatarUrl} alt="profile" /> : <S.DesktopAvatarFallback />}
      <div>
        <S.DesktopName>{username}</S.DesktopName>
        <S.DesktopMeta>{meta}</S.DesktopMeta>
      </div>
    </S.DesktopHeader>
  );
}
