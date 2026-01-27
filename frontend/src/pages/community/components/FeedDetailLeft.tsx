import styled from "styled-components";

export function FeedDetailLeft() {
  return (
    <LeftContainer>
      <Image src="/mock-detail.jpg" alt="detail" />
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

