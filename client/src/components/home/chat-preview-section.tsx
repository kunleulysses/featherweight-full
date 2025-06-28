import React from "react";
import { Container } from "@/components/ui/container";

export function ChatPreviewSection() {
  return (
    <section className="py-24">
      <Container className="text-center">
        <h2 className="font-heading text-3xl text-offwhite mb-8">Sentient Chat</h2>
        <div className="bg-slate-900 rounded-lg p-8 max-w-2xl mx-auto space-y-4">
          <p>
            <span className="text-accent">Flappy:</span> How are you feeling today?
          </p>
          <p>
            <span className="text-offwhite">You:</span> Reflective and hopeful.
          </p>
        </div>
      </Container>
    </section>
  );
}