"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  Children,
  isValidElement,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HorizontalCarouselProps {
  children: ReactNode;
  ariaLabel?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  resumeDelay?: number;
  pauseOnInteraction?: boolean;
  desktopMode?: "grid" | "carousel";
  desktopGridCols?: string;
  cardWidthMobile?: string;
  gap?: string;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export function HorizontalCarousel({
  children,
  ariaLabel = "Featured items carousel",
  autoplay = false,
  autoplayInterval = 4000,
  resumeDelay = 6000,
  pauseOnInteraction = true,
  desktopMode = "grid",
  desktopGridCols = "md:grid-cols-2 lg:grid-cols-3",
  cardWidthMobile = "w-[84vw] xs:w-[320px] sm:w-[360px]",
  gap = "gap-3.5 sm:gap-4",
  showDots = true,
  showArrows = true,
  className,
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPrefersReducedMotion, setIsPrefersReducedMotion] = useState(false);

  const items = Children.toArray(children).filter(isValidElement);
  const totalItems = items.length;

  // 1. Reduced motion detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. Viewport visibility detection with IntersectionObserver
  // Autoplay only activates when the carousel is meaningfully visible (>= 40%) in the viewport
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Tab visibility detection (pause when browser tab is inactive)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        setIsVisible(false);
      } else if (containerRef.current) {
        // Re-check bounding rect on return
        const rect = containerRef.current.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(inViewport);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // 4. Update activeIndex on manual or programmatic scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const firstChild = container.firstElementChild as HTMLElement;
    if (!firstChild) return;

    // Use actual card offset width + gap for accurate index calculation
    const itemWidth = firstChild.offsetWidth + 14;
    const newIndex = Math.round(container.scrollLeft / itemWidth);
    setActiveIndex(Math.min(Math.max(newIndex, 0), totalItems - 1));
  }, [totalItems]);

  // 5. Scroll strictly inside the horizontal container without touching vertical page scroll
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const targetChild = container.children[index] as HTMLElement;
      const firstChild = container.firstElementChild as HTMLElement;

      if (targetChild && firstChild) {
        // Target offset relative to first item inside the scroll track
        const targetLeft = targetChild.offsetLeft - firstChild.offsetLeft;
        container.scrollTo({
          left: targetLeft,
          behavior: isPrefersReducedMotion ? "auto" : "smooth",
        });
      }
    },
    [isPrefersReducedMotion]
  );

  const handleNext = useCallback(() => {
    if (totalItems <= 1) return;
    const nextIndex = (activeIndex + 1) % totalItems;
    scrollToIndex(nextIndex);
  }, [activeIndex, totalItems, scrollToIndex]);

  const handlePrev = useCallback(() => {
    if (totalItems <= 1) return;
    const prevIndex = (activeIndex - 1 + totalItems) % totalItems;
    scrollToIndex(prevIndex);
  }, [activeIndex, totalItems, scrollToIndex]);

  // 6. User Touch & Interaction Management: immediate pause, delayed resume
  const startInteraction = useCallback(() => {
    if (!pauseOnInteraction) return;

    // Clear any existing resume timeout and autoplay timer
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsInteracting(true);
  }, [pauseOnInteraction]);

  const endInteraction = useCallback(() => {
    if (!pauseOnInteraction) return;

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    // Wait comfortable idle period (default 6000ms) before resuming autoplay
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
      resumeTimeoutRef.current = null;
    }, resumeDelay);
  }, [pauseOnInteraction, resumeDelay]);

  // 7. Autoplay Loop Manager — strictly single timer instance
  useEffect(() => {
    // Clear any previous interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Guard conditions: disabled if reduced motion, paused, offscreen, or interacting
    if (!autoplay || isInteracting || isHovered || !isVisible || isPrefersReducedMotion || totalItems <= 1) {
      return;
    }

    // In grid desktopMode, do not run carousel autoplay on desktop viewports
    if (desktopMode === "grid" && typeof window !== "undefined" && window.innerWidth >= 768) {
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    autoplay,
    isInteracting,
    isHovered,
    isVisible,
    isPrefersReducedMotion,
    totalItems,
    desktopMode,
    autoplayInterval,
    handleNext,
  ]);

  // 8. Global cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: SINGLE RESPONSIVE DOM TREE (NO DUPLICATION)
  // ─────────────────────────────────────────────────────────────────────────────
  if (desktopMode === "grid") {
    return (
      <div
        ref={containerRef}
        className={cn("w-full relative select-none", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={startInteraction}
        onTouchEnd={endInteraction}
        onMouseDown={startInteraction}
        onMouseUp={endInteraction}
        onFocus={startInteraction}
        onBlur={endInteraction}
      >
        {/* Single Responsive Track: flex scroll on mobile (< md), CSS grid on desktop (>= md) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={cn(
            "flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 overscroll-x-contain scrollbar-none",
            "md:grid md:overflow-visible md:snap-none md:mx-0 md:px-0 md:py-0",
            desktopGridCols,
            gap
          )}
          style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "shrink-0 snap-start transition-opacity duration-300",
                cardWidthMobile,
                "md:shrink md:w-auto md:h-full"
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1} of ${totalItems}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Mobile-Only Dot Indicators & Swipe Hint (< md) */}
        {showDots && totalItems > 1 && (
          <div className="flex md:hidden items-center justify-between mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {items.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    startInteraction();
                    scrollToIndex(dotIdx);
                    endInteraction();
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 focus:outline-none",
                    dotIdx === activeIndex
                      ? "w-6 bg-brand-maroon"
                      : "w-2 bg-stone-300 hover:bg-stone-400"
                  )}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
              <span>Swipe</span>
              <span>→</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // Full Multi-item Carousel on all viewports (when desktopMode is "carousel")
  return (
    <div
      ref={containerRef}
      className={cn("w-full relative select-none", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={startInteraction}
      onTouchEnd={endInteraction}
      onMouseDown={startInteraction}
      onMouseUp={endInteraction}
      onFocus={startInteraction}
      onBlur={endInteraction}
    >
      {/* Scroll Track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          "flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 overscroll-x-contain scrollbar-none",
          gap
        )}
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "shrink-0 snap-start transition-opacity duration-300",
              cardWidthMobile,
              "md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            )}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${totalItems}`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between mt-4">
        {/* Dot Indicators */}
        {showDots && totalItems > 1 && (
          <div className="flex items-center gap-1.5">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => {
                  startInteraction();
                  scrollToIndex(dotIdx);
                  endInteraction();
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 focus:outline-none",
                  dotIdx === activeIndex
                    ? "w-6 bg-brand-maroon"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                )}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Desktop Left/Right Controls */}
        {showArrows && totalItems > 1 && (
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                startInteraction();
                handlePrev();
                endInteraction();
              }}
              className="p-2 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:border-brand-maroon transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                startInteraction();
                handleNext();
                endInteraction();
              }}
              className="p-2 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:border-brand-maroon transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
