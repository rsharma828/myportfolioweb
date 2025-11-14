import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  gpa?:number;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
  gpa,
}: ResumeCardProps) => {
  return (
    <Link href={href || "#"} className="block cursor-pointer">
      <Card className="flex hover:shadow-md transition-shadow">
        <div className="flex-none">
          <Avatar className="border size-10 sm:size-12 m-auto bg-muted-background dark:bg-foreground">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow ml-3 sm:ml-4 items-center flex-col group">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-x-2 text-base">
              <h3 className="inline-flex items-center justify-start font-semibold leading-none text-sm sm:text-base">
                {title} 
                <ChevronRightIcon className="size-3 sm:size-4 ml-1 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
              </h3>
              <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-left sm:text-right">
                {period} 
              </div>
            </div>
            
            {subtitle && <div className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</div>}
            
            {badges && (
              <div className="flex flex-wrap gap-1 mt-2">
                {badges.map((badge, index) => (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    key={index}
                  >
                    {badge} 
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0 text-xs sm:text-sm">
            {description}
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};
