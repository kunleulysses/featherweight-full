import React from "react";
import { Container } from "@/components/ui/container";
import { Database, GitBranch, FileText, Zap } from "lucide-react";

const features = [
  {
    icon: Database,
    title: "Deep Memory",
    description: "Your journal is stored securely and contextually.",
  },
  {
    icon: GitBranch,
    title: "Adaptive Insights",
    description: "AI evolves with your growth and patterns.",
  },
  {
    icon: Zap,
    title: "Instant Assistance",
    description: "Ask questions and get guidance in real-time.",
  },
  {
    icon: FileText,
    title: "Seamless Export",
    description: "Export your data whenever you need it.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-black">
      <Container>
        <h2 className="text-center font-heading text-3xl text-offwhite mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center space-y-4">
              <Icon className="h-12 w-12 text-accent" />
              <h3 className="font-heading text-xl text-offwhite">{title}</h3>
              <p className="text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}