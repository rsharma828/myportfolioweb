"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  videoUrl?: string;
  isPortrait?: boolean | null;
  ratio?: "landscape" | "portrait";
  forceRotate?: boolean;
}

export function VideoModal({
  open,
  onOpenChange,
  title,
  videoUrl,
  isPortrait,
  ratio,
  forceRotate = false,
}: VideoModalProps) {
  const [detectedOrientation, setDetectedOrientation] = useState<boolean | null>(isPortrait ?? null);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoUrl && videoRef.current && open) {
      const videoElement = videoRef.current;
      
      const handleLoadedMetadata = () => {
        if (videoElement.videoWidth && videoElement.videoHeight) {
          setDetectedOrientation(videoElement.videoHeight > videoElement.videoWidth);
          setVideoDimensions({
            width: videoElement.videoWidth,
            height: videoElement.videoHeight,
          });
        }
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // If metadata is already loaded
      if (videoElement.readyState >= 1) {
        handleLoadedMetadata();
      }

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoUrl, open]);

  // Priority: ratio prop > isPortrait prop > detected orientation
  const isPortraitVideo = ratio === "portrait" 
    ? true 
    : ratio === "landscape" 
    ? false 
    : (isPortrait !== null ? isPortrait : detectedOrientation) === true;
  
  // On mobile: when force rotating, treat as landscape
  // On tablet/desktop: show natural portrait orientation
  const effectiveIsPortraitMobile = forceRotate ? false : isPortraitVideo;
  const effectiveIsPortraitDesktop = isPortraitVideo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "w-[95vw] sm:w-[90vw] p-0 gap-0 overflow-hidden",
          "border-0 shadow-2xl rounded-lg sm:rounded-2xl",
          "bg-gradient-to-b from-background to-background/95",
          "backdrop-blur-xl",
          // For portrait videos on tablet/desktop, allow wider max-width to prevent cropping
          effectiveIsPortraitDesktop && !forceRotate
            ? "max-w-md sm:max-w-lg md:max-w-xl"
            : effectiveIsPortraitMobile 
            ? "max-w-sm"
            : "max-w-4xl sm:max-w-5xl"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="relative">
          {/* Header with gradient overlay */}
          <div className="absolute top-0 left-0 right-0 z-10 px-3 sm:px-6 pt-3 sm:pt-6 pb-3 sm:pb-4 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-md">
            <DialogHeader className="pr-8 sm:pr-12">
              <DialogTitle className="text-base sm:text-xl font-semibold text-white drop-shadow-lg tracking-tight">
                {title}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          {/* Video Container */}
          {videoUrl && (
            <div 
              className={cn(
                "relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-900",
                "flex items-center justify-center overflow-hidden",
                // For portrait videos: flexible container that adapts to video
                // For landscape: use aspect-video
                forceRotate && isPortraitVideo
                  ? "aspect-video sm:aspect-[9/16] min-h-[250px] sm:min-h-[400px]"
                  : effectiveIsPortraitDesktop 
                  ? "" 
                  : "aspect-video min-h-[250px] sm:min-h-[400px]"
              )}
              style={
                effectiveIsPortraitDesktop && !forceRotate && videoDimensions
                  ? {
                      // Calculate container size based on video's natural aspect ratio
                      // Ensure it fits within viewport while maintaining aspect ratio
                      aspectRatio: `${videoDimensions.width} / ${videoDimensions.height}`,
                      maxWidth: '100%',
                      maxHeight: '85vh',
                      width: '100%',
                      padding: 0,
                    }
                  : effectiveIsPortraitDesktop && !forceRotate
                  ? {
                      // Fallback: use 9:16 aspect ratio if dimensions not loaded yet
                      aspectRatio: '9 / 16',
                      maxWidth: '100%',
                      maxHeight: '85vh',
                      width: '100%',
                      padding: 0,
                    }
                  : undefined
              }
            >
              <div className="absolute inset-0 bg-black/20" />
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                className={cn(
                  "relative z-10",
                  // Rotate only on mobile, natural orientation on tablet/desktop
                  forceRotate && isPortraitVideo 
                    ? "rotate-90 object-cover sm:rotate-0 sm:object-contain" 
                    : "object-contain"
                )}
                playsInline
                style={
                  forceRotate && isPortraitVideo
                    ? {
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                        width: 'auto',
                        height: 'calc(100% * 1.778)',
                        maxWidth: 'none',
                      }
                    : effectiveIsPortraitDesktop
                    ? {
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                        // Video should fill container completely without gaps
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }
                    : {
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }
                }
              />
              
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/20 rounded-br-lg" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

