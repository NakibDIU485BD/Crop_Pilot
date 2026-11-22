import { useEffect, useState } from "react";
import { ArrowRight, Check, RotateCcw, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import leafImage from "@/assets/croppilot-leaf.webp";

export function LeafScanPreview() {
  const [state, setState] = useState<"ready" | "scanning" | "complete">("ready");

  useEffect(() => {
    if (state !== "scanning") return;
    const timer = setTimeout(() => setState("complete"), 1800);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <span className="flex items-center gap-2 text-sm font-medium"><ScanLine className="size-4 text-primary" /> Leaf analysis</span>
        <span className="text-xs text-muted-foreground">ILLUSTRATIVE SAMPLE</span>
      </div>
      <div className="grid sm:grid-cols-[1fr_1fr]">
        <div className="relative aspect-square overflow-hidden">
          <img src={leafImage} alt="Sample tomato leaf with brown spots and yellow patches" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-6 rounded-lg border border-home-light/70" />
          {state === "scanning" && <div className="scan-sweep absolute inset-x-6 top-6 h-0.5 bg-home-lime" />}
          <span className="absolute bottom-4 left-4 bg-home-ink/80 px-3 py-1.5 text-xs text-home-light">Tomato · sample leaf</span>
        </div>
        <div className="flex min-h-72 flex-col justify-between p-6">
          <div aria-live="polite">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{state === "complete" ? "Sample result" : "Plant health"}</p>
            <h3 className="mt-3 font-display text-2xl">{state === "complete" ? "Early blight" : state === "scanning" ? "Scanning leaf…" : "A closer look."}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{state === "complete" ? "Brown spots and yellowing are shown in this example. A real diagnosis needs a trained model and expert review." : "An example of how a leaf photo could become a plant-health insight."}</p>
            {state === "complete" && <p className="mt-5 flex items-center gap-2 text-sm text-primary"><Check className="size-4" /> Sample analysis complete</p>}
          </div>
          <div className="mt-6">
            <Button className="w-full" disabled={state === "scanning"} onClick={() => setState(state === "complete" ? "ready" : "scanning")}>
              {state === "complete" ? <RotateCcw /> : <ScanLine />}
              {state === "complete" ? "Reset sample" : state === "scanning" ? "Scanning…" : "Scan sample leaf"}
              {state === "ready" && <ArrowRight />}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Demo only · Not a real diagnosis</p>
          </div>
        </div>
      </div>
    </div>
  );
}