"use client";

import { useState } from "react";
import type { MediaAsset } from "@/content/media";
import { cn } from "@/lib/utils";

interface MediaFrameProps {
  media?: MediaAsset;
  alt?: string;
  className?: string;
  priorityVideo?: boolean;
}

export function MediaFrame({ media, alt, className, priorityVideo = false }: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  if (!media || failed) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] border border-white/10 bg-mesh-desert",
          className
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(202,168,106,0.28),transparent_35%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,.16)_15%,rgba(126,83,38,.5)_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[36%] rounded-t-[55%] bg-[linear-gradient(180deg,#6c4525,#1f140d)] opacity-80 blur-[2px]" />
        <div className="relative flex h-full min-h-[320px] items-end p-8">
          <div className="rounded-2xl border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.24em] text-sand">Erg Chebbi Luxury</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#e8dcc6]">
              Premium desert visual placeholder ready to be replaced with your licensed photography or hero video.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className={cn("overflow-hidden rounded-[28px] border border-white/10 bg-black", className)}>
        <video
          className="h-full w-full object-cover"
          autoPlay={priorityVideo}
          muted
          loop
          playsInline
          poster={media.poster}
          onError={() => setFailed(true)}
        >
          <source src={media.src} />
        </video>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-[28px] border border-white/10 bg-black", className)}>
      <img
        src={media.src}
        alt={alt || media.alt}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
