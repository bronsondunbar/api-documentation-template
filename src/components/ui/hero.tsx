"use client";

import React, { useState, useEffect, useRef } from "react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  size?: string;
  backgroundType?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  size = "medium",
  backgroundType = "none",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="h-96 w-full object-cover">
      {dimensions.width > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.bronsondunbar.com/api/v1/image/placeholder?title=${title}&subtitle=${subtitle}&width=${dimensions.width}&height=${dimensions.height}&size=${size}`}
          alt={title}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
};

export default Hero;
