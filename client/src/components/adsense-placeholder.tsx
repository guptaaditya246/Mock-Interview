import { Card } from "@/components/ui/card";

interface AdSensePlaceholderProps {
  variant: "banner" | "rectangle";
}

export function AdSensePlaceholder({ variant }: AdSensePlaceholderProps) {
  const dimensions = variant === "banner" 
    ? { width: "728px", height: "90px" } 
    : { width: "300px", height: "250px" };

  return (
    <Card 
      className="flex items-center justify-center border-dashed border-2 bg-muted/30"
      style={{ 
        maxWidth: dimensions.width, 
        height: dimensions.height,
        margin: variant === "banner" ? "0 auto" : "0"
      }}
      data-testid={`adsense-${variant}`}
    >
      <div className="text-center px-4">
        <p className="text-xs text-muted-foreground font-mono mb-1">
          AdSense Placeholder
        </p>
        <p className="text-[10px] text-muted-foreground/60 font-mono">
          {dimensions.width} × {dimensions.height}
        </p>
        <p className="text-[10px] text-muted-foreground/40 mt-2 font-mono">
          YOUR_ADSENSE_CODE_HERE
        </p>
      </div>
    </Card>
  );
}
