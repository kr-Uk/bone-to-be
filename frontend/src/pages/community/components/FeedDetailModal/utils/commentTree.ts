import type { FeedComment } from "../../../api";

export interface CommentTreeNode {
  comment: FeedComment;
  depth: number;
}

/**
 * 평평한 댓글 배열을 트리 구조로 변환합니다.
 * 부모-자식 관계를 고려하여 depth를 계산합니다.
 *
 * @param comments - 평평한 댓글 배열
 * @returns depth 정보를 포함한 정렬된 댓글 배열
 */
export function buildCommentTree(comments: FeedComment[]): CommentTreeNode[] {
  // 1단계: ID로 맵 구축
  const byId = new Map<string, FeedComment>();
  const children = new Map<string, FeedComment[]>();

  for (const comment of comments) {
    byId.set(comment.id, comment);
  }

  // 2단계: 부모-자식 관계 맵 구축
  for (const comment of comments) {
    const parentId = comment.parentCommentId ?? null;
    if (!parentId) continue;

    const list = children.get(parentId) ?? [];
    list.push(comment);
    children.set(parentId, list);
  }

  // 3단계: 최상위 댓글 찾기
  const topLevel = comments.filter((c) => !c.parentCommentId || !byId.has(c.parentCommentId));

  // 4단계: DFS로 트리 순회
  const result: CommentTreeNode[] = [];

  const visit = (comment: FeedComment, depth: number) => {
    result.push({ comment, depth });

    const kids = children.get(comment.id);
    if (kids) {
      kids.forEach((child) => visit(child, depth + 1));
    }
  };

  topLevel.forEach((c) => visit(c, 0));

  return result;
}
