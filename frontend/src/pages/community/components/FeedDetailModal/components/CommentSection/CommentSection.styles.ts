import styled from "styled-components";

export const CommentsSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Desktop */

  @media (max-width: 768px) {
    gap: 12px; /* Tablet */
  }

  @media (max-width: 430px) {
    gap: 8px; /* Mobile */
  }
`;

export const CommentStatus = styled.div`
  color: #a1a1a1;
  font-size: 14px;
`;

export const CommentRowWrapper = styled.div<{ $depth: number }>`
  padding-left: ${({ $depth }) => ($depth > 0 ? "24px" : "0")};
`;
