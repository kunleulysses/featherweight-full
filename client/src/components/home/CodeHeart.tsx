import React from "react";

interface CodeHeartProps {
  size?: number;
  className?: string;
}

export function CodeHeart({ size = 300, className = "" }: CodeHeartProps) {
  const lines = Array.from({ length: Math.ceil(size / 4) }, () =>
    Array.from({ length: Math.ceil(size / 8) }, () =>
      Math.random() > 0.5 ? "01" : "10"
    ).join("")
  );

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size, WebkitMaskImage: 'url(/assets/heart-mask.svg)', maskImage: 'url(/assets/heart-mask.svg)', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 animate-scroll">
        <div className="whitespace-pre font-mono text-[4px] leading-[3px] text-accent">
          {lines.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}