import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProfile } from "@/lib/db/profile";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) {
    return { title: "Portfolio" };
  }
  const base = profile.siteUrl || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: {
      default: profile.name,
      template: `%s | ${profile.name}`,
    },
    description: profile.description,
    openGraph: {
      title: `${profile.name}`,
      description: profile.description,
      url: base,
      siteName: `${profile.name}`,
      locale: "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: `${profile.name}`,
      card: "summary_large_image",
    },
    verification: {
      google: "",
      yandex: "",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased max-w-5xl mx-auto py-12 sm:py-24 px-6",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <TooltipProvider delayDuration={0} disableHoverableContent>
              {children}
              {profile ? (
                <Navbar
                  social={{
                    GitHub: profile.socialGithub,
                    LinkedIn: profile.socialLinkedin,
                    X: profile.socialX,
                    Youtube: profile.socialYoutube,
                  }}
                />
              ) : null}
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
