"use client";

import React, { useEffect, useState } from "react";
import { TransitionPanel } from "./transition-panel";
import useMeasure from "react-use-measure";

function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative flex h-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 bg-transparent px-4 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:text-zinc-50 dark:hover:bg-zinc-800"
    >
      {children}
    </button>
  );
}

const COMMUNITY_STORIES = [
  {
    quote: "Through Community Connect, I found amazing volunteer tutors who helped my daughter excel in math. What started as weekly sessions turned into a lasting mentorship that changed her academic trajectory.",
    name: "Maria Rodriguez",
    role: "Parent, Eastside Neighborhood",
    initials: "MR",
  },
  {
    quote: "I wanted to give back but didn't know where to start. Community Connect matched me with our local food bank, and now I volunteer every weekend. It's become one of the most rewarding parts of my life.",
    name: "James Chen",
    role: "Volunteer, 2 years",
    initials: "JC",
  },
  {
    quote: "We used Community Connect to organize a neighborhood cleanup and over 50 volunteers showed up. What was a neglected park is now a beautiful space where families gather every weekend.",
    name: "Riverside Neighbors",
    role: "Community Group",
    initials: "RN",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-yellow-500 fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TransitionPanelCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [ref, bounds] = useMeasure();

  const handleSetActiveIndex = (newIndex: number) => {
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (activeIndex < 0) setActiveIndex(0);
    if (activeIndex >= COMMUNITY_STORIES.length)
      setActiveIndex(COMMUNITY_STORIES.length - 1);
  }, [activeIndex]);

  return (
    <div className="w-[400px] overflow-hidden rounded-2xl border border-zinc-950/10 bg-white shadow-xl dark:bg-zinc-800">
      <TransitionPanel
        activeIndex={activeIndex}
        variants={{
          enter: (direction: number) => ({
            x: direction > 0 ? 400 : -400,
            opacity: 0,
            height: bounds.height > 0 ? bounds.height : "auto",
            position: "initial",
          }),
          center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : "auto",
          },
          exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 400 : -400,
            opacity: 0,
            position: "absolute",
            top: 0,
            width: "100%",
          }),
        }}
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
        custom={direction}
      >
        {COMMUNITY_STORIES.map((story, index) => (
          <div
            key={index}
            className="px-6 py-8"
            ref={ref}
          >
            <StarRating />
            <blockquote className="text-zinc-700 dark:text-zinc-200 text-lg leading-relaxed mb-6">
              "{story.quote}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-mid flex items-center justify-center text-white font-semibold text-sm">
                {story.initials}
              </div>
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {story.name}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {story.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </TransitionPanel>
      <div className="flex justify-between p-4 border-t border-zinc-100 dark:border-zinc-700">
        {activeIndex > 0 ? (
          <Button onClick={() => handleSetActiveIndex(activeIndex - 1)}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        <Button
          onClick={() =>
            activeIndex === COMMUNITY_STORIES.length - 1
              ? handleSetActiveIndex(0)
              : handleSetActiveIndex(activeIndex + 1)
          }
        >
          {activeIndex === COMMUNITY_STORIES.length - 1 ? "Start Over" : "Next"}
        </Button>
      </div>
    </div>
  );
}

