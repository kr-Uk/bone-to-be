import { useEffect, useMemo, useState } from "react";

export type SectionId = "straight" | "wave" | "natural";

interface ScrollSpyState {
  progress: number;
  activeId: SectionId;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const useScrollSpy = (sectionIds: readonly SectionId[]): ScrollSpyState => {
  const [state, setState] = useState<ScrollSpyState>({
    progress: 0,
    activeId: sectionIds[0],
  });

  const ids = useMemo(() => [...sectionIds], [sectionIds]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    if (sections.length === 0) {
      return;
    }

    let ticking = false;

    const getRange = (): { start: number; end: number } => {
      const first = sections[0];
      const last = sections[sections.length - 1];
      const viewportHeight = window.innerHeight;

      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      const lastTop = last.getBoundingClientRect().top + window.scrollY;

      const start = firstTop + viewportHeight * 0.5;
      const end = lastTop + last.offsetHeight - viewportHeight * 0.5;

      return { start, end };
    };

    const compute = () => {
      ticking = false;

      const viewportHeight = window.innerHeight;
      const cursor = window.scrollY + viewportHeight * 0.5;

      const { start, end } = getRange();
      const raw = (cursor - start) / (end - start);
      const progress = clamp01(raw);

      let activeId: SectionId = ids[0];

      for (const section of sections) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        const bottom = top + section.offsetHeight;
        if (cursor >= top && cursor < bottom) {
          activeId = section.id as SectionId;
          break;
        }
      }

      const last = sections[sections.length - 1];
      const lastBottom = last.getBoundingClientRect().top + window.scrollY + last.offsetHeight;
      if (cursor >= lastBottom) {
        activeId = last.id as SectionId;
      }

      setState({ progress, activeId });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return state;
};
