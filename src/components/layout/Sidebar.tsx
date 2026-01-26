import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Scale,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FileText, // Novo ícone importado para Petições
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Processos", url: "/processos", icon: Briefcase },
  { title: "Petições", url: "/peticoes", icon: FileText }, // Novo item de Petições
  { title: "Agenda", url: "/agenda", icon: Calendar },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Botão de Recolher no Topo (Direita) */}
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Logo */}
      <div className={cn("p-6 pt-2 border-b border-sidebar-border transition-all", collapsed && "flex justify-center px-0")}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-serif text-lg font-semibold text-sidebar-foreground leading-tight">
                LexOffice
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Gestão Jurídica
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto"> {/* Adicionado overflow-y-auto caso o menu cresça muito */}
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground/80"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive && "text-sidebar-primary"
                    )}
                  />
                  {!collapsed && (
                    <span className="animate-fade-in">{item.title}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer apenas com Sair */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className={cn(
            "group w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
            "text-red-500 hover:bg-red-500/10",
            collapsed && "justify-center"
          )}
        >
          <LogOut 
            className="w-5 h-5 transition-all duration-200 group-hover:scale-110 group-hover:text-red-400" 
          />
          {!collapsed && (
            <span className="text-sm font-semibold transition-colors duration-200 group-hover:text-red-400">
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}