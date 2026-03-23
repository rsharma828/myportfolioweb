"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { useRef, useCallback } from "react";

interface Props {
  slug: string;
  title: string;
  description: string;
  dates?: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  projectTag?: string;
  liveUrl?: string;
  className?: string;
}

export function ProjectCard({
  slug,
  title,
  description,
  dates,
  tags,
  image,
  video,
  projectTag,
  liveUrl,
  className,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <Card
      className={`flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full relative group ${className ?? ""}`}
      onMouseEnter={video ? handleMouseEnter : undefined}
      onMouseLeave={video ? handleMouseLeave : undefined}
    >
      <Link href={`/projects/${slug}`} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
      <div className="relative pointer-events-none h-48" style={{ viewTransitionName: `project-image-${slug}` }}>
        {video ? (
          <video
            ref={videoRef}
            src={video}
            loop
            muted
            playsInline
            preload="metadata"
            className="pointer-events-none mx-auto h-48 w-full object-cover object-top"
          />
        ) : image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground text-sm">
            No preview
          </div>
        )}
      </div>

      <CardHeader className="px-5 py-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2 relative z-20 pointer-events-none">
            <Link href={`/projects/${slug}`} className="hover:underline pointer-events-auto">
              <CardTitle className="text-xl">{title}</CardTitle>
            </Link>
            {projectTag && (
              <Badge variant="secondary" className="ml-2 shrink-0 px-2 py-1 text-xs">
                {projectTag}
              </Badge>
            )}
          </div>
          {dates && <time className="font-sans text-xs text-muted-foreground block">{dates}</time>}
          <p className="text-pretty font-sans text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardFooter className="px-5 py-4 mt-auto flex flex-col gap-2 sm:flex-row relative z-20">
        <Link href={`/projects/${slug}`} className={liveUrl ? "w-full sm:w-1/2" : "w-full"}>
          <Button variant="default" className="w-full">
            View project
          </Button>
        </Link>
        {liveUrl ? (
          <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-1/2">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <ExternalLink size={16} />
              Live site
            </Button>
          </Link>
        ) : null}
      </CardFooter>
    </Card>
  );
}
