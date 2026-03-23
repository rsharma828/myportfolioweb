import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Maps to `timeline` on save via `timelineStart` / `timelineEnd` form fields. */
export function TimelineDateFields({
  defaultStart = "",
  defaultEnd = "",
}: {
  defaultStart?: string;
  defaultEnd?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>Project period</Label>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timelineStart" className="text-xs font-normal text-muted-foreground">
            Start date
          </Label>
          <Input id="timelineStart" name="timelineStart" type="date" defaultValue={defaultStart} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timelineEnd" className="text-xs font-normal text-muted-foreground">
            End date (optional)
          </Label>
          <Input id="timelineEnd" name="timelineEnd" type="date" defaultValue={defaultEnd} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Shown on cards and project pages as a readable range (e.g. Jan 2, 2024 – Jun 5, 2025).
      </p>
    </div>
  );
}
