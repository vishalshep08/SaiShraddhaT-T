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
  autoplayInterval = 4500,
  desktopMode = "grid",
  desktopGridCols = "md:grid-cols-2 lg:grid-cols-3",
  cardWidthMobile = "w-[84vw] xs:w-[320px] sm:w-[360px]",
  gap = "gap-4 sm:gap-6",
  showDots = true,
  showArrows = true,
  className,
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPrefersReducedMotion, setIsPrefersReducedMotion] = useState(false);

  const items = Children.toArray(children).filter(isValidElement);
  const totalItems = items.length;

  // Check user preference for reduced motion
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

  // Track visibility with IntersectionObserver so autoplay only runs when visible
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update active index on scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).offsetWidth + 16
      : container.clientWidth;

    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(Math.max(newIndex, 0), totalItems - 1));
  }, [totalItems]);

  // Scroll to a specific item strictly inside the horizontal container without touching window vertical scroll
  const scrollToIndex = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const targetChild = container.children[index] as HTMLElement;

      if (targetChild) {
        // Compute left offset relative to scroll container
        const targetLeft = targetChild.offsetLeft - container.offsetLeft;
        container.scrollTo({
          left: targetLeft,
          behavior: isPrefersReducedMotion ? "auto" : "smooth",
        });
      }
    },
    [isPrefersReducedMotion]
  );

  const handleNext = useCallback(() => {
    const nextIndex = (activeIndex + 1) % totalItems;
    scrollToIndex(nextIndex);
  }, [activeIndex, totalItems, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const prevIndex = (activeIndex - 1 + totalItems) % totalItems;
    scrollToIndex(prevIndex);
  }, [activeIndex, totalItems, scrollToIndex]);

  // Autoplay handler — only fires when element is visible in viewport and not paused
  useEffect(() => {
    if (!autoplay || isPaused || !isVisible || isPrefersReducedMotion || totalItems <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, isVisible, isPrefersReducedMotion, totalItems, autoplayInterval, handleNext]);

  // If desktopMode is "grid", render responsive grid on desktop & horizontal snap carousel on mobile
  if (desktopMode === "grid") {
    return (
      <div
        ref={containerRef}
        className={cn("w-full relative select-none", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {/* Mobile Horizontal Carousel (< md) */}
        <div className="block md:hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={cn(
              "flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 overscroll-x-contain scrollbar-none",
              gap
            )}
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "shrink-0 snap-start transition-opacity duration-300",
                  cardWidthMobile
                )}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${totalItems}`}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Mobile Dot Indicators & Swipe Hint */}
          {showDots && totalItems > 1 && (
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-1.5">
                {items.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => scrollToIndex(dotIdx)}
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

              <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                <span>Swipe for more</span>
                <span>→</span>
              </span>
            </div>
          )}
        </div>

        {/* Desktop Multi-column Grid (>= md) */}
        <div className={cn("hidden md:grid", desktopGridCols, gap)}>
          {items}
        </div>
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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
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
                onClick={() => scrollToIndex(dotIdx)}
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
              onClick={handlePrev}
              className="p-2 rounded-full border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:border-brand-maroon transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
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
