"use client";

import { Button } from "@ianlintner/theme";
import { Download, Printer } from "lucide-react";

export function ResumeActions() {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button
        variant="primary"
        size="sm"
        onClick={() => window.print()}
        aria-label="Print or save as PDF"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print / Save PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        aria-label="Download resume as plain text"
      >
        <a href="#resume-plain-text">
          <Download className="mr-2 h-4 w-4" />
          Plain text
        </a>
      </Button>
    </div>
  );
}
