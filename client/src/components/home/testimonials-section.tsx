import React from "react";
import { Container } from "@/components/ui/container";

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-black">
      <Container>
        <h2 className="font-heading text-3xl text-offwhite text-center mb-12">
          Testimonials
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          <blockquote className="text-slate-400 italic">
            “Flappy changed the way I journal—insights feel like they're written by a friend.”
          </blockquote>
          <cite className="block text-accent">— Alex Doe</cite>
        </div>
      </Container>
    </section>
  );
}