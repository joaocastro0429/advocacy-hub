import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Briefcase, CalendarDays, Gavel, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCases, CaseInput } from "@/hooks/useCases";
import { useClients } from "@/hooks/useClients";
import { cn } from "@/lib/utils";

const statusConfig = {
  em_andamento: { label: "Em Andamento", className: "bg-blue-100 text-blue-700 border-blue-200" },
  aguardando: { label: "Aguardando", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  concluido: { label: "Concluído", className: "bg-green-100 text-green-700 border-green-200" },
  urgente: { label: "Urgente", className: "bg-red-100 text-red-700 border-red-200" },
};

const caseTypes = ["Trabalhista", "Cível", "Criminal", "Família", "Empresarial", "Tributário", "Previdenciário", "Consumidor", "Outros"];

export default function Cases() {
  const { cases, isLoading, createCase, updateCase, deleteCase } = useCases();
  const { clients } = useClients();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CaseInput>({
    client_id: "",
    case_number: "",
    case_type: "",
    court: null,
    judge: null,
    subject: null,
    status: "em_andamento",
    value: null,
    notes: null,
    trial_date: null, // Nova Data de Julgamento
  });

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredCases = cases?.filter(
    (c) =>
      c.case_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.clients?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.case_type?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleOpenDialog = (caseItem?: any) => {
    if (caseItem) {
      setEditingCase(caseItem.id);
      setFormData({
        client_id: caseItem.client_id,
        case_number: caseItem.case_number,
        case_type: caseItem.case_type,
        court: caseItem.court,
        judge: caseItem.judge,
        subject: caseItem.subject,
        status: caseItem.status,
        value: caseItem.value,
        notes: caseItem.notes,
        trial_date: caseItem.trial_date,
      });
    } else {
      setEditingCase(null);
      setFormData({
        client_id: "", case_number: "", case_type: "", court: null,
        judge: null, subject: null, status: "em_andamento", value: null, notes: null, trial_date: null,
      });
    }
    setIsDialogOpen(true);
  };

  const handleQuickStatusChange = async (id: string, newStatus: string) => {
    await updateCase.mutateAsync({ id, status: newStatus });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCase) {
      await updateCase.mutateAsync({ id: editingCase, ...formData });
    } else {
      await createCase.mutateAsync(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este processo?")) {
      await deleteCase.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Processos</h1>
          <p className="text-muted-foreground">Gestão de contencioso e prazos</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800 shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Novo Processo
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar processo ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Processo/Cliente</TableHead>
              <TableHead className="font-bold text-slate-700">Datas (Cad./Julg.)</TableHead>
              <TableHead className="font-bold text-slate-700">Status</TableHead>
              <TableHead className="font-bold text-slate-700">Área</TableHead>
              <TableHead className="w-[100px] text-right font-bold text-slate-700 px-6">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-primary font-bold">{caseItem.case_number}</span>
                    <span className="font-semibold text-slate-800">{caseItem.clients?.name || "Não vinculado"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-500">
                      <CalendarDays className="w-3 h-3" /> {formatDate(caseItem.created_at)}
                    </span>
                    <span className={cn("flex items-center gap-1 font-bold", caseItem.trial_date ? "text-amber-600" : "text-slate-300")}>
                      <Gavel className="w-3 h-3" /> {formatDate(caseItem.trial_date) || "Não definida"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {/* ALTERAÇÃO DE STATUS RÁPIDA */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter transition-all hover:opacity-80",
                        statusConfig[caseItem.status as keyof typeof statusConfig]?.className
                      )}>
                        {statusConfig[caseItem.status as keyof typeof statusConfig]?.label || caseItem.status}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <DropdownMenuItem 
                          key={key} 
                          onClick={() => handleQuickStatusChange(caseItem.id, key)}
                          className="text-xs font-bold uppercase cursor-pointer"
                        >
                          {config.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-slate-600 text-sm font-medium">{caseItem.case_type}</TableCell>
                <TableCell className="px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(caseItem)} className="h-8 w-8 text-slate-400 hover:text-primary">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(caseItem.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingCase ? "Editar Processo" : "Novo Processo"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-2">
                <Label className="font-bold text-slate-700">Cliente Responsável *</Label>
                <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })} required>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                  <SelectContent>{clients?.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Nº do Processo (CNJ) *</Label>
                <Input value={formData.case_number} onChange={(e) => setFormData({ ...formData, case_number: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Data do Julgamento/Audiência</Label>
                <Input 
                  type="date" 
                  value={formData.trial_date || ""} 
                  onChange={(e) => setFormData({ ...formData, trial_date: e.target.value || null })} 
                  className="bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Área do Direito *</Label>
                <Select value={formData.case_type} onValueChange={(v) => setFormData({ ...formData, case_type: v })} required>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{caseTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Status Atual</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Vara / Tribunal</Label>
                <Input value={formData.court || ""} onChange={(e) => setFormData({ ...formData, court: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Valor da Causa (R$)</Label>
                <Input type="number" value={formData.value || ""} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })} />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="font-bold text-slate-700">Notas Internas</Label>
                <Textarea value={formData.notes || ""} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800" disabled={createCase.isPending || updateCase.isPending}>
                {editingCase ? "Salvar Alterações" : "Cadastrar Processo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}