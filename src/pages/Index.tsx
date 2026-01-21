import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Briefcase, Users, Calendar, Clock } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">
              Bom dia, Dr. Carlos
            </h1>
            <p className="text-muted-foreground mt-1">
              Aqui está o resumo do seu escritório hoje
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Processos Ativos"
            value={42}
            subtitle="8 com prazos esta semana"
            icon={Briefcase}
            trend={{ value: 12, isPositive: true }}
            variant="accent"
          />
          <StatCard
            title="Clientes"
            value={156}
            subtitle="3 novos este mês"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Audiências"
            value={8}
            subtitle="Este mês"
            icon={Calendar}
          />
          <StatCard
            title="Prazos Urgentes"
            value={5}
            subtitle="Próximos 7 dias"
            icon={Clock}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentCases />
          </div>
          <div>
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
