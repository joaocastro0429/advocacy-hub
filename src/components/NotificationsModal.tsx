import { Bell, Clock, Trash2, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const allNotifications = [
  {
    id: 1,
    title: "Prazo Urgente",
    description: "Contestação do processo 0001234-56 vence amanhã às 14:00.",
    time: "10 min atrás",
    type: "urgent",
    read: false,
  },
  {
    id: 2,
    title: "Nova Audiência",
    description: "Audiência de conciliação marcada com Maria Santos para 25/10.",
    time: "1 hora atrás",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "Documento Assinado",
    description: "O cliente João Oliveira assinou digitalmente a procuração.",
    time: "5 horas atrás",
    type: "success",
    read: true,
  },
];

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsModal({ open, onOpenChange }: NotificationsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Ajustamos o max-w para não quebrar o tamanho na tela */}
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 border-sidebar-border bg-card">
        <DialogHeader className="p-6 border-b border-border flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Notificações</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Central de avisos do LexOffice</p>
            </div>
          </div>
          {/* O shadcn já coloca o X automaticamente, mas você pode customizar o header aqui */}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1.5 uppercase font-bold tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" /> Marcar lidas
            </Button>
            <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1.5 uppercase font-bold tracking-wider text-red-500 hover:text-red-600">
              <Trash2 className="w-3.5 h-3.5" /> Limpar
            </Button>
          </div>

          <div className="grid gap-3">
            {allNotifications.map((notif) => (
              <Card key={notif.id} className={cn(
                "p-4 border-l-4 transition-all hover:bg-muted/50 border-border bg-background/50",
                notif.type === 'urgent' ? "border-l-red-500" : "border-l-primary",
                !notif.read && "bg-primary/5 shadow-sm border-primary/20"
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <div className={cn(
                      "mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      notif.type === 'urgent' ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                    )}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-none">{notif.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-[9px] text-muted-foreground uppercase font-black tracking-widest">
                        <Clock className="w-3 h-3" /> {notif.time}
                      </div>
                    </div>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-red-600 rounded-full shrink-0 mt-1 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}