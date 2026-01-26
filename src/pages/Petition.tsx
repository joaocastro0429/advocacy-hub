import { useState } from "react";
import { Plus, Search, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePetitions, PetitionInput } from "@/hooks/usePetitions";
import { useClients } from "@/hooks/useClients";

export default function Petitions() {
  const { petitions, isLoading, createPetition, updatePetition, deletePetition } = usePetitions();
  const { clients } = useClients();
  
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PetitionInput>({
    title: "",
    process_number: "",
    client_name: "",
    type: "Inicial",
    status: "Rascunho",
    content_summary: "",
  });

  const filteredPetitions = petitions?.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.process_number?.includes(search) ||
      p.client_name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleOpenDialog = (petition?: any) => {
    if (petition) {
      setEditingId(petition.id);
      setFormData({
        title: petition.title,
        process_number: petition.process_number,
        client_name: petition.client_name,
        type: petition.type,
        status: petition.status,
        content_summary: petition.content_summary,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        process_number: "",
        client_name: "",
        type: "Inicial",
        status: "Rascunho",
        content_summary: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePetition.mutateAsync({ id: editingId, ...formData });
      } else {
        await createPetition.mutateAsync(formData);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar petição:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja excluir este rascunho de petição?")) {
      await deletePetition.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Petições</h1>
          <p className="text-muted-foreground">Gerencie suas petições processuais e rascunhos</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="shadow-sm bg-[#1e293b] text-[#fbbf24] hover:bg-[#334155]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Petição
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, processo ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground italic">Carregando petições...</div>
        ) : filteredPetitions.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Nenhuma petição encontrada</h3>
            <p className="text-muted-foreground text-sm mb-6">Comece redigindo sua primeira petição jurídica.</p>
            {!search && <Button onClick={() => handleOpenDialog()} variant="outline">Criar Petição</Button>}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-bold text-slate-700">Título / Peça</TableHead>
                <TableHead className="font-bold text-slate-700">Processo / Cliente</TableHead>
                <TableHead className="font-bold text-slate-700">Tipo</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
                <TableHead className="w-[100px] text-right font-bold text-slate-700 px-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPetitions.map((petition) => (
                <TableRow key={petition.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-900">{petition.title}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-600 font-mono text-xs">{petition.process_number || "N/A"}</span>
                      <span className="text-slate-400 text-xs">{petition.client_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {petition.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      petition.status === "Finalizada" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {petition.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(petition)} className="h-8 w-8 text-slate-400 hover:text-primary">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(petition.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white shadow-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{editingId ? "Editar Petição" : "Nova Petição"}</DialogTitle>
            <DialogDescription>Preencha os dados básicos para gerar ou organizar sua peça jurídica.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="title" className="font-bold text-slate-700">Título da Peça *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Petição Inicial - Indenizatória"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  required
                />
              </div>

              {/* CAMPO CLIENTE RESPONSÁVEL ESTILIZADO CONFORME IMAGEM */}
              <div className="md:col-span-2 space-y-2">
                <Label className="font-bold text-slate-700">Cliente Responsável *</Label>
                <Select 
                  value={formData.client_name} 
                  onValueChange={(value) => setFormData({ ...formData, client_name: value })}
                >
                  <SelectTrigger className="bg-white border-slate-200 focus:ring-2 focus:ring-amber-500/20 transition-all">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {clients?.map((client) => (
                      <SelectItem 
                        key={client.id} 
                        value={client.name}
                        className="cursor-pointer focus:bg-[#d99117] focus:text-white py-2"
                      >
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="process" className="font-bold text-slate-700">Número do Processo</Label>
                <Input
                  id="process"
                  placeholder="0000000-00.0000.0.00.0000"
                  value={formData.process_number || ""}
                  onChange={(e) => setFormData({ ...formData, process_number: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Tipo de Peça</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Inicial">Petição Inicial</SelectItem>
                    <SelectItem value="Contestação">Contestação</SelectItem>
                    <SelectItem value="Recurso">Recurso</SelectItem>
                    <SelectItem value="Manifestação">Manifestação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Revisão">Em Revisão</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="summary" className="font-bold text-slate-700">Resumo dos Fatos / Notas</Label>
                <Textarea
                  id="summary"
                  placeholder="Breve resumo para ajudar na redação..."
                  value={formData.content_summary || ""}
                  onChange={(e) => setFormData({ ...formData, content_summary: e.target.value })}
                  className="bg-slate-50 border-slate-200 focus:bg-white"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="px-8 shadow-md bg-[#1e293b] text-[#fbbf24] hover:bg-slate-800">
                {editingId ? "Salvar Alterações" : "Criar Petição"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}