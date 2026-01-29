import { useState } from "react";
import { AiOutlineAppstore } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import styled from "styled-components";

import { Text } from "./ProfileCommon";

import type { UserPost } from "../api/profile.types";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: clamp(1rem, 4vw, 1.5rem);
  }
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 5rem;
  padding-top: 0.75rem;
  border-top: 0.041875rem var(--neutral-600, #525252) solid;

  @media (max-width: 768px) {
    gap: clamp(2.5rem, 10vw, 5rem);
    padding-top: clamp(0.5rem, 2vw, 0.75rem);
  }
`;

const Tab = styled.button<{ $active?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding-top: 0.2rem;
  color: ${({ $active }) =>
    $active ? "var(--neutral-50, #fafafa)" : "var(--neutral-500, #737373)"};
  background: transparent;

  @media (max-width: 768px) {
    gap: clamp(0.4rem, 2vw, 0.625rem);
    padding-top: clamp(0.1rem, 1.5vw, 0.2rem);
  }

  &::before {
    content: "";
    position: absolute;
    top: -0.75rem;
    left: 0;
    right: 0;
    height: 0.125rem;
    background: ${({ $active }) => ($active ? "var(--color-bg-brand, #9810fa)" : "transparent")};
  }
`;

const TabText = styled(Text)`
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25rem;
  letter-spacing: 0.09375rem;

  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 3.5vw, 1rem);
    line-height: clamp(1.1rem, 4vw, 1.25rem);
    letter-spacing: clamp(0.06rem, 0.4vw, 0.09375rem);
  }
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const PostCard = styled.div<{ $variant: "dark" | "darker" }>`
  position: relative;
  aspect-ratio: 3 / 4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${({ $variant }) => ($variant === "dark" ? "#151515" : "#1a1a1a")};
  outline: 0.0625rem rgba(255, 255, 255, 0.05) solid;
  outline-offset: -0.0625rem;

  @media (max-width: 1024px) {
    background: ${({ $variant }) =>
      $variant === "dark" ? "black" : "var(--neutral-900, #171717)"};
    outline: 0.0625rem var(--neutral-600, #525252) solid;
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

const PostLabel = styled(Text)`
  color: var(--neutral-700, #404040);
  font-size: 0.925rem;
  font-weight: 400;
  line-height: 1.23rem;
  font-family: Consolas;
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(124, 58, 237, 0.2);
  backdrop-filter: blur(0.125rem);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
`;

const HoverText = styled(Text)`
  color: var(--neutral-50, #fafafa);
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.75rem;
`;

const PostCardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:hover ${PostImage} {
    transform: scale(1.05);
  }

  &:hover ${HoverOverlay} {
    opacity: 1;
  }
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
        <Tab $active={activeTab === "posts"} onClick={() => setActiveTab("posts")} type="button">
          <AiOutlineAppstore size={24} />
          <TabText>Posts</TabText>
        </Tab>
        <Tab $active={activeTab === "saved"} onClick={() => setActiveTab("saved")} type="button">
          <CiBookmark size={24} />
          <TabText>Saved</TabText>
        </Tab>
      </TabBar>
      <PostGrid>
        {items.map((post, index) => (
          <PostCard key={post.postId} $variant={index % 2 === 0 ? "dark" : "darker"}>
            <PostCardInner>
              {post.imageUrl ? (
                <PostImage src={post.imageUrl} alt={`Post ${post.postId}`} />
              ) : (
                <PostLabel>{`IMG_${String(post.postId).padStart(2, "0")}`}</PostLabel>
              )}
              <HoverOverlay>
                <HoverText>LIKES</HoverText>
              </HoverOverlay>
            </PostCardInner>
          </PostCard>
        ))}
      </PostGrid>
    </Section>
  );
};

export default PostsSection;
