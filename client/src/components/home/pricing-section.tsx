import React from "react";
import { Container } from "@/components/ui/container";

export function PricingSection() {
  return (
    <section className="py-24 bg-black">
      <Container>
        <h2 className="font-heading text-3xl text-offwhite text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border border-slate-700 rounded-lg p-8 space-y-4 text-center">
            <h3 className="font-heading text-xl text-offwhite">Free</h3>
            <p className="text-slate-400">Basic journaling features</p>
            <p className="font-heading text-4xl text-offwhite">$0</p>
            <button className="mt-4 px-6 py-2 bg-accent text-black rounded-lg">
              Get Started
            </button>
          </div>
          <div className="border border-slate-700 rounded-lg p-8 space-y-4 text-center bg-slate-900">
            <h3 className="font-heading text-xl text-offwhite">Premium</h3>
            <p className="text-slate-400">Full AI-driven insights</p>
            <p className="font-heading text-4xl text-offwhite">
              $9<span className="text-sm">/mo</span>
            </p>
            <button className="mt-4 px-6 py-2 bg-accent text-black rounded-lg">
              Upgrade Now
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}