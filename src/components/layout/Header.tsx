import { useState } from "react";
import { Bell, Search, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// Dados simplificados para o menu rápido do sino
const quickNotifications = [
  { id: 1, title: "Prazo Urgente", time: "10 min atrás", type: "urgent" },
  { id: 2, title: "Nova Audiência", time: "1 hora atrás", type: "info" },
  { id: 3, title: "Documento Assinado", time: "5 horas atrás", type: "success" },
];

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40">
      {/* 1. Busca */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar processos, clientes..." 
          className="pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary" 
        />
      </div>

      <div className="flex items-center gap-4">
        
        {/* 2. Menu do Sino (Dropdown Rápido) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative group">
              <Bell className="w-5 h-5 transition-transform group-hover:scale-110 text-slate-600" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-600 rounded-full border-2 border-card" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden shadow-2xl border-border">
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h3 className="font-bold text-sm">Notificações Recentes</h3>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">3 NOVAS</span>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              {quickNotifications.map((notif) => (
                <DropdownMenuItem 
                  key={notif.id} 
                  className="p-4 flex flex-col items-start gap-1 cursor-pointer border-b border-border last:border-0 focus:bg-primary/5"
                  onClick={() => navigate("/notificacoes")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest", 
                      notif.type === 'urgent' ? "text-red-600" : "text-primary"
                    )}>
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> {notif.time}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            <div className="p-2 bg-slate-50">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/notificacoes")}
                className="w-full text-xs h-9 font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                Ver todas na página central
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 3. Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-3 hover:bg-muted/50 rounded-full transition-all">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-slate-700 leading-none">{user?.user_metadata?.full_name || "Dr. Carlos"}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">Advogado</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-xl border-border">
            <DropdownMenuLabel className="text-xs text-slate-400 uppercase font-black">Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => navigate("/perfil")}>
              Perfil
            </DropdownMenuItem>
            {/* LINHA CORRIGIDA ABAIXO */}
            <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => navigate("/settings")}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-bold" 
              onClick={handleLogout}
            >
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}