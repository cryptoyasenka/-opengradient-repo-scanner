"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { VerdictResult, CategoryRiskLevel } from "@/types/verdict";

const CATEGORY_LABELS: Record<keyof VerdictResult["categories"], string> = {
  account_credibility: "Account Credibility",
  repository_credibility: "Repository Credibility",
  package_manifest_risks: "Package Manifest Risks",
  code_behavior_risks: "Code Behavior Risks",
  commit_integrity: "Commit Integrity",
  readme_red_flags: "README Red Flags",
  github_actions_risks: "GitHub Actions Risks",
};

const RISK_COLORS: Record<CategoryRiskLevel, string> = {
  none: "bg-[rgba(65,200,133,0.15)] text-[#41c885] border-[rgba(65,200,133,0.3)]",
  low: "bg-[rgba(36,188,227,0.15)] text-[#24bce3] border-[rgba(36,188,227,0.3)]",
  medium: "bg-[rgba(196,149,8,0.15)] text-[#c49508] border-[rgba(196,149,8,0.3)]",
  high: "bg-[rgba(255,140,0,0.15)] text-[#ff8c00] border-[rgba(255,140,0,0.3)]",
  critical: "bg-[rgba(242,58,58,0.15)] text-[#f23a3a] border-[rgba(242,58,58,0.3)]",
};

interface CategoryAccordionProps {
  categories: VerdictResult["categories"];
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  return (
    <Accordion className="w-full">
      {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => {
        const cat = categories[key];
        return (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="flex justify-between hover:no-underline">
              <span className="text-sm font-medium">{CATEGORY_LABELS[key]}</span>
              <Badge className={`ml-2 text-xs ${RISK_COLORS[cat.risk_level]}`}>
                {cat.risk_level}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[#999999]">
              {cat.findings}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
