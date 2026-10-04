
import { useEffect } from "react";

function useScrollFloat() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {
      return undefined;
    }

    let animationFrame = null;
    let resetTimer = null;

    let lastScrollY = window.scrollY;

    let currentScale = 1;
    let targetScale = 1;

    let currentY = 0;
    let targetY = 0;

    let currentBlur = 0;
    let targetBlur = 0;

    const applyAnimation = () => {
      const scaleDifference =
        targetScale - currentScale;

      const yDifference =
        targetY - currentY;

      const blurDifference =
        targetBlur - currentBlur;

      /*
        Spring-like smoothing.
        Lower values = slower/more elastic.
      */
      currentScale +=
        scaleDifference * 0.11;

      currentY +=
        yDifference * 0.11;

      currentBlur +=
        blurDifference * 0.11;

      /*
        Snap tiny differences to their target.
      */
      if (Math.abs(scaleDifference) < 0.0005) {
        currentScale = targetScale;
      }

      if (Math.abs(yDifference) < 0.03) {
        currentY = targetY;
      }

      if (Math.abs(blurDifference) < 0.02) {
        currentBlur = targetBlur;
      }

      const root =
        document.documentElement;

      root.style.setProperty(
        "--scroll-scale",
        currentScale.toFixed(4)
      );

      root.style.setProperty(
        "--scroll-offset-y",
        `${currentY.toFixed(2)}px`
      );

      root.style.setProperty(
        "--scroll-blur",
        `${currentBlur.toFixed(2)}px`
      );

      const stillMoving =
        Math.abs(targetScale - currentScale) >
          0.0005 ||
        Math.abs(targetY - currentY) >
          0.03 ||
        Math.abs(targetBlur - currentBlur) >
          0.02;

      if (stillMoving) {
        animationFrame =
          requestAnimationFrame(
            applyAnimation
          );
      } else {
        animationFrame = null;
      }
    };

    const scheduleAnimation = () => {
      if (!animationFrame) {
        animationFrame =
          requestAnimationFrame(
            applyAnimation
          );
      }
    };

    const resetToNormal = () => {
      targetScale = 1;
      targetY = 0;
      targetBlur = 0;

      scheduleAnimation();
    };

    const handleScroll = () => {
      const currentScrollY =
        window.scrollY;

      const delta =
        currentScrollY - lastScrollY;

      lastScrollY =
        currentScrollY;

      /*
        Ignore extremely tiny browser scroll changes.
      */
      if (Math.abs(delta) < 0.2) {
        return;
      }

      /*
        SCROLL DOWN
        Cards become slightly smaller.
      */
      if (delta > 0) {
        const intensity =
          Math.min(
            Math.abs(delta),
            40
          ) / 40;

        targetScale =
          1 - 0.045 * intensity;

        targetY =
          -7 * intensity;

        targetBlur =
          0.15 * intensity;
      }

      /*
        SCROLL UP
        Cards become slightly larger.
      */
      else {
        const intensity =
          Math.min(
            Math.abs(delta),
            40
          ) / 40;

        targetScale =
          1 + 0.025 * intensity;

        targetY =
          5 * intensity;

        targetBlur =
          0;
      }

      clearTimeout(resetTimer);

      /*
        Once the user stops scrolling,
        smoothly return to normal.
      */
      resetTimer = setTimeout(
        resetToNormal,
        110
      );

      scheduleAnimation();
    };

    /*
      Passive scrolling keeps touch and wheel
      scrolling responsive.
    */
    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      clearTimeout(resetTimer);

      if (animationFrame) {
        cancelAnimationFrame(
          animationFrame
        );
      }

      const root =
        document.documentElement;

      root.style.removeProperty(
        "--scroll-scale"
      );

      root.style.removeProperty(
        "--scroll-offset-y"
      );

      root.style.removeProperty(
        "--scroll-blur"
      );
    };
  }, []);
}

export default useScrollFloat;
