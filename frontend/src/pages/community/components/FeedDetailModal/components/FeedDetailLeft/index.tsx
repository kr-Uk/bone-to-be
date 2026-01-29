import * as S from "./FeedDetailLeft.styles";

import type { FeedDetailLeftProps } from "../../types";

export function FeedDetailLeft({ imageUrl, isLoading, hasError }: FeedDetailLeftProps) {
  return (
    <S.LeftContainer>
      {imageUrl ? (
        <S.Image src={imageUrl} alt="detail" />
      ) : (
        <S.Placeholder>
          {hasError ? "이미지를 불러올 수 없습니다." : isLoading ? "로딩 중..." : "이미지 없음"}
        </S.Placeholder>
      )}
    </S.LeftContainer>
  );
}
