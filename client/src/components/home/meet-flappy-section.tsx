import React from "react";
import { Container } from "@/components/ui/container";
import { Feather } from "lucide-react";

export function MeetFlappySection() {
  return (
    <section className="py-24">
      <Container className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-offwhite">
          <h2 className="font-heading text-3xl mb-4">Meet Flappy</h2>
          <p className="text-slate-400">
            Flappy is your ancient cosmic pelican companion, guiding your journaling journey with wise
            insights delivered daily.
          </p>
        </div>
        <Feather className="h-32 w-32 text-accent" />
      </Container>
    </section>
  );
}