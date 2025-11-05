import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export function AdSensePlaceholder({ variant }: { variant: "banner" | "square" }) {
  const dimensions =
    variant === "banner"
      ? { width: "728px", height: "90px" }
      : { width: "300px", height: "250px" };

  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // You can’t truly detect load completion easily, so we just assume not loaded initially
      setTimeout(() => setAdLoaded(true), 2000);
    } catch (e) {
      console.warn("AdSense failed to load:", e);
    }
  }, []);

  return (
    <Card
      className="flex items-center justify-center border-dashed border-2 bg-muted/30 text-muted-foreground text-xs font-mono"
      style={{
        maxWidth: dimensions.width,
        height: dimensions.height,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* AdSense Ad Container */}
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: dimensions.width,
          height: dimensions.height,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        data-ad-client="ca-pub-4301116399441370"
        data-ad-slot="1111111111"
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-test="on"
      ></ins>

      {/* Fallback placeholder */}
      {!adLoaded && (
        <span style={{ zIndex: 1 }}>
          Ad space ({dimensions.width} × {dimensions.height})
        </span>
      )}
    </Card>
  );
}