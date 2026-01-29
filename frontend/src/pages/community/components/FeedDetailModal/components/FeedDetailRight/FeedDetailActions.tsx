import { FaRegHeart, FaHeart, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";

import * as S from "./FeedDetailRight.styles";

export interface FeedDetailActionsProps {
  liked: boolean;
  saved: boolean;
  onLikeToggle: () => void;
  onCommentClick: () => void;
  onSaveToggle: () => void;
}

export function FeedDetailActions({
  liked,
  saved,
  onLikeToggle,
  onCommentClick,
  onSaveToggle,
}: FeedDetailActionsProps) {
  return (
    <S.ActionRow>
      <S.LeftActions>
        <S.HeartButton $liked={liked} onClick={onLikeToggle}>
          {liked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </S.HeartButton>

        <S.IconButton onClick={onCommentClick}>
          <FaRegComment size={20} />
        </S.IconButton>
      </S.LeftActions>

      <S.IconButton onClick={onSaveToggle}>
        {saved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
      </S.IconButton>
    </S.ActionRow>
  );
}
