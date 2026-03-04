import { Bell, Clock, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    description: "Audiência de conciliação marcada com Maria Santos para 25/10 na 2ª Vara do Trabalho.",
    time: "1 hora atrás",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "Documento Assinado",
    description: "O cliente João Oliveira assinou digitalmente a procuração e o contrato de honorários.",
    time: "5 horas atrás",
    type: "success",
    read: true,
  },
];

export default function Notifications() {
  return (
    // p-6 e max-w-6xl garantem que a página fique centralizada e não cole na Sidebar
    <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Notificações</h1>
          <p className="text-muted-foreground text-sm">Gerencie todos os avisos e prazos do seu escritório.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-white">
            <CheckCircle className="w-4 h-4" /> Marcar todas como lidas
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-red-500 hover:text-red-600 bg-white">
            <Trash2 className="w-4 h-4" /> Limpar histórico
          </Button>
        </div>
      </div>

      {/* Lista de Cards */}
      <div className="grid gap-4">
        {allNotifications.map((notif) => (
          <Card key={notif.id} className={cn(
            "p-5 border-0 border-l-4 transition-all hover:shadow-md bg-white",
            notif.type === 'urgent' ? "border-l-red-500" : "border-l-primary",
            !notif.read && "ring-1 ring-primary/10"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className={cn(
                  "mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  notif.type === 'urgent' ? "bg-red-50 text-red-600" : "bg-slate-50 text-primary"
                )}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">{notif.title}</h3>
                    {!notif.read && (
                       <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Nova</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {notif.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" /> {notif.time}
                  </div>
                </div>
              </div>
              
              {!notif.read && (
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full shrink-0 shadow-sm shadow-red-200" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}