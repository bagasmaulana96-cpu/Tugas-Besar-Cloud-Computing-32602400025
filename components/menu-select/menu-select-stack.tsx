"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ListTodo, Wallet, Sparkles, Calendar } from "lucide-react";
import MenuCard from "./menu-card";

interface MenuItem {
  id: string;
  label: string;
  imageSrc: string;
  route: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "profile",
    label: "Profile",
    imageSrc: "/previews/profile.png",
    route: "/dashboard/profile",
    icon: <User size={18} />,
  },
  {
    id: "todo",
    label: "To-Do",
    imageSrc: "/previews/todo.png",
    route: "/dashboard/todo",
    icon: <ListTodo size={18} />,
  },
  {
    id: "finance",
    label: "Finance",
    imageSrc: "/previews/finance.png",
    route: "/dashboard/finance",
    icon: <Wallet size={18} />,
  },
  {
    id: "skill",
    label: "Skill",
    imageSrc: "/previews/skill.png",
    route: "/dashboard/skill",
    icon: <Sparkles size={18} />,
  },
  {
    id: "schedule",
    label: "Schedule",
    imageSrc: "/previews/schedule.png",
    route: "/dashboard/schedule",
    icon: <Calendar size={18} />,
  },
];

export default function MenuSelectStack() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const scrollAccumulator = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollLocked = useRef(false);

  function goToIndex(index: number) {
    const clamped = Math.max(0, Math.min(MENU_ITEMS.length - 1, index));
    setActiveIndex(clamped);
  }

  function handleWheelDelta(delta: number) {
    if (scrollLocked.current) return;
    scrollAccumulator.current += delta;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (Math.abs(scrollAccumulator.current) > 60) {
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      goToIndex(activeIndex + direction);
      scrollAccumulator.current = 0;
    }

    debounceTimer.current = setTimeout(() => {
      scrollAccumulator.current = 0;
    }, 150);
  }

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      handleWheelDelta(e.deltaY);
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY;
      handleWheelDelta(delta);
      touchStartY = currentY;
    }

    const container = document.getElementById("menu-select-container");
    container?.addEventListener("wheel", onWheel, { passive: false });
    container?.addEventListener("touchstart", onTouchStart);
    container?.addEventListener("touchmove", onTouchMove);

    return () => {
      container?.removeEventListener("wheel", onWheel);
      container?.removeEventListener("touchstart", onTouchStart);
      container?.removeEventListener("touchmove", onTouchMove);
    };
  }, [activeIndex]);

  function handleSelect(item: MenuItem) {
    scrollLocked.current = true;
    setIsSelecting(true);
    setTimeout(() => {
      router.push(item.route);
    }, 500);
  }

  return (
    <div
      id="menu-select-container"
      className="fixed inset-0 bg-bg-base overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/previews/background.png)",
          filter: "blur(2px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-bg-base/70" />

      <button
        onClick={() => router.push("/dashboard/profile")}
        className="fixed top-6 right-6 z-20 text-text-secondary hover:text-text-primary text-sm px-4 py-2 transition-colors duration-150"
      >
        Skip
      </button>

      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {MENU_ITEMS.map((item, index) => (
          <MenuCard
            key={item.id}
            imageSrc={item.imageSrc}
            label={item.label}
            icon={item.icon}
            offset={index - activeIndex}
            isSelecting={isSelecting && index === activeIndex}
            onClick={() => handleSelect(item)}
          />
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => goToIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-purple-main w-6" : "bg-bg-border w-1.5"}`}
            aria-label={`Go to ${item.label}`}
          />
        ))}
      </div>
    </div>
  );
}
