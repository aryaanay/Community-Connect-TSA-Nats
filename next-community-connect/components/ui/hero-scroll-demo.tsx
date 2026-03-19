"use client";

import React from "react";
import { ContainerScroll } from "./container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="relative">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-widest uppercase">
              Your Community
            </h1>
            <p className="text-lg md:text-2xl font-extralight text-white/70 tracking-[0.3em]">
              Connected Together
            </p>
          </div>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=3840&q=80"
          alt="Community connection"
          height={720}
          width={1400}
          className="mx-auto rounded-xl object-cover h-full w-full"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

