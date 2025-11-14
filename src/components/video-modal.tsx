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
  forceRotate?: boolean;
}

export function VideoModal({
  open,
  onOpenChange,
  title,
  videoUrl,
  isPortrait,
  forceRotate = false,
}: VideoModalProps) {
  const [detectedOrientation, setDetectedOrientation] = useState<boolean | null>(isPortrait ?? null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoUrl && videoRef.current && open) {
      const videoElement = videoRef.current;
      
      const handleLoadedMetadata = () => {
        if (videoElement.videoWidth && videoElement.videoHeight) {
          setDetectedOrientation(videoElement.videoHeight > videoElement.videoWidth);
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

  // Use prop if available, otherwise use detected orientation
  const orientation = isPortrait !== null ? isPortrait : detectedOrientation;
  const isPortraitVideo = orientation === true;
  
  // When force rotating, treat as landscape in modal
  const effectiveIsPortrait = forceRotate ? false : isPortraitVideo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "w-[95vw] sm:w-[90vw] p-0 gap-0 overflow-hidden",
          "border-0 shadow-2xl rounded-lg sm:rounded-2xl",
          "bg-gradient-to-b from-background to-background/95",
          "backdrop-blur-xl",
          effectiveIsPortrait ? "max-w-sm sm:max-w-md" : "max-w-4xl sm:max-w-5xl"
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
            <div className={cn(
              "relative w-full bg-gradient-to-br from-gray-900 via-black to-gray-900",
              "flex items-center justify-center",
              effectiveIsPortrait 
                ? "aspect-[9/16] min-h-[400px] sm:min-h-[500px]" 
                : "aspect-video min-h-[250px] sm:min-h-[400px]"
            )}>
              <div className="absolute inset-0 bg-black/20" />
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                className={cn(
                  "relative z-10 w-full h-full",
                  forceRotate && isPortraitVideo ? "rotate-90 object-cover" : "object-contain"
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
                    : {
                        boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
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

