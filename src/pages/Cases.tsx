import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCases, CaseInput } from "@/hooks/useCases";
import { useClients } from "@/hooks/useClients";
import { cn } from "@/lib/utils";

const statusConfig = {
  em_andamento: { label: "Em Andamento", className: "bg-primary/10 text-primary border-primary/20" },
  aguardando: { label: "Aguardando", className: "bg-warning/10 text-warning border-warning/20" },
  concluido: { label: "Concluído", className: "bg-success/10 text-success border-success/20" },
  urgente: { label: "Urgente", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const caseTypes = [
  "Trabalhista",
  "Cível",
  "Criminal",
  "Família",
  "Empresarial",
  "Tributário",
  "Previdenciário",
  "Consumidor",
  "Outros",
];

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
  });

  const filteredCases = cases.filter(
    (c) =>
      c.case_number.toLowerCase().includes(search.toLowerCase()) ||
      c.clients?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.case_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (caseItem?: typeof cases[0]) => {
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
      });
    } else {
      setEditingCase(null);
      setFormData({
        client_id: "",
        case_number: "",
        case_type: "",
        court: null,
        judge: null,
        subject: null,
        status: "em_andamento",
        value: null,
        notes: null,
      });
    }
    setIsDialogOpen(true);
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

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Processos</h1>
            <p className="text-muted-foreground">Gerencie seus processos jurídicos</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Processo
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : filteredCases.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-2">Nenhum processo encontrado</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {search ? "Tente uma busca diferente" : "Comece adicionando seu primeiro processo"}
              </p>
              {!search && (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Processo
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-mono text-sm">{caseItem.case_number}</TableCell>
                    <TableCell className="font-medium">{caseItem.clients?.name || "-"}</TableCell>
                    <TableCell>{caseItem.case_type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          statusConfig[caseItem.status as keyof typeof statusConfig]?.className
                        )}
                      >
                        {statusConfig[caseItem.status as keyof typeof statusConfig]?.label || caseItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(caseItem.value)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(caseItem)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(caseItem.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCase ? "Editar Processo" : "Novo Processo"}</DialogTitle>
            <DialogDescription>Preencha os dados do processo abaixo</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_number">Número do Processo *</Label>
                <Input
                  id="case_number"
                  value={formData.case_number}
                  onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                  placeholder="0000000-00.0000.0.00.0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="case_type">Tipo *</Label>
                <Select
                  value={formData.case_type}
                  onValueChange={(value) => setFormData({ ...formData, case_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor da Causa</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value ? parseFloat(e.target.value) : null })
                  }
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="court">Vara/Tribunal</Label>
                <Input
                  id="court"
                  value={formData.court || ""}
                  onChange={(e) => setFormData({ ...formData, court: e.target.value || null })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="judge">Juiz</Label>
                <Input
                  id="judge"
                  value={formData.judge || ""}
                  onChange={(e) => setFormData({ ...formData, judge: e.target.value || null })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={formData.subject || ""}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value || null })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createCase.isPending || updateCase.isPending}>
                {editingCase ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
