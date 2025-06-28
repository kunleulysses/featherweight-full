import React from "react";
import { Container } from "@/components/ui/container";

export function EmailPreviewSection() {
  return (
    <section className="py-24">
      <Container>
        <h2 className="font-heading text-3xl text-offwhite text-center mb-8">
          Daily Inspiration via Email
        </h2>
        <div className="bg-slate-900 p-6 rounded-lg max-w-lg mx-auto">
          <p className="text-slate-400">Subject: ✨ Today’s Cosmic Reflection</p>
          <hr className="border-slate-700 my-4" />
          <p className="text-offwhite">
            Good morning! Today the stars whisper about the infinite potential within you...
          </p>
        </div>
      </Container>
    </section>
  );
}