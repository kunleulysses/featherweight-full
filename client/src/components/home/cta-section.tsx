import React from "react";
import { Container } from "@/components/ui/container";

export function CTASection() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <h2 className="font-heading text-3xl text-offwhite mb-6">
          Ready to dive into the mystery?
        </h2>
        <button className="px-8 py-4 bg-accent text-black rounded-lg text-xl hover:bg-opacity-80 transition">
          Begin Your Journey
        </button>
      </Container>
    </section>
  );
}