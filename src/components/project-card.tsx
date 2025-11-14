"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { VideoModal } from "@/components/video-modal";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates?: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  projectTag?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  forceRotate?: boolean; // New prop to force rotation for specific videos
}

export function ProjectCard({
  title,
  video,
  image,
  forceRotate = false,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const [shouldRotate, setShouldRotate] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && videoRef.current) {
      const videoElement = videoRef.current;

      const detectOrientation = () => {
        if (videoElement.videoWidth && videoElement.videoHeight) {
          const isPortraitVideo =
            videoElement.videoHeight > videoElement.videoWidth;
          setIsPortrait(isPortraitVideo);

          // Determine if we should rotate: either forced or detected as portrait
          setShouldRotate(forceRotate || isPortraitVideo);
        }
      };

      const handleLoadedMetadata = () => {
        detectOrientation();
      };

      const handleLoadedData = () => {
        detectOrientation();
      };

      // Check if already loaded
      if (videoElement.readyState >= 1) {
        detectOrientation();
      }

      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("loadeddata", handleLoadedData);

      // Force load if not already loading
      if (videoElement.readyState === 0) {
        videoElement.load();
      }

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [video, forceRotate]);

  const handleClick = () => {
    if (video) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        className={cn(
          "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out",
          "w-full h-full bg-transparent",
          video && "cursor-pointer"
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            "relative w-full bg-transparent flex items-center justify-center overflow-hidden",
            // On mobile: rotate portrait to landscape; on tablet/desktop: show natural orientation
            forceRotate && shouldRotate
              ? "aspect-video sm:aspect-[9/16] sm:min-h-[350px]"
              : isPortrait === true && !forceRotate
              ? "aspect-[9/16] min-h-[350px]"
              : "aspect-video"
          )}
        >
          {video && (
            <video
              ref={videoRef}
              src={video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={cn(
                "pointer-events-none",
                // Apply rotation only on mobile (< 640px), natural orientation on tablet/desktop
                forceRotate && shouldRotate
                  ? "rotate-90 object-cover sm:rotate-0 sm:object-contain sm:w-full sm:h-full"
                  : isPortrait === true && !forceRotate
                  ? "w-full h-full object-contain"
                  : "w-full h-full object-cover object-top"
              )}
              style={
                forceRotate && shouldRotate
                  ? {
                      // Calculate proper dimensions for rotated video on mobile only
                      // When rotated 90deg, width and height swap
                      width: "auto",
                      height: "calc(100% * 1.778)", // 16:9 aspect ratio scaled to fill
                      maxWidth: "none",
                    }
                  : undefined
              }
            />
          )}
          {!video && image && (
            <iframe
              src={image}
              width="100%"
              height="200"
              allow="autoplay"
              className="w-full"
            ></iframe>
          )}

          {/* Title overlay at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent px-4 py-3">
            <h3
              className={cn(
                "text-xl font-semibold tracking-tight text-white transition-colors",
                video && "hover:text-primary"
              )}
            >
              {title}
            </h3>
          </div>
        </div>
      </Card>

      {video && (
        <VideoModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title={title}
          videoUrl={video}
          isPortrait={isPortrait}
          forceRotate={forceRotate}
        />
      )}
    </>
  );
}
