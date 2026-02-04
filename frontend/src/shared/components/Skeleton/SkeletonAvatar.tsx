import { Skeleton } from "./Skeleton";

import type { CSSProperties } from "react";

interface SkeletonAvatarProps {
  size?: CSSProperties["width"];
  className?: string;
}

/**
 * Circular avatar skeleton component
 *
 * @param size - Diameter of the circular avatar (default: '9rem')
 *
 * @example
 * // Default size (9rem)
 * <SkeletonAvatar />
 *
 * @example
 * // Custom size
 * <SkeletonAvatar size="5rem" />
 * <SkeletonAvatar size={64} />
 */
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({ size = "9rem", className }) => {
  return <Skeleton variant="circular" width={size} height={size} className={className} />;
};
