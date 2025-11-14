"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DATA } from "@/data/resume";
import { useEffect, useState } from "react";

interface SocialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
}

// Get social media icon component
function getSocialIcon(name: string) {
  const social = Object.entries(DATA.contact.social).find(([key]) => key === name);
  if (social) {
    const IconComponent = social[1].icon;
    return <IconComponent className="h-8 w-8" />;
  }
  return null;
}

// Get social media description
function getSocialDescription(name: string): string {
  const descriptions: Record<string, string> = {
    LinkedIn: "Connect with me on LinkedIn to see my professional experience and network.",
    Instagram: "Follow me on Instagram to see my latest video editing work and creative projects.",
    Youtube: "Subscribe to my YouTube channel for video editing tutorials and portfolio showcases.",
  };
  return descriptions[name] || `Visit my ${name} profile to see more of my work.`;
}

// Generic Social Media Embed Component
function SocialEmbed({ url, platform }: { url: string; platform: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let socialEmbedUrl = "";
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        const instagramUsername = url.split('/').filter(Boolean).pop()?.replace('@', '') || '';
        socialEmbedUrl = `https://www.instagram.com/${instagramUsername}/embed/?cr=1&v=14&wp=540&rd=https%3A%2F%2Fexample.com&rp=%2F`;
        break;
        
      case 'linkedin':
        // LinkedIn doesn't support reliable embedding, fallback to direct URL
        socialEmbedUrl = url;
        break;
        
      case 'youtube':
        // Extract channel handle or ID from YouTube URL
        let channelIdentifier = '';
        if (url.includes('/channel/')) {
          channelIdentifier = url.split('/channel/')[1].split('/')[0];
          socialEmbedUrl = `https://www.youtube.com/embed/videoseries?list=UU${channelIdentifier.substring(2)}`; // Convert UC to UU for uploads playlist
        } else if (url.includes('/@')) {
          channelIdentifier = url.split('/@')[1].split('/')[0];
          // For handle-based URLs, we'll embed the channel page directly
          socialEmbedUrl = `https://www.youtube.com/@${channelIdentifier}`;
        } else {
          socialEmbedUrl = url;
        }
        break;
        
      default:
        socialEmbedUrl = url;
    }
    
    setEmbedUrl(socialEmbedUrl);
    
    // Set a timeout to show fallback if loading takes too long
    const timeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [url, platform, isLoading]);

  // Platform-specific styling
  const getPlatformStyles = () => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return {
          gradient: 'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
          spinnerColor: 'border-purple-600',
          buttonGradient: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
          emoji: '📱',
          appName: 'Instagram'
        };
      case 'linkedin':
        return {
          gradient: 'from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20',
          spinnerColor: 'border-blue-600',
          buttonGradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          emoji: '💼',
          appName: 'LinkedIn'
        };
      case 'youtube':
        return {
          gradient: 'from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20',
          spinnerColor: 'border-red-600',
          buttonGradient: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          emoji: '📺',
          appName: 'YouTube'
        };
      default:
        return {
          gradient: 'from-gray-100 to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20',
          spinnerColor: 'border-gray-600',
          buttonGradient: 'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
          emoji: '🌐',
          appName: platform
        };
    }
  };

  const styles = getPlatformStyles();

  if (hasError) {
    return (
      <div className={`w-full h-[400px] sm:h-[600px] relative bg-gradient-to-br ${styles.gradient} rounded-lg overflow-hidden flex items-center justify-center`}>
        <div className="text-center space-y-3 sm:space-y-4 px-4">
          <div className="text-3xl sm:text-4xl">{styles.emoji}</div>
          <p className="text-sm sm:text-base text-muted-foreground">{platform} content is loading...</p>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              size="sm"
              className={`gap-2 bg-gradient-to-r ${styles.buttonGradient} sm:size-lg`}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Open {styles.appName} Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-[400px] sm:h-[600px] relative bg-gradient-to-br ${styles.gradient} rounded-lg overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4 px-4">
            <div className={`animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 ${styles.spinnerColor}`}></div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Loading {platform} profile...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="auto"
        allowTransparency={true}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className="rounded-lg"
        title={`${platform} Profile`}
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
      
      {/* Fallback content overlay */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button 
              size="sm" 
              variant="secondary"
              className="w-full gap-2 bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <ExternalLink className="h-4 w-4" />
              Open in {styles.appName} App
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export function SocialModal({
  open,
  onOpenChange,
  title,
  url,
}: SocialModalProps) {
  const socialIcon = getSocialIcon(title);
  const description = getSocialDescription(title);
  const platform = title.toLowerCase();
  
  // Check if platform supports embedding (only Instagram works reliably)
  const supportsEmbed = ['instagram'].includes(platform);

  // For platforms with embeds, use a larger modal
  const modalClassName = supportsEmbed 
    ? "w-[95vw] sm:w-[90vw] max-w-2xl p-0 gap-0 overflow-hidden"
    : "w-[95vw] sm:w-[90vw] max-w-sm sm:max-w-md p-0 gap-0 overflow-hidden";

  // Platform-specific icon styling
  const getIconStyling = () => {
    switch (platform) {
      case 'instagram':
        return {
          background: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
          text: "text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"
        };
      case 'linkedin':
        return {
          background: "bg-gradient-to-r from-blue-500/10 to-blue-600/10",
          text: "text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text"
        };
      case 'youtube':
        return {
          background: "bg-gradient-to-r from-red-500/10 to-red-600/10",
          text: "text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text"
        };
      default:
        return {
          background: "bg-primary/10",
          text: "text-primary"
        };
    }
  };

  const iconStyles = getIconStyling();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          modalClassName,
          "border-0 shadow-2xl rounded-2xl",
          "bg-gradient-to-br from-background via-background to-muted/20"
        )}
      >
        {/* Header with platform-specific styling */}
        <DialogHeader className={cn(
          "text-center",
          supportsEmbed ? "px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4" : "px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6"
        )}>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className={cn("rounded-full p-3 sm:p-4", iconStyles.background)}>
              <div className={iconStyles.text}>
                {socialIcon}
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className={cn(
          "space-y-4 sm:space-y-6",
          supportsEmbed ? "px-4 sm:px-6 pb-4 sm:pb-6" : "px-4 sm:px-8 pb-6 sm:pb-8"
        )}>
          {supportsEmbed ? (
            // Social media embed view
            <div className="space-y-4">
              <p className="text-center text-muted-foreground leading-relaxed text-sm">
                {description}
              </p>
              <SocialEmbed url={url} platform={title} />
            </div>
          ) : (
            // Regular social modal view for platforms without embeds
            <>
              <p className="text-center text-muted-foreground leading-relaxed">
                {description}
              </p>
              
              <div className="space-y-3">
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                  className="block"
                >
                  <Button 
                    size="lg" 
                    className="w-full gap-2 group"
                  >
                    <span>Visit {title}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onOpenChange(false)}
                  className="block"
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                </Link>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Clicking will open {title} in a new browser tab
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

