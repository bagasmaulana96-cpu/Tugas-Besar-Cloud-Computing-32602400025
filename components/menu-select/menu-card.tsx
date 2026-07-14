"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

interface MenuCardProps {
  imageSrc: string;
  label: string;
  icon: React.ReactNode;
  offset: number;
  isSelecting: boolean;
  onClick: () => void;
}

export default function MenuCard({
  imageSrc,
  label,
  icon,
  offset,
  isSelecting,
  onClick,
}: MenuCardProps) {
  const isActive = offset === 0;
  const [showOpenButton, setShowOpenButton] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowOpenButton(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowOpenButton(false);
    }
  }, [isActive]);

  const absOffset = Math.abs(offset);
  const clampedOffset = Math.max(-1, Math.min(1, offset));

  const transformStyle: React.CSSProperties = isActive
    ? { transform: "translateZ(0) scale(1)", opacity: 1 }
    : {
        transform: `translateY(${clampedOffset * 140}px) translateZ(-120px) rotateX(${clampedOffset * -15}deg) scale(0.85)`,
        opacity: absOffset >= 2 ? 0 : 0.5,
      };

  return (
    <div
      onClick={isActive ? onClick : undefined}
      style={transformStyle}
      className={clsx(
        "absolute left-1/2 -translate-x-1/2 aspect-[4/3] w-[85vw] max-w-[420px] sm:w-[380px] md:w-[440px] rounded-2xl overflow-hidden transition-transform duration-[400ms] ease-out",
        isActive
          ? "cursor-pointer ring-2 ring-purple-mid"
          : "pointer-events-none",
        isActive &&
          isSelecting &&
          "scale-[1.08] transition-transform duration-500 ease-out",
      )}
    >
      <img
        src={imageSrc}
        alt={label}
        className="absolute inset-0 w-full h-full object-contain bg-bg-surface"
      />

      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 transition-colors duration-500 ease-out",
          isActive && isSelecting && "from-black/95 via-black/95 to-black/95",
        )}
      />

      <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-bg-card/60 backdrop-blur-md border border-white/[0.1] flex items-center justify-center text-purple-light">
        {icon}
      </div>

      <span className="absolute bottom-4 left-4 text-xl font-bold uppercase text-text-primary">
        {label}
      </span>

      {isActive && showOpenButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="absolute bottom-4 right-4 bg-purple-main hover:bg-purple-light text-white rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1.5 animate-fade-in transition-colors duration-150"
        >
          Open
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}
