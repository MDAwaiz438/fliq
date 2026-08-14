"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLenis } from "@studio-freight/react-lenis";

function ScrollToTopContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();

  useEffect(() => {
    // Disable browser default scroll restoration so App Router always respects manual top positioning
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const scrollToTop = () => {
      // 1. Reset Lenis virtual scroller
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true } as any);
      }

      // 2. Reset standard browser window and document elements
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior
      });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate execution
    scrollToTop();

    // Secondary frame execution after React DOM completes layout paint
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    const timeoutId = setTimeout(() => {
      scrollToTop();
    }, 40);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams, lenis]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopContent />
    </Suspense>
  );
}
