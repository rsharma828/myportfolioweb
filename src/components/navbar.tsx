"use client";

import { useState } from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import { SocialModal } from "@/components/social-modal";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BriefcaseIcon, HomeIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [openSocial, setOpenSocial] = useState<{ name: string; url: string } | null>(null);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14">
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12"
                )}
              >
                <HomeIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/resume"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12"
                )}
              >
                <BriefcaseIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resume</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/#services"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12"
                )}
              >
                <WrenchIcon className="size-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Services</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
        
        <Separator orientation="vertical" className="h-full" />
        {Object.entries(DATA.contact.social).map(([name, social]) => (
            <DockIcon key={name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {name.toLowerCase() === 'linkedin' || name.toLowerCase() === 'youtube' ? (
                    // LinkedIn and YouTube open directly in new tab
                    <Link
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12"
                      )}
                    >
                      <social.icon className="size-4" />
                    </Link>
                  ) : (
                    // Other platforms show modal
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenSocial({ name, url: social.url });
                      }}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12"
                      )}
                    >
                      <social.icon className="size-4" />
                    </button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}
        <Separator orientation="vertical" className="h-full py-2" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModeToggle />
            </TooltipTrigger>
            <TooltipContent>
              <p>Theme</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
      
      {openSocial && (
        <SocialModal
          open={!!openSocial}
          onOpenChange={(open) => !open && setOpenSocial(null)}
          title={openSocial.name}
          url={openSocial.url}
        />
      )}
    </div>
  );
}
