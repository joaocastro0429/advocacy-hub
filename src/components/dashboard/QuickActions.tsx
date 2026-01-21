import { Plus, UserPlus, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "Novo Processo",
    icon: Plus,
    variant: "default" as const,
  },
  {
    label: "Novo Cliente",
    icon: UserPlus,
    variant: "outline" as const,
  },
  {
    label: "Nova Petição",
    icon: FileText,
    variant: "outline" as const,
  },
  {
    label: "Agendar",
    icon: Calendar,
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          className="gap-2"
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
}
