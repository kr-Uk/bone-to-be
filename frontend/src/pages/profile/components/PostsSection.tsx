import { useState } from "react";
import { AiOutlineAppstore } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import styled from "styled-components";

import type { UserPost } from "../api/profile.types";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.gray[400])};
  font-size: ${({ theme }) => theme.typography.body.sm.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.semibold.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.semibold.lineHeight};
  letter-spacing: 0.02em;
  text-transform: none;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 3px;
    background: ${({ theme, $active }) => ($active ? theme.colors.text : "transparent")};
    transform: translateY(2px);
    border-radius: 9999px;
  }
`;
const TabText = styled.div`
  letter-spacing: 0.05em;  
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PostImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const PostCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover ${PostImage} {
    transform: scale(1.05);
  }
`;

const PostLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.sm.regular.fontWeight};
  line-height: ${({ theme }) => theme.typography.body.sm.regular.lineHeight};
`;

const PostIcon = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.sm};
  bottom: ${({ theme }) => theme.spacing.sm};
  width: 18px;
  height: 16px;
  background: ${({ theme }) => theme.colors.gray[400]};
  border: 2px solid ${({ theme }) => theme.colors.gray[400]};
  border-radius: 2px;
`;
const BookmarkIcon = styled(CiBookmark)`
  stroke-width: 1.2;
  stroke: currentColor;
`;
interface PostsSectionProps {
  posts: UserPost[];
  saved: UserPost[];
}

const PostsSection = ({ posts, saved }: PostsSectionProps) => {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const items = activeTab === "posts" ? posts : saved;

  return (
    <Section>
      <TabBar>
        <Tab $active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
          <AiOutlineAppstore size={16} />
          <TabText>Posts</TabText>
        </Tab>
        <Tab $active={activeTab === "saved"} onClick={() => setActiveTab("saved")}>
          <BookmarkIcon size={16} />
          <TabText>Saved</TabText>
        </Tab>
      </TabBar>
      <PostGrid>
        {items.map((post) => (
          <PostCard key={post.postId}>
            {post.imageUrl ? (
              <PostImage src={post.imageUrl} alt={`Post ${post.postId}`} />
            ) : (
              <PostLabel>{`IMG_${post.postId}`}</PostLabel>
            )}
            <PostIcon aria-hidden="true" />
          </PostCard>
        ))}
      </PostGrid>
    </Section>
  );
};

export default PostsSection;
