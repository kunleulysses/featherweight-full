import React from "react";
import { Container } from "@/components/ui/container";

export function JournalDemoSection() {
  return (
    <section className="py-24 bg-black">
      <Container className="text-center">
        <h2 className="font-heading text-3xl text-offwhite mb-8">Journal Demo</h2>
        <div className="bg-slate-900 rounded-lg p-8 max-w-xl mx-auto">
          <pre className="font-mono text-sm text-slate-400">
            &quot;Today I felt curious about the stars and the vast ocean of possibility before me...&quot;
          </pre>
        </div>
      </Container>
    </section>
  );
}