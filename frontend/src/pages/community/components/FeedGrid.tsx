import styled from "styled-components";

import { FeedCard } from "./FeedCard";

import type { FeedItem } from "../api";

interface FeedGridProps {
  feedItems: FeedItem[];
  onLike: (feedId: string, isLiked: boolean) => void;
  onCardClick: (feedId: string) => void;
}

const GridContainer = styled.div`
  display: grid;
  gap: 0;
  grid-template-columns: repeat(3, 1fr);

  /* Tablet */
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
  }

  /* Desktop */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 3px;
  }
`;

export function FeedGrid({ feedItems, onLike, onCardClick }: FeedGridProps) {
  return (
    <GridContainer>
      {feedItems.map((item) => (
        <FeedCard
          key={item.id}
          item={item}
          onLike={() => onLike(item.id, item.isLiked)}
          onClick={() => onCardClick(item.id)}
        />
      ))}
    </GridContainer>
  );
}
