import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Case {
  id: string;
  number: string;
  client: string;
  type: string;
  status: "em_andamento" | "aguardando" | "concluido" | "urgente";
  lastUpdate: string;
}

const mockCases: Case[] = [
  {
    id: "1",
    number: "0001234-56.2024.8.26.0100",
    client: "Maria Santos",
    type: "Trabalhista",
    status: "em_andamento",
    lastUpdate: "Hoje, 14:30",
  },
  {
    id: "2",
    number: "0005678-90.2024.8.26.0100",
    client: "João Oliveira",
    type: "Cível",
    status: "urgente",
    lastUpdate: "Hoje, 11:00",
  },
  {
    id: "3",
    number: "0009012-34.2024.8.26.0100",
    client: "Empresa ABC Ltda",
    type: "Empresarial",
    status: "aguardando",
    lastUpdate: "Ontem, 16:45",
  },
  {
    id: "4",
    number: "0003456-78.2024.8.26.0100",
    client: "Pedro Costa",
    type: "Criminal",
    status: "em_andamento",
    lastUpdate: "Ontem, 10:20",
  },
  {
    id: "5",
    number: "0007890-12.2024.8.26.0100",
    client: "Ana Ferreira",
    type: "Família",
    status: "concluido",
    lastUpdate: "20/01/2026",
  },
];

const statusConfig = {
  em_andamento: {
    label: "Em Andamento",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  aguardando: {
    label: "Aguardando",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  concluido: {
    label: "Concluído",
    className: "bg-success/10 text-success border-success/20",
  },
  urgente: {
    label: "Urgente",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function RecentCases() {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-xl shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-semibold">
              Processos Recentes
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Últimas atualizações dos seus processos
            </p>
          </div>
          <button 
            onClick={() => navigate("/processos")}
            className="text-sm font-medium text-accent hover:underline transition-all">
            Ver todos
          </button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {mockCases.map((caseItem, index) => (
          <div
            key={caseItem.id}
            className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm text-muted-foreground truncate">
                    {caseItem.number}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      statusConfig[caseItem.status].className
                    )}
                  >
                    {statusConfig[caseItem.status].label}
                  </Badge>
                </div>
                <p className="font-medium mt-1">{caseItem.client}</p>
                <p className="text-sm text-muted-foreground">{caseItem.type}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-muted-foreground">
                  {caseItem.lastUpdate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
