import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { phaseLists, phaseDescriptions } from "@/lib/phases";

export function PhaseDescriptions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [isOpen]);

  return (
    <div ref={cardRef} className="w-full max-w-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer">
              <CardTitle>Penetration Testing - Phases Info</CardTitle>
              <ChevronsUpDown className="h-4 w-4" />
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2 pt-2">
              {phaseLists.slice(1).map((phase) => ( // "default"を除外
                <div key={phase} className="text-left">
                  <h4 className="font-semibold">{phase.replace(/_/g, " ")}</h4>
                  <p className="text-xs text-muted-foreground">
                    {phaseDescriptions[phase]}
                  </p>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}
