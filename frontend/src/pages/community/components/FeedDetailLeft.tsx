import styled from "styled-components";

interface Props {
  imageUrl?: string;
  isLoading?: boolean;
  hasError?: boolean;
}

export function FeedDetailLeft({ imageUrl, isLoading, hasError }: Props) {
  return (
    <LeftContainer>
      {imageUrl ? (
        <Image src={imageUrl} alt="detail" />
      ) : (
        <Placeholder>
          {hasError ? "이미지를 불러올 수 없습니다." : isLoading ? "로딩 중..." : "이미지 없음"}
        </Placeholder>
      )}
    </LeftContainer>
  );
}

const LeftContainer = styled.div`
  flex: 1.5;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
`;

const Placeholder = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

