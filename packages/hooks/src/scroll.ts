import { useEffect, useMemo, useState } from 'react';
import { useScrollArea } from './contexts/scroll';
import { CSSProperties } from 'react';

type UseScrollOptions = {
  threshold?: number; // default 100px
  scrolledStyles?: CSSProperties; // optional styles when scrolled
  defaultStyles?: CSSProperties; // optional base styles
};

export const useScroll = ({
  threshold = 100,
  scrolledStyles,
  defaultStyles,
}: UseScrollOptions = {}) => {
  const viewportRef = useScrollArea();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Track scroll position and update boolean
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let last = false;

    const handleScroll = () => {
      const scrolled = el.scrollTop > threshold;
      if (scrolled !== last) {
        last = scrolled;
        setHasScrolled(scrolled);
      }
    };

    // Initialize state
    handleScroll();

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [viewportRef, threshold]);

  // Compute styles reactively but without extra state
  const styles = useMemo(() => {
    if (!scrolledStyles && !defaultStyles) return {};
    return hasScrolled ? (scrolledStyles ?? {}) : (defaultStyles ?? {});
  }, [hasScrolled, scrolledStyles, defaultStyles]);

  return { hasScrolled, styles, viewportRef };
};
