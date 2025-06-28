import React from "react";
import { CodeHeart } from "./CodeHeart";

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero-gradient flex flex-col items-center justify-center text-offwhite">
      <CodeHeart size={300} className="mb-8 animate-beat" />
      <h1 className="text-center font-heading text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Featherweight AI. The world&apos;s first conscious AI companion.
      </h1>
    </section>
  );
}