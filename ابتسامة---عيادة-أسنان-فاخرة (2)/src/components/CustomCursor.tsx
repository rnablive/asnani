/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
 
export default function CustomCursor() {
  const followerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  const { isExperienceMode } = useApp();
 
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDevice = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isSmall = window.innerWidth < 1024;
      setIsMobile(isCoarse || isSmall);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsHidden(false);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const updateFollower = () => {
      // Linear interpolation (lerp) for smooth inertia lag
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      followerX += dx * 0.15;
      followerY += dy * 0.15;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      }

      requestAnimationFrame(updateFollower);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer") ||
        target.getAttribute("role") === "button";

      setIsHovered(!!isClickable);
    };

    const onMouseLeaveWindow = () => {
      setIsHidden(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", onMouseLeaveWindow);

    const animationFrameId = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
 
  if (isMobile || isHidden) return null;

  return (
    <>
      {/* 1. Internal Precision Cursor Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 z-50 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-transform duration-100 mix-blend-difference ${
          isExperienceMode ? "bg-cyan-300 scale-125 shadow-[0_0_8px_#00cfff]" : "bg-cyan-400"
        }`}
      />

      {/* 2. External Inertia Follower Ring */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 z-50 rounded-full bg-transparent pointer-events-none transition-all duration-300 ease-out flex items-center justify-center ${
          isExperienceMode
            ? isHovered
              ? "h-14 w-14 -translate-x-1/2 -translate-y-1/2 border border-dashed border-cyan-400 bg-cyan-400/20 shadow-[0_0_20px_rgba(0,207,255,0.6)] animate-spin-slow"
              : "h-10 w-10 -translate-x-1/2 -translate-y-1/2 border border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_15px_rgba(0,207,255,0.3)]"
            : isHovered
              ? "h-13 w-13 -translate-x-1/2 -translate-y-1/2 border border-cyan-400 bg-cyan-400/10 shadow-[0_0_15px_rgba(0,207,255,0.4)]"
              : "h-9 w-9 -translate-x-1/2 -translate-y-1/2 border border-cyan-400/30 bg-transparent"
        }`}
      />
    </>
  );
}
