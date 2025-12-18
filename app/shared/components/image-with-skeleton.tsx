"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  width?: number;
  height?: number;
};

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = "",
  objectFit = "cover",
  priority = false,
  width = 100,
  height = 100,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative" style={{ width: "100%", height: "100%" }}>
      {isLoading && (
        <Skeleton
          className="absolute inset-0"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full transition-opacity duration-300",
          className,
          isLoading && "opacity-0",
        )}
        style={{ objectFit }}
        onLoad={handleImageLoad}
        loading={priority ? "eager" : "lazy"}
        width={width}
        height={height}
      />
    </div>
  );
};
